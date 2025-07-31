import { defineEventHandler, sendRedirect, setResponseStatus } from "h3";

export default defineEventHandler((event) => {
	// 在開發環境中不執行任何重定向
	if (process.env.NODE_ENV === "development") {
		return;
	}

	const host = event.node.req.headers.host ?? ""; // e.g., 'www.yenshow.com', 'beta.yenshow.com'
	const url = event.node.req.url;
	if (!url) return;

	// --- 1. 標準化網域與協定 (Canonical Domain & Protocol) ---
	// 確保所有流量都導向主要網域 (www.yenshow.com) 並使用 HTTPS。
	// 這能防止搜尋引擎將不同網域視為重複內容，有助於集中 SEO 權重。

	// 對於 beta 或 api 子網域，直接回傳 410 Gone，防止其被索引
	const isBetaOrApi = host.startsWith("beta.") || host.startsWith("api.");
	if (isBetaOrApi) {
		setResponseStatus(event, 410, "Gone");
		return ""; // 停止處理這些網域的請求
	}

	const canonicalHost = "www.yenshow.com";
	const isHttps = event.node.req.headers["x-forwarded-proto"] === "https";

	// 如果不是 HTTPS 或不在 www 主網域上，則重定向
	if (!isHttps || host !== canonicalHost) {
		return sendRedirect(event, `https://${canonicalHost}${url}`, 301);
	}

	// --- 2. 標準化 URL 路徑 (Canonical URL Path) ---
	// 此區塊的規則旨在清理 URL，確保每個頁面只有一個唯一的 URL，避免重複內容問題。

	const { pathname, searchParams } = new URL(url, `https://${host}`);

	// 為 /storage/ 路徑下的資源添加 X-Robots-Tag，指示搜尋引擎不要索引這些內容
	if (pathname.startsWith("/storage/")) {
		event.node.res.setHeader("X-Robots-Tag", "noindex, nofollow");
	}

	// 移除常見的追蹤參數 (fbclid, gclid)，避免因參數不同而產生重複內容
	const trackingParams = ["fbclid", "gclid", "msclkid"];
	let needsRedirect = false;
	for (const param of trackingParams) {
		if (searchParams.has(param)) {
			searchParams.delete(param);
			needsRedirect = true;
		}
	}
	if (needsRedirect) {
		const cleanUrl = `${pathname}${searchParams.toString() ? "?" + searchParams.toString() : ""}`;
		return sendRedirect(event, cleanUrl, 301);
	}

	// 強制將特定路徑轉為小寫，統一 URL 格式
	const lowercasePaths = ["/products/", "/news/", "/faqs/", "/solutions/"];
	for (const path of lowercasePaths) {
		if (pathname.toLowerCase().startsWith(path) && pathname !== pathname.toLowerCase()) {
			return sendRedirect(event, pathname.toLowerCase(), 301);
		}
	}

	// --- 3. 永久重定向 (301 Redirects) ---
	// 將已變更路徑的舊 URL 永久重導向到新位置。
	// 這能將舊頁面的 SEO 權重轉移到新頁面，並確保使用者和爬蟲找到正確的內容。
	const permanentRedirects: Record<string, string | ((match: RegExpMatchArray) => string)> = {
		"^/privacy-policy/?$": "/contact",
		"^/faq/(.*)$": (match) => `/faqs/${match[1]}`,
		"^/news/latest-news/media-interview-coverage-yenshow-technology-general-manager-jerry-chung-featured-in-cts-excellent-showcase-program/?$":
			"/news/media-interview-coverage-yenshow-technology-general-manager-jerry-chung-featured-in-cts-excellent-showcase-program"
	};

	for (const from in permanentRedirects) {
		const match = pathname.match(new RegExp(from));
		if (match) {
			let to = permanentRedirects[from];
			if (typeof to === "function") {
				to = to(match);
			}
			return sendRedirect(event, to, 301);
		}
	}

	// --- 4. 已刪除內容 (410 Gone) ---
	// 針對已永久移除且不會再出現的頁面，回傳 410 Gone 狀態。
	// 這比 404 Not Found 更明確地告訴搜尋引擎此頁面已死，應從索引中移除，有助於清理 GSC 中的錯誤報告。

	// Regex 規則列表，用於匹配應回傳 410 的路徑
	const gonePaths = [
		// -- A. 舊版 CMS (WordPress) 相關路徑 --
		"^/wp-includes(/.*)?$",
		"^/wp-content(/.*)?$",
		"^/archives(/.*)?$",
		"^/products_category(/.*)?$",
		"^/category(/.*)?$",
		"^/tag(/.*)?$",
		"^/author(/.*)?$",
		"^/blog(/.*)?$",
		"^/comments(/.*)?$",
		"/feed/?$",

		// -- B. 爬蟲或服務產生的無效路徑 --
		"^/cdn-cgi(/.*)?$", // Cloudflare
		"^/vercel(/.*)?$", // Vercel
		"^/_vercel(/.*)?$", // Vercel
		"^/storage(/.*)?$", // 舊儲存路徑

		// -- C. 前端錯誤或意外產生的路徑 (e.g., /news/undefined) --
		"^/news/undefined(/.*)?$",
		"^/faqs/undefined(/.*)?$",
		"^/news/undefined/news/.*$", // GSC 回報的重複路徑
		"^/faqs/undefined/faqs/.*$", // GSC 回報的重複路徑

		// -- D. 根據 GSC 報告移除的舊新聞文章 --
		"^/news/latest-newsmedia-interview-coverage-yenshow-technology-general-manager-jerry-chung-featured-in-cts-exclusive-interview-a-deep-dive-into-the-critical-value-of-iris-recognition-technology-in-cybersecurity-applications/?$",
		"^/news/now-available-yenshow-technology-yx-pro-series-wireless-intrusion-prevention-system/?$",
		"^/news/latest-update-yenshow-technology-launches-a-brand-new-smart-meeting-room-management-so.*$",
		"^/news/breaking-newsyenshow-technology-unveils-dual-ai-behavior-analysis-nvr-model-s-ys-ba16-lys-ba32-revolutionizing-video-surveillance/?$",

		// -- E. 舊版產品或數字 ID 路徑 --
		"^/products/[\\da-fA-F]{24}/?$", // 舊 MongoDB ID 格式
		"^/products/.*[\\u4e00-\\u9fa5].*/?$", // 包含中文的舊產品路徑
		"^/(\\d{1,})/?$", // 純數字路徑 (e.g., /1234)

		// -- F. 其他已棄用的路徑 --
		"^/applications(/.*)?$"
	];

	// 應標示為 410 Gone 的舊產品代號 (slug)
	const goneProductSlugs = [
		/* ---------------- GSC 報告中需要移除的項目 ---------------- */
		"5ys-425iwg-4g",
		"6ys-8325g0-cisb",
		"6ys-a87g1-ls-c36s80",
		"6ys-k01-c36s80",
		"ds-k7p02",
		"ds-k7p05",
		"ftc-06-ftc-08",
		"ftc-06",
		"iys-6716nxi-m1-aib",
		"iys-6732nxi-m1-aib",
		"iys-7716",
		"tbc-01",
		"tocc-實際測試",
		"tocc查詢系統",
		"yshm-td2628-10-qa",
		"ys-2cd7586g2-xzhsy",
		"ys-3e0326p-ec",
		"ys-it47",
		"ys-kd-acw3",
		"ys-2de4215iw-det5",
		"ys-k1801m",
		"ys-ftc-06-3",
		"ys-2cd2043g2-iu",
		"ys-k630x-t",
		"ys-tdsb00-ekt-poe-4m",
		"ys-td1018-1-qr",
		"ys-2cd3646g2ht-lzsy",
		"ys-kd-acf1",
		"ys-2cd3b26g2t-izhsy",
		"ys-ba32nxh-m1a1(b)",
		"ys-ac-05",
		"ys-zdyh2a0ixs-d(t2)",
		"6ys-825g0-c-ivsb",
		"6ys-825g0-c-iwsb"

		/* ---------------- 暫時保留/待確認的項目 (已註解) ---------------- */
		// "ys-3e3754tf",
		// "ys-2cd3746g2-izs",
		// "ys-pdqp15am-lm-wb",
		// "ys-pkf1-wb",
		// "ys-pdmc-eg2-wb",
		// "ys-tmg01",
		// "ys-ac-08",
		// "ys-tvl224",
		// "ys-2cd3321g0-iu",
		// "ys-pm1-o1l-wb",
		// "ys-2cd3t47g1-l(s)",
		// "ys-ac-01",
		// "ys-ac-02f",
		// "ys-ttc-01-3_pa",
		// "ys-kd9633",
		// "ys-9664ni-m16",
		// "ys-2cd3021g0-iu",
		// "ys-7604-8",
		// "ys-2cd3563g2-is",
		// "iys-ba32nxi-m1ai(b)",
		// "ys-3e0109p-e(c)",
		// "ys-sg-3b411x"
	];

	// 動態將 goneProductSlugs 添加到 gonePaths 規則中
	goneProductSlugs.forEach((slug) => {
		const escapedSlug = slug.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
		gonePaths.push(`^/products/${escapedSlug}/?$`);
	});

	// 遍歷所有 410 規則，如果匹配則回傳 Gone 狀態
	for (const pattern of gonePaths) {
		if (new RegExp(pattern, "i").test(pathname)) {
			setResponseStatus(event, 410, "Gone");
			return ""; // 結束回應
		}
	}
});
