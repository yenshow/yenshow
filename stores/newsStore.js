import { defineStore } from "pinia";
import { ref } from "vue";
import { useApi } from "~/composables/useApi";

export const useNewsStore = defineStore("news", () => {
	const { entityApi } = useApi();
	// 設定 entityType 為 'news'，並根據 NewsController.js 的 responseKey 設定為 'news'
	// 設定 requiresAuth 為 false，因為新聞通常是公開的
	const newsService = entityApi("news", {
		responseKey: "news",
		requiresAuth: false
	});

	const newsList = ref([]);
	const currentNewsItem = ref(null);
	const pagination = ref({ page: 1, limit: 12, total: 0, pages: 0 });
	const isLoading = ref(false);
	const error = ref(null);

	/**
	 * 獲取所有新聞 (帶分頁)
	 * @param {Object} params - 查詢參數 (例如 { page: 1, limit: 10, sortBy: 'publishDate_desc', isActive: true })
	 */
	async function fetchAllNews(params = {}) {
		isLoading.value = true;
		error.value = null;
		try {
			// 後端列表 API：自帶權限過濾（公開只返回 isActive=true）
			const result = await newsService.getAll(params);
			newsList.value = result.items || [];
			if (result.pagination) {
				pagination.value = {
					page: result.pagination.page || pagination.value.page,
					limit: result.pagination.limit || pagination.value.limit,
					total: result.pagination.total || pagination.value.total,
					pages: result.pagination.pages || pagination.value.pages
				};
			}
		} catch (e) {
			error.value = e.message || "無法獲取新聞列表";
			newsList.value = [];
			pagination.value = { page: 1, limit: 12, total: 0, pages: 0 };
		} finally {
			isLoading.value = false;
		}
	}

	async function fetchCategories() {
		try {
			return await newsService.getCategories();
		} catch (e) {
			console.warn("載入分類清單失敗", e?.message || e);
			return [];
		}
	}

	async function fetchNewsBySlug(slug, params = {}) {
		isLoading.value = true;
		error.value = null;
		try {
			// 使用標準化的 getBySlug 方法，填充相關新聞
			const queryParams = {
				...params,
				populate: "relatedNews"
			};
			const result = await newsService.getBySlug(slug, queryParams);
			if (!result) {
				throw new Error("獲取新聞詳情失敗：找不到項目");
			}
			currentNewsItem.value = result;
			return currentNewsItem.value;
		} catch (e) {
			error.value = e.message || "獲取新聞詳情時發生錯誤";
			currentNewsItem.value = null; // 確保出錯時清空
			throw e;
		} finally {
			isLoading.value = false;
		}
	}

	return {
		newsList,
		currentNewsItem,
		pagination,
		isLoading,
		error,
		fetchAllNews,
		fetchNewsBySlug,
		fetchCategories
	};
});
