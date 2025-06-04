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
	const pagination = ref(null);
	const isLoading = ref(false);
	const error = ref(null);

	/**
	 * 獲取所有新聞 (帶分頁)
	 * @param {Object} params - 查詢參數 (例如 { page: 1, limit: 10, sortBy: 'publishDate_desc', isActive: true })
	 */
	async function fetchAllNews(params = { isActive: true }) {
		isLoading.value = true;
		error.value = null;
		try {
			// 使用 search 方法以獲取項目和分頁資訊
			const result = await newsService.search(params);
			newsList.value = result.items;
			pagination.value = result.pagination;
		} catch (e) {
			error.value = e.message || "無法獲取新聞列表";
			newsList.value = [];
			pagination.value = null;
			console.error("Error fetching all news:", e);
		} finally {
			isLoading.value = false;
		}
	}

	/**
	 * 根據 ID 獲取單個新聞項目 (保留此函數，如果其他地方仍嚴格按 ID 獲取)
	 * @param {String} id - 新聞項目的 ID
	 * @param {Object} params - 查詢參數
	 * @returns {Promise<Object|null>}
	 */
	async function fetchNewsById(id, params = {}) {
		isLoading.value = true;
		error.value = null;
		currentNewsItem.value = null;
		try {
			const item = await newsService.getById(id, params);
			currentNewsItem.value = item;
			return { News: item };
		} catch (e) {
			error.value = e.message || `無法獲取 ID 為 ${id} 的新聞`;
			return null;
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
		fetchNewsById
	};
});
