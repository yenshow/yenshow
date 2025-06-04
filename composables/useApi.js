import axios from "axios";
import { useUserStore } from "~/stores/userStore";
import { useLanguageStore } from "~/stores/core/languageStore";

export const useApi = () => {
	const config = useRuntimeConfig();
	const languageStore = useLanguageStore();

	// 建立實例
	const api = axios.create({
		baseURL: config.public.apiBaseUrl
	});

	const apiAuth = axios.create({
		baseURL: config.public.apiBaseUrl
	});

	// 在每個請求中自動加上 JWT Token
	apiAuth.interceptors.request.use((config) => {
		try {
			const user = useUserStore();
			config.headers.Authorization = "Bearer " + user.token;
		} catch (storeError) {
			console.error("Error accessing userStore in API interceptor:", storeError);
		}
		return config;
	});

	// 處理回應錯誤，特別是處理登入過期的情況
	apiAuth.interceptors.response.use(
		(res) => {
			return res;
		},
		async (error) => {
			if (error.response) {
				if (error.response.data.message === "登入過期" && error.config.url !== "/api/users/extend") {
					try {
						const user = useUserStore();
						const { data } = await apiAuth.patch("/api/users/extend");
						user.token = data.result;
						error.config.headers.Authorization = "Bearer " + user.token;
						return axios(error.config);
					} catch (extendError) {
						console.error("Error extending token:", extendError);
						try {
							const user = useUserStore();
							user.logout(); // 嘗試登出
						} catch (logoutError) {
							console.error("Error logging out after token extension failure:", logoutError);
						}
						return Promise.reject(extendError);
					}
				}
			}
			return Promise.reject(error);
		}
	);

	/**
	 * 安全API請求，自動處理錯誤
	 * @param {Function} apiCall - API調用函數
	 * @param {Object} errorOptions - 錯誤處理選項
	 * @returns {Promise} 處理過的Promise
	 */
	const safeApiCall = async (apiCall, errorOptions = {}) => {
		try {
			const response = await apiCall();
			return response;
		} catch (error) {
			// 簡化錯誤日誌，只保留關鍵信息
			if (error.response) {
				console.error(`API錯誤 (${error.response.status}):`, error.response.data);
			} else if (error.request) {
				console.error("API請求未收到回應");
			} else {
				console.error("API請求錯誤:", error.message);
			}

			// 如果有提供回調函數，執行它
			if (errorOptions.onError) {
				errorOptions.onError(error);
			}

			if (errorOptions.onFinally) {
				errorOptions.onFinally();
			}

			throw error;
		}
	};

	// 1. 添加語言攔截器
	const setupLanguageInterceptor = () => {
		// 請求攔截器 - 自動添加語言參數
		api.interceptors.request.use((config) => {
			// 為GET請求添加語言參數
			if (config.method?.toLowerCase() === "get") {
				config.params = {
					...(config.params || {}),
					lang: languageStore.currentLang
				};
			}
			// 為其他請求在數據中添加語言參數
			else if (config.data && typeof config.data === "object" && !(config.data instanceof FormData)) {
				config.data = {
					...config.data,
					lang: languageStore.currentLang
				};
			}

			return config;
		});

		// 同樣為 apiAuth 添加語言攔截器
		apiAuth.interceptors.request.use((config) => {
			if (config.method?.toLowerCase() === "get") {
				config.params = {
					...(config.params || {}),
					lang: languageStore.currentLang
				};
			} else if (config.data && typeof config.data === "object" && !(config.data instanceof FormData)) {
				config.data = {
					...config.data,
					lang: languageStore.currentLang
				};
			}
			return config;
		});
	};

	// 2. 添加響應格式處理
	const handleSuccessResponse = (response) => {
		// 處理後端成功響應格式
		if (response.data && response.data.success === true) {
			return response.data.result || {};
		}

		// 如果沒有遵循標準格式，直接返回
		return response.data;
	};

	// 3. 創建符合 EntityService 處理邏輯的API包裝器
	const entityApi = (entityType, options = {}) => {
		const responseKey = options.responseKey || `${entityType}List`;

		// 判斷是否需要認證，默認為 true
		const requiresAuth = options.requiresAuth !== false;
		const instance = requiresAuth ? apiAuth : api;

		return {
			// 獲取所有項目 (對應 BaseController.getAllItems)
			getAll: async (params = {}) => {
				const response = await safeApiCall(() => instance.get(`/api/${entityType}`, { params }));
				return response?.data?.result?.[responseKey] || [];
			},

			// 獲取單個項目 (對應 BaseController.getItemById)
			getById: async (id, params = {}) => {
				const response = await safeApiCall(() => instance.get(`/api/${entityType}/${id}`, { params }));
				// 兼容大小寫
				return response?.data?.result?.[entityType] || response?.data?.result?.[entityType.charAt(0).toUpperCase() + entityType.slice(1)] || null;
			},

			// 搜索項目 (對應 BaseController.searchItems)
			search: async (params = {}) => {
				const response = await safeApiCall(() => instance.get(`/api/${entityType}/search`, { params }));
				return {
					items: response?.data?.result?.[responseKey] || [],
					pagination: response?.data?.result?.pagination || null
				};
			}
		};
	};

	// 4. 創建符合 HierarchyManager 的API包裝器
	const hierarchyApi = {
		// 獲取完整層次結構 (對應 HierarchyManager.getFullHierarchy)
		getFullHierarchy: async (params = {}) => {
			const response = await safeApiCall(() => apiAuth.get("/api/hierarchy", { params })); // 假設需要認證
			return response?.data?.result?.hierarchy || [];
		},

		// 根據父項獲取子項 (對應 HierarchyManager.getChildrenByParentId)
		getChildrenByParent: async (parentType, parentId, params = {}) => {
			const response = await safeApiCall(
				() => apiAuth.get(`/api/hierarchy/children/${parentType}/${parentId}`, { params }) // 假設需要認證
			);
			return response?.data?.result || null;
		},

		// 獲取父層結構 (對應 HierarchyManager.getParentHierarchy)
		getParentHierarchy: async (itemType, itemId, params = {}) => {
			const response = await safeApiCall(
				() => apiAuth.get(`/api/hierarchy/parents/${itemType}/${itemId}`, { params }) // 假設需要認證
			);
			return response?.data?.result?.hierarchy || [];
		},

		// 新增：獲取指定項目以下的子階層 (對應 HierarchyManager.getSubHierarchy)
		getSubHierarchy: async (itemType, itemId, params = {}) => {
			const response = await safeApiCall(
				() => apiAuth.get(`/api/hierarchy/subtree/${itemType}/${itemId}`, { params }) // 假設需要認證
			);
			return response?.data?.result?.hierarchy || null;
		}
	};

	// SSR 和 CSR 環境下處理不同
	if (process.client) {
		setupLanguageInterceptor();
	}

	return {
		// 現有功能
		api,
		apiAuth,
		safeApiCall,

		// 新增功能
		entityApi,
		hierarchyApi,
		handleSuccessResponse
	};
};
