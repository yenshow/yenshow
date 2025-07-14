import { defineEventHandler, sendRedirect, setResponseStatus } from "h3";

export default defineEventHandler((event) => {
	// Do not run any redirects in development
	if (process.env.NODE_ENV === "development") {
		return;
	}

	const host = event.node.req.headers.host ?? ""; // e.g., 'www.yenshow.com', 'beta.yenshow.com'
	const url = event.node.req.url;
	if (!url) return;

	// --- 1. Domain & Protocol Level Redirects ---
	const isBetaOrApi = host.startsWith("beta.") || host.startsWith("api.");
	if (isBetaOrApi) {
		setResponseStatus(event, 410, "Gone");
		return ""; // Stop processing for these domains
	}

	const canonicalHost = "www.yenshow.com";
	// In Vercel/Netlify, the protocol is often in this header
	const isHttps = event.node.req.headers["x-forwarded-proto"] === "https";

	// If it's not HTTPS or not on the www canonical domain, redirect it.
	if (!isHttps || host !== canonicalHost) {
		return sendRedirect(event, `https://${canonicalHost}${url}`, 301);
	}

	// --- 2. Path Level Redirects (for the canonical domain) ---
	// Use URL to easily parse pathname and query params
	const { pathname, searchParams } = new URL(url, `https://${host}`);

	// Add X-Robots-Tag to assets in /storage to prevent indexing
	if (pathname.startsWith("/storage/")) {
		event.node.res.setHeader("X-Robots-Tag", "noindex, nofollow");
		// We don't return here, just set the header and let the request continue
	}

	// Strip tracking parameters (e.g., fbclid, gclid) to prevent duplicate content
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

	// Handle all /products/... paths by redirecting to lowercase to ensure a canonical URL
	if (pathname.startsWith("/products/") && pathname !== pathname.toLowerCase()) {
		return sendRedirect(event, pathname.toLowerCase(), 301);
	}

	// Handle permanent redirects (301)
	const permanentRedirects: Record<string, string | ((match: RegExpMatchArray) => string)> = {
		// e.g. /privacy-policy -> /contact
		"^/privacy-policy/?$": "/contact",
		// e.g. /faq/some-guide -> /faqs/some-guide
		"^/faq/(.*)$": (match) => `/faqs/${match[1]}`,
		// News article redirect
		"^/news/latest-news/media-interview-coverage-yenshow-technology-general-manager-jerry-chung-featured-in-cts-excellent-showcase-program/?$":
			"/news/media-interview-coverage-yenshow-technology-general-manager-jerry-chung-featured-in-cts-excellent-showcase-program"
	};

	// Handle permanent redirects (301)
	for (const from in permanentRedirects) {
		const match = pathname.match(new RegExp(from));
		if (match) {
			let to = permanentRedirects[from];
			if (typeof to === "function") {
				to = to(match);
			}
			return sendRedirect(event, to, 301);
		}
	}

	// Paths that should return a 410 Gone status
	const gonePaths = [
		// --- Old CMS/WordPress patterns ---
		"^/wp-includes(/.*)?$",
		"^/wp-content(/.*)?$",
		"^/archives(/.*)?$",
		"^/products_category(/.*)?$",
		"^/category(/.*)?$",
		"^/tag(/.*)?$",
		"^/author(/.*)?$",
		"^/blog(/.*)?$",
		"^/comments(/.*)?$",
		"/feed/?$", // Matches any URL ending with /feed or /feed

		// --- Misc old or error paths ---
		"^/applications(/.*)?$",
		"^/cdn-cgi(/.*)?$", // Cloudflare paths
		"^/vercel(/.*)?$", // Vercel paths
		"^/_vercel(/.*)?$", // Vercel paths
		"^/_nuxt(/.*)?$", // Nuxt build assets
		"^/storage(/.*)?$", // Storage paths
		"^/news/undefined(/.*)?$", // Frontend error paths
		"^/faqs/undefined(/.*)?$", // Frontend error paths

		// --- Old product/numeric paths ---
		// e.g. /products/68464f3bdeb1a88d51709444 (MongoDB ID)
		"^/products/[\\da-fA-F]{24}/?$",
		// e.g. /products/中文產品名稱. This regex now specifically targets paths with Chinese characters.
		"^/products/.*[\\u4e00-\\u9fa5].*/?$",
		// e.g. /1234 or /1234/
		"^/(\\d{1,})/?$"
	];

	// Handle specific old product slugs that should be marked as gone
	const goneProductSlugs = [
		// Add specific, confirmed-to-be-gone product slugs here
		"5ys-425iwg-4g",
		"6ys-8325g0-cisb",
		"6ys-a87g1-ls-c36s80",
		"6ys-k01-c36s80",
		"ds-k7p02", // Assuming this is also a gone product based on context
		"ds-k7p05",
		"ftc-06-ftc-08",
		"ftc-06",
		"iys-6716nxi-m1-aib",
		"iys-6732nxi-m1-aib",
		"iys-7716",
		"tbc-01",
		"tocc-實際測試",
		"tocc查詢系統",
		"yshm-td2628-10-qa"
	];

	const pathSegments = pathname.split("/").filter(Boolean);
	if (pathSegments[0] === "products" && pathSegments.length > 1) {
		const productSlug = pathSegments[1];
		if (goneProductSlugs.includes(productSlug)) {
			setResponseStatus(event, 410, "Gone");
			return "";
		}
	}

	// Handle old WordPress search `/?s=...`
	if (pathname === "/" && searchParams.has("s")) {
		const searchValue = searchParams.get("s") || "";
		// Redirect to the new search page format
		return sendRedirect(event, `/search?q=${encodeURIComponent(searchValue)}`, 301);
	}

	// Handle paths that are permanently gone (410)
	for (const pattern of gonePaths) {
		if (new RegExp(pattern).test(pathname)) {
			setResponseStatus(event, 410, "Gone");
			return ""; // End the response
		}
	}
});
