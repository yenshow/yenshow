<template>
	<div class="bg-slate-100">
		<SkeletonNewsDetail v-if="loading" />
		<div v-else-if="error" class="min-h-screen flex items-center justify-center">
			<div class="bg-red-50 text-red-500 p-8 rounded-lg text-center">
				<h2 class="text-2xl font-bold mb-4">無法載入新聞內容</h2>
				<p>{{ error }}</p>
				<NuxtLink to="/News" class="text-blue-600 hover:underline">返回最新消息</NuxtLink>
			</div>
		</div>
		<article v-else-if="newsDetail" class="pb-8 md:pb-12 lg:pb-16">
			<!-- 麵包屑導航 -->
			<div class="p-4 md:p-6 lg:p-8">
				<nav class="text-[12px] md:text-[16px] lg:text-[21px] text-gray-500">
					<ol class="flex flex-wrap items-center">
						<li><NuxtLink to="/" class="hover:text-primary">首頁</NuxtLink></li>
						<li class="mx-2">/</li>
						<li><NuxtLink to="/News" class="hover:text-primary">最新消息</NuxtLink></li>
						<li class="mx-2">/</li>
						<li class="text-gray-700 font-medium truncate">{{ getLocalizedText(newsDetail.title) }}</li>
					</ol>
				</nav>
			</div>

			<!-- 新聞主體區塊 -->
			<div class="container space-y-6 md:space-y-8">
				<!-- 1. 標題 / 作者 / 發佈日期 -->
				<section class="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
					<h1 class="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 theme-text">
						{{ getLocalizedText(newsDetail.title) }}
					</h1>
					<div class="flex flex-wrap items-center text-sm text-gray-500 gap-3">
						<span v-if="newsDetail.author">作者: {{ newsDetail.author }}</span>
						<span>發布於: {{ formatDate(newsDetail.publishDate) }}</span>
						<span v-if="newsDetail.category">分類: {{ newsDetail.category }}</span>
					</div>
				</section>

				<!-- 2. 封面圖片 -->
				<section v-if="newsDetail.coverImageUrl" class="rounded-lg overflow-hidden shadow-lg border border-slate-200">
					<NuxtImg
						:src="getImageUrl(newsDetail.coverImageUrl)"
						:alt="getLocalizedText(newsDetail.title)"
						class="w-full h-auto max-h-[600px] object-cover"
						format="webp"
						loading="lazy"
						:placeholder="[50, 28, 75, 5]"
						sizes="sm:100vw md:100vw lg:800px"
					/>
				</section>

				<!-- 3. 摘要 -->
				<section v-if="getLocalizedText(newsDetail.summary)" class="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
					<div class="prose max-w-none border-l-4 border-primary pl-4 italic text-gray-700">
						{{ getLocalizedText(newsDetail.summary) }}
					</div>
				</section>

				<!-- 4. 主要內容渲染 -->
				<section class="bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-lg border border-slate-200">
					<div class="news-content-render">
						<template v-for="(block, index) in newsDetail.content" :key="block._id || `block-${index}`">
							<!-- 富文本區塊 -->
							<template v-if="block.itemType === 'richText'">
								<TiptapRenderer :content="getCurrentLanguageTiptapJson(block.richTextData)" class="mb-4" :class="getRichTextBlockClasses(index)" />
							</template>

							<!-- 圖片區塊 -->
							<div v-else-if="block.itemType === 'image'" :class="getImageBlockWrapperClasses(index)">
								<NuxtImg
									:src="getImageUrl(block.imageUrl)"
									:alt="getLocalizedText(block.imageAltText)"
									class="w-full h-auto rounded-md object-contain max-h-[600px] bg-gray-100"
									format="webp"
									loading="lazy"
									:placeholder="[50, 50, 75, 5]"
									sizes="sm:100vw md:50vw lg:600px"
								/>
								<p v-if="getLocalizedText(block.imageCaption)" class="text-center text-sm italic mt-2 text-gray-600">
									{{ getLocalizedText(block.imageCaption) }}
								</p>
							</div>

							<!-- 影片嵌入區塊 -->
							<div v-else-if="block.itemType === 'videoEmbed'" class="my-4 lg:my-6 aspect-video" :class="getVideoBlockClasses()">
								<iframe
									width="100%"
									height="100%"
									:src="getEmbedVideoUrl(block.videoEmbedUrl)"
									frameborder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowfullscreen
									class="rounded-md"
									:title="getLocalizedText(block.videoCaption) || '嵌入影片'"
								></iframe>
								<p v-if="getLocalizedText(block.videoCaption)" class="text-center text-sm italic mt-2 text-gray-600">
									{{ getLocalizedText(block.videoCaption) }}
								</p>
							</div>
						</template>
						<div class="clear-both"></div>
					</div>
				</section>
			</div>

			<!-- 返回按鈕 -->
			<div class="mt-8 md:mt-12 text-center">
				<NuxtLink to="/News" class="text-blue-600 hover:underline"> &larr; 返回新聞列表 </NuxtLink>
			</div>
		</article>
		<div v-else class="min-h-screen flex items-center justify-center">
			<div class="text-center py-12 text-gray-500">
				<h2 class="text-2xl font-bold mb-4">找不到指定的新聞</h2>
				<NuxtLink to="/News" class="mt-4 inline-block text-blue-600 hover:underline">返回新聞列表</NuxtLink>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useNewsStore } from "~/stores/newsStore";
import { useLanguageStore } from "~/stores/core/languageStore";
import { useHead } from "#app";
import TiptapRenderer from "~/components/news/TiptapRenderer.vue";
import SkeletonNewsDetail from "~/components/news/SkeletonNewsDetail.vue";

const route = useRoute();
const newsStore = useNewsStore();
const languageStore = useLanguageStore();
const config = useRuntimeConfig();

const newsDetail = ref(null);
const loading = ref(true);
const error = ref("");

const newsId = computed(() => route.params.id);

// 處理圖片 URL (與列表頁相同)
const getImageUrl = (imageUrl) => {
	if (!imageUrl) return "/placeholder-image.png"; // 詳情頁的預設圖或不顯示
	if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
		return imageUrl;
	}
	const base = config.public.apiBaseUrl?.replace(/\/$/, "") || "";
	const imagePath = imageUrl.replace(/^\//, "");
	return `${base}/${imagePath}`;
};

// 獲取本地化文字 (用於標題、Alt、Caption)
const getLocalizedText = (field) => {
	if (typeof field === "object" && field !== null) {
		const lang = languageStore.currentLang.toUpperCase();
		return field[lang] || field.TW || field.EN || "";
	} else if (typeof field === "string") {
		return field;
	}
	return "";
};

// 從 richTextData 中獲取當前語言的內容陣列
const getCurrentLanguageTiptapJson = (richTextDataObject) => {
	if (typeof richTextDataObject === "object" && richTextDataObject !== null) {
		const lang = languageStore.currentLang.toUpperCase();
		// Return the Tiptap JSON object for the current language, or fallback to TW, or default empty
		return richTextDataObject[lang] || richTextDataObject.TW || { type: "doc", content: [{ type: "paragraph" }] };
	}
	return { type: "doc", content: [{ type: "paragraph" }] }; // Default empty content
};

// 格式化日期 (與列表頁相同)
const formatDate = (dateString) => {
	if (!dateString) return "無日期";
	try {
		return new Date(dateString).toLocaleDateString("sv-SE"); // YYYY-MM-DD format
	} catch (e) {
		return "日期無效";
	}
};

// 檢查文字是否為潛在連結 (用於備註)
const isPotentialLink = (text) => {
	if (typeof text !== "string") return false;
	return text.startsWith("http://") || text.startsWith("https://");
};

// 轉換影片 URL 為可嵌入的 URL (簡易版)
const getEmbedVideoUrl = (url) => {
	if (!url) return "";
	// YouTube: youtu.be/<id> or youtube.com/watch?v=<id>
	let youtubeMatch = url.match(/^https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
	if (youtubeMatch && youtubeMatch[1]) {
		return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
	}
	// Vimeo: vimeo.com/<id>
	let vimeoMatch = url.match(/^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)/);
	if (vimeoMatch && vimeoMatch[1]) {
		return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
	}
	if (url.includes("/embed/")) return url;
	return url;
};

// --- 新增：動態計算區塊樣式的方法 ---
const getImageBlockWrapperClasses = (index) => {
	const classes = ["my-4", "lg:my-6"];
	const currentBlock = newsDetail.value?.content[index];
	const nextBlock = newsDetail.value?.content[index + 1];

	if (currentBlock?.itemType === "image" && nextBlock?.itemType === "richText") {
		classes.push("float-left", "w-full", "sm:w-2/5", "md:w-1/3", "mr-6", "mb-3");
		// 對於 float 的圖片，移除 my- (上下邊距)，改由 mb- 控制下方間距，mr- 控制右方間距
		const yMarginIndex = classes.findIndex((c) => c.startsWith("my-"));
		if (yMarginIndex > -1) classes.splice(yMarginIndex, 1);
		const yLgMarginIndex = classes.findIndex((c) => c.startsWith("lg:my-"));
		if (yLgMarginIndex > -1) classes.splice(yLgMarginIndex, 1);
	} else {
		classes.push("clear-both");
	}
	return classes;
};

const getRichTextBlockClasses = (index) => {
	const classes = [];
	if (index === 0) return classes; //第一個元素不需要特別處理

	const prevBlock = newsDetail.value?.content[index - 1];
	const currentBlock = newsDetail.value?.content[index];

	if (prevBlock?.itemType === "image" && currentBlock?.itemType === "richText") {
		// 如果前一個是圖片且當前是富文本 (形成文繞圖)
		classes.push("overflow-hidden"); // 創建 BFC 以正確包裹浮動元素旁的文字
	} else {
		// 否則，確保此富文本區塊清除之前的浮動
		classes.push("clear-both");
	}
	return classes;
};

const getVideoBlockClasses = () => {
	// 影片區塊總是清除浮動
	return ["clear-both", "my-4", "lg:my-6"];
};
// --- 結束：動態計算區塊樣式的方法 ---

onMounted(async () => {
	if (newsId.value) {
		loading.value = true;
		error.value = "";
		try {
			const fetchedNewsResponse = await newsStore.fetchNewsById(newsId.value);

			console.log("fetchedNewsResponse", fetchedNewsResponse);
			if (fetchedNewsResponse && fetchedNewsResponse.News) {
				newsDetail.value = fetchedNewsResponse.News;

				// --- SEO Meta Tags ---
				useHead(() => {
					const title = getLocalizedText(newsDetail.value.metaTitle) || getLocalizedText(newsDetail.value.title) || "新聞詳情";
					let description = getLocalizedText(newsDetail.value.metaDescription);
					if (!description) {
						description = getLocalizedText(newsDetail.value.summary); // Fallback to summary
					}

					const metaTags = [];
					if (description) {
						metaTags.push({ name: "description", content: description });
					}
					return {
						title: title,
						meta: metaTags
					};
				});
				console.log("新聞詳情:", newsDetail.value);
				// --- End SEO Meta Tags ---
			} else {
				error.value = "找不到該新聞的內容數據或資料結構不正確。";
			}
		} catch (e) {
			console.error("獲取新聞詳情失敗:", e);
			error.value = e.message || "無法載入新聞詳情。";
		} finally {
			loading.value = false;
		}
	} else {
		error.value = "新聞 ID 或 Slug 未提供。";
		loading.value = false;
	}
});
</script>

<style scoped>
/* Add any necessary container styling if needed */
.news-content-render > *:not(:last-child) {
	margin-bottom: 1rem; /* Add some default spacing between blocks */
}
</style>
