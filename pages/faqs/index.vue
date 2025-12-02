<template>
	<div>
		<section class="container min-h-screen p-8 md:p-12 lg:p-16 xl:p-24 flex flex-col gap-8 md:gap-12">
			<div class="text-center pt-4 sm:pt-6 md:pt-8 text-white space-y-4 md:space-y-6">
				<h2 class="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white">{{ t("faqs.center") }}</h2>
			</div>

			<!-- 搜尋框 -->
			<div class="relative w-full max-w-lg mx-auto">
				<input
					type="text"
					v-model="searchQuery"
					:placeholder="t('faqs.search_placeholder')"
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
			<div v-if="isLoadingUI" class="space-y-6">
				<div v-for="n in 3" :key="`skeleton-faqs-${n}`" class="rounded-lg bg-white/10 animate-pulse p-4 sm:p-5 flex flex-col gap-2 sm:gap-3">
					<div class="h-5 sm:h-6 bg-gray-300/30 rounded w-3/4"></div>
					<div class="h-3 sm:h-4 bg-gray-300/30 rounded w-1/2"></div>
					<div class="h-3 sm:h-4 bg-gray-300/30 rounded w-full mt-1 sm:mt-2"></div>
					<div class="h-3 sm:h-4 bg-gray-300/30 rounded w-5/6"></div>
				</div>
			</div>

			<!-- 顯示錯誤訊息 -->
			<div v-else-if="faqsStore.error" class="text-center text-red-500 bg-white/80 p-4 rounded-md">
				<p>{{ t("faqs.error_list", { msg: faqsStore.error }) }}</p>
			</div>

			<!-- 內容區域 -->
			<div v-else-if="mainCategories.length > 0" class="flex flex-col gap-8">
				<!-- 主分類 Toggle 按鈕（資料完成後再渲染，不顯示骨架） -->
				<div v-if="showCategoryControls" class="flex flex-wrap justify-center gap-2 sm:gap-4">
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
						{{ i18nMainCat(mainCat) }}
					</button>
				</div>

				<!-- 子分類與 FAQs 列表 -->
				<div v-if="selectedMainCategory" class="flex flex-col gap-8">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div v-for="[subCat, faqs] in paginatedSubCategories" :key="subCat" class="bg-white/80 backdrop-blur-sm rounded-lg p-6">
							<div class="flex justify-between items-center mb-4">
								<h3 class="text-[16px] md:text-[18px] lg:text-[21px] xl:text-[24px] font-semibold text-primary">{{ subCat }}</h3>
								<button
									v-if="faqs.length > 3"
									@click="toggleExpand(selectedMainCategory, subCat)"
									class="text-sm text-primary hover:text-primary-dark font-semibold transition-colors px-3 py-1 rounded-md hover:bg-primary/10"
								>
									{{ isExpanded(selectedMainCategory, subCat) ? t("faqs.list.collapse") : t("faqs.list.show_more") }}
								</button>
							</div>

							<div class="space-y-2">
								<div v-for="faq in getVisibleFaqs(selectedMainCategory, subCat, faqs)" :key="faq._id" class="border-b border-slate-500 last:border-b-0">
									<NuxtLink
										:to="localePath(`/faqs/${faq.slug?.toLowerCase() || ''}`)"
										class="block w-full py-4 group"
										:title="`查看 '${getLocalizedText(faq.question, languageStore.currentLang)}' 的詳細解答`"
									>
										<div class="flex flex-col">
											<span
												class="text-slate-800 text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] group-hover:text-primary transition-colors"
											>
												{{ getLocalizedText(faq.question, languageStore.currentLang) }}
											</span>
											<span class="text-xs lg:text-sm text-slate-500 text-right">
												{{ formatDate(faq.publishDate) }}
											</span>
										</div>
									</NuxtLink>
								</div>
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
							{{ t("faqs.list.prev") }}
						</button>
						<span class="text-lg font-medium text-white/90">{{ t("faqs.list.page", { current: currentPage, total: totalPages }) }}</span>
						<button
							@click="currentPage++"
							:disabled="currentPage === totalPages"
							class="px-4 py-2 rounded-md font-semibold transition-colors"
							:class="currentPage === totalPages ? 'bg-slate-600/50 text-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-primary/80 text-white'"
						>
							{{ t("faqs.list.next") }}
						</button>
					</div>
				</div>
			</div>

			<!-- 沒有 FAQs 時的訊息 -->
			<div v-else class="text-center text-slate-300 bg-white/10 p-8 rounded-lg">
				<p v-if="searchQuery">{{ t("faqs.list.no_result_search", { q: searchQuery }) }}</p>
				<p v-else>{{ t("faqs.list.no_result") }}</p>
			</div>
		</section>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useFaqsStore } from "~/stores/faqsStore";
import { useLanguageStore } from "~/stores/core/languageStore";
import { useHead } from "#app";

const { t } = useI18n();
const faqsStore = useFaqsStore();
const languageStore = useLanguageStore();
const localePath = useLocalePath();

useHead({
	title: () => ` - ${t("faqs.title")}`,
	meta: [{ name: "description", content: () => t("faqs.meta_description") }]
});

// -- State --
const selectedMainCategory = ref(null);
const allMainCategories = ref([]);
const expandedSubCategories = ref({}); // 追蹤展開的子分類
const searchQuery = ref("");
const currentPage = ref(1);
const subCategoriesPerPage = 6;

// 立即顯示骨架的 UI 載入狀態（涵蓋分類與列表）
const pageLoading = ref(false);
const isLoadingUI = computed(() => pageLoading.value || faqsStore.isLoading);
const categoriesLoaded = ref(false);
const showCategoryControls = computed(() => categoriesLoaded.value && !isLoadingUI.value);

// -- Helpers --
const i18nMainCat = (key) => {
	if (key === "名詞解說" || key?.toLowerCase?.() === "glossary") return t("faqs.filters.glossary");
	if (key === "產品介紹" || key?.toLowerCase?.() === "product introduction" || key?.toLowerCase?.() === "product") return t("faqs.filters.product");
	if (key === "故障排除" || key?.toLowerCase?.() === "troubleshooting") return t("faqs.filters.troubleshooting");
	return key;
};

// 獲取本地化文字 (用於 question 和 answer)
const getLocalizedText = (field, lang, isHtml = false) => {
	const currentLang = lang.toUpperCase();
	if (typeof field === "object" && field !== null) {
		const text = field[currentLang] || field.TW || field.EN || "";
		return isHtml ? text : text.replace(/<[^>]*>?/gm, ""); // 簡單移除 HTML 標籤，如果不是 isHtml
	}
	return isHtml ? String(field) : String(field).replace(/<[^>]*>?/gm, "");
};

// 將後端回傳的主分類欄位（字串或多語物件）轉為顯示字串
const normalizeMainName = (mainField) => {
	const lang = languageStore.currentLang?.toUpperCase?.() || "TW";
	if (typeof mainField === "object" && mainField !== null) {
		return (mainField[lang] || mainField.TW || mainField.EN || "").trim();
	}
	return String(mainField || "").trim();
};

// 將不同語系/別名規一為固定鍵
const canonicalizeMainName = (name) => {
	const n = String(name || "").trim();
	const lower = n.toLowerCase();
	// 英文別名 → 英文固定鍵
	if (lower === "products" || lower === "product") return "Product Introduction";
	if (lower === "glossary") return "Glossary";
	if (lower === "troubleshooting") return "Troubleshooting";
	// 中文名稱 → 英文固定鍵（避免不同語系鍵值不一致）
	if (n === "產品介紹") return "Product Introduction";
	if (n === "名詞解說") return "Glossary";
	if (n === "故障排除") return "Troubleshooting";
	return n;
};

// -- Computed --

const groupedFaqs = computed(() => {
	if (!faqsStore.faqsList) return {};
	const currentLang = languageStore.currentLang?.toUpperCase?.() || "TW";
	const grouped = faqsStore.faqsList.reduce((acc, faqs) => {
		const mainField = faqs.category?.main;
		const mainCat = typeof mainField === "object" && mainField !== null ? mainField[currentLang] || mainField.TW || mainField.EN : mainField;
		const normalizedMain = canonicalizeMainName((mainCat || "其他").trim());
		const subField = faqs.category?.sub;
		const subCat = (
			typeof subField === "object" && subField !== null ? subField[currentLang] || subField.TW || subField.EN || "一般" : subField || "一般"
		).trim();

		if (!acc[normalizedMain]) {
			acc[normalizedMain] = {};
		}
		if (!acc[normalizedMain][subCat]) {
			acc[normalizedMain][subCat] = [];
		}
		acc[normalizedMain][subCat].push(faqs);
		return acc;
	}, {});

	// 在每個子分類中按發布日期對 FAQs 進行排序 (最新的在前)
	for (const mainCat in grouped) {
		for (const subCat in grouped[mainCat]) {
			grouped[mainCat][subCat].sort((a, b) => {
				const dateA = a.publishDate ? new Date(a.publishDate).getTime() : 0;
				const dateB = b.publishDate ? new Date(b.publishDate).getTime() : 0;
				return dateB - dateA;
			});
		}
	}

	return grouped;
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

const mainCategories = computed(() => (allMainCategories.value.length ? allMainCategories.value : Object.keys(filteredGroupedFaqs.value)));

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
watch(mainCategories, (newVal) => {
	if (newVal.length > 0 && (!selectedMainCategory.value || !newVal.includes(selectedMainCategory.value))) {
		selectedMainCategory.value = newVal[0];
	} else if (newVal.length === 0) {
		selectedMainCategory.value = null;
	}
});

// 當篩選條件改變時，重設分頁並重新抓取（與 News 體驗一致）
watch([searchQuery, selectedMainCategory], async ([newQ, newCat], [oldQ, oldCat] = []) => {
	if (newCat !== oldCat) {
		if (currentPage.value !== 1) {
			currentPage.value = 1;
			return;
		}
		await fetchFaqs();
		return;
	}
	// 只有搜尋字變化時也回到第一頁即可（不強制重抓，保留本地濾結果）
	currentPage.value = 1;
});

// 當分頁變化時，滾動到頂部
watch(currentPage, () => {
	smoothScrollToTop();
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

// --- Helper: Smooth scroll to top ---
const smoothScrollToTop = () => {
	const startPosition = window.pageYOffset;
	const startTime = performance.now();
	const duration = 600; // 增加滾動時間到 600ms

	const easeInOutCubic = (t) => {
		return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
	};

	const animateScroll = (currentTime) => {
		const elapsed = currentTime - startTime;
		const progress = Math.min(elapsed / duration, 1);
		const ease = easeInOutCubic(progress);
		window.scrollTo(0, startPosition * (1 - ease));

		if (progress < 1) {
			requestAnimationFrame(animateScroll);
		}
	};

	requestAnimationFrame(animateScroll);
};

const fetchFaqs = async () => {
	// Scroll to top first for better UX
	smoothScrollToTop();

	const params = {
		page: 1,
		limit: 1000, // 維持當前群組呈現，一次取回
		sort: "publishDate",
		sortDirection: "desc"
	};
	pageLoading.value = true;
	try {
		await faqsStore.fetchAllFaqs(params);
	} finally {
		pageLoading.value = false;
	}
};

onMounted(async () => {
	pageLoading.value = true;
	try {
		// 先載入主分類（後端 enum）並規一名稱
		const cats = await faqsStore.fetchCategories();
		allMainCategories.value = Array.isArray(cats) ? cats.map((c) => canonicalizeMainName(normalizeMainName(c))) : [];
		categoriesLoaded.value = true;
		// 設定預設主分類，讓 watcher 觸發抓取，避免重複請求
		if (allMainCategories.value.length > 0) {
			selectedMainCategory.value = allMainCategories.value[0];
		} else {
			selectedMainCategory.value = null;
			await fetchFaqs();
		}
	} finally {
		pageLoading.value = false;
	}
});
</script>
