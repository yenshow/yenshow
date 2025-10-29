<template>
	<div>
		<section
			class="bg-secondary rounded-[50px] md:rounded-[100px] md:min-h-screen flex flex-col justify-center mt-[64px] sm:mt-[128px] md:mt-[256px] lg:mt-[512px] py-[48px] gap-[48px] md:gap-[144px] overflow-x-hidden"
		>
			<!-- News Section -->
			<article
				ref="newsArticle"
				class="container px-[24px] sm:px-[48px] lg:px-[120px] text-primary flex flex-col lg:flex-row justify-between lg:items-center gap-[24px] news-section"
			>
				<!-- CTA -->
				<nav class="min-w-[auto] lg:min-w-[328px] flex items-end lg:items-start lg:flex-col gap-[12px] lg:gap-[24px]">
					<div class="flex flex-col gap-[12px] lg:gap-[24px] me-auto">
						<h3 class="text-[24px] sm:text-[28px] md:text-[36px] lg:text-[64px] xl:text-[72px] 2xl:text-[80px]">{{ newsSection.title }}</h3>
					</div>
					<ButtonCTA class="w-fit h-fit view-all-button" :label="newsSection.viewAllText" :to="newsSection.to"></ButtonCTA>
				</nav>
				<!-- Content -->
				<div class="overflow-hidden w-full max-w-[800px] border-y-2 border-primary divide-y-2 divide-primary">
					<!-- Skeleton Loader -->
					<div v-if="newsSection.isLoading">
						<div v-for="n in 4" :key="`sk-news-${n}`" class="animate-pulse px-[16px] py-[12px] sm:px-[24px] flex items-center gap-[12px] sm:gap-[24px]">
							<div class="h-5 w-[90px] rounded-md bg-primary/20"></div>
							<div class="h-6 w-[70px] rounded-full bg-primary/20"></div>
							<div class="h-7 w-full max-w-[400px] rounded-md bg-primary/20"></div>
						</div>
					</div>
					<!-- Actual Content -->
					<template v-else>
						<template v-if="newsSection.list && newsSection.list.length > 0">
							<NuxtLink
								v-for="item in newsSection.list"
								:key="item._id"
								:to="`${newsSection.to}/${item.slug?.toLowerCase() || ''}`"
								class="px-[16px] sm:px-[24px] py-[12px] flex items-center gap-[12px] sm:gap-[24px] hover:bg-primary/10 transition-colors duration-200"
							>
								<h4 class="text-[12px] lg:text-[16px] xl:text-[18px] font-bold text-primary">
									{{ formatDate(item.publishDate) }}
								</h4>
								<div
									v-if="item.category && typeof item.category === 'string'"
									class="text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] px-[4px] py-[2px] lg:px-[6px] lg:py-[4px] rounded-full border-2 border-primary opacity-80 whitespace-nowrap"
								>
									{{ item.category }}
								</div>
								<span class="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[24px] xl:text-[28px] text-primary truncate">
									{{ getLocalizedText(item.title, languageStore.currentLang) }}
								</span>
							</NuxtLink>
						</template>
						<div v-else class="px-[16px] sm:px-[24px] py-[12px] text-primary/70">{{ newsSection.emptyText }}</div>
					</template>
				</div>
			</article>

			<!-- FAQs Section -->
			<article
				ref="faqsArticle"
				class="container px-[24px] sm:px-[48px] lg:px-[120px] text-primary flex flex-col lg:flex-row-reverse justify-between lg:items-center gap-[24px] faqs-section"
			>
				<!-- CTA -->
				<nav class="min-w-[auto] lg:min-w-[328px] flex items-end lg:items-end lg:flex-col gap-[12px] lg:gap-[24px]">
					<div class="flex flex-col gap-[12px] lg:gap-[24px] me-auto lg:me-0 lg:ms-auto">
						<h3 class="text-[24px] sm:text-[28px] md:text-[36px] lg:text-[64px] xl:text-[72px] 2xl:text-[80px] lg:text-right">{{ faqsSection.title }}</h3>
					</div>
					<ButtonCTA class="w-fit h-fit view-all-button" :label="faqsSection.viewAllText" :to="faqsSection.to"></ButtonCTA>
				</nav>
				<!-- Content -->
				<div class="overflow-hidden w-full max-w-[800px] border-y-2 border-primary divide-y-2 divide-primary">
					<!-- Skeleton Loader -->
					<div v-if="faqsSection.isLoading">
						<div v-for="n in 4" :key="`sk-faqs-${n}`" class="animate-pulse px-[16px] py-[12px] sm:px-[24px] flex items-center gap-[12px] sm:gap-[24px]">
							<div class="h-5 w-[90px] rounded-md bg-primary/20"></div>
							<div class="h-7 w-full max-w-[400px] rounded-md bg-primary/20"></div>
						</div>
					</div>
					<!-- Actual Content -->
					<template v-else>
						<template v-if="faqsSection.list && faqsSection.list.length > 0">
							<NuxtLink
								v-for="(item, index) in faqsSection.list"
								:key="item._id"
								:to="`${faqsSection.to}/${item.slug?.toLowerCase() || ''}`"
								class="px-[16px] sm:px-[24px] py-[12px] flex items-center gap-[12px] sm:gap-[24px] hover:bg-primary/10 transition-colors duration-200"
							>
								<h4 class="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] xl:text-[28px] text-primary min-w-[30px]">
									{{ `Q${index + 1}` }}
								</h4>
								<span class="text-[12px] sm:text-[16px] lg:text-[24px] xl:text-[28px] text-primary truncate">
									{{ getLocalizedText(item.question, languageStore.currentLang) }}
								</span>
							</NuxtLink>
						</template>
						<div v-else class="px-[16px] sm:px-[24px] py-[12px] text-primary/70">{{ faqsSection.emptyText }}</div>
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
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const localePath = useLocalePath();
const newsStore = useNewsStore();
const faqsStore = useFaqsStore();
const languageStore = useLanguageStore();

const newsArticle = ref(null);
const faqsArticle = ref(null);

const sections = computed(() => [
	{
		title: t("home.news.title"),
		to: "/news", // 直接使用路徑，不使用 localePath
		list: newsStore.newsList
			? [...newsStore.newsList]
					.sort((a, b) => {
						const dateA = a.publishDate ? new Date(a.publishDate) : null;
						const dateB = b.publishDate ? new Date(b.publishDate) : null;
						if (dateB && !dateA) return 1;
						if (!dateB && dateA) return -1;
						if (!dateB && !dateA) return 0;
						return dateB.getTime() - dateA.getTime();
					})
					.slice(0, 4)
			: [],
		isLoading: newsStore.isLoading,
		fetch: () => newsStore.fetchAllNews({ sortBy: "publishDate_desc", isActive: true }),
		emptyText: t("home.news.empty_text"),
		viewAllText: t("home.news.view_all"),
		type: "news"
	},
	{
		title: t("home.faqs.title"),
		to: "/faqs", // 直接使用路徑，不使用 localePath
		list: faqsStore.faqsList
			? [...faqsStore.faqsList]
					.sort((a, b) => {
						const dateA = a.publishDate ? new Date(a.publishDate) : null;
						const dateB = b.publishDate ? new Date(b.publishDate) : null;
						if (dateB && !dateA) return 1;
						if (!dateB && dateA) return -1;
						if (!dateB && !dateA) return 0;
						return dateB.getTime() - dateA.getTime();
					})
					.slice(0, 4)
			: [],
		isLoading: faqsStore.isLoading,
		fetch: () => faqsStore.fetchAllFaqs({ sortBy: "publishDate_desc", isActive: true }),
		emptyText: t("home.faqs.empty_text"),
		viewAllText: t("home.faqs.view_all"),
		type: "faqs"
	}
]);

const newsSection = computed(() => sections.value[0]);
const faqsSection = computed(() => sections.value[1]);

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

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
					observer.unobserve(entry.target);
				}
			});
		},
		{
			threshold: 0.1
		}
	);

	if (newsArticle.value) {
		observer.observe(newsArticle.value);
	}
	if (faqsArticle.value) {
		observer.observe(faqsArticle.value);
	}
});
</script>

<style scoped>
.news-section,
.faqs-section {
	opacity: 0;
	transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.news-section {
	transform: translateX(-50px);
}

.faqs-section {
	transform: translateX(50px);
}

.news-section.is-visible,
.faqs-section.is-visible {
	opacity: 1;
	transform: translateX(0);
}

.text-nowrap {
	white-space: nowrap;
	overflow: hidden;
}
</style>
