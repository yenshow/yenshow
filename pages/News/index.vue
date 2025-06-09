<template>
	<div class="container min-h-screen p-8 md:p-12 lg:p-16 xl:p-24 flex flex-col gap-8 sm:gap-10 md:gap-12">
		<h2 class="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold pt-4 pb-8 sm:pt-6 sm:pb-10 md:pt-8 md:pb-12 text-white">
			最新消息
		</h2>
		<!-- 顯示載入狀態 with Skeleton -->
		<div v-if="newsStore.isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
			<SkeletonNewsCard v-for="n in newsStore.newsList.length || 4" :key="`skeleton-${n}`" />
		</div>

		<!-- 顯示錯誤訊息 -->
		<div v-else-if="newsStore.error" class="text-center text-red-500">
			<p>無法載入新聞：{{ newsStore.error }}</p>
		</div>

		<!-- News 列表 -->
		<div v-else-if="newsStore.newsList && newsStore.newsList.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
			<NuxtLink
				:to="`/News/${newsItem._id}`"
				v-for="newsItem in sortedNewsList"
				:key="newsItem._id || newsItem.id"
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
	</div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useNewsStore } from "~/stores/newsStore";
import { useLanguageStore } from "~/stores/core/languageStore"; // 用於多語言支援
import SkeletonNewsCard from "~/components/news/SkeletonNewsCard.vue";
import { useHead } from "#app";

const newsStore = useNewsStore();
const languageStore = useLanguageStore(); // 用於獲取當前語言
const config = useRuntimeConfig(); // 用於獲取 apiBaseUrl

useHead({
	title: " - 最新消息",
	meta: [{ name: "description", content: "獲取遠岫科技的最新消息、產品發布、技術更新與行業洞察。" }]
});

// 新增 computed 屬性，用於對新聞列表進行排序
const sortedNewsList = computed(() => {
	if (!Array.isArray(newsStore.newsList)) {
		return [];
	}
	// 複製陣列以避免修改原始 store 狀態
	return [...newsStore.newsList].sort((a, b) => {
		const dateA = a.publishDate ? new Date(a.publishDate) : null;
		const dateB = b.publishDate ? new Date(b.publishDate) : null;

		// 檢查日期是否有效
		const isValidDateA = dateA && !isNaN(dateA.getTime());
		const isValidDateB = dateB && !isNaN(dateB.getTime());

		// 將無效日期的項目排在列表末尾
		if (isValidDateB && !isValidDateA) return 1;
		if (!isValidDateB && isValidDateA) return -1;
		if (!isValidDateB && !isValidDateA) return 0;

		// 按日期降序排序（最新消息在前）
		return dateB.getTime() - dateA.getTime();
	});
});

// 處理圖片 URL
const getImageUrl = (coverImgUrl) => {
	if (!coverImgUrl) return "/News.png"; // 預設圖片
	if (coverImgUrl.startsWith("http://") || coverImgUrl.startsWith("https://")) {
		return coverImgUrl;
	}
	const base = config.public.apiBaseUrl?.replace(/\/$/, "") || "";
	let imagePath = coverImgUrl.replace(/^\//, ""); // 移除開頭的斜線 (如果有的話)

	// 對路徑的每個部分進行編碼，以處理目錄或檔案名中的特殊字元
	const encodedPath = imagePath
		.split("/")
		.map((segment) => encodeURIComponent(segment))
		.join("/");

	return `${base}/${encodedPath}`;
};

// 獲取本地化文字 (主要用於 title)
const getLocalizedText = (field, lang) => {
	const currentLang = lang.toUpperCase();
	if (typeof field === "object" && field !== null) {
		return field[currentLang] || field.TW || field.EN || "";
	} else if (typeof field === "string") {
		return field;
	}
	return "";
};

// 生成新聞摘要
const generateSummary = (newsItem, lang) => {
	const currentLang = lang.toUpperCase();
	// 優先使用 newsItem.summary
	if (newsItem.summary && typeof newsItem.summary === "object") {
		const localizedSummary = newsItem.summary[currentLang] || newsItem.summary.TW || newsItem.summary.EN;
		if (localizedSummary && localizedSummary.trim() !== "") {
			return localizedSummary;
		}
	}

	// 若無摘要，則從 contentBlocks 生成
	if (Array.isArray(newsItem.content) && newsItem.content.length > 0) {
		for (const block of newsItem.content) {
			if (block.itemType === "richText" && block.richTextData) {
				const langContent = block.richTextData[currentLang] || block.richTextData.TW;
				if (Array.isArray(langContent)) {
					for (const richTextBlock of langContent) {
						if (richTextBlock.type === "paragraph" && richTextBlock.text) {
							return richTextBlock.text; // 返回第一個段落的文字
						}
					}
				}
			}
		}
	}
	return "閱讀更多..."; // 如果沒有合適的段落或摘要
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
	newsStore.fetchAllNews();
});
</script>
