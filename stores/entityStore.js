import { defineStore } from "pinia";
import { useApi } from "~/composables/useApi";
import { useLanguageStore } from "~/stores/core/languageStore";

// 通用實體 store 工廠函數
export const createEntityStore = (entityType, options = {}) => {
	const responseKey = options.responseKey || `${entityType}List`;

	return defineStore(`${entityType}Store`, {
		state: () => ({
			items: [],
			currentItem: null,
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
			// getItemById: (state) => (id) => {
			// 	return state.items.find((item) => item._id === id);
			// },

			// 取得本地化名稱的輔助函數
			getItemName: () => (item) => {
				if (!item) return "";
				const languageStore = useLanguageStore();
				return languageStore.getLocalizedField(item, "name");
			}
		},

		actions: {
			// 獲取所有項目
			async fetchAll(params = {}) {
				this.isLoading = true;
				this.error = null;

				try {
					const { entityApi } = useApi();
					const languageStore = useLanguageStore();

					// 加入當前語言參數
					const updatedParams = {
						...params,
						lang: languageStore.currentLang
					};

					this.items = await entityApi(entityType, { responseKey }).getAll(updatedParams);
				} catch (error) {
					this.error = error.message || `獲取${entityType}時發生錯誤`;
				} finally {
					this.isLoading = false;
				}
			},
			// 搜尋項目
			async search(keyword, params = {}) {
				this.isLoading = true;
				this.error = null;

				try {
					const { entityApi } = useApi();
					const languageStore = useLanguageStore();

					const searchParams = {
						keyword,
						page: params.page || this.pagination.page,
						limit: params.limit || this.pagination.limit,
						sort: params.sort || "createdAt",
						sortDirection: params.sortDirection || "asc",
						...params,
						lang: languageStore.currentLang
					};

					const result = await entityApi(entityType, { responseKey }).search(searchParams);

					this.items = result.items;
					if (result.pagination) {
						this.pagination = result.pagination;
					}

					return this.items;
				} catch (error) {
					this.error = error.message || `搜尋${entityType}時發生錯誤`;
					return [];
				} finally {
					this.isLoading = false;
				}
			}
		}
	});
};
