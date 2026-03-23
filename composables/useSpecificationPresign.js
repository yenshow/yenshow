/**
 * 產品規格 PDF：登入後向後端換取短效、一次性下載憑證，再組出實際可開啟的 URL。
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
	const { apiAuth } = useApi();

	/**
	 * @param {{ productId: string, documentUrl: string }} params
	 * @returns {Promise<string>} 含 ?dl= 的完整下載 URL
	 */
	const buildSignedSpecificationUrl = async ({ productId, documentUrl }) => {
		const { data } = await apiAuth.get("/api/documents/specifications/presign", {
			params: { productId, documentUrl }
		});

		const presign = data?.result || data;
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

	return { buildSignedSpecificationUrl };
};
