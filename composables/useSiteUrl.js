/**
 * 官網絕對 URL（canonical、OG、JSON-LD）
 */
export const useSiteUrl = () => {
	const config = useRuntimeConfig();
	const raw = config.public.siteUrl || "https://www.yenshow.com";
	return raw.replace(/\/$/, "");
};

export const buildCanonicalUrl = (siteUrl, localizedPath) => {
	const normalized = localizedPath.startsWith("/") ? localizedPath : `/${localizedPath}`;
	return `${siteUrl}${normalized}`;
};

/** 依目前語系產生完整 canonical URL（須在 setup 頂層呼叫） */
export const useCanonicalUrl = (path = "/") => {
	const siteUrl = useSiteUrl();
	const localePath = useLocalePath();
	return buildCanonicalUrl(siteUrl, localePath(path));
};

/** 供動態 path 使用（在 setup 建立一次） */
export const useCanonicalUrlBuilder = () => {
	const siteUrl = useSiteUrl();
	const localePath = useLocalePath();
	return (path = "/") => buildCanonicalUrl(siteUrl, localePath(path));
};

export const useDefaultOgImage = () => {
	const siteUrl = useSiteUrl();
	return `${siteUrl}/logo/yenshow.svg`;
};
