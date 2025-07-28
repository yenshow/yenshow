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

	// Enforce lowercase for key paths to ensure a canonical URL
	const lowercasePaths = ["/products/", "/news/", "/faqs/", "/solutions/"];
	for (const path of lowercasePaths) {
		if (pathname.toLowerCase().startsWith(path) && pathname !== pathname.toLowerCase()) {
			return sendRedirect(event, pathname.toLowerCase(), 301);
		}
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
		"^/storage(/.*)?$", // Storage paths
		"^/news/undefined(/.*)?$", // Frontend error paths
		"^/faqs/undefined(/.*)?$", // Frontend error paths

		// --- Old news paths from GSC report ---
		"^/news/latest-newsmedia-interview-coverage-yenshow-technology-general-manager-jerry-chung-featured-in-cts-exclusive-interview-a-deep-dive-into-the-critical-value-of-iris-recognition-technology-in-cybersecurity-applications/?$",
		"^/news/now-available-yenshow-technology-yx-pro-series-wireless-intrusion-prevention-system/?$",
		// The following path is shortened to catch partial URLs from GSC
		"^/news/latest-update-yenshow-technology-launches-a-brand-new-smart-meeting-room-management-so.*$",
		"^/news/breaking-newsyenshow-technology-unveils-dual-ai-behavior-analysis-nvr-model-s-ys-ba16-lys-ba32-revolutionizing-video-surveillance/?$",

		// --- From GSC report ---
		// Handle malformed/duplicated paths from frontend errors
		"^/news/undefined/news/.*$",
		"^/faqs/undefined/faqs/.*$",

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
		"5ys-425iwg-4g",
		"6ys-8325g0-cisb",
		"6ys-a87g1-ls-c36s80",
		"6ys-k01-c36s80",
		"ds-k7p02",
		"ds-k7p05",
		"ftc-06-ftc-08",
		"ftc-06",
		"iys-6716nxi-m1-aib",
		"iys-6732nxi-m1-aib",
		"iys-7716",
		"tbc-01",
		"tocc-實際測試",
		"tocc查詢系統",
		"yshm-td2628-10-qa",
		// --- From GSC report ---
		"ys-2cd7586g2-xzhsy",
		"ys-3e0326p-ec",
		"ys-it47",
		"ys-kd-acw3",
		"ys-2de4215iw-det5",
		"ys-3e3754tf",
		"ys-2cd3746g2-izs",
		"ys-k1801m",
		"ys-ftc-06-3",
		"ys-pdqp15am-lm-wb",
		"ys-pkf1-wb",
		"ys-pdmc-eg2-wb",
		"ys-2cd2043g2-iu",
		"ys-k630x-t",
		"ys-tdsb00-ekt-poe-4m",
		"ys-td1018-1-qr",
		"ys-tmg01",
		"ys-2cd3646g2ht-lzsy",
		"ys-kd-acf1",
		"ys-ac-08",
		"ys-tvl224",
		"ys-2cd3b26g2t-izhsy",
		"ys-2cd3321g0-iu",
		// --- From GSC report (2024-07-22) ---
		"ys-ba32nxh-m1a1(b)",
		"ys-ac-05",
		"ys-ac-08",
		"ys-zdyh2a0ixs-d(t2)",
		"ys-pm1-o1l-wb",
		"ys-2cd3t47g1-l(s)",
		"6ys-825g0-c-ivsb",
		"6ys-825g0-c-iwsb",
		// --- From GSC report (2024-07-23) ---
		"ys-ac-01",
		"ys-ac-02f",
		"ys-ttc-01-3_pa"
	];

	// Dynamically add gone product slugs to the gonePaths regex array
	goneProductSlugs.forEach((slug) => {
		// Escape special regex characters in the slug before creating the regex.
		const escapedSlug = slug.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
		gonePaths.push(`^/products/${escapedSlug}/?$`);
	});

	// Handle old WordPress search `/?s=...`
	if (pathname === "/" && searchParams.has("s")) {
		const searchValue = searchParams.get("s") || "";
		// Redirect to the new search page format
		return sendRedirect(event, `/search?q=${encodeURIComponent(searchValue)}`, 301);
	}

	// Handle paths that are permanently gone (410)
	for (const pattern of gonePaths) {
		if (new RegExp(pattern, "i").test(pathname)) {
			setResponseStatus(event, 410, "Gone");
			return ""; // End the response
		}
	}
});
