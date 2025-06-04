<template>
	<div class="container min-h-screen p-[48px] md:p-[96px] flex flex-col gap-[48px]">
		<h2 class="text-center text-[24px] md:text-[36px] lg:text-[48px] font-bold py-[12px] md:pt-[24px] md:pb-[48px] text-white">常見問題</h2>

		<!-- 顯示載入狀態 with Skeleton -->
		<div v-if="faqStore.isLoading" class="space-y-6">
			<SkeletonFaqCard v-for="n in 3" :key="`skeleton-faq-${n}`" />
		</div>

		<!-- 顯示錯誤訊息 -->
		<div v-else-if="faqStore.error" class="text-center text-red-500 bg-white/80 p-4 rounded-md">
			<p>無法載入常見問題：{{ faqStore.error }}</p>
		</div>

		<!-- FAQ 列表 -->
		<div v-else-if="faqStore.faqList && faqStore.faqList.length > 0" class="space-y-6">
			<div
				v-for="faqItem in faqStore.faqList"
				:key="faqItem._id || faqItem.id"
				class="rounded-lg bg-white/90 backdrop-blur-sm overflow-hidden shadow-md p-5 flex flex-col gap-2"
			>
				<h4 class="text-[18px] md:text-[22px] font-bold text-primary">
					{{ getLocalizedText(faqItem.question, languageStore.currentLang) }}
				</h4>
				<p class="text-[10px] md:text-[12px] text-slate-500" v-if="faqItem.publishDate">發布日期: {{ formatDate(faqItem.publishDate) }}</p>
				<div
					class="text-[14px] md:text-[16px] text-slate-700 mt-1 prose max-w-none"
					v-html="getLocalizedText(faqItem.answer, languageStore.currentLang, true)"
				></div>
				<p class="text-[12px] text-slate-400 mt-2" v-if="faqItem.category">分類: {{ faqItem.category }}</p>
				<!-- 可以根據需要添加 imageUrl, videoUrl, documentUrl 的顯示 -->
			</div>
		</div>

		<!-- 沒有 FAQ 時的訊息 -->
		<div v-else class="text-center text-slate-300">
			<p>目前沒有常見問題。</p>
		</div>
	</div>
</template>

<script setup>
import { onMounted } from "vue";
import { useFaqStore } from "~/stores/faqStore";
import { useLanguageStore } from "~/stores/core/languageStore";
import SkeletonFaqCard from "~/components/faq/SkeletonFaqCard.vue";
import { useHead } from "#app";

const faqStore = useFaqStore();
const languageStore = useLanguageStore();
const config = useRuntimeConfig();

useHead({
	title: " - 常見問題",
	meta: [{ name: "description", content: "查找關於遠岫科技產品、服務及解決方案的常見問題與解答。" }]
});

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
	faqStore.fetchAllFaqs({ isActive: true }); // 預設只載入啟用的 FAQ
});
</script>

<style scoped>
/* 如果需要特定於此頁面的樣式 */
.prose :where(p):not(:where([class~="not-prose"] *)) {
	margin-top: 0.5em;
	margin-bottom: 0.5em;
}
</style>
