/**
 * 產品規格 PDF：換取短效一次性開啟憑證。
 * - presign：官網會員登入後開啟
 */
export const SPEC_DOCUMENT_PATH_REGEX = /^\/storage\/products\/([a-f0-9]{24})\/documents\/.+\.pdf$/i;

const fullyDecodeUri = (value) => {
	let current = String(value ?? "").trim();
	for (let i = 0; i < 5; i++) {
		try {
			const next = decodeURIComponent(current.replace(/\+/g, "%20"));
			if (next === current) break;
			current = next;
		} catch {
			break;
		}
	}
	return current;
};

/** @param {string} documentUrl */
export const normalizeDocumentUrl = (documentUrl) => {
	let url = fullyDecodeUri(documentUrl);
	if (/^https?:\/\//i.test(url)) {
		try {
			url = fullyDecodeUri(new URL(url).pathname);
		} catch {
			/* keep */
		}
	}
	if (!url.startsWith("/")) url = `/${url}`;
	return url;
};

const encodeStoragePath = (storagePath) =>
	String(storagePath || "")
		.split("/")
		.map((segment) => encodeURIComponent(segment))
		.join("/");

/**
 * @param {string} documentUrl 例如 /storage/products/<id>/documents/xxx.pdf
 * @returns {{ productId: string, documentUrl: string } | null}
 */
export const parseSpecDocumentFromStoragePath = (documentUrl) => {
	if (!documentUrl || typeof documentUrl !== "string") return null;
	const normalized = normalizeDocumentUrl(documentUrl);
	const m = normalized.match(SPEC_DOCUMENT_PATH_REGEX);
	if (!m) return null;
	return { productId: m[1], documentUrl: normalized };
};

export const useSpecificationPresign = () => {
	const config = useRuntimeConfig();
	const { apiAuth } = useApi();

	const toSignedUrl = (presign) => {
		const { storagePath, token } = presign || {};
		if (!storagePath || !token) throw new Error("presign_missing");

		const base = config.public.fileServiceBaseUrl?.replace(/\/$/, "");
		if (!base) throw new Error("config_missing");

		return `${base}/storage/${encodeStoragePath(storagePath)}?dl=${encodeURIComponent(token)}`;
	};

	/** @param {{ productId: string, documentUrl: string }} params */
	const buildSignedSpecificationUrl = async ({ productId, documentUrl }) => {
		const { data } = await apiAuth.get("/api/documents/specifications/presign", {
			params: { productId, documentUrl: normalizeDocumentUrl(documentUrl) }
		});
		return toSignedUrl(data?.result || data);
	};

	return { buildSignedSpecificationUrl };
};
