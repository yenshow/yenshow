import { useHead } from "#app";
import { useI18n } from "vue-i18n";

const LOCALE_OG = {
	zh: "zh_TW",
	en: "en_US"
};

/**
 * 集中管理頁面 SEO：title、description、canonical、OG、JSON-LD、noindex
 */
export const usePageSeo = (options) => {
	const siteUrl = useSiteUrl();
	const localePath = useLocalePath();
	const defaultOgImage = useDefaultOgImage();
	const { locale } = useI18n();

	const resolve = () => {
		const opts = typeof options === "function" ? options() : options;
		if (!opts) return null;

		const {
			title = "",
			description = "",
			path = "/",
			image,
			noindex = false,
			jsonLd = null
		} = opts;

		const canonical = buildCanonicalUrl(siteUrl, localePath(path));
		const ogImage = image || defaultOgImage;
		const ogLocale = LOCALE_OG[locale.value] || "zh_TW";

		const meta = [
			{ name: "description", content: description },
			{ property: "og:title", content: title || "遠岫科技" },
			{ property: "og:description", content: description },
			{ property: "og:url", content: canonical },
			{ property: "og:image", content: ogImage },
			{ property: "og:locale", content: ogLocale },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: title || "遠岫科技" },
			{ name: "twitter:description", content: description },
			{ name: "twitter:image", content: ogImage }
		];

		if (noindex) {
			meta.push({ name: "robots", content: "noindex, nofollow" });
		}

		const link = [{ rel: "canonical", href: canonical }];
		const script = [];

		const ldBlocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
		ldBlocks.forEach((block, index) => {
			if (!block) return;
			script.push({
				type: "application/ld+json",
				key: `json-ld-${index}`,
				innerHTML: JSON.stringify(block)
			});
		});

		return {
			title,
			meta,
			link,
			...(script.length ? { script } : {})
		};
	};

	useHead(() => resolve());
};
