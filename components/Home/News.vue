<template>
	<div>
		<section class="bg-secondary rounded-[100px] min-h-screen flex flex-col justify-center gap-[24px] md:gap-[48px]">
			<!-- Unified Section -->
			<article
				v-for="(section, secIndex) in sections"
				:key="secIndex"
				class="container px-[24px] sm:px-[48px] lg:px-[120px] text-primary flex flex-col lg:flex-row justify-between lg:items-center gap-[24px]"
			>
				<!-- CTA -->
				<nav class="min-w-[auto] lg:min-w-[328px] flex items-end lg:items-start lg:flex-col gap-[12px] lg:gap-[24px]">
					<div class="flex flex-col gap-[12px] lg:gap-[24px] me-auto">
						<h3 class="text-[24px] md:text-[36px] lg:text-[64px] xl:text-[72px] 2xl:text-[80px]">{{ section.title }}</h3>
					</div>
					<ButtonCTA class="w-fit h-fit view-all-button" label="View All" :to="section.to"></ButtonCTA>
				</nav>
				<!-- Content -->
				<div class="overflow-hidden w-full max-w-[800px] border-y-2 border-primary divide-y-2 divide-primary">
					<!-- Skeleton Loader -->
					<div v-if="section.isLoading">
						<div
							v-for="n in 3"
							:key="`sk-${section.type}-${n}`"
							class="animate-pulse px-[16px] py-[12px] sm:px-[24px] flex items-center gap-[12px] sm:gap-[24px]"
						>
							<div class="h-5 w-[90px] rounded-md bg-primary/20"></div>
							<div v-if="section.type === 'news'" class="h-6 w-[70px] rounded-full bg-primary/20"></div>
							<div class="h-7 w-full max-w-[400px] rounded-md bg-primary/20"></div>
						</div>
					</div>
					<!-- Actual Content -->
					<template v-else>
						<template v-if="section.list && section.list.length > 0">
							<NuxtLink
								v-for="(item, index) in section.list"
								:key="item._id"
								:to="`${section.to}/${item._id}`"
								class="px-[16px] sm:px-[24px] py-[12px] flex items-center gap-[12px] sm:gap-[24px] hover:bg-primary/10 transition-colors duration-200"
							>
								<h4 class="text-[12px] lg:text-[16px] xl:text-[18px] font-bold text-primary min-w-[90px]">
									{{ section.type === "news" ? formatDate(item.publishDate) : `Q${index + 1}` }}
								</h4>
								<div
									v-if="section.type === 'news' && item.category && typeof item.category === 'string'"
									class="text-[8px] sm:text-[10px] lg:text-[12px] xl:text-[14px] px-[4px] py-[2px] lg:px-[6px] lg:py-[4px] rounded-full border-2 border-primary opacity-80 whitespace-nowrap"
								>
									{{ item.category }}
								</div>
								<span class="text-[12px] sm:text-[16px] lg:text-[24px] xl:text-[28px] text-primary truncate">
									{{ getLocalizedText(section.type === "news" ? item.title : item.question, languageStore.currentLang) }}
								</span>
							</NuxtLink>
						</template>
						<div v-else class="px-[16px] sm:px-[24px] py-[12px] text-primary/70">{{ section.emptyText }}</div>
					</template>
				</div>
			</article>
		</section>
	</div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import ButtonCTA from "~/components/common/Button-CTA.vue";
import { useNewsStore } from "~/stores/newsStore";
import { useFaqsStore } from "~/stores/faqsStore";
import { useLanguageStore } from "~/stores/core/languageStore";

const newsStore = useNewsStore();
const faqsStore = useFaqsStore();
const languageStore = useLanguageStore();

const sections = ref([
	{
		title: "最新消息",
		to: "/news",
		list: computed(() => newsStore.newsList),
		isLoading: computed(() => newsStore.isLoading),
		fetch: () => newsStore.fetchAllNews({ limit: 3, sortBy: "publishDate_desc", isActive: true }),
		emptyText: "目前沒有最新消息。",
		type: "news"
	},
	{
		title: "常見問題",
		to: "/faqs",
		list: computed(() => faqsStore.faqsList),
		isLoading: computed(() => faqsStore.isLoading),
		fetch: () => faqsStore.fetchAllFaqs({ limit: 3, isActive: true }),
		emptyText: "目前沒有常見問題。",
		type: "faqs"
	}
]);

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
	for (const section of sections.value) {
		try {
			await section.fetch();
		} catch (error) {
			// console.error(`Failed to fetch ${section.title}:`, error); // Optional: for debugging
		}
	}
});
</script>

<style scoped>
.text-nowrap {
	white-space: nowrap;
	overflow: hidden;
}
</style>
