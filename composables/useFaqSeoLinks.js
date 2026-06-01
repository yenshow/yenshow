import { solutions } from "~/data/solutions.js";

/** FAQ 主分類 → 預設方案 slug */
const CATEGORY_SOLUTION_MAP = {
	名詞解說: ["video-intercom-system", "community-security"],
	產品介紹: ["ai-smart-factory", "video-intercom-system"],
	故障排除: ["community-security", "wireless-security-system"],
	Glossary: ["video-intercom-system", "community-security"],
	"Product Introduction": ["ai-smart-factory"],
	Troubleshooting: ["community-security", "wireless-security-system"]
};

/** 關鍵字 → 產品系列路徑 */
const KEYWORD_PRODUCT_PATHS = [
	{ pattern: /門禁|wiegand|bacnet|access/i, paths: ["/products/access-control", "/products/video-intercom"] },
	{ pattern: /監控|影像|rtsp|bitrate|dori|魚眼|ipc|nvr|surveillance/i, paths: ["/products/surveillance-monitoring"] },
	{ pattern: /對講|intercom/i, paths: ["/products/video-intercom"] },
	{ pattern: /安全|防護|alarm/i, paths: ["/products/security-solutions"] },
	{ pattern: /hvac|智慧建築|building/i, paths: ["/solutions/aiot-property-management", "/products/security-solutions"] }
];

const getCategoryMain = (faq) => {
	const main = faq?.category?.main;
	if (!main) return "";
	if (typeof main === "string") return main;
	return main.TW || main.EN || "";
};

const getSearchText = (faq) => {
	const q = faq?.question;
	const parts = [];
	if (q?.TW) parts.push(q.TW);
	if (q?.EN) parts.push(q.EN);
	if (faq?.summary?.TW) parts.push(faq.summary.TW);
	if (faq?.summary?.EN) parts.push(faq.summary.EN);
	return parts.join(" ");
};

/**
 * 解析 FAQ 的商務導流連結（後台欄位優先，否則規則 fallback）
 */
export const useFaqSeoLinks = (faqRef) => {
	const { locale } = useI18n();

	const relatedSolutions = computed(() => {
		const faq = faqRef.value;
		if (!faq) return [];

		const fromApi = (faq.relatedSolutions || []).filter((slug) => solutions[slug]);
		if (fromApi.length) {
			return fromApi.map((slug) => ({
				slug,
				title: solutions[slug].title,
				path: `/solutions/${slug}`
			}));
		}

		const main = getCategoryMain(faq);
		const slugs = CATEGORY_SOLUTION_MAP[main] || ["community-security", "video-intercom-system"];
		return slugs
			.filter((slug) => solutions[slug])
			.map((slug) => ({
				slug,
				title: solutions[slug].title,
				path: `/solutions/${slug}`
			}));
	});

	const relatedProductPaths = computed(() => {
		const faq = faqRef.value;
		if (!faq) return [];

		const fromApi = faq.relatedProductPaths || [];
		if (fromApi.length) return fromApi;

		const text = getSearchText(faq);
		const paths = new Set();
		for (const { pattern, paths: p } of KEYWORD_PRODUCT_PATHS) {
			if (pattern.test(text)) {
				p.forEach((path) => paths.add(path));
			}
		}
		if (!paths.size) {
			paths.add("/products");
		}
		return Array.from(paths);
	});

	const primaryCta = computed(() => {
		const faq = faqRef.value;
		if (!faq?.ctaPrimary?.href) {
			return {
				label: locale.value === "en" ? "Contact Us" : "聯絡我們",
				href: "/contact",
				type: "contact"
			};
		}
		const label =
			locale.value === "en"
				? faq.ctaPrimary.label?.EN || faq.ctaPrimary.label?.TW
				: faq.ctaPrimary.label?.TW || faq.ctaPrimary.label?.EN;
		return {
			label: label || (locale.value === "en" ? "Learn more" : "了解更多"),
			href: faq.ctaPrimary.href,
			type: faq.ctaPrimary.type || "contact"
		};
	});

	return {
		relatedSolutions,
		relatedProductPaths,
		primaryCta
	};
};
