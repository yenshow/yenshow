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

							<!-- 3. 主要內容渲染（新結構：article + attachments） -->
							<section class="bg-white p-4 md:p-6 lg:pb-8 lg:px-8 rounded-lg shadow-lg border border-slate-200" style="padding-top: 0 !important">
								<TiptapRenderer
									v-if="localizedArticle"
									:content="localizedArticle"
									class="tiptap-renderer-content"
								/>
							</section>

							<!-- 圖片附件 -->
							<section
								v-if="attachmentImages.length > 0"
								class="bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-lg border border-slate-200"
							>
								<h3 class="text-xl font-semibold mb-4 text-slate-700">{{ t("news.detail.images") }}</h3>
								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<NuxtImg
										v-for="(img, idx) in attachmentImages"
										:key="img._id || `img-${idx}`"
										:src="getImageUrl(img.url)"
										:alt="getLocalizedText(newsDetail.title)"
										class="w-full h-auto rounded-md object-contain max-h-[600px] bg-gray-100"
										format="webp"
										loading="lazy"
									/>
								</div>
							</section>

							<!-- 影片附件 -->
							<section
								v-if="attachmentVideos.length > 0"
								class="bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-lg border border-slate-200"
							>
								<h3 class="text-xl font-semibold mb-4 text-slate-700">{{ t("news.detail.videos") }}</h3>
								<div class="space-y-4">
									<div
										v-for="(v, idx) in attachmentVideos"
										:key="v._id || `vid-${idx}`"
										class="rounded-lg border border-slate-200 overflow-hidden"
									>
										<video
											v-if="v.source === 'upload' && v.url"
											width="100%"
											height="100%"
											controls
											preload="metadata"
											class="aspect-video bg-black"
											:title="t('news.detail.video.embed_title')"
										>
											<source :src="getEmbedVideoUrl(v.url)" type="video/mp4" />
											{{ t("news.detail.video.not_supported") }}
										</video>
										<iframe
											v-else-if="v.source === 'embed' && v.embedUrl"
											class="w-full aspect-video"
											:src="getEmbedVideoUrl(v.embedUrl)"
											:title="t('news.detail.video.embed_title')"
											frameborder="0"
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
											allowfullscreen
										/>
									</div>
								</div>
							</section>

							<!-- 相關文件 -->
							<section v-if="documentUrls && documentUrls.length > 0" class="bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-lg border border-slate-200">
								<h3 class="text-xl font-semibold mb-4 text-slate-700">{{ t("news.detail.documents") }}</h3>
								<ul class="list-disc list-inside space-y-2">
									<li v-for="(doc, index) in documentUrls" :key="`doc-${index}`">
										<a :href="doc.url" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">
											{{ getFileName(doc.url) || t("news.detail.download", { index: index + 1 }) }}
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
import TiptapRenderer from "~/components/common/TiptapRenderer.vue";
import { buildArticleJsonLd, buildBreadcrumbJsonLd, stripRichTextToPlain } from "~/utils/seo.js";
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
const toCanonical = useCanonicalUrlBuilder();

const { pending, error } = await useAsyncData(`news-show-${route.params.slug}`, () => newsStore.fetchNewsBySlug(route.params.slug));

if (error.value) {
	console.error("Failed to fetch news:", error.value);
}

const newsDetail = computed(() => newsStore.currentNewsItem || null);

const attachmentImages = computed(() => newsDetail.value?.attachmentImages || []);
const attachmentVideos = computed(() => newsDetail.value?.attachmentVideos || []);
const documentUrls = computed(() => {
	const docs = newsDetail.value?.attachmentDocuments || [];
	return Array.isArray(docs)
		? docs
				.filter((d) => d?.url && typeof d.url === "string")
				.map((d) => ({ url: getImageUrl(d.url) }))
		: [];
});

const localizedArticle = computed(() => {
	const lang = languageStore.currentLang.toUpperCase();
	const article = newsDetail.value?.article;
	if (!article || typeof article !== "object") return null;
	return article[lang] || article.TW || article.EN || { type: "doc", content: [{ type: "paragraph" }] };
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

usePageSeo(() => {
	if (!newsDetail.value) {
		return {
			title: t("news.detail.meta.title_fallback"),
			description: t("news.detail.meta.desc_fallback", { title: "" }),
			path: `/news/${route.params.slug}`
		};
	}

	const slug = String(route.params.slug).toLowerCase();
	const title =
		getLocalizedText(newsDetail.value.metaTitle) ||
		getLocalizedText(newsDetail.value.title) ||
		t("news.detail.meta.title_fallback");
	const description =
		getLocalizedText(newsDetail.value.metaDescription) ||
		getLocalizedText(newsDetail.value.summary) ||
		t("news.detail.meta.desc_fallback", { title });
	const ogImage = newsDetail.value.coverImageUrl ? getImageUrl(newsDetail.value.coverImageUrl) : undefined;
	const canonicalPath = `/news/${slug}`;
	const pageUrl = toCanonical(canonicalPath);

	const articleBody = stripRichTextToPlain(
		languageStore.currentLang === "en"
			? newsDetail.value.article?.EN || newsDetail.value.article?.TW
			: newsDetail.value.article?.TW || newsDetail.value.article?.EN,
		500
	);

	return {
		title,
		description,
		path: canonicalPath,
		image: ogImage,
		jsonLd: [
			buildArticleJsonLd({
				headline: getLocalizedText(newsDetail.value.title),
				description: description || articleBody,
				image: ogImage,
				datePublished: newsDetail.value.publishDate,
				url: pageUrl
			}),
			buildBreadcrumbJsonLd([
				{ name: t("news.breadcrumb.home"), item: toCanonical("/") },
				{ name: t("news.breadcrumb.list"), item: toCanonical("/news") },
				{ name: getLocalizedText(newsDetail.value.title), item: pageUrl }
			])
		]
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
