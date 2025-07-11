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
	const { pathname, searchParams } = new URL(url, `https://${host}`);

	// Universal rule to enforce lowercase URLs.
	// This is the most important rule for SEO consistency.
	// It checks if the path contains any uppercase letters.
	if (/[A-Z]/.test(pathname)) {
		const lowerCasePath = pathname.toLowerCase();
		// Re-attach query string if it exists
		const queryString = searchParams.toString();
		const finalUrl = queryString ? `${lowerCasePath}?${queryString}` : lowerCasePath;
		return sendRedirect(event, finalUrl, 301);
	}

	// Handle /faq -> /faqs redirect separately to preserve path and query string.
	const faqMatch = pathname.match(new RegExp("^/faq(?!s)(/.*)?$"));
	if (faqMatch) {
		const restOfPath = faqMatch[1] || "";
		const queryString = searchParams.toString();
		const finalUrl = `/faqs${restOfPath.toLowerCase()}${queryString ? `?${queryString}` : ""}`;
		return sendRedirect(event, finalUrl, 301);
	}

	// Handle old WordPress search `/?s=...`
	if (pathname === "/" && searchParams.has("s")) {
		const searchValue = searchParams.get("s") || "";
		// Redirect to the new search page format
		return sendRedirect(event, `/search?q=${encodeURIComponent(searchValue)}`, 301);
	}

	// Handle permanent redirects (301) for paths that don't involve case changes
	const permanentRedirects: Record<string, string> = {
		// e.g. /privacy-policy -> /contact
		"^/privacy-policy/?$": "/contact"
		// The /faq redirect is now handled above.
	};

	// Handle paths that are permanently gone (410)
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

		// --- Misc old or error paths ---
		"^/applications(/.*)?$",
		"^/cdn-cgi(/.*)?$", // Cloudflare paths
		"^/vercel(/.*)?$",
		"^/storage(/.*)?$",

		// --- Programmatically generated error paths (now legacy) ---
		"^/(news|News|faqs|Faqs|faq)/undefined(/.*)?$",

		// --- Old product ID paths that are now replaced by codes ---
		"^/products/[a-fA-F0-9]{24}/?$",

		// --- Specific old product prefixes and patterns from GSC reports ---
		"^/products/ys-([^/]+/?)$", // Catches /products/ys-xxxx
		"^/products/ds-([^/]+/?)$", // Catches /products/ds-xxxx
		"^/products/iys-([^/]+/?)$", // Catches /products/iys-xxxx
		"^/products/applications(/.*)?$", // Catches /products/applications/...

		// --- Rule to catch any product URL with non-ASCII characters (e.g., Chinese) ---
		"^/products/.*[^\x00-\x7F].*",

		// --- Old product/numeric paths ---
		// e.g. /1234
		"^/(\\d{1,})$",

		// --- Old feed paths ---
		"/feed/?$"
	];

	// Handle paths that are permanently gone (410)
	for (const pattern of gonePaths) {
		if (new RegExp(pattern).test(pathname)) {
			setResponseStatus(event, 410, "Gone");
			return ""; // End the response
		}
	}

	// Handle remaining permanent redirects (301)
	for (const from in permanentRedirects) {
		if (new RegExp(from).test(pathname)) {
			return sendRedirect(event, permanentRedirects[from], 301);
		}
	}
});
