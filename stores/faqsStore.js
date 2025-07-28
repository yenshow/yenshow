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
			// 移除手動添加的語言參數，攔截器會自動處理
			const result = await faqsService.search(params);
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
			// 使用標準化的 getBySlug 方法
			const queryParams = {
				...params,
				populate: "relatedFaqs" // 請求填充 relatedFaqs
			};
			const result = await faqsService.getBySlug(slug, queryParams);
			if (!result) {
				throw new Error("獲取常見問題詳情失敗：找不到項目");
			}
			currentFaqsItem.value = result;
			return currentFaqsItem.value;
		} catch (e) {
			error.value = e.message || "獲取常見問題詳情時發生錯誤";
			currentFaqsItem.value = null; // 確保出錯時清空
			throw e;
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
