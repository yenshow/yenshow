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

	css: ["@/assets/css/global.css", "@/assets/css/tiptap-styles.css"],

	/* -------------------------------------------------- */
	modules: ["@nuxtjs/tailwindcss", "@nuxtjs/sitemap", "@nuxtjs/robots", "@nuxtjs/i18n", "@pinia/nuxt", "@nuxtjs/device", "@nuxt/image", "nuxt-gtag"],

	gtag: { id: "G-K9YP86ZDRP", config: { defer: true } },

	/* -------------------------------------------------- */
	// 圖片優化配置
	image: {
		provider: "ipx",
		// 預設圖片格式
		format: ["webp", "avif", "jpg"],
		// 預設品質
		quality: 85,
		// 自訂螢幕寬度，用於 Nuxt Image 在 vercel provider 下生成對應寬度
		screens: {
			// 常見 Tailwind 斷點（保持對齊）
			xs: 320,
			sm: 640,
			md: 768,
			lg: 1024,
			xl: 1280,
			"2xl": 1536,
			// 實際元件 sizes/width 使用到的像素（含 2x DPR 推估）
			w1: 1,
			w2: 2,
			w50: 50,
			w200: 200,
			w300: 300,
			w320: 320,
			w384: 384,
			w400: 400,
			w410: 410,
			w420: 420,
			w450: 450,
			w480: 480,
			w500: 500,
			w640: 640,
			w800: 800,
			w820: 820,
			w960: 960,
			w1000: 1000,
			w1024: 1024,
			w1280: 1280,
			w1300: 1300,
			w80: 80,
			w160: 160,
			w64: 64,
			w96: 96,
			w128: 128,
			w192: 192,
			w2048: 2048,
			w288: 288,
			w576: 576
		},
		// 預設載入策略
		loading: "lazy",
		// 預設模糊佔位符
		placeholder: [20, 20, 75, 5],
		// 允許的遠端圖片網域（供 NuxtImg 最佳化代理）
		domains: ["api.yenshow.com"],
		// 快取設定
		cache: {
			// 快取時間（秒）
			maxAge: 31536000 // 1年
		},
		// 預設尺寸
		presets: {
			avatar: {
				modifiers: {
					format: "webp",
					width: 50,
					height: 50,
					quality: 80
				}
			},
			thumbnail: {
				modifiers: {
					format: "webp",
					width: 200,
					height: 200,
					quality: 85
				}
			},
			hero: {
				modifiers: {
					format: "webp",
					width: 1200,
					height: 600,
					quality: 90
				}
			}
		}
	},

	/* -------------------------------------------------- */
	i18n: {
		bundle: { optimizeTranslationDirective: false },
		defaultLocale: "zh",
		strategy: "prefix_except_default",
		lazy: true,
		langDir: "locales",
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
					"zh/faqs.json"
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
					"en/faqs.json"
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
					const items = (result.news ?? []).filter((n: any) => n?.slug && !n.slug.toLowerCase().includes("undefined"));
					return items.map((n: any) => ({
						loc: `/news/${n.slug.toLowerCase()}`,
						lastmod: n.updated_at
					}));
				}
			},

			/* ---------- FAQs：動態從 API 獲取所有已發佈的常見問題 ---------- */
			faqs: {
				async urls() {
					const { result } = await $fetch<any>("https://api.yenshow.com/api/faqs/search?all=true&isActive=true");
					const items = (result.faqs ?? result.faq ?? []).filter((f: any) => f?.slug && !f.slug.toLowerCase().includes("undefined"));
					return items.map((f: any) => ({
						loc: `/faqs/${f.slug.toLowerCase()}`,
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
					const listRaw = result.products ?? result.productList ?? result.productsList ?? [];

					// 過濾無效代號：24 位 Hex、中文、純數字或含大寫
					const invalidHex24 = /^[\\da-f]{24}$/i;
					const invalidChinese = /[\\u4e00-\\u9fa5]/;
					const invalidDigits = /^\\d+$/;
					const list = listRaw.filter((p: any) => {
						if (!p?.code) return false;
						const c = p.code;
						if (invalidHex24.test(c)) return false;
						if (invalidChinese.test(c)) return false;
						if (invalidDigits.test(c)) return false;
						if (c !== c.toLowerCase()) return false;
						return true;
					});

					const productUrls = list.map((p: any) => ({
						loc: `/products/${p.code.toLowerCase()}`,
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
