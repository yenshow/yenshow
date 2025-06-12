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
			const languageStore = useLanguageStore();
			const queryParams = { ...params, lang: languageStore.currentLang };
			// 使用 search 方法以獲取項目和分頁資訊
			const result = await newsService.search(queryParams);
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
			const { apiAuth } = useApi();
			const languageStore = useLanguageStore();

			// 添加語言參數
			const queryParams = {
				...params,
				lang: languageStore.currentLang
			};

			// 發送請求
			const response = await apiAuth({
				url: `/api/news/${slug}`,
				method: "get",
				params: queryParams
			});

			if (!response.data.success) {
				throw new Error(response.data.message || "獲取新聞詳情失敗");
			}

			// 更新當前新聞
			currentNewsItem.value = response.data.result.news || response.data.result;
			return currentNewsItem.value;
		} catch (error) {
			error.value = error.message || "獲取新聞詳情時發生錯誤";
			throw error;
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
