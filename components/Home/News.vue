<template>
	<div>
		<section class="bg-secondary rounded-[100px] min-h-screen flex flex-col justify-center gap-[24px] md:gap-[48px]">
			<!-- News -->
			<article
				class="container px-[24px] sm:px-[48px] lg:px-[120px] text-primary flex flex-col lg:flex-row justify-between lg:items-center gap-[24px] lg:gap-0"
			>
				<!-- CTA -->
				<nav class="min-w-[auto] lg:min-w-[328px] flex items-end lg:items-start lg:flex-col gap-[12px] lg:gap-[24px]">
					<div class="flex flex-col gap-[12px] lg:gap-[24px] me-auto">
						<h3 class="text-[24px] md:text-[36px] lg:text-[64px] xl:text-[72px] 2xl:text-[80px]">{{ $t("news title") }}</h3>
					</div>
					<ButtonCTA class="w-fit h-fit view-all-button" :label="$t('view all')" to="/news"></ButtonCTA>
				</nav>
				<!-- Content -->
				<div class="w-full max-w-[880px] xl:max-w-[960px] 2xl:max-w-[1024px] border-y-2 border-primary divide-y-2 divide-primary">
					<NuxtLink
						v-if="newsStore.newsList && newsStore.newsList.length > 0"
						v-for="item in newsStore.newsList"
						:key="item._id"
						:to="`/news/${item._id}`"
						class="px-[16px] sm:px-[24px] py-[12px] flex items-center gap-[12px] sm:gap-[24px] hover:bg-primary/10 transition-colors duration-200"
					>
						<h5 class="text-[12px] lg:text-[16px] xl:text-[18px] font-bold text-primary min-w-[90px]">{{ formatDate(item.publishDate) }}</h5>
						<div
							v-if="item.category && typeof item.category === 'string'"
							class="text-[8px] sm:text-[10px] lg:text-[12px] xl:text-[14px] px-[4px] py-[2px] lg:px-[6px] lg:py-[4px] rounded-full border-2 border-primary opacity-80 whitespace-nowrap"
						>
							{{ $t(item.category) }}
						</div>
						<span class="text-[12px] sm:text-[16px] lg:text-[24px] xl:text-[28px] text-primary truncate">{{
							getLocalizedText(item.title, languageStore.currentLang)
						}}</span>
					</NuxtLink>
					<div v-if="!newsStore.isLoading && newsStore.newsList && newsStore.newsList.length === 0" class="px-[16px] sm:px-[24px] py-[12px] text-primary/70">
						{{ $t("home.noNewsAvailable") }}
					</div>
					<div v-if="newsStore.isLoading" class="px-[16px] sm:px-[24px] py-[12px] text-primary/70">{{ $t("home.loadingNews") }}...</div>
				</div>
			</article>
			<!-- Problems -->
			<article
				class="container px-[24px] sm:px-[48px] lg:px-[120px] text-primary flex flex-col lg:flex-row justify-between lg:items-center gap-[24px] lg:gap-0"
			>
				<!-- CTA -->
				<nav class="min-w-[auto] lg:min-w-[328px] flex items-end lg:items-start lg:flex-col gap-[12px] lg:gap-[24px]">
					<div class="flex flex-col gap-[12px] lg:gap-[24px] me-auto">
						<h3 class="text-[24px] md:text-[36px] lg:text-[64px] xl:text-[72px] 2xl:text-[80px]">{{ $t("problems title") }}</h3>
					</div>
					<ButtonCTA class="w-fit h-fit view-all-button" :label="$t('view all')" to="/faq"></ButtonCTA>
				</nav>
				<!-- Content -->
				<div class="w-full max-w-[880px] xl:max-w-[960px] 2xl:max-w-[1024px] border-y-2 border-primary divide-y-2 divide-primary">
					<div
						v-if="faqStore.faqList && faqStore.faqList.length > 0"
						v-for="(item, index) in faqStore.faqList"
						:key="item._id"
						class="px-[16px] sm:px-[24px] py-[12px] flex items-center gap-[12px] sm:gap-[24px]"
					>
						<h5 class="text-[12px] sm:text-[16px] lg:text-[24px] xl:text-[28px] text-primary">Q{{ index + 1 }}</h5>
						<span class="text-[12px] sm:text-[16px] lg:text-[24px] xl:text-[28px] text-primary truncate">{{
							getLocalizedText(item.question, languageStore.currentLang)
						}}</span>
					</div>
					<div v-if="!faqStore.isLoading && faqStore.faqList && faqStore.faqList.length === 0" class="px-[16px] sm:px-[24px] py-[12px] text-primary/70">
						{{ $t("home.noFaqsAvailable") }}
					</div>
					<div v-if="faqStore.isLoading" class="px-[16px] sm:px-[24px] py-[12px] text-primary/70">{{ $t("home.loadingFaqs") }}...</div>
				</div>
			</article>
		</section>
	</div>
</template>

<script setup>
import { onMounted } from "vue";
import ButtonCTA from "~/components/common/Button-CTA.vue";
import { useNewsStore } from "~/stores/newsStore";
import { useFaqStore } from "~/stores/faqStore";
import { useLanguageStore } from "~/stores/core/languageStore";

const newsStore = useNewsStore();
const faqStore = useFaqStore();
const languageStore = useLanguageStore();

// Helper function to get localized text (e.g., for titles, questions)
const getLocalizedText = (field, lang) => {
	if (!field) return "";
	const currentLang = lang ? lang.toUpperCase() : "TW"; // Default to TW or handle as needed
	if (typeof field === "object" && field !== null) {
		return field[currentLang] || field.TW || field.EN || field.en || field.tw || "";
	} else if (typeof field === "string") {
		return field;
	}
	return "";
};

// Helper function to format date to YYYY.MM.DD
const formatDate = (dateString) => {
	if (!dateString) return "";
	try {
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		const day = date.getDate().toString().padStart(2, "0");
		return `${year}.${month}.${day}`;
	} catch (e) {
		// console.error("Invalid Date:", dateString, e); // Optional: for debugging
		return ""; // Return empty string for invalid date
	}
};

onMounted(async () => {
	try {
		await newsStore.fetchAllNews({ limit: 3, sortBy: "publishDate_desc", isActive: true });
	} catch (error) {
		// console.error("Failed to fetch news:", error); // Optional: for debugging
	}
	try {
		await faqStore.fetchAllFaqs({ limit: 3, isActive: true }); // Assuming default sort or API handles order for latest
	} catch (error) {
		// console.error("Failed to fetch FAQs:", error); // Optional: for debugging
	}
});
</script>

<style scoped>
.text-nowrap {
	white-space: nowrap;
	overflow: hidden;
}
</style>
