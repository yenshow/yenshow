import { defineEventHandler, sendRedirect, setResponseStatus } from "h3";
import { toProductUrlSegment } from "~/utils/productUrl.js";

export default defineEventHandler((event) => {
	const host = event.node.req.headers.host ?? "";
	const url = event.node.req.url;
	if (!url) return;

	// 1. 僅正式 production 部署強制 www + HTTPS（避免 Vercel Preview 被 301 回正式站）
	// NODE_ENV=production 在 Preview 也為 true；改以 VERCEL_ENV 區分。本地 nuxt dev 不進入此段。
	if (process.env.VERCEL_ENV === "production") {
		const isHttps = event.node.req.headers["x-forwarded-proto"] === "https";
		if (!isHttps || host !== "www.yenshow.com") {
			return sendRedirect(event, `https://www.yenshow.com${url}`, 301);
		}
	}

	// 2. 子網域 410 Gone
	if (host.startsWith("beta.") || host.startsWith("api.")) {
		setResponseStatus(event, 410, "Gone");
		return "";
	}

	const { pathname, searchParams } = new URL(url, `https://${host}`);

	// 3. 清理追蹤參數
	const trackingParams = ["fbclid", "gclid", "msclkid"];
	let needsRedirect = false;
	for (const param of trackingParams) {
		if (searchParams.has(param)) {
			searchParams.delete(param);
			needsRedirect = true;
		}
	}
	if (needsRedirect) {
		const cleanUrl = `${pathname}${searchParams.toString() ? "?" + searchParams.toString() : ""}`;
		return sendRedirect(event, cleanUrl, 301);
	}

	// 4. 路徑大小寫重定向
	const lowercasePaths = [
		{ pattern: /^\/products(\/|$)/i, correct: "/products" },
		{ pattern: /^\/news(\/|$)/i, correct: "/news" },
		{ pattern: /^\/faqs(\/|$)/i, correct: "/faqs" },
		{ pattern: /^\/solutions(\/|$)/i, correct: "/solutions" },
		{ pattern: /^\/interactive(\/|$)/i, correct: "/interactive" }
	];

	for (const { pattern, correct } of lowercasePaths) {
		const match = pathname.match(pattern);
		if (match && match[0] !== correct + (match[1] || "")) {
			const correctedPath = pathname.replace(pattern, correct + "$1");
			const redirectUrl = `${correctedPath}${searchParams.toString() ? "?" + searchParams.toString() : ""}`;
			return sendRedirect(event, redirectUrl, 301);
		}
	}

	// 4b. 移除尾隨斜線（根路徑除外）
	if (pathname.length > 1 && pathname.endsWith("/")) {
		const withoutSlash = pathname.replace(/\/+$/, "");
		const redirectUrl = `${withoutSlash}${searchParams.toString() ? "?" + searchParams.toString() : ""}`;
		return sendRedirect(event, redirectUrl, 301);
	}

	// 4c. 產品路徑正規化：大小寫、型號內嵌 /（如 /products/YS-7604NI-K1/4K → /products/ys-7604ni-k1-4k）
	const productPathMatch = pathname.match(/^(\/en)?\/products\/(.+)$/);
	if (productPathMatch) {
		const localePrefix = productPathMatch[1] ?? "";
		const rest = productPathMatch[2];
		const normalized = toProductUrlSegment(rest);
		if (normalized && rest !== normalized) {
			const redirectUrl = `${localePrefix}/products/${normalized}${searchParams.toString() ? "?" + searchParams.toString() : ""}`;
			return sendRedirect(event, redirectUrl, 301);
		}
	}

	// 5. 永久重定向
	const permanentRedirects = {
		"^/privacy-policy/?$": "/contact",
		"^/faq/(.*)$": (match: any) => `/faqs/${match[1]}`
	};

	for (const [from, to] of Object.entries(permanentRedirects)) {
		const match = pathname.match(new RegExp(from));
		if (match) {
			const redirectTo = typeof to === "function" ? to(match) : to;
			return sendRedirect(event, redirectTo, 301);
		}
	}

	// 6. 410 Gone 規則 (核心錯誤路徑)
	const gonePaths = [
		// 舊 CMS 路徑
		"^/wp-includes(/.*)?$",
		"^/wp-content(/.*)?$",
		"^/archives(/.*)?$",
		"^/products_category(/.*)?$",
		"^/category(/.*)?$",
		"^/tag(/.*)?$",
		"^/author(/.*)?$",
		"^/blog(/.*)?$",
		"^/comments(/.*)?$",
		"/feed/?$",

		// 服務路徑
		"^/cdn-cgi(/.*)?$",
		"^/vercel(/.*)?$",
		"^/_vercel(/.*)?$",
		"^/storage(/.*)?$",

		// 錯誤路徑 (undefined 問題)
		"^/news/undefined(/.*)?$",
		"^/faqs/undefined(/.*)?$",
		"^/news/undefined/news/.*$",
		"^/faqs/undefined/faqs/.*$",
		"^/News/undefined(/.*)?$",
		"^/Faqs/undefined(/.*)?$",
		"^/News/undefined/news/.*$",
		"^/Faqs/undefined/faqs/.*$",

		// 舊產品路徑模式
		"^/products/[\\da-fA-F]{24}/?$",
		"^/products/.*[\\u4e00-\\u9fa5].*/?$",
		"^/products/\\d+/?$",
		"^/(\\d{1,})/?$",
		"^/applications(/.*)?$"
	];

	// 檢查 410 規則
	for (const pattern of gonePaths) {
		if (new RegExp(pattern, "i").test(pathname)) {
			setResponseStatus(event, 410, "Gone");
			return "";
		}
	}
});
