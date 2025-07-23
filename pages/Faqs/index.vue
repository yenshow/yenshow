<template>
	<div>
		<section class="container min-h-screen p-8 md:p-12 lg:p-16 xl:p-24 flex flex-col gap-8 sm:gap-10 md:gap-12">
			<div class="text-center pt-4 sm:pt-6 md:pt-8 text-white space-y-4 md:space-y-6">
				<h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white">說明中心</h2>
				<p class="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] text-slate-300">需要任何協助嗎？您可以在這裡找到答案。</p>
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
					<div v-for="(faqs, subCat) in groupedFaqs[selectedMainCategory]" :key="subCat" class="bg-white/80 backdrop-blur-sm rounded-lg p-6">
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
				</div>
			</div>

			<!-- 沒有 FAQs 時的訊息 -->
			<div v-else class="text-center text-slate-300">
				<p>目前沒有常見問題。</p>
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

const selectedMainCategory = ref(null);
const expandedSubCategories = ref({}); // 追蹤展開的子分類

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

const mainCategories = computed(() => Object.keys(groupedFaqs.value));

// 自動選擇第一個主分類
watch(mainCategories, (newVal) => {
	if (newVal.length > 0 && (!selectedMainCategory.value || !newVal.includes(selectedMainCategory.value))) {
		selectedMainCategory.value = newVal[0];
	} else if (newVal.length === 0) {
		selectedMainCategory.value = null;
	}
});

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

// 獲取本地化文字 (用於 question 和 answer)
const getLocalizedText = (field, lang, isHtml = false) => {
	const currentLang = lang.toUpperCase();
	if (typeof field === "object" && field !== null) {
		const text = field[currentLang] || field.TW || field.EN || "";
		return isHtml ? text : text.replace(/<[^>]*>?/gm, ""); // 簡單移除 HTML 標籤，如果不是 isHtml
	}
	return isHtml ? String(field) : String(field).replace(/<[^>]*>?/gm, "");
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
