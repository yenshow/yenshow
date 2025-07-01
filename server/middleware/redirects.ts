import { defineEventHandler, sendRedirect, setResponseStatus } from "h3";

const permanentRedirects: Record<string, string | ((match: RegExpMatchArray) => string)> = {
	// e.g. /some/path/feed or /some/path/feed/ -> /some/path
	"^/(?<path>.*)/feed/?$": (match) => `/${match.groups?.path ?? ""}`,
	// e.g. /1234 -> /News
	"^/(\\d{1,})$": "/News",
	// e.g. /privacy-policy -> /contact
	"^/privacy-policy/?$": "/contact"
};

// Paths that should return a 410 Gone status
const gonePaths = [
	"^/wp-includes(/.*)?$",
	"^/wp-content(/.*)?$",
	"^/archives(/.*)?$",
	"^/products_category(/.*)?$",
	"^/category(/.*)?$",
	"^/tag(/.*)?$",
	"^/applications(/.*)?$",
	// 舊的產品路徑 (例如 /products/中文名稱)
	"^/products/(?![\\da-fA-F]{24}$)[^/]+/?$"
];

export default defineEventHandler((event) => {
	const url = event.node.req.url;
	if (!url) return;

	// Use URL to easily parse pathname and query params
	const { pathname, searchParams } = new URL(url, `http://${event.node.req.headers.host}`);

	// 1. Handle old WordPress search `/?s=...`
	if (pathname === "/" && searchParams.has("s")) {
		const searchValue = searchParams.get("s") || "";
		// Redirect to the new search page format
		return sendRedirect(event, `/search?q=${encodeURIComponent(searchValue)}`, 301);
	}

	// 2. Handle paths that are permanently gone (410)
	for (const pattern of gonePaths) {
		if (new RegExp(pattern).test(pathname)) {
			setResponseStatus(event, 410, "Gone");
			return ""; // End the response
		}
	}

	// 3. Handle permanent redirects (301)
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
