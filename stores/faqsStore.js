import { defineStore } from "pinia";
import { ref } from "vue";
import { useApi } from "~/composables/useApi";
import { useLanguageStore } from "~/stores/core/languageStore";

export const useFaqsStore = defineStore("faqs", () => {
	const { entityApi } = useApi();
	// 設定 entityType 為 'faqs'，並根據 FaqsController.js 的 responseKey 設定為 'faqs'
	// 設定 requiresAuth 為 false，因為 FAQs 通常是公開的
	const faqsService = entityApi("faqs", {
		responseKey: "faqs",
		requiresAuth: false
	});

	const faqsList = ref([]);
	const currentFaqsItem = ref(null);
	const pagination = ref(null);
	const isLoading = ref(false);
	const error = ref(null);

	/**
	 * 獲取所有常見問題 (帶分頁)
	 * @param {Object} params - 查詢參數 (例如 { page: 1, limit: 10, sortBy: 'publishDate_desc', isActive: true })
	 */
	async function fetchAllFaqs(params = { isActive: true }) {
		isLoading.value = true;
		error.value = null;
		try {
			const languageStore = useLanguageStore();
			const queryParams = { ...params, lang: languageStore.currentLang };
			// 使用 search 方法以獲取項目和分頁資訊
			const result = await faqsService.search(queryParams);
			faqsList.value = result.items;
			pagination.value = result.pagination;
		} catch (e) {
			error.value = e.message || "無法獲取常見問題列表";
			faqsList.value = [];
			pagination.value = null;
		} finally {
			isLoading.value = false;
		}
	}

	async function fetchFaqsBySlug(slug, params = {}) {
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
				url: `/api/faqs/${slug}`,
				method: "get",
				params: queryParams
			});

			if (!response.data.success) {
				throw new Error(response.data.message || "獲取常見問題詳情失敗");
			}

			// 更新當前常見問題
			currentFaqsItem.value = response.data.result.faqs || response.data.result;
			return currentFaqsItem.value;
		} catch (error) {
			error.value = error.message || "獲取常見問題詳情時發生錯誤";
			throw error;
		} finally {
			isLoading.value = false;
		}
	}

	return {
		faqsList,
		currentFaqsItem,
		pagination,
		isLoading,
		error,
		fetchAllFaqs,
		fetchFaqsBySlug
	};
});
