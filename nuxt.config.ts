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
			link: [
				{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
				{ rel: "preload", href: "/logo/yenshow.png", as: "image", fetchpriority: "high" }
			],
			script: []
		},
		pageTransition: { name: "page", mode: "out-in" }
	},
	css: ["~/assets/css/global.css"],
	modules: [
		"@nuxtjs/tailwindcss",
		"@nuxtjs/i18n",
		"@nuxtjs/google-fonts",
		"@pinia/nuxt",
		"@nuxtjs/sitemap",
		"@nuxtjs/device",
		"@nuxt/image",
		"@nuxtjs/robots",
		"nuxt-gtag"
	],
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
	googleFonts: {
		families: {
			"LXGW WenKai Mono TC": [300, 500, 700]
		},
		display: "swap"
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
				include: ["/"],
				exclude: ["/products/**"]
			},
			products: {
				include: ["/products/**"]
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
