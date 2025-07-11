import { defineEventHandler, sendRedirect, setResponseStatus } from "h3";

export default defineEventHandler(async (event) => {
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

	// --- Dynamic Product Existence Check ---
	// This is the most robust way to handle old/invalid product URLs.
	// It runs before static path checks.
	const productPathMatch = pathname.match(/^\/products\/([^/]+)\/?$/);
	if (productPathMatch) {
		const productCode = productPathMatch[1];
		try {
			// We make a lightweight HEAD request to the API to check if the product exists.
			// This avoids fetching the full product data.
			await $fetch(`/api/v1/products/code/${productCode}`, { method: "HEAD" });
			// If the request succeeds (doesn't throw a 404), the product exists.
			// We do nothing and let the request proceed to the Vue app.
		} catch (error: any) {
			// If the API returns a 404 status, it means the product does not exist.
			if (error.statusCode === 404) {
				setResponseStatus(event, 410, "Gone");
				return ""; // Stop processing and return 410.
			}
			// For other network errors, we can log them but let the request pass
			// to avoid breaking the site due to temporary API availability issues.
		}
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
	// NOTE: Many old product/category paths are now handled by the dynamic product check above.
	// We keep a few very generic or non-product-related patterns here.
	const gonePaths = [
		// --- Old CMS/WordPress patterns ---
		"^/wp-includes(/.*)?$",
		"^/wp-content(/.*)?$",
		"^/category(/.*)?$",

		// --- Misc old or error paths ---
		"^/cdn-cgi(/.*)?$", // Cloudflare paths
		"^/(news|faqs)/undefined(/.*)?$" // Programmatically generated error paths
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
