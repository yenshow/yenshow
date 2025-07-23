<template>
	<div>
		<section class="container min-h-screen p-8 md:p-12 lg:p-16 xl:p-24 flex flex-col gap-8 md:gap-12">
			<h2 class="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white">最新消息</h2>
			<!-- Filter & Sort Controls -->
			<div class="flex flex-col sm:flex-row items-center justify-center sm:justify-between w-full gap-4">
				<!-- Spacer for sm screens and up, to balance the sort button -->
				<div class="hidden sm:block w-[130px] flex-shrink-0"></div>
				<!-- Filter Buttons -->
				<div class="flex justify-center flex-wrap gap-2 sm:gap-4">
					<button
						v-for="category in dynamicCategories"
						:key="category.value || 'all'"
						@click="selectCategory(category.value)"
						:class="[
							'px-4 py-2 rounded-full text-[16px] md:text-[18px] lg:text-[21px] font-semibold transition-colors',
							selectedCategory === category.value
								? 'bg-primary text-white shadow-lg'
								: 'bg-white/80 text-primary hover:bg-primary/80 hover:text-white backdrop-blur-sm'
						]"
					>
						{{ category.text }}
					</button>
				</div>
				<!-- Sort Button -->
				<button
					@click="toggleSort"
					class="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[16px] font-semibold transition-colors bg-white/80 text-primary hover:bg-primary/80 hover:text-white backdrop-blur-sm w-[130px] justify-center"
					title="切換排序順序"
				>
					<span>{{ sortDirection === "desc" ? "由新到舊" : "由舊到新" }}</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 transition-transform"
						:class="{ 'rotate-180': sortDirection === 'asc' }"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			</div>

			<!-- 顯示載入狀態 with Skeleton -->
			<div v-if="newsStore.isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
				<SkeletonNewsCard v-for="n in 12" :key="`skeleton-${n}`" />
			</div>

			<!-- 顯示錯誤訊息 -->
			<div v-else-if="newsStore.error" class="text-center text-red-500">
				<p>無法載入新聞：{{ newsStore.error }}</p>
			</div>

			<!-- News 列表 -->
			<div v-else-if="newsStore.newsList.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
				<NuxtLink
					:to="`/news/${newsItem.slug}`"
					v-for="newsItem in newsStore.newsList"
					:key="newsItem.slug"
					class="rounded-lg bg-white/80 backdrop-blur-md overflow-hidden flex flex-col no-underline shadow-md hover:shadow-xl transition-shadow duration-300 group"
				>
					<NuxtImg
						class="w-full h-40 sm:h-44 md:h-48 lg:h-52 xl:h-56 object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-105"
						:src="getImageUrl(newsItem.coverImageUrl)"
						:alt="getLocalizedText(newsItem.title, languageStore.currentLang)"
						format="webp"
						loading="lazy"
						width="320"
						height="180"
						:placeholder="[50, 27, 75, 5]"
					/>
					<div class="flex flex-col gap-2 sm:gap-3 p-4 sm:p-5 flex-grow">
						<h4 class="text-base sm:text-lg md:text-xl font-bold text-primary overflow-hidden whitespace-nowrap text-ellipsis">
							{{ getLocalizedText(newsItem.title, languageStore.currentLang) }}
						</h4>
						<p class="text-xs sm:text-sm text-slate-500">{{ formatDate(newsItem.publishDate) }}</p>
						<p class="text-sm sm:text-base text-slate-600 mt-auto break-words line-clamp-3">
							{{ generateSummary(newsItem, languageStore.currentLang) }}
						</p>
					</div>
				</NuxtLink>
			</div>
			<!-- 沒有符合條件的新聞 -->
			<div v-else class="text-center text-slate-300 py-10">
				<p>沒有找到符合條件的最新消息。</p>
			</div>

			<!-- Pagination Controls -->
			<div v-if="newsStore.pagination && newsStore.pagination.pages > 1" class="flex justify-center items-center gap-4 text-white mt-8">
				<button
					@click="prevPage"
					:disabled="currentPage === 1"
					class="px-4 py-2 bg-primary rounded-md disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors"
				>
					上一頁
				</button>
				<span class="text-lg font-medium">第 {{ currentPage }} / {{ newsStore.pagination.pages }} 頁</span>
				<button
					@click="nextPage"
					:disabled="currentPage === newsStore.pagination.pages"
					class="px-4 py-2 bg-primary rounded-md disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors"
				>
					下一頁
				</button>
			</div>
		</section>
	</div>
</template>

<script setup>
import { onMounted, computed, ref, watch } from "vue";
import { useNewsStore } from "~/stores/newsStore";
import { useLanguageStore } from "~/stores/core/languageStore";
import SkeletonNewsCard from "~/components/news/SkeletonNewsCard.vue";
import { useHead } from "#app";

const newsStore = useNewsStore();
const languageStore = useLanguageStore();
const config = useRuntimeConfig();

useHead({
	title: " - 最新消息",
	meta: [{ name: "description", content: "獲取遠岫科技的最新消息、產品發布、技術更新與行業洞察。" }]
});

// --- State ---
const staticCategories = [
	{ value: "品牌新聞", text: "品牌新聞" },
	{ value: "智慧方案", text: "智慧方案" },
	{ value: "產品介紹", text: "產品介紹" }
];
const dynamicCategories = computed(() => [{ value: null, text: "全部消息" }, ...staticCategories]);
const selectedCategory = ref(null);
const sortDirection = ref("desc"); // 'desc' or 'asc'
const currentPage = ref(1);
const itemsPerPage = 12;

// --- Data Fetching Logic ---
const fetchNews = async () => {
	// Scroll to top first for better UX
	window.scrollTo({ top: 0, behavior: "smooth" });

	const params = {
		page: currentPage.value,
		limit: itemsPerPage,
		sort: "publishDate",
		sortDirection: sortDirection.value,
		isActive: true
	};

	if (selectedCategory.value) {
		params.category = selectedCategory.value;
	}

	await newsStore.fetchAllNews(params);
};

// --- Event Handlers ---
const selectCategory = (category) => {
	if (selectedCategory.value !== category) {
		selectedCategory.value = category;
	}
};

const toggleSort = () => {
	sortDirection.value = sortDirection.value === "desc" ? "asc" : "desc";
};

const nextPage = () => {
	if (newsStore.pagination && currentPage.value < newsStore.pagination.pages) {
		currentPage.value++;
	}
};

const prevPage = () => {
	if (currentPage.value > 1) {
		currentPage.value--;
	}
};

// --- Watchers to trigger data fetching ---
watch([selectedCategory, sortDirection], () => {
	// Reset to page 1 when filters or sort order change
	if (currentPage.value !== 1) {
		currentPage.value = 1;
	} else {
		// If already on page 1, the currentPage watcher won't trigger, so fetch manually
		fetchNews();
	}
});

watch(currentPage, fetchNews);

// --- Lifecycle Hooks ---
onMounted(() => {
	fetchNews();
});

// --- Helper Functions ---
const getImageUrl = (coverImgUrl) => {
	if (!coverImgUrl) return "/News.png";
	if (coverImgUrl.startsWith("http://") || coverImgUrl.startsWith("https://")) {
		return coverImgUrl;
	}
	const base = config.public.apiBaseUrl?.replace(/\/$/, "") || "";
	const imagePath = coverImgUrl.replace(/^\//, "");
	const encodedPath = imagePath
		.split("/")
		.map((segment) => encodeURIComponent(segment))
		.join("/");
	return `${base}/${encodedPath}`;
};

const getLocalizedText = (field, lang) => {
	const currentLang = lang.toUpperCase();
	if (typeof field === "object" && field !== null) {
		return field[currentLang] || field.TW || field.EN || "";
	} else if (typeof field === "string") {
		return field;
	}
	return "";
};

const generateSummary = (newsItem, lang) => {
	const currentLang = lang.toUpperCase();
	if (newsItem.summary && typeof newsItem.summary === "object") {
		const localizedSummary = newsItem.summary[currentLang] || newsItem.summary.TW || newsItem.summary.EN;
		if (localizedSummary && localizedSummary.trim() !== "") {
			return localizedSummary;
		}
	}
	if (Array.isArray(newsItem.content) && newsItem.content.length > 0) {
		for (const block of newsItem.content) {
			if (block.itemType === "richText" && block.richTextData) {
				const langContent = block.richTextData[currentLang] || block.richTextData.TW;
				if (Array.isArray(langContent)) {
					for (const richTextBlock of langContent) {
						if (richTextBlock.type === "paragraph" && richTextBlock.text) {
							return richTextBlock.text;
						}
					}
				}
			}
		}
	}
	return "閱讀更多...";
};

const formatDate = (dateString) => {
	if (!dateString) return "無日期";
	try {
		return new Date(dateString).toLocaleDateString("sv-SE");
	} catch (e) {
		return "日期無效";
	}
};
</script>
