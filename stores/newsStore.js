import { defineStore } from "pinia";
import { ref } from "vue";
import { useApi } from "~/composables/useApi";
import { useLanguageStore } from "~/stores/core/languageStore";

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
			// 移除手動添加的語言參數，攔截器會自動處理
			const result = await newsService.search(params);
			newsList.value = result.items;
			pagination.value = result.pagination;
		} catch (e) {
			error.value = e.message || "無法獲取新聞列表";
			newsList.value = [];
			pagination.value = null;
		} finally {
			isLoading.value = false;
		}
	}

	async function fetchNewsBySlug(slug, params = {}) {
		isLoading.value = true;
		error.value = null;
		try {
			// 使用標準化的 getBySlug 方法
			const result = await newsService.getBySlug(slug, params);
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
		fetchNewsBySlug
	};
});
