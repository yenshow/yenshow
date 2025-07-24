<template>
	<div>
		<section class="container min-h-screen p-8 md:p-12 lg:p-16 xl:p-24 flex flex-col gap-8 sm:gap-10 md:gap-12">
			<div class="text-center pt-4 sm:pt-6 md:pt-8 text-white space-y-4 md:space-y-6">
				<h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white">說明中心</h2>
				<p class="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] text-slate-300">需要任何協助嗎？您可以在這裡找到答案。</p>
			</div>

			<!-- 搜尋框 -->
			<div class="relative w-full max-w-lg mx-auto">
				<input
					type="text"
					v-model="searchQuery"
					placeholder="搜尋問題、分類..."
					class="w-full px-4 py-3 pl-10 rounded-full border-2 border-slate-200 bg-white/90 text-primary focus:ring-primary focus:border-primary transition-all duration-300 shadow-sm placeholder:text-slate-400"
				/>
				<svg class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
						clip-rule="evenodd"
					/>
				</svg>
			</div>

			<!-- 顯示載入狀態 with Skeleton -->
			<div v-if="faqsStore.isLoading" class="space-y-6">
				<SkeletonFaqsCard v-for="n in 3" :key="`skeleton-faqs-${n}`" />
			</div>

			<!-- 顯示錯誤訊息 -->
			<div v-else-if="faqsStore.error" class="text-center text-red-500 bg-white/80 p-4 rounded-md">
				<p>無法載入常見問題：{{ faqsStore.error }}</p>
			</div>

			<!-- 內容區域 -->
			<div v-else-if="mainCategories.length > 0" class="flex flex-col gap-8">
				<!-- 主分類 Toggle 按鈕 -->
				<div class="flex flex-wrap justify-center gap-2 sm:gap-4">
					<button
						v-for="mainCat in mainCategories"
						:key="mainCat"
						@click="selectedMainCategory = mainCat"
						:class="[
							'px-4 py-2 rounded-full font-semibold transition-colors text-[16px] md:text-[18px] lg:text-[21px]',
							selectedMainCategory === mainCat
								? 'bg-primary text-white shadow-lg'
								: 'bg-white/80 text-primary hover:bg-primary/80 hover:text-white backdrop-blur-sm'
						]"
					>
						{{ mainCat }}
					</button>
				</div>

				<!-- 子分類與 FAQs 列表 -->
				<div v-if="selectedMainCategory" class="flex flex-col gap-8">
					<div v-for="[subCat, faqs] in paginatedSubCategories" :key="subCat" class="bg-white/80 backdrop-blur-sm rounded-lg p-6">
						<div class="flex justify-between items-center mb-4">
							<h3 class="text-[16px] md:text-[18px] lg:text-[21px] xl:text-[24px] font-semibold text-primary">{{ subCat }}</h3>
							<button
								v-if="faqs.length > 3"
								@click="toggleExpand(selectedMainCategory, subCat)"
								class="text-sm text-primary hover:text-primary-dark font-semibold transition-colors px-3 py-1 rounded-md hover:bg-primary/10"
							>
								{{ isExpanded(selectedMainCategory, subCat) ? "收合" : "顯示更多" }}
							</button>
						</div>

						<div class="space-y-2">
							<div v-for="faq in getVisibleFaqs(selectedMainCategory, subCat, faqs)" :key="faq._id" class="border-b border-slate-500 last:border-b-0">
								<NuxtLink
									:to="`/faqs/${faq.slug}`"
									class="block w-full py-4 text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] text-slate-800 hover:text-primary transition-colors"
									:title="`查看 '${getLocalizedText(faq.question, languageStore.currentLang)}' 的詳細解答`"
								>
									{{ getLocalizedText(faq.question, languageStore.currentLang) }}
								</NuxtLink>
							</div>
						</div>
					</div>

					<!-- 分頁控制 -->
					<div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mt-8 text-white">
						<button
							@click="currentPage--"
							:disabled="currentPage === 1"
							class="px-4 py-2 rounded-md font-semibold transition-colors"
							:class="currentPage === 1 ? 'bg-slate-600/50 text-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-primary/80 text-white'"
						>
							上一頁
						</button>
						<span class="text-lg font-medium text-white/90">第 {{ currentPage }} / {{ totalPages }} 頁</span>
						<button
							@click="currentPage++"
							:disabled="currentPage === totalPages"
							class="px-4 py-2 rounded-md font-semibold transition-colors"
							:class="currentPage === totalPages ? 'bg-slate-600/50 text-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-primary/80 text-white'"
						>
							下一頁
						</button>
					</div>
				</div>
			</div>

			<!-- 沒有 FAQs 時的訊息 -->
			<div v-else class="text-center text-slate-300 bg-white/10 p-8 rounded-lg">
				<p v-if="searchQuery">找不到與「{{ searchQuery }}」相關的常見問題。</p>
				<p v-else>目前沒有常見問題。</p>
			</div>
		</section>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useFaqsStore } from "~/stores/faqsStore";
import { useLanguageStore } from "~/stores/core/languageStore";
import SkeletonFaqsCard from "~/components/faqs/SkeletonFaqsCard.vue";
import { useHead } from "#app";

const faqsStore = useFaqsStore();
const languageStore = useLanguageStore();

useHead({
	title: " - 常見問題",
	meta: [{ name: "description", content: "查找關於遠岫科技產品、服務及解決方案的常見問題與解答。" }]
});

// -- State --
const selectedMainCategory = ref(null);
const expandedSubCategories = ref({}); // 追蹤展開的子分類
const searchQuery = ref("");
const currentPage = ref(1);
const subCategoriesPerPage = 4;

// -- Helpers --

// 獲取本地化文字 (用於 question 和 answer)
const getLocalizedText = (field, lang, isHtml = false) => {
	const currentLang = lang.toUpperCase();
	if (typeof field === "object" && field !== null) {
		const text = field[currentLang] || field.TW || field.EN || "";
		return isHtml ? text : text.replace(/<[^>]*>?/gm, ""); // 簡單移除 HTML 標籤，如果不是 isHtml
	}
	return isHtml ? String(field) : String(field).replace(/<[^>]*>?/gm, "");
};

// -- Computed --

const groupedFaqs = computed(() => {
	if (!faqsStore.faqsList) return {};
	return faqsStore.faqsList.reduce((acc, faqs) => {
		const mainCat = faqs.category?.main || "其他";
		const subCat = faqs.category?.sub?.trim() || "一般";

		if (!acc[mainCat]) {
			acc[mainCat] = {};
		}
		if (!acc[mainCat][subCat]) {
			acc[mainCat][subCat] = [];
		}
		acc[mainCat][subCat].push(faqs);
		return acc;
	}, {});
});

const filteredGroupedFaqs = computed(() => {
	if (!searchQuery.value.trim()) {
		return groupedFaqs.value;
	}

	const lowerCaseQuery = searchQuery.value.trim().toLowerCase();
	const result = {};

	for (const mainCat in groupedFaqs.value) {
		const subCategories = groupedFaqs.value[mainCat];
		const filteredSubCategories = {};

		for (const subCat in subCategories) {
			const faqs = subCategories[subCat];
			const subCatMatches = subCat.toLowerCase().includes(lowerCaseQuery);
			const questionsMatch = faqs.filter((faq) => getLocalizedText(faq.question, languageStore.currentLang).toLowerCase().includes(lowerCaseQuery));

			if (subCatMatches) {
				// If subcategory name matches, include all its questions.
				filteredSubCategories[subCat] = faqs;
			} else if (questionsMatch.length > 0) {
				// Otherwise, if questions inside match, include only those.
				filteredSubCategories[subCat] = questionsMatch;
			}
		}

		if (Object.keys(filteredSubCategories).length > 0) {
			result[mainCat] = filteredSubCategories;
		}
	}
	return result;
});

const mainCategories = computed(() => Object.keys(filteredGroupedFaqs.value));

const currentSubCategories = computed(() => {
	if (!selectedMainCategory.value || !filteredGroupedFaqs.value[selectedMainCategory.value]) {
		return [];
	}
	return Object.entries(filteredGroupedFaqs.value[selectedMainCategory.value]);
});

const totalPages = computed(() => {
	if (!currentSubCategories.value.length) return 1;
	return Math.ceil(currentSubCategories.value.length / subCategoriesPerPage);
});

const paginatedSubCategories = computed(() => {
	const start = (currentPage.value - 1) * subCategoriesPerPage;
	const end = start + subCategoriesPerPage;
	return currentSubCategories.value.slice(start, end);
});

// -- Watchers --

// 自動選擇第一個主分類或處理篩選後的空狀態
watch(
	mainCategories,
	(newVal) => {
		if (newVal.length > 0 && (!selectedMainCategory.value || !newVal.includes(selectedMainCategory.value))) {
			selectedMainCategory.value = newVal[0];
		} else if (newVal.length === 0) {
			selectedMainCategory.value = null;
		}
	},
	{ immediate: true }
);

// 當篩選條件改變時，重設分頁
watch([searchQuery, selectedMainCategory], () => {
	currentPage.value = 1;
});

// -- Methods --

const getVisibleFaqs = (mainCat, subCat, faqs) => {
	const key = `${mainCat}-${subCat}`;
	if (isExpanded(mainCat, subCat)) {
		return faqs;
	}
	return faqs.slice(0, 3);
};

const toggleExpand = (mainCat, subCat) => {
	const key = `${mainCat}-${subCat}`;
	expandedSubCategories.value[key] = !expandedSubCategories.value[key];
};

const isExpanded = (mainCat, subCat) => {
	const key = `${mainCat}-${subCat}`;
	return !!expandedSubCategories.value[key];
};

// 格式化日期
const formatDate = (dateString) => {
	if (!dateString) return "無日期";
	try {
		return new Date(dateString).toLocaleDateString("sv-SE"); // YYYY-MM-DD
	} catch (e) {
		return "日期無效";
	}
};

onMounted(() => {
	faqsStore.fetchAllFaqs({ sortBy: "publishDate_desc", isActive: true, limit: 9999 }); // 預設只載入啟用的 FAQs
});
</script>
