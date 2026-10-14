/**
 * 產品規格 PDF：向後端換取短效、一次性開啟憑證，再組出實際可開啟的 URL。
 * - public-url：活躍產品免登入（LIFF／官網共用）
 * - presign：需官網登入（非活躍或公開端點失敗時備援）
 */
export const SPEC_DOCUMENT_PATH_REGEX = /^\/storage\/products\/([a-f0-9]{24})\/documents\/.+\.pdf$/i;

/**
 * @param {string} documentUrl 例如 /storage/products/<id>/documents/xxx.pdf
 * @returns {{ productId: string, documentUrl: string } | null}
 */
export const parseSpecDocumentFromStoragePath = (documentUrl) => {
	if (!documentUrl || typeof documentUrl !== "string") return null;
	const normalized = documentUrl.startsWith("/") ? documentUrl : `/${documentUrl}`;
	const m = normalized.match(SPEC_DOCUMENT_PATH_REGEX);
	if (!m) return null;
	return { productId: m[1], documentUrl: normalized };
};

export const useSpecificationPresign = () => {
	const config = useRuntimeConfig();
	const { api, apiAuth } = useApi();

	const toSignedUrl = (presign) => {
		const { storagePath, token } = presign || {};
		if (!storagePath || !token) {
			throw new Error("presign_missing");
		}

		const base = config.public.fileServiceBaseUrl?.replace(/\/$/, "");
		if (!base) {
			throw new Error("config_missing");
		}

		return `${base}/storage/${storagePath}?dl=${encodeURIComponent(token)}`;
	};

	/**
	 * 活躍產品免登入開啟（與 LIFF public-url 相同）
	 * @param {{ productId: string, documentUrl: string }} params
	 * @returns {Promise<string>}
	 */
	const buildPublicSpecificationUrl = async ({ productId, documentUrl }) => {
		const { data } = await api.get("/api/documents/specifications/public-url", {
			params: { productId, documentUrl }
		});
		return toSignedUrl(data?.result || data);
	};

	/**
	 * 官網登入後簽發
	 * @param {{ productId: string, documentUrl: string }} params
	 * @returns {Promise<string>}
	 */
	const buildSignedSpecificationUrl = async ({ productId, documentUrl }) => {
		const { data } = await apiAuth.get("/api/documents/specifications/presign", {
			params: { productId, documentUrl }
		});
		return toSignedUrl(data?.result || data);
	};

	/**
	 * 優先免登入；失敗且已登入時改走 presign
	 * @param {{ productId: string, documentUrl: string, preferAuth?: boolean }} params
	 * @returns {Promise<string>}
	 */
	const buildOpenableSpecificationUrl = async ({ productId, documentUrl, preferAuth = false }) => {
		if (!preferAuth) {
			try {
				return await buildPublicSpecificationUrl({ productId, documentUrl });
			} catch {
				// 非活躍或公開端點失敗時，交給呼叫端決定是否登入後再試
			}
		}
		return buildSignedSpecificationUrl({ productId, documentUrl });
	};

	return {
		buildPublicSpecificationUrl,
		buildSignedSpecificationUrl,
		buildOpenableSpecificationUrl
	};
};
