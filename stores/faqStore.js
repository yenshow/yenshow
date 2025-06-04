import { defineStore } from "pinia";
import { ref } from "vue";
import { useApi } from "~/composables/useApi";

export const useFaqStore = defineStore("faq", () => {
	const { entityApi } = useApi();
	// 設定 entityType 為 'faqs'，並根據 FaqController.js 的 responseKey 設定為 'faqs'
	// 設定 requiresAuth 為 false，因為 FAQ 通常是公開的
	const faqService = entityApi("faqs", {
		responseKey: "faqs", // FaqController 使用 'faqs' 作為 responseKey
		requiresAuth: false
	});

	const faqList = ref([]);
	const currentFaqItem = ref(null);
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
			// 使用 search 方法以獲取項目和分頁資訊
			const result = await faqService.search(params);
			faqList.value = result.items;
			pagination.value = result.pagination;
		} catch (e) {
			error.value = e.message || "無法獲取常見問題列表";
			faqList.value = [];
			pagination.value = null;
			console.error("Error fetching all FAQs:", e);
		} finally {
			isLoading.value = false;
		}
	}

	/**
	 * 根據 ID 獲取單個常見問題項目
	 * @param {String} id - 常見問題項目的 ID
	 * @param {Object} params - 查詢參數
	 * @returns {Promise<Object|null>}
	 */
	async function fetchFaqById(id, params = {}) {
		isLoading.value = true;
		error.value = null;
		currentFaqItem.value = null;
		try {
			const item = await faqService.getById(id, params);
			currentFaqItem.value = item;
			// 後端 getItemById 回傳的物件結構是 { faq: item } 或 { Faq: item }
			// entityApi 已經處理了這個結構，直接回傳 item
			return { Faq: item };
		} catch (e) {
			error.value = e.message || `無法獲取 ID 為 ${id} 的常見問題`;
			return null;
		} finally {
			isLoading.value = false;
		}
	}

	return {
		faqList,
		currentFaqItem,
		pagination,
		isLoading,
		error,
		fetchAllFaqs,
		fetchFaqById
	};
});
