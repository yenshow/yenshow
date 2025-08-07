<template>
	<div class="bg-slate-100">
		<SkeletonNewsDetail v-if="pending" />
		<div v-else-if="error" class="min-h-screen flex items-center justify-center">
			<div class="bg-red-50 text-red-500 p-8 rounded-lg text-center">
				<h2 class="text-2xl font-bold mb-4">無法載入新聞內容</h2>
				<p>{{ error }}</p>
				<NuxtLink to="/news" class="text-blue-600 hover:underline">返回最新消息</NuxtLink>
			</div>
		</div>
		<article v-else-if="newsDetail" class="pb-8 md:pb-12 lg:pb-16">
			<!-- 麵包屑導航 -->
			<div class="p-4 md:p-6 lg:p-8">
				<nav class="text-sm md:text-base text-gray-500">
					<ol class="flex flex-wrap items-center">
						<li><NuxtLink to="/" class="hover:text-primary">首頁</NuxtLink></li>
						<li class="mx-2">/</li>
						<li><NuxtLink to="/news" class="hover:text-primary">最新消息</NuxtLink></li>
						<li class="mx-2">/</li>
						<li class="text-gray-700 font-medium truncate">{{ getLocalizedText(newsDetail.title) }}</li>
					</ol>
				</nav>
			</div>

			<!-- 新聞主體區塊 (現代分欄式佈局) -->
			<div class="container">
				<div class="lg:grid lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
					<!-- 左側黏貼欄 (僅桌面) -->
					<aside class="hidden lg:block lg:col-span-5">
						<div class="lg:sticky lg:top-8 space-y-4 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto no-scrollbar">
							<!-- 標題 / 作者 / 發佈日期 -->
							<section class="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
								<h1 class="text-2xl xl:text-3xl font-bold mb-3 theme-text">
									{{ getLocalizedText(newsDetail.title) }}
								</h1>
								<div class="flex text-sm text-gray-500 gap-4">
									<span v-if="newsDetail.author">作者: {{ newsDetail.author }}</span>
									<span>發布於: {{ formatDate(newsDetail.publishDate) }}</span>
								</div>
							</section>

							<!-- 封面圖 -->
							<section v-if="newsDetail.coverImageUrl" class="rounded-lg overflow-hidden shadow-lg border border-slate-200">
								<NuxtImg
									:src="getImageUrl(newsDetail.coverImageUrl)"
									:alt="getLocalizedText(newsDetail.title)"
									class="w-full h-auto object-cover"
									format="webp"
									loading="eager"
									width="800"
									height="800"
									:placeholder="[50, 50, 75, 5]"
									sizes="lg:40vw"
									fetchpriority="high"
								/>
							</section>

							<!-- 摘要 -->
							<section v-if="getLocalizedText(newsDetail.summary)" class="bg-slate-50 p-6 rounded-lg shadow-lg border border-slate-200">
								<div class="prose max-w-none border-l-4 border-primary pl-4 italic text-gray-700">
									{{ getLocalizedText(newsDetail.summary) }}
								</div>
							</section>

							<!-- 公司簡介卡片 -->
							<CompanyProfileCard />
						</div>
					</aside>

					<!-- 右側內容欄 -->
					<main class="lg:col-span-7">
						<div class="space-y-6 lg:space-y-0">
							<!-- 手機與平板的標題和摘要 -->
							<section class="lg:hidden bg-white rounded-xl overflow-hidden shadow-lg">
								<!-- 1. 標題 / 作者 / 發佈日期 -->
								<div class="p-6">
									<h1 class="text-2xl md:text-3xl font-bold mb-3 theme-text">
										{{ getLocalizedText(newsDetail.title) }}
									</h1>
									<div class="flex flex-wrap items-center text-sm text-gray-500 gap-3">
										<span v-if="newsDetail.author">作者: {{ newsDetail.author }}</span>
										<span>發布於: {{ formatDate(newsDetail.publishDate) }}</span>
									</div>
								</div>
								<!-- 封面圖 (僅手機/平板) -->
								<div v-if="newsDetail.coverImageUrl">
									<NuxtImg
										:src="getImageUrl(newsDetail.coverImageUrl)"
										:alt="getLocalizedText(newsDetail.title)"
										class="w-full h-auto"
										format="webp"
										loading="eager"
										width="1600"
										height="900"
										:placeholder="[50, 28, 75, 5]"
										sizes="sm:100vw"
										fetchpriority="high"
									/>
								</div>
							</section>

							<!-- 2. 摘要 -->
							<section v-if="getLocalizedText(newsDetail.summary)" class="bg-slate-50 block lg:hidden p-6 rounded-lg shadow-lg border border-slate-200">
								<div class="prose max-w-none border-l-4 border-primary pl-4 italic text-gray-700 md:text-lg">
									{{ getLocalizedText(newsDetail.summary) }}
								</div>
							</section>
							<!-- 3. 主要內容渲染 -->
							<section class="bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-lg border border-slate-200">
								<template v-for="(block, index) in newsDetail.content" :key="block._id || `block-${index}`">
									<!-- 富文本區塊 -->
									<template v-if="block.itemType === 'richText'">
										<TiptapRenderer
											:content="getCurrentLanguageTiptapJson(block.richTextData)"
											class="tiptap-renderer-content mb-4"
											:class="getRichTextBlockClasses(index)"
										/>
									</template>

									<!-- 圖片區塊 -->
									<div v-else-if="block.itemType === 'image'" :class="getImageBlockWrapperClasses(index)">
										<NuxtImg
											:src="getImageUrl(block.imageUrl)"
											:alt="getLocalizedText(block.imageAltText)"
											class="w-full h-auto rounded-md object-contain max-h-[600px] bg-gray-100"
											format="webp"
											loading="lazy"
											width="600"
											height="600"
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
											allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
											allowfullscreen
											class="rounded-md"
											:title="getLocalizedText(block.videoCaption) || '嵌入影片'"
										></iframe>
										<p v-if="getLocalizedText(block.videoCaption)" class="text-center text-sm italic mt-2 text-gray-600">
											{{ getLocalizedText(block.videoCaption) }}
										</p>
									</div>
								</template>
							</section>

							<!-- 公司簡介卡片 (手機/平板) -->
							<CompanyProfileCard class="block lg:hidden" />
						</div>
					</main>
				</div>
			</div>

			<!-- 返回按鈕 -->
			<div class="mt-8 md:mt-12 text-center">
				<NuxtLink to="/news" class="text-blue-600 hover:underline"> &larr; 返回新聞列表 </NuxtLink>
			</div>
		</article>
		<div v-else class="min-h-screen flex items-center justify-center">
			<div class="text-center py-12 text-gray-500">
				<h2 class="text-2xl font-bold mb-4">找不到指定的新聞</h2>
				<NuxtLink to="/news" class="mt-4 inline-block text-blue-600 hover:underline">返回新聞列表</NuxtLink>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useNewsStore } from "~/stores/newsStore";
import { useLanguageStore } from "~/stores/core/languageStore";
import { useHead } from "#app";
import TiptapRenderer from "~/components/news/TiptapRenderer.vue";
import SkeletonNewsDetail from "~/components/news/SkeletonNewsDetail.vue";
import CompanyProfileCard from "~/components/news/CompanyProfileCard.vue";

definePageMeta({
	key: (route) => route.fullPath
});

const route = useRoute();
const newsStore = useNewsStore();
const languageStore = useLanguageStore();
const config = useRuntimeConfig();

const { pending, error } = await useAsyncData(`news-show-${route.params.slug}`, () => newsStore.fetchNewsBySlug(route.params.slug));

if (error.value) {
	console.error("Failed to fetch news:", error.value);
}

const newsDetail = computed(() => newsStore.currentNewsItem || null);

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

// 轉換影片 URL 為可嵌入的 URL
const getEmbedVideoUrl = (url) => {
	if (!url) return "";

	try {
		const videoUrl = new URL(url);
		const hostname = videoUrl.hostname;
		const pathname = videoUrl.pathname;

		// 處理 YouTube 網址
		if (hostname.includes("youtube.com")) {
			if (pathname.startsWith("/embed/")) {
				return url; // 已經是嵌入格式
			}
			const videoId = videoUrl.searchParams.get("v");
			if (videoId) {
				return `https://www.youtube.com/embed/${videoId}?mute=1&rel=0`;
			}
		} else if (hostname.includes("youtu.be")) {
			const videoId = pathname.substring(1); // 移除開頭的 '/'
			if (videoId) {
				return `https://www.youtube.com/embed/${videoId}?mute=1&rel=0`;
			}
		}
		// 處理 Vimeo 網址
		else if (hostname.includes("vimeo.com")) {
			const videoId = pathname.substring(1);
			if (videoId && /^\d+$/.test(videoId)) {
				return `https://player.vimeo.com/video/${videoId}`;
			}
		}
	} catch (error) {
		console.error(`無效的影片 URL "${url}":`, error);
		return ""; // 發生錯誤時返回空字串
	}

	// 如果無法解析，返回原始 URL 作為備用
	return url;
};

// --- 新增：動態計算區塊樣式的方法 (重構版) ---
const getImageBlockWrapperClasses = (index) => {
	const currentBlock = newsDetail.value?.content[index];
	const nextBlock = newsDetail.value?.content[index + 1];

	// 檢查下一個區塊是否為 richText，以決定是否啟用文繞圖
	if (currentBlock?.itemType === "image" && nextBlock?.itemType === "richText") {
		// 計算這是第幾個圖片區塊，用於交錯浮動
		const imageIndex = newsDetail.value.content.slice(0, index + 1).filter((b) => b.itemType === "image").length - 1;

		const classes = ["mb-4"]; // 浮動圖片只有下方和側邊間距
		if (imageIndex % 2 === 0) {
			// 偶數圖片靠左
			classes.push("float-left", "w-full", "sm:w-1/2", "md:w-2/5", "mr-6");
		} else {
			// 奇數圖片靠右
			classes.push("float-right", "w-full", "sm:w-1/2", "md:w-2/5", "ml-6");
		}
		return classes;
	} else {
		// 獨立圖片（或最後一個區塊），置中並給予較大空間
		return ["clear-both", "my-6", "lg:my-8", "w-full", "md:w-4/5", "mx-auto"];
	}
};

const getRichTextBlockClasses = (index) => {
	const classes = [];
	if (index === 0) return classes;

	const prevBlock = newsDetail.value?.content[index - 1];
	const nextBlockOfPrevBlock = newsDetail.value?.content[index]; // current block

	// 如果前一個區塊是圖片，且該圖片後緊跟著這個 richText 區塊（即形成文繞圖）
	if (prevBlock?.itemType === "image" && nextBlockOfPrevBlock?.itemType === "richText") {
		// 建立 BFC (Block Formatting Context) 來正確包裹文字，避免環繞問題
		classes.push("overflow-hidden");
	} else {
		// 否則，清除之前的浮動，確保從新的一行開始
		classes.push("clear-both");
	}
	return classes;
};

const getVideoBlockClasses = () => {
	// 影片區塊總是獨立、置中，並清除浮動
	return ["clear-both", "my-6", "lg:my-8", "w-full", "md:w-4/5", "mx-auto"];
};
// --- 結束：動態計算區塊樣式的方法 ---

useHead(() => {
	if (!newsDetail.value) {
		return {
			title: "新聞詳情"
		};
	}

	const title = getLocalizedText(newsDetail.value.metaTitle) || getLocalizedText(newsDetail.value.title) || "新聞詳情";
	const description =
		getLocalizedText(newsDetail.value.metaDescription) || getLocalizedText(newsDetail.value.summary) || `查看關於「${title}」的最新消息與詳情。`;
	const ogImage = newsDetail.value.coverImageUrl ? getImageUrl(newsDetail.value.coverImageUrl) : `${config.public.baseURL}/images/og-image.jpg`;

	return {
		title,
		meta: [
			{ hid: "description", name: "description", content: description },
			{ hid: "og:title", property: "og:title", content: title },
			{ hid: "og:description", property: "og:description", content: description },
			{ hid: "og:image", property: "og:image", content: ogImage },
			{ hid: "og:url", property: "og:url", content: `${config.public.baseURL}/news/${route.params.slug}` }
		],
		link: [{ rel: "canonical", href: `${config.public.baseURL}/news/${route.params.slug}` }]
	};
});
</script>

<style>
/* 隱藏滾動條但保留滾動功能 */
.no-scrollbar::-webkit-scrollbar {
	display: none; /* for Chrome, Safari and Opera */
}
.no-scrollbar {
	-ms-overflow-style: none; /* for IE and Edge */
	scrollbar-width: none; /* for Firefox */
}
</style>
