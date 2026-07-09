import { platformProducts, platformSlugs } from "~/data/platformProducts";

/** 首頁 / 產品索引共用的 YSOP、YSOS 卡片資料 */
export const usePlatformList = () => {
	const { t } = useI18n();

	return computed(() =>
		platformSlugs.map((slug) => {
			const product = platformProducts[slug];
			return {
				slug,
				title: t(`platform.${slug}.title`),
				description: t(`home.intro.platforms.${slug}.description`),
				cta: t(`home.intro.platforms.${slug}.cta`),
				image: product.heroImage,
				accent: product.accent,
				linkClass: product.textAccent
			};
		})
	);
};
