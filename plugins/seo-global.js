import { buildOrganizationJsonLd, buildWebSiteJsonLd } from "~/utils/seo.js";

/**
 * 全站 Organization / WebSite 結構化資料（SSR + 客戶端）
 */
export default defineNuxtPlugin(() => {
	const siteUrl = useSiteUrl();

	useHead({
		script: [
			{
				type: "application/ld+json",
				key: "json-ld-organization",
				innerHTML: JSON.stringify(buildOrganizationJsonLd(siteUrl))
			},
			{
				type: "application/ld+json",
				key: "json-ld-website",
				innerHTML: JSON.stringify(buildWebSiteJsonLd(siteUrl))
			}
		]
	});
});
