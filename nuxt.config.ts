import { visualizer } from "rollup-plugin-visualizer";

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
			link: [{ rel: "icon", type: "image/x-icon", href: "/logo/yenshow-icon.png" }],
			script: []
		},
		pageTransition: { name: "page", mode: "out-in" }
	},
	css: ["~/assets/css/global.css"],
	modules: ["@nuxtjs/tailwindcss", "@nuxtjs/i18n", "@pinia/nuxt", "@nuxtjs/sitemap", "@nuxtjs/device", "@nuxt/image", "@nuxtjs/robots", "nuxt-gtag"],
	gtag: {
		id: "G-K9YP86ZDRP"
	},
	i18n: {
		locales: [
			{ code: "zh", iso: "zh-TW", name: "繁體中文", file: "zh.json" },
			{ code: "en", iso: "en-US", name: "English", file: "en.json" }
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
			fileServiceBaseUrl: process.env.NUXT_PUBLIC_FILE_SERVICE_BASE_URL || "https://api.yenshow.com"
		}
	},
	nitro: {
		devProxy: {
			"/api": {
				target: process.env.API_TARGET_URL || "http://localhost:4000/api",
				changeOrigin: true,
				prependPath: false
			},
			"/storage": {
				target: process.env.NUXT_DEV_STORAGE_PROXY_TARGET || "http://localhost:4000/storage",
				changeOrigin: true
			}
		}
	},
	site: {
		url: "https://www.yenshow.com",
		name: "遠岫科技"
	},
	sitemap: {
		sitemaps: {
			pages: {
				exclude: ["/news/**", "/products/**", "/faq/**"]
			},
			news: {
				include: ["/news/**"],
				urls: async () => {
					try {
						const response = await $fetch<{ result: { news: { id: string | number; updatedAt: string }[] } }>(
							"https://api.yenshow.com/api/news/search?all=true&isActive=true"
						);
						return response.result.news.map((p) => ({
							loc: `/news/${p.id}`,
							lastmod: p.updatedAt
						}));
					} catch (e) {
						console.error("Sitemap: Failed to fetch news articles.", e);
						return [];
					}
				}
			},
			faqs: {
				include: ["/faq/**"],
				urls: async () => {
					try {
						const response = await $fetch<{ result: { faqs: { id: string | number; updatedAt: string }[] } }>(
							"https://api.yenshow.com/api/faqs/search?all=true&isActive=true"
						);
						return response.result.faqs.map((p) => ({
							loc: `/faq/${p.id}`,
							lastmod: p.updatedAt
						}));
					} catch (e) {
						console.error("Sitemap: Failed to fetch FAQs.", e);
						return [];
					}
				}
			},
			products: {
				include: ["/products/**"],
				urls: async () => {
					try {
						const response = await $fetch<{ result: { products: { id: string | number; updatedAt: string }[] } }>(
							"https://api.yenshow.com/api/products/search?all=true&isActive=true"
						);
						return response.result.products.map((p) => ({
							loc: `/products/${p.id}`,
							lastmod: p.updatedAt
						}));
					} catch (e) {
						console.error("Sitemap: Failed to fetch products.", e);
						return [];
					}
				}
			}
		}
	},
	robots: {
		groups: [
			{
				userAgent: "*",
				disallow: ["/admin/", "/account/"],
				allow: "/admin/login"
			}
		],
		sitemap: "/sitemap.xml"
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
