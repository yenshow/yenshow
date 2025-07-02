import { defineEventHandler, sendRedirect, setResponseStatus } from "h3";

export default defineEventHandler((event) => {
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
	const permanentRedirects: Record<string, string | ((match: RegExpMatchArray) => string)> = {
		// e.g. /privacy-policy -> /contact
		"^/privacy-policy/?$": "/contact"
	};

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
		"^/faq(/.*)?$", // Old FAQ structure, new is /Faqs
		"^/cdn-cgi(/.*)?$", // Cloudflare paths

		// --- Old product/numeric paths ---
		// e.g. /products/中文產品名稱
		"^/products/(?![\\da-fA-F]{24}$)[^/]+/?$",
		// e.g. /1234
		"^/(\\d{1,})$"
	];

	// Use URL to easily parse pathname and query params
	const { pathname, searchParams } = new URL(url, `https://${host}`);

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
});
