/**
 * 產品型號 → 單一 URL 路徑段（與後端 server/utils/productUrl.js 規則一致）
 * 例：YS-7604NI-K1/4K → ys-7604ni-k1-4k
 */
export const toProductUrlSegment = (code) => {
	if (code == null || code === "") return "";
	return String(code)
		.trim()
		.toLowerCase()
		.replace(/[/\\]+/g, "-")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-+|-+$/g, "");
};

/** 組成官網產品詳情路徑 */
export const toProductPath = (code) => {
	const segment = toProductUrlSegment(code);
	return segment ? `/products/${segment}` : "/products";
};

/**
 * 比對用正規化：忽略大小寫、符號、空白與斜線差異
 * 例：YS-7604NI-K1/4K 與 ys-7604ni-k1-4k 皆 → ys7604nik14k
 */
export const normalizeProductCode = (value) => {
	if (value == null || value === "") return "";
	return String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
};

/** 畫面顯示用型號（僅替換第一個 -，維持既有行為） */
export const formatCodeForDisplay = (value) => {
	if (value == null) return "";
	return String(value).replace("-", " ");
};
