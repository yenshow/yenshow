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
			script: [
				{
					innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','GTM-MDGKVSK5');`,
					type: "text/javascript"
				}
			]
		},
		pageTransition: { name: "page", mode: "out-in" }
	},
	css: ["~/assets/css/global.css", "~/assets/css/fonts.css"],
	modules: ["@nuxtjs/tailwindcss", "@nuxtjs/i18n", "@pinia/nuxt", "@nuxtjs/sitemap", "@nuxtjs/device", "@nuxt/image", "@nuxtjs/robots"],
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
	}
});
