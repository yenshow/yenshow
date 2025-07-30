import { defineStore } from "pinia";
import { useApi } from "~/composables/useApi";
import { useLanguageStore } from "@/stores/core/languageStore";

/**
 * 產品管理 Store
 * 專門用於處理產品資料的狀態管理和 API 操作
 */
export const useProductsStore = defineStore("productsStore", {
	state: () => ({
		items: [],
		currentProduct: null,
		pagination: {
			page: 1,
			limit: 20,
			total: 0,
			pages: 0
		},
		isLoading: false,
		error: null
	}),

	getters: {
		/**
		 * 通過 ID 獲取產品
		 */
		getProductById: (state) => (id) => {
			return state.items.find((item) => item._id === id);
		},

		/**
		 * 通過產品代碼獲取產品
		 */
		getProductByCode: (state) => (code) => {
			return state.items.find((item) => item.code === code);
		},

		/**
		 * 獲取本地化產品名稱
		 */
		getProductName: () => (product) => {
			if (!product) return "";
			const languageStore = useLanguageStore();
			return languageStore.getLocalizedField(product, "name");
		}
	},

	actions: {
		/**
		 * 獲取產品列表
		 */
		async fetchProducts(params = {}) {
			this.isLoading = true;
			this.error = null;

			try {
				const { apiAuth } = useApi();
				const languageStore = useLanguageStore();

				// 基本查詢參數
				const queryParams = {
					page: params.page || this.pagination.page,
					limit: params.limit || this.pagination.limit,
					sort: params.sort || "createdAt",
					sortDirection: params.sortDirection || "asc",
					...params,
					lang: languageStore.currentLang
				};

				// 發送請求
				const response = await apiAuth({
					url: "/api/products",
					method: "get",
					params: queryParams
				});

				if (!response.data.success) {
					throw new Error(response.data.message || "獲取產品列表失敗");
				}

				// 更新狀態
				const result = response.data.result || {};
				this.items = result.productsList || [];

				// 更新分頁信息
				if (result.pagination) {
					this.pagination = result.pagination;
				}

				return this.items;
			} catch (error) {
				this.error = error.message || "獲取產品列表時發生錯誤";
				return [];
			} finally {
				this.isLoading = false;
			}
		},

		/**
		 * 搜索產品
		 */
		async searchProducts(keyword, params = {}) {
			this.isLoading = true;
			this.error = null;

			try {
				const { apiAuth } = useApi();
				const languageStore = useLanguageStore();

				// 搜索參數
				const searchParams = {
					keyword,
					page: params.page || this.pagination.page,
					limit: params.limit || this.pagination.limit,
					sort: params.sort || "createdAt",
					sortDirection: params.sortDirection || "asc",
					isActive: true, // 只搜尋上架商品
					...params,
					lang: languageStore.currentLang
				};

				// 發送請求
				const response = await apiAuth({
					url: "/api/products/search",
					method: "get",
					params: searchParams
				});

				if (!response.data.success) {
					throw new Error(response.data.message || "搜索產品失敗");
				}

				// 更新狀態
				const result = response.data.result || {};
				this.items = result.productsList || [];

				// 更新分頁信息
				if (result.pagination) {
					this.pagination = result.pagination;
				}

				return this.items;
			} catch (error) {
				this.error = error.message || "搜索產品時發生錯誤";
				return [];
			} finally {
				this.isLoading = false;
			}
		},

		/**
		 * 獲取單個產品詳情
		 */
		async fetchProductById(id, params = {}) {
			this.isLoading = true;
			this.error = null;

			try {
				const { apiAuth } = useApi();
				const languageStore = useLanguageStore();

				// 添加語言參數
				const queryParams = {
					...params,
					lang: languageStore.currentLang
				};

				// 發送請求
				const response = await apiAuth({
					url: `/api/products/${id}`,
					method: "get",
					params: queryParams
				});

				if (!response.data.success) {
					throw new Error(response.data.message || "獲取產品詳情失敗");
				}

				// 更新當前產品
				this.currentProduct = response.data.result.products || response.data.result;
				return this.currentProduct;
			} catch (error) {
				this.error = error.message || "獲取產品詳情時發生錯誤";
				return null;
			} finally {
				this.isLoading = false;
			}
		}
	}
});
