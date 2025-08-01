import { visualizer } from "rollup-plugin-visualizer";
import { defineNuxtConfig } from "nuxt/config";
import { $fetch } from "ofetch";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },

	/* -------------------------------------------------- */
	app: {
		head: {
			charset: "utf-8",
			viewport: "width=device-width, initial-scale=1",
			titleTemplate: "遠岫科技 %s",
			meta: [
				{ name: "description", content: "遠岫科技專注於提供創新的軟體解決方案與專業的技術諮詢服務。" },
				{ property: "og:title", content: "遠岫科技" },
				{ property: "og:description", content: "遠岫科技專注於提供創新的軟體解決方案與專業的技術諮詢服務。" },
				{ property: "og:url", content: "https://www.yenshow.com" },
				{ name: "twitter:card", content: "summary_large_image" }
			],
			link: [
				{ rel: "icon", type: "image/x-icon", href: "/logo/yenshow-icon.svg" },
				{ rel: "preconnect", href: "https://api.yenshow.com" }
			]
		},
		pageTransition: { name: "page", mode: "out-in" }
	},

	css: ["@/assets/css/global.css"],

	/* -------------------------------------------------- */
	modules: ["@nuxtjs/tailwindcss", "@nuxtjs/sitemap", "@nuxtjs/robots", "@nuxtjs/i18n", "@pinia/nuxt", "@nuxtjs/device", "@nuxt/image", "nuxt-gtag"],

	gtag: { id: "G-K9YP86ZDRP", config: { defer: true } },

	/* -------------------------------------------------- */
	i18n: {
		bundle: { optimizeTranslationDirective: false },
		locales: [{ code: "zh", iso: "zh-TW", name: "繁體中文", file: "zh.json" }],
		defaultLocale: "zh",
		strategy: "prefix_except_default",
		lazy: true,
		langDir: "locales/"
	},

	/* -------------------------------------------------- */
	runtimeConfig: {
		apiSecret: process.env.API_SECRET || "",
		apiKey: process.env.API_KEY || "",
		public: {
			apiBaseUrl: process.env.API_BASE_URL || "/api",
			storagePath: process.env.STORAGE_PATH || "/storage",
			fileServiceBaseUrl: process.env.NUXT_PUBLIC_FILE_SERVICE_BASE_URL || "https://api.yenshow.com",
			siteUrl: "https://www.yenshow.com"
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
				urls: [
					{ loc: "/", changefreq: "weekly", priority: 1.0 },
					{ loc: "/contact", changefreq: "monthly", priority: 0.7 },
					{ loc: "/success-stories", changefreq: "monthly", priority: 0.7 },
					{ loc: "/news", changefreq: "weekly", priority: 0.8 },
					{ loc: "/faqs", changefreq: "weekly", priority: 0.8 }
				]
			},

			/* ---------- News：動態從 API 獲取所有已發佈的新聞文章 ---------- */
			news: {
				async urls() {
					const { result } = await $fetch<any>("https://api.yenshow.com/api/news/search?all=true&isActive=true");
					return (result.news ?? []).map((n: any) => ({
						loc: `/news/${n.slug}`,
						lastmod: n.updated_at
					}));
				}
			},

			/* ---------- FAQs：動態從 API 獲取所有已發佈的常見問題 ---------- */
			faqs: {
				async urls() {
					const { result } = await $fetch<any>("https://api.yenshow.com/api/faqs/search?all=true&isActive=true");
					return (result.faqs ?? result.faq ?? []).map((f: any) => ({
						loc: `/faqs/${f.slug}`,
						lastmod: f.updated_at
					}));
				}
			},

			/* ---------- Products：動態獲取所有產品頁面及靜態分類頁 ---------- */
			products: {
				async urls() {
					// 靜態產品分類頁
					const categoryUrls = [
						{ loc: "/products" },
						{ loc: "/products/access-control" },
						{ loc: "/products/devices-accessories" },
						{ loc: "/products/security-solutions" },
						{ loc: "/products/surveillance-monitoring" },
						{ loc: "/products/video-intercom" }
					];

					// 動態產品內頁
					const { result } = await $fetch<any>("https://api.yenshow.com/api/products/search?all=true&isActive=true");
					const list = result.products ?? result.productList ?? result.productsList ?? [];
					const productUrls = list.map((p: any) => ({
						loc: `/products/${p.code}`,
						lastmod: p.updated_at
					}));

					return [...categoryUrls, ...productUrls];
				}
			}
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
				disallow: ["/api/", "/vercel/", "/__sitemap__/"]
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
