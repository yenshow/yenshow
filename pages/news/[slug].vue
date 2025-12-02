<template>
	<div class="bg-slate-100 pt-8 md:pt-0">
		<!-- 骨架載入狀態 -->
		<div v-if="pending" class="min-h-screen p-4 md:p-6 lg:p-8">
			<div class="container space-y-6">
				<!-- 麵包屑骨架 -->
				<div class="hidden md:block">
					<div class="h-4 bg-gray-300/30 rounded w-1/3 animate-pulse"></div>
				</div>

				<!-- 標題與摘要骨架 -->
				<section class="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
					<div class="h-8 bg-gray-300/30 rounded w-3/4 mb-3 animate-pulse"></div>
					<div class="h-4 bg-gray-300/30 rounded w-1/2 mb-4 animate-pulse"></div>
					<div class="h-4 bg-gray-300/30 rounded w-full mb-2 animate-pulse"></div>
					<div class="h-4 bg-gray-300/30 rounded w-5/6 animate-pulse"></div>
				</section>

				<!-- 主要內容骨架 -->
				<div class="lg:grid lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
					<!-- 左側骨架 -->
					<aside class="hidden lg:block lg:col-span-5">
						<div class="space-y-4">
							<div class="h-64 bg-gray-300/30 rounded-lg animate-pulse"></div>
						</div>
					</aside>

					<!-- 右側內容骨架 -->
					<main class="lg:col-span-7">
						<div class="space-y-6">
							<!-- 手機封面圖骨架 -->
							<div class="lg:hidden h-48 bg-gray-300/30 rounded-xl animate-pulse"></div>

							<!-- 內容區塊骨架 -->
							<section class="bg-white p-4 md:p-6 lg:pb-8 lg:px-8 rounded-lg shadow-lg border border-slate-200">
								<div class="space-y-4">
									<div class="h-4 bg-gray-300/30 rounded w-full animate-pulse"></div>
									<div class="h-4 bg-gray-300/30 rounded w-full animate-pulse"></div>
									<div class="h-4 bg-gray-300/30 rounded w-3/4 animate-pulse"></div>
									<div class="h-4 bg-gray-300/30 rounded w-full animate-pulse"></div>
									<div class="h-4 bg-gray-300/30 rounded w-5/6 animate-pulse"></div>
									<div class="h-4 bg-gray-300/30 rounded w-full animate-pulse"></div>
									<div class="h-4 bg-gray-300/30 rounded w-2/3 animate-pulse"></div>
								</div>
							</section>
						</div>
					</main>
				</div>
			</div>
		</div>
		<div v-else-if="error" class="min-h-screen flex items-center justify-center">
			<div class="bg-red-50 text-red-500 p-8 rounded-lg text-center">
				<h2 class="text-2xl font-bold mb-4">無法載入新聞內容</h2>
				<p>{{ error }}</p>
				<NuxtLink :to="localePath('/news')" class="text-blue-600 hover:underline">返回最新消息</NuxtLink>
			</div>
		</div>
		<article v-else-if="newsDetail" class="pb-8 md:pb-12 lg:pb-16">
			<!-- 麵包屑導航 -->
			<div class="p-4 md:p-6 lg:p-8 hidden md:block">
				<nav class="text-sm md:text-base text-gray-500">
					<ol class="flex flex-wrap items-center">
						<li>
							<NuxtLink :to="localePath('/')" class="hover:text-primary">{{ t("news.breadcrumb.home") }}</NuxtLink>
						</li>
						<li class="mx-2">/</li>
						<li>
							<NuxtLink :to="localePath('/news')" class="hover:text-primary">{{ t("news.breadcrumb.list") }}</NuxtLink>
						</li>
						<li class="mx-2">/</li>
						<li class="text-gray-700 font-medium truncate">{{ getLocalizedText(newsDetail.title) }}</li>
					</ol>
				</nav>
			</div>

			<!-- 標題與摘要 -->
			<div class="container mb-4 md:mb-6 lg:mb-8">
				<section class="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
					<h1 class="text-2xl xl:text-3xl font-bold mb-3 theme-text">
						{{ getLocalizedText(newsDetail.title) }}
					</h1>
					<div class="flex flex-wrap items-center text-sm text-gray-500 gap-4">
						<span v-if="newsDetail.author">{{ t("news.detail.author", { name: newsDetail.author }) }}</span>
						<span>{{ t("news.detail.published_at", { date: formatDate(newsDetail.publishDate) }) }}</span>
					</div>
					<div v-if="getLocalizedText(newsDetail.summary)" class="prose max-w-none border-l-4 border-primary pl-4 italic text-gray-700 md:text-lg mt-4">
						{{ getLocalizedText(newsDetail.summary) }}
					</div>
				</section>
			</div>

			<!-- 新聞主體區塊 (現代分欄式佈局) -->
			<div class="container">
				<div class="lg:grid lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
					<!-- 左側黏貼欄 (僅桌面) -->
					<aside class="hidden lg:block lg:col-span-5">
						<div class="lg:sticky lg:top-8 space-y-4">
							<!-- 封面圖 -->
							<section v-if="newsDetail.coverImageUrl" class="rounded-lg overflow-hidden shadow-lg border border-slate-200">
								<NuxtImg
									:src="getImageUrl(newsDetail.coverImageUrl)"
									:alt="getLocalizedText(newsDetail.title)"
									class="w-full h-auto object-contain"
									format="webp"
									loading="eager"
									:placeholder="[50, 50, 75, 5]"
									fetchpriority="high"
								/>
							</section>
						</div>
					</aside>

					<!-- 右側內容欄 -->
					<main class="lg:col-span-7">
						<div class="space-y-6 lg:space-y-0">
							<!-- 手機與平板的封面圖 -->
							<section v-if="newsDetail.coverImageUrl" class="lg:hidden bg-white rounded-xl overflow-hidden shadow-lg">
								<NuxtImg
									:src="getImageUrl(newsDetail.coverImageUrl)"
									:alt="getLocalizedText(newsDetail.title)"
									class="w-full h-auto"
									format="webp"
									loading="eager"
									:placeholder="[50, 50, 75, 5]"
									fetchpriority="high"
								/>
							</section>

							<!-- 3. 主要內容渲染 -->
							<section class="bg-white p-4 md:p-6 lg:pb-8 lg:px-8 rounded-lg shadow-lg border border-slate-200" style="padding-top: 0 !important">
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
										/>
										<p v-if="getLocalizedText(block.imageCaption)" class="text-center text-sm italic mt-2 text-gray-600">
											{{ getLocalizedText(block.imageCaption) }}
										</p>
									</div>

									<!-- 影片嵌入區塊 -->
									<div v-else-if="block.itemType === 'videoEmbed'" class="my-4 lg:my-6" :class="getVideoBlockClasses()">
										<!-- 調試資訊 (開發環境) -->
										<div v-if="config.public.dev" class="mb-2 p-2 bg-gray-100 text-xs rounded">
											<div>原始 URL: {{ block.videoEmbedUrl }}</div>
											<div>是否本地影片: {{ isLocalVideo(block.videoEmbedUrl) }}</div>
											<div>處理後 URL: {{ getEmbedVideoUrl(block.videoEmbedUrl) }}</div>
										</div>

										<!-- 本地影片檔案使用 video 標籤 -->
										<video
											v-if="isLocalVideo(block.videoEmbedUrl)"
											width="100%"
											height="100%"
											controls
											preload="metadata"
											class="rounded-md aspect-video"
											:title="getLocalizedText(block.videoCaption) || t('news.detail.video.embed_title')"
											@error="handleVideoError"
											@loadstart="handleVideoLoadStart"
											@canplay="handleVideoCanPlay"
										>
											<source :src="getEmbedVideoUrl(block.videoEmbedUrl)" type="video/mp4" />
											{{ t("news.detail.video.not_supported") }}
										</video>

										<!-- 外部影片平台使用卡片式設計 -->
										<div
											v-else
											class="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow"
										>
											<!-- YouTube 圖示 -->
											<div class="mb-6">
												<svg class="w-20 h-20 mx-auto text-red-600" fill="currentColor" viewBox="0 0 24 24">
													<path
														d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
													/>
												</svg>
											</div>

											<!-- 標題 -->
											<h3 class="text-xl font-semibold text-gray-800 mb-3">
												{{ getLocalizedText(block.videoCaption) || t("news.detail.video_card.title_fallback") }}
											</h3>

											<!-- 描述 -->
											<p class="text-gray-600 mb-8 leading-relaxed">{{ t("news.detail.video_card.desc") }}</p>

											<!-- 觀看按鈕 -->
											<a
												:href="getOriginalYouTubeUrl(block.videoEmbedUrl)"
												target="_blank"
												rel="noopener noreferrer"
												class="inline-flex items-center px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
											>
												<svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
													<path
														d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
													/>
												</svg>
												{{ t("news.detail.video_card.button") }}
											</a>

											<!-- 額外資訊 -->
											<p class="text-sm text-gray-500 mt-6">
												<svg class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
													<path
														fill-rule="evenodd"
														d="M10 18a8 8 0 100-16 8 8 0 0118 0zM11 6a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
														clip-rule="evenodd"
													/>
												</svg>
												{{ t("news.detail.video_card.note") }}
											</p>
										</div>
									</div>
								</template>
							</section>

							<!-- 相關文件 -->
							<section v-if="documentUrls && documentUrls.length > 0" class="bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-lg border border-slate-200">
								<h3 class="text-xl font-semibold mb-4 text-slate-700">{{ t("news.detail.documents") }}</h3>
								<ul class="list-disc list-inside space-y-2">
									<li v-for="(doc, index) in documentUrls" :key="`doc-${index}`">
										<a :href="doc.url" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">
											{{ getLocalizedText(doc.description) || getFileName(doc.url) || t("news.detail.download", { index: index + 1 }) }}
										</a>
									</li>
								</ul>
							</section>

							<!-- 公司簡介卡片移至底部相關區塊左側 -->
						</div>
					</main>
				</div>
			</div>

			<!-- 底部兩欄：左公司卡片 + 右相關列表（共用元件） -->
			<section v-if="newsDetail" class="container mt-8 lg:mt-12">
				<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
					<div class="lg:col-span-5">
						<CompanyProfileCard />
					</div>
					<div v-if="newsDetail.relatedNews && newsDetail.relatedNews.length > 0" class="lg:col-span-7">
						<RelatedList :title="t('news.detail.related')" :items="relatedNewsItems" route-name="news-slug" :columns="1" :show-date="false" />
					</div>
				</div>
			</section>

			<!-- 返回按鈕 -->
			<div class="py-4 md:py-8 text-center">
				<NuxtLink :to="localePath('/news')" class="text-blue-600 hover:underline"> &larr; {{ t("news.detail.back_list_link") }} </NuxtLink>
			</div>
		</article>
		<div v-else class="min-h-screen flex items-center justify-center">
			<div class="text-center py-12 text-gray-500">
				<NuxtLink :to="localePath('/news')" class="mt-4 inline-block text-blue-600 hover:underline">{{ t("news.detail.back_list_link") }}</NuxtLink>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useNewsStore } from "~/stores/newsStore";
import { useLanguageStore } from "~/stores/core/languageStore";
import { useHead } from "#app";
import TiptapRenderer from "~/components/common/TiptapRenderer.vue";
import CompanyProfileCard from "~/components/common/CompanyProfileCard.vue";
import RelatedList from "~/components/common/RelatedList.vue";

const { t } = useI18n();
definePageMeta({
	key: (route) => route.fullPath
});

const route = useRoute();
const localePath = useLocalePath();
const newsStore = useNewsStore();
const languageStore = useLanguageStore();
const config = useRuntimeConfig();

const { pending, error } = await useAsyncData(`news-show-${route.params.slug}`, () => newsStore.fetchNewsBySlug(route.params.slug));

if (error.value) {
	console.error("Failed to fetch news:", error.value);
}

const newsDetail = computed(() => newsStore.currentNewsItem || null);

// 處理文件 URL 和描述 - 支援多種可能的欄位名稱
const documentUrls = computed(() => {
	if (!newsDetail.value) return [];

	// 嘗試多種可能的欄位名稱
	const docUrl = newsDetail.value.documentUrl || newsDetail.value.documentUrls || newsDetail.value.attachments || newsDetail.value.files;
	const docDescription = newsDetail.value.documentDescription || newsDetail.value.documentDescriptions;

	if (Array.isArray(docUrl)) {
		// 如果 documentDescription 也是陣列，則配對使用
		if (Array.isArray(docDescription) && docDescription.length === docUrl.length) {
			return docUrl
				.map((url, index) => ({
					url: url,
					description: docDescription[index]
				}))
				.filter((doc) => doc.url && typeof doc.url === "string");
		}
		// 如果只有 URL 陣列，則只返回 URL
		return docUrl
			.filter((url) => url && typeof url === "string")
			.map((url) => ({
				url: url,
				description: null
			}));
	}

	// 如果文件存在於 content 區塊中
	if (Array.isArray(newsDetail.value.content)) {
		const fileBlocks = newsDetail.value.content.filter(
			(block) => block.itemType === "file" || block.itemType === "document" || block.itemType === "attachment"
		);

		if (fileBlocks.length > 0) {
			return fileBlocks
				.map((block) => {
					const url = block.fileUrl || block.documentUrl || block.url || block.attachmentUrl;
					const description = block.documentDescription || block.description || block.fileDescription;
					return url ? { url, description } : null;
				})
				.filter((doc) => doc !== null);
		}
	}

	return [];
});

// 將後端資料轉成共用元件所需的 items 結構
const relatedNewsItems = computed(() => {
	if (!newsDetail.value?.relatedNews) return [];
	return newsDetail.value.relatedNews
		.filter((n) => n?.slug && n.slug !== "undefined" && n.slug.toLowerCase() !== "undefined") // 過濾無效 slug
		.map((n) => ({
			slug: n.slug.toLowerCase(), // 統一轉小寫
			titleText: n.title, // 直接傳入多語言物件，讓 RelatedList 組件處理
			imageUrl: n.coverImageUrl ? getImageUrl(n.coverImageUrl) : null,
			date: n.publishDate ? formatDate(n.publishDate) : null
		}));
});

// 處理圖片 URL
const getImageUrl = (coverImgUrl) => {
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

// 從 URL 中提取檔案名稱
const getFileName = (url) => {
	try {
		const urlObj = new URL(url);
		const pathParts = urlObj.pathname.split("/");
		return pathParts.pop() || "檔案";
	} catch (e) {
		return "檔案";
	}
};

// 判斷是否為本地影片檔案
const isLocalVideo = (url) => {
	if (!url) return false;
	// 檢查是否為本地檔案路徑（以 / 開頭且包含檔案副檔名）
	if (url.startsWith("/") && (url.includes(".mp4") || url.includes(".webm") || url.includes(".ogg"))) {
		return true;
	}
	// 檢查是否為完整的本地檔案 URL
	if (url.includes(".mp4") || url.includes(".webm") || url.includes(".ogg")) {
		try {
			const urlObj = new URL(url);
			// 如果是同域名下的檔案，視為本地影片
			return urlObj.hostname === window.location.hostname || urlObj.hostname === "localhost";
		} catch {
			return false;
		}
	}
	return false;
};

// 轉換影片 URL 為可嵌入的 URL
const getEmbedVideoUrl = (url) => {
	if (!url) return "";

	// 處理本地影片檔案 (相對路徑)
	if (url.startsWith("/")) {
		// 使用 fileServiceBaseUrl 而不是 apiBaseUrl，因為影片檔案是靜態資源
		const base = config.public.fileServiceBaseUrl?.replace(/\/$/, "") || "https://api.yenshow.com";
		let videoPath = url.replace(/^\//, ""); // 移除開頭的斜線

		// 對路徑的每個部分進行編碼，以處理目錄或檔案名中的特殊字元
		const encodedPath = videoPath
			.split("/")
			.map((segment) => encodeURIComponent(segment))
			.join("/");

		const fullUrl = `${base}/${encodedPath}`;
		console.log("本地影片 URL:", { original: url, encoded: fullUrl }); // 調試用
		return fullUrl;
	}

	// 處理外部影片平台
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
				return `https://www.youtube.com/embed/${videoId}?mute=1&rel=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;
			}
		} else if (hostname.includes("youtu.be")) {
			const videoId = pathname.substring(1); // 移除開頭的 '/'
			if (videoId) {
				// 移除可能的查詢參數，只保留純 videoId
				const cleanVideoId = videoId.split("?")[0];
				return `https://www.youtube.com/embed/${cleanVideoId}?mute=1&rel=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;
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

// 判斷是否為 YouTube URL
const isYouTubeUrl = (url) => {
	if (!url) return false;
	return url.includes("youtube.com") || url.includes("youtu.be");
};

// 獲取原始 YouTube URL (用於備用連結)
const getOriginalYouTubeUrl = (url) => {
	if (!url) return "";

	try {
		const videoUrl = new URL(url);
		const hostname = videoUrl.hostname;
		const pathname = videoUrl.pathname;

		if (hostname.includes("youtube.com")) {
			const videoId = videoUrl.searchParams.get("v");
			if (videoId) {
				return `https://www.youtube.com/watch?v=${videoId}`;
			}
		} else if (hostname.includes("youtu.be")) {
			const videoId = pathname.substring(1).split("?")[0];
			if (videoId) {
				return `https://www.youtube.com/watch?v=${videoId}`;
			}
		}
	} catch (error) {
		console.error(`無法解析 YouTube URL "${url}":`, error);
	}

	return url; // 如果無法解析，返回原始 URL
};

// 影片載入事件處理 (用於本地影片)
const handleVideoLoadStart = (event) => {
	console.log("影片開始載入:", event.target.src);
};

const handleVideoCanPlay = (event) => {
	console.log("影片可以播放:", event.target.src);
};

const handleVideoError = (event) => {
	console.error("影片載入錯誤:", {
		src: event.target.src,
		error: event.target.error,
		networkState: event.target.networkState,
		readyState: event.target.readyState
	});
};

// --- 新增：動態計算區塊樣式的方法 (重構版) ---
// 抽離通用樣式，避免重複
const CENTER_BLOCK_CLASSES = ["clear-both", "my-6", "lg:my-8", "w-full", "mx-auto"];
const FLOAT_IMAGE_BASE_CLASSES = ["w-full", "sm:w-1/2", "md:w-2/5", "mb-4"];
const FLOAT_LEFT_CLASSES = ["float-left", ...FLOAT_IMAGE_BASE_CLASSES, "mr-6"];
const FLOAT_RIGHT_CLASSES = ["float-right", ...FLOAT_IMAGE_BASE_CLASSES, "ml-6"];

const getImageBlockWrapperClasses = (index) => {
	const currentBlock = newsDetail.value?.content[index];
	const nextBlock = newsDetail.value?.content[index + 1];

	// 檢查下一個區塊是否為 richText，以決定是否啟用文繞圖
	if (currentBlock?.itemType === "image" && nextBlock?.itemType === "richText") {
		// 計算這是第幾個圖片區塊，用於交錯浮動
		const imageIndex = newsDetail.value.content.slice(0, index + 1).filter((b) => b.itemType === "image").length - 1;

		// 偶數圖片靠左，奇數圖片靠右
		return imageIndex % 2 === 0 ? FLOAT_LEFT_CLASSES : FLOAT_RIGHT_CLASSES;
	} else {
		// 獨立圖片（或最後一個區塊），置中並給予較大空間
		return [...CENTER_BLOCK_CLASSES, "md:w-4/5"];
	}
};

const getRichTextBlockClasses = (index) => {
	const classes = [];
	if (index === 0) return classes;

	const prevBlock = newsDetail.value?.content[index - 1];

	// 如果前一個區塊是圖片，文字需要建立 BFC，否則清除浮動從新行開始
	if (prevBlock?.itemType === "image") {
		classes.push("overflow-hidden");
	} else {
		classes.push("clear-both");
	}
	return classes;
};

const getVideoBlockClasses = () => {
	// 影片區塊總是獨立、置中，並清除浮動
	// 對於卡片式設計，給予更合適的寬度
	return [...CENTER_BLOCK_CLASSES, "md:w-4/5"];
};
// --- 結束：動態計算區塊樣式的方法 ---

useHead(() => {
	if (!newsDetail.value) {
		return {
			title: t("news.detail.meta.title_fallback")
		};
	}

	const title = getLocalizedText(newsDetail.value.metaTitle) || getLocalizedText(newsDetail.value.title) || t("news.detail.meta.title_fallback");
	const description =
		getLocalizedText(newsDetail.value.metaDescription) || getLocalizedText(newsDetail.value.summary) || t("news.detail.meta.desc_fallback", { title });
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
