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

	// --- Dynamic Product Existence & Canonical URL Check ---
	const productPathMatch = pathname.match(/^\/products\/([^/]+)\/?$/);
	if (productPathMatch) {
		const requestedProductCode = productPathMatch[1];

		// Rule A: Explicitly treat all URLs starting with lowercase 'ys-' as old and gone.
		// This is a fast path for GSC cleanup without hitting the API.
		if (requestedProductCode.startsWith("ys-")) {
			setResponseStatus(event, 410, "Gone");
			return "";
		}

		// Rule B: For all other cases (e.g., 'YS-'), perform a dynamic check.
		try {
			const { result: product } = await $fetch<any>(`/api/v1/products/code/${requestedProductCode}`);

			// If product exists, check if the requested code matches the canonical code (case-sensitive).
			if (product && product.code) {
				if (product.code !== requestedProductCode) {
					// Redirect to the canonical URL if there's a case mismatch.
					const canonicalPath = `/products/${product.code}`;
					const queryString = searchParams.toString();
					const finalUrl = queryString ? `${canonicalPath}?${queryString}` : canonicalPath;
					return sendRedirect(event, finalUrl, 301);
				}
				// If codes match, this is a valid, canonical URL.
				// Stop middleware processing and let Nuxt handle the rendering.
				return;
			} else {
				// This case might occur if API returns 200 but no product data.
				// Treat as if not found.
				throw new Error("Product data not found in successful API response.");
			}
		} catch (error: any) {
			// If the API returns a 404, it means the product does not exist.
			if (error.statusCode === 404) {
				setResponseStatus(event, 410, "Gone");
				return ""; // Stop processing and return 410.
			}
			// For other network errors, log them but let the request pass to avoid breaking the site.
		}
	}

	// Universal rule to enforce lowercase URLs for all OTHER paths.
	if (/[A-Z]/.test(pathname)) {
		const lowerCasePath = pathname.toLowerCase();
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
	// NOTE: Many old product/category paths are now handled by the dynamic product check above.
	// We keep a few very generic or non-product-related patterns here.
	const gonePaths = [
		// --- Old CMS/WordPress patterns ---
		"^/wp-includes(/.*)?$",
		"^/wp-content(/.*)?$",
		"^/category(/.*)?$",
		"^/products_category(/.*)?$",

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
