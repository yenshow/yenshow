import { visualizer } from "rollup-plugin-visualizer";
import { ofetch } from "ofetch";
import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-02-11",
	devtools: { enabled: false },
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
				{ rel: "icon", type: "image/x-icon", href: "/logo/yenshow-icon.png" },
				{ rel: "preconnect", href: "https://fonts.googleapis.com" },
				{ rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" },
				{ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=LXGW+WenKai+Mono+TC&display=swap" }
			],
			script: []
		},
		pageTransition: { name: "page", mode: "out-in" }
	},
	css: ["~/assets/css/global.css"],
	modules: ["@nuxtjs/tailwindcss", "nuxt-simple-sitemap", "@nuxtjs/robots", "@nuxtjs/i18n", "@pinia/nuxt", "@nuxtjs/device", "@nuxt/image", "nuxt-gtag"],
	gtag: {
		id: "G-K9YP86ZDRP"
	},
	i18n: {
		bundle: {
			optimizeTranslationDirective: false
		},
		locales: [
			{ code: "zh", iso: "zh-TW", name: "繁體中文", file: "zh.json" }
			// { code: "en", iso: "en-US", name: "English", file: "en.json" }
		],
		defaultLocale: "zh",
		strategy: "prefix_except_default", // 預設語言無前綴
		lazy: true, // 延遲載入語言檔案，提高效能
		langDir: "locales/"
	},
	runtimeConfig: {
		apiSecret: process.env.API_SECRET || "",
		apiKey: process.env.API_KEY || "",
		public: {
			apiBaseUrl: process.env.API_BASE_URL || "/api",
			storagePath: process.env.STORAGE_PATH || "/storage",
			fileServiceBaseUrl: process.env.NUXT_PUBLIC_FILE_SERVICE_BASE_URL || "https://api.yenshow.com",
			siteUrl: "https://www.yenshow.com" // sitemap 需要
		}
	},
	sitemap: {
		autoLastmod: true,
		sitemaps: {
			pages: {
				urls: [
					{ loc: "/", changefreq: "weekly", priority: 1.0 },
					{ loc: "/contact", changefreq: "monthly", priority: 0.7 },
					{ loc: "/Success-Stories", changefreq: "monthly", priority: 0.7 }
				]
			},
			news: {
				async urls() {
					const { result } = (await $fetch("https://api.yenshow.com/api/news/search?all=true&isActive=true")) as any;
					return result.news.map((n: any) => ({
						loc: `/news/${n.slug}`,
						lastmod: n.updated_at
					}));
				}
			},
			faqs: {
				async urls() {
					const { result } = (await $fetch("https://api.yenshow.com/api/faqs/search?all=true&isActive=true")) as any;
					return result.faqs.map((f: any) => ({
						loc: `/faq/${f.slug}`,
						lastmod: f.updated_at
					}));
				}
			},
			products: {
				async urls() {
					const { result } = (await $fetch("https://api.yenshow.com/api/products/search?all=true&isActive=true")) as any;
					const list = result.products || result.productsList;
					return list.map((p: any) => ({
						loc: `/products/${p.id}`,
						lastmod: p.updated_at
					}));
				}
			},
			"product-categories": {
				urls: [
					{ loc: "/products" },
					{ loc: "/products/Access-Control" },
					{ loc: "/products/Devices-Accessories" },
					{ loc: "/products/Security-Solutions" },
					{ loc: "/products/Surveillance-Monitoring" },
					{ loc: "/products/video-intercom" }
				]
			}
		}
	},
	robots: {
		sitemap: "https://www.yenshow.com/sitemap.xml",
		groups: [{ userAgent: "*", allow: "/" }]
	},
	experimental: {
		payloadExtraction: true
	},
	build: {
		transpile: ["gsap", "three"]
	},
	vite: {
		plugins: [visualizer()],
		build: {
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (id.includes("node_modules")) {
						}
					}
				}
			}
		}
	}
});
