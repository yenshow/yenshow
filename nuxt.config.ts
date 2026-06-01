import { visualizer } from "rollup-plugin-visualizer";
import { defineNuxtConfig } from "nuxt/config";
import { solutions } from "./data/solutions.js";
import { fetchAllSitemapItems, toSitemapEntries } from "./utils/fetchSitemapUrls.js";

const SITE_URL = "https://www.yenshow.com";
const DEFAULT_META_DESCRIPTION =
	"遠岫科技提供影像監控、門禁管理、可視對講與智慧建築整合方案，協助企業與社區打造安全、高效的安防系統。";

const sitemapAlternates = (loc: string) => [
	{ hreflang: "zh-TW", href: `${SITE_URL}${loc}` },
	{ hreflang: "en-US", href: `${SITE_URL}/en${loc === "/" ? "" : loc}` },
	{ hreflang: "x-default", href: `${SITE_URL}${loc}` }
];

const staticPageLocs = ["/", "/contact", "/success-stories", "/news", "/faqs", "/products"];

const solutionSitemapUrls = Object.keys(solutions).map((slug) => ({
	loc: `/solutions/${slug}`,
	changefreq: "monthly" as const,
	priority: 0.8,
	alternatives: sitemapAlternates(`/solutions/${slug}`)
}));

const productCategoryLocs = [
	"/products",
	"/products/access-control",
	"/products/devices-accessories",
	"/products/security-solutions",
	"/products/surveillance-monitoring",
	"/products/video-intercom"
];

const fetchSitemapTypeSafe = async (type: string) => {
	try {
		const items = await fetchAllSitemapItems(type);
		return toSitemapEntries(items);
	} catch (error) {
		console.warn(`[sitemap] Failed to fetch type="${type}":`, error);
		return [];
	}
};

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	compatibilityDate: "2025-01-01",

	/* -------------------------------------------------- */
	app: {
		head: {
			charset: "utf-8",
			viewport: "width=device-width, initial-scale=1",
			titleTemplate: "遠岫科技 %s",
			meta: [
				{ name: "description", content: DEFAULT_META_DESCRIPTION },
				{ property: "og:title", content: "遠岫科技" },
				{ property: "og:description", content: DEFAULT_META_DESCRIPTION },
				{ property: "og:url", content: "https://www.yenshow.com" },
				{ name: "twitter:card", content: "summary_large_image" }
			],
			link: [
				{ rel: "icon", type: "image/x-icon", href: "/logo/yenshow-icon.svg" },
				{ rel: "preconnect", href: "https://api.yenshow.com" }
			]
		},
		// 全域頁面轉場設定
		pageTransition: { name: "page", mode: "out-in", appear: true }
	},

	css: ["@/assets/css/global.css", "@/assets/css/tiptap-styles.css"],

	/* -------------------------------------------------- */
	modules: ["@nuxtjs/tailwindcss", "@nuxtjs/sitemap", "@nuxtjs/robots", "@nuxtjs/i18n", "@pinia/nuxt", "@nuxtjs/device", "@nuxt/image", "nuxt-gtag"],

	gtag: { id: "G-K9YP86ZDRP", config: { defer: true } },

	/* -------------------------------------------------- */
	i18n: {
		defaultLocale: "zh",
		strategy: "prefix_except_default",
		lazy: false,
		langDir: "locales",
		bundle: {
			optimizeTranslationDirective: false
		},
		detectBrowserLanguage: {
			useCookie: true,
			cookieKey: "i18n_redirected",
			redirectOn: "root"
		},
		locales: [
			{
				code: "zh",
				iso: "zh-TW",
				name: "繁體中文",
				files: [
					"zh/common.json",
					"zh/layout.json",
					"zh/home.json",
					"zh/products.json",
					"zh/login.json",
					"zh/settings.json",
					"zh/contact.json",
					"zh/success-stories.json",
					"zh/news.json",
					"zh/faqs.json",
					"zh/employees.json",
					"zh/licenseActivate.json"
				]
			},
			{
				code: "en",
				iso: "en-US",
				name: "English",
				files: [
					"en/common.json",
					"en/layout.json",
					"en/home.json",
					"en/products.json",
					"en/login.json",
					"en/settings.json",
					"en/contact.json",
					"en/success-stories.json",
					"en/news.json",
					"en/faqs.json",
					"en/employees.json",
					"en/licenseActivate.json"
				]
			}
		]
	},

	/* -------------------------------------------------- */
	runtimeConfig: {
		apiSecret: process.env.API_SECRET || "",
		apiKey: process.env.API_KEY || "",
		public: {
			apiBaseUrl: process.env.API_BASE_URL || "/api",
			storagePath: process.env.STORAGE_PATH || "/storage",
			fileServiceBaseUrl: process.env.NUXT_PUBLIC_FILE_SERVICE_BASE_URL || "https://api.yenshow.com",
			siteUrl: SITE_URL
		}
	},

	/* -------------------------------------------------- */
	// Sitemap 模組：產生 sitemap.xml，主動告知搜尋引擎網站的結構與有效頁面。
	// 這有助於加速新內容的發現，並確保只有標準化後的 URL 被提交。
	// 這裡的設定會動態抓取最新的新聞、FAQ 和產品，確保站點地圖始終是最新狀態。
	sitemap: {
		sitemapsPathPrefix: "/__sitemap__",
		autoLastmod: true,
		sitemaps: {
			/* ---------- 靜態頁面：手動定義網站的核心靜態頁面 ---------- */
			pages: {
				urls: staticPageLocs.map((loc) => ({
					loc,
					changefreq: loc === "/" ? ("weekly" as const) : ("monthly" as const),
					priority: loc === "/" ? 1.0 : 0.7,
					alternatives: sitemapAlternates(loc)
				}))
			},

			solutions: {
				urls: solutionSitemapUrls
			},

			news: {
				async urls() {
					return fetchSitemapTypeSafe("news");
				}
			},

			faqs: {
				async urls() {
					return fetchSitemapTypeSafe("faqs");
				}
			},

			products: {
				async urls() {
					const categoryUrls = productCategoryLocs.map((loc) => ({
						loc,
						alternatives: sitemapAlternates(loc)
					}));
					const dynamic = await fetchSitemapTypeSafe("products");
					return [...categoryUrls, ...dynamic];
				}
			},

		}
	},

	/* -------------------------------------------------- */
	// Robots 模組：產生 robots.txt，指示搜尋引擎爬蟲哪些路徑可以或不可以抓取。
	// 這對於防止爬蟲進入管理後台、API 路徑或暫存區域非常重要，
	// 避免索引無用或敏感的內容，並節省爬取預算。
	robots: {
		sitemap: "https://www.yenshow.com/sitemap.xml",
		groups: [
			{
				userAgent: "*",
				// 'allow: "/"' 是預設行為，此處不需明確設定。
				// Disallow 規則會阻止爬蟲訪問特定目錄。
				// 移除 /api/ 限制以避免影響搜尋引擎索引
				disallow: ["/vercel/", "/__sitemap__/"]
			}
		]
	},

	/* -------------------------------------------------- */
	features: { inlineStyles: true },

	experimental: { payloadExtraction: true },

	/* -------------------------------------------------- */
	build: { transpile: ["gsap", "three"] },

	vite: {
		plugins: [visualizer()],
		build: {
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (id.includes("node_modules")) {
							// ...
						}
					}
				}
			}
		}
	}
});
