import { $fetch } from "ofetch";

const API_BASE =
	process.env.NUXT_SITEMAP_API_BASE ||
	(process.env.API_BASE_URL && !String(process.env.API_BASE_URL).startsWith("/")
		? process.env.API_BASE_URL
		: "https://api.yenshow.com");
const SECRET = process.env.SITEMAP_BUILD_SECRET || "";

const fetchPage = async (type, page, limit = 100) => {
	const params = new URLSearchParams({
		type,
		page: String(page),
		limit: String(limit)
	});
	if (SECRET) {
		params.set("secret", SECRET);
	}
	const url = `${API_BASE.replace(/\/$/, "")}/api/seo/sitemap-urls?${params}`;
	const res = await $fetch(url);
	return res?.result ?? { items: [], pagination: { totalPages: 1 } };
};

/**
 * 拉取指定類型全部 sitemap 項目（含 alternates）
 */
export const fetchAllSitemapItems = async (type) => {
	const all = [];
	let page = 1;
	let totalPages = 1;

	do {
		const { items, pagination } = await fetchPage(type, page);
		if (items?.length) {
			all.push(...items);
		}
		totalPages = pagination?.totalPages ?? 1;
		page += 1;
	} while (page <= totalPages);

	return all;
};

/**
 * 轉為 @nuxtjs/sitemap 的 url 項目（含 i18n alternates）
 */
export const toSitemapEntries = (items) => {
	return items.map((item) => {
		const entry = {
			loc: item.loc,
			...(item.lastmod ? { lastmod: item.lastmod } : {})
		};

		if (item.alternates) {
			entry.alternatives = [
				{ hreflang: "zh-TW", href: item.alternates["zh-TW"] },
				{ hreflang: "en-US", href: item.alternates["en-US"] },
				{ hreflang: "x-default", href: item.alternates["zh-TW"] }
			];
		}

		return entry;
	});
};
