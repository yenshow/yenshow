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
	sitemap: {
		sitemapsPathPrefix: "/__sitemap__",
		autoLastmod: true,
		sitemaps: {
			/* ---------- 靜態頁 ---------- */
			pages: {
				urls: [
					{ loc: "/", changefreq: "weekly", priority: 1.0 },
					{ loc: "/contact", changefreq: "monthly", priority: 0.7 },
					{ loc: "/success-stories", changefreq: "monthly", priority: 0.7 },
					{ loc: "/news", changefreq: "weekly", priority: 0.8 },
					{ loc: "/faqs", changefreq: "weekly", priority: 0.8 }
				]
			},

			/* ---------- News ---------- */
			news: {
				async urls() {
					const { result } = await $fetch<any>("https://api.yenshow.com/api/news/search?all=true&isActive=true");
					return (result.news ?? []).map((n: any) => ({
						loc: `/news/${n.slug}`,
						lastmod: n.updated_at
					}));
				}
			},

			/* ---------- FAQs ---------- */
			faqs: {
				async urls() {
					const { result } = await $fetch<any>("https://api.yenshow.com/api/faqs/search?all=true&isActive=true");
					return (result.faqs ?? result.faq ?? []).map((f: any) => ({
						loc: `/faqs/${f.slug}`,
						lastmod: f.updated_at
					}));
				}
			},

			/* ---------- Products ---------- */
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
	robots: {
		sitemap: "https://www.yenshow.com/sitemap.xml",
		groups: [
			{
				userAgent: "*",
				// allow: "/", // 註解或移除這行，因為下面的 Disallow 會更具體
				disallow: ["/api/", "/vercel/", "/__sitemap__/"]
			}
		]
	},

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
