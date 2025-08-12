import { defineStore } from "pinia";
import { ref } from "vue";
import { useApi } from "~/composables/useApi";

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
	const pagination = ref({ page: 1, limit: 1000, total: 0, pages: 1 });
	const isLoading = ref(false);
	const error = ref(null);

	/**
	 * 獲取所有常見問題 (帶分頁)
	 * @param {Object} params - 查詢參數 (例如 { page: 1, limit: 10, sortBy: 'publishDate_desc', isActive: true })
	 */
	async function fetchAllFaqs(params = {}) {
		isLoading.value = true;
		error.value = null;
		try {
			// 改用列表 API，後端已自動過濾公開端 isActive=true
			const result = await faqsService.getAll(params);
			faqsList.value = result.items || [];
			if (result.pagination) {
				pagination.value = {
					page: result.pagination.page || pagination.value.page,
					limit: result.pagination.limit || pagination.value.limit,
					total: result.pagination.total || pagination.value.total,
					pages: result.pagination.pages || pagination.value.pages
				};
			}
		} catch (e) {
			error.value = e.message || "無法獲取常見問題列表";
			faqsList.value = [];
			pagination.value = { page: 1, limit: 1000, total: 0, pages: 1 };
		} finally {
			isLoading.value = false;
		}
	}

	async function fetchCategories() {
		try {
			return await faqsService.getCategories();
		} catch (e) {
			console.warn("載入 FAQ 主分類清單失敗", e?.message || e);
			return [];
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
		fetchFaqsBySlug,
		fetchCategories
	};
});
