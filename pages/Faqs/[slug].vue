<template>
	<div class="bg-slate-100 pt-8 md:pt-0">
		<!-- 骨架載入狀態 -->
		<div v-if="pending" class="min-h-screen p-4 md:p-6 lg:p-8">
			<div class="container space-y-6">
				<!-- 麵包屑骨架 -->
				<div class="h-4 bg-gray-300/30 rounded w-1/3 animate-pulse"></div>

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

							<!-- 答案內容骨架 -->
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

		<!-- 錯誤訊息 -->
		<div v-else-if="error" class="min-h-screen flex items-center justify-center">
			<div class="bg-red-50 text-red-500 p-8 rounded-lg text-center shadow-md">
				<h2 class="text-2xl font-bold mb-4">無法載入內容</h2>
				<p>請稍後再試或返回說明中心。</p>
				<NuxtLink :to="localePath('/faqs')" class="text-blue-600 hover:underline mt-4 inline-block">返回說明中心</NuxtLink>
			</div>
		</div>

		<!-- 主要文章區塊 -->
		<article v-else-if="faqsShow" class="pb-8 md:pb-12 lg:pb-16">
			<!-- 麵包屑導航 -->
			<div class="p-4 md:p-6 lg:p-8">
				<nav class="text-xs md:text-sm text-gray-500">
					<ol class="flex flex-wrap items-center">
						<li>
							<NuxtLink :to="localePath('/')" class="hover:text-primary">{{ t("news.breadcrumb.home") }}</NuxtLink>
						</li>
						<li class="mx-2">/</li>
						<li>
							<NuxtLink :to="localePath('/faqs')" class="hover:text-primary">{{ t("faqs.center") }}</NuxtLink>
						</li>
						<li class="mx-2">/</li>
						<li class="text-gray-700 font-medium truncate">{{ getLocalizedText(faqsShow.question) }}</li>
					</ol>
				</nav>
			</div>

			<!-- 標題與摘要（移至麵包屑下方） -->
			<div class="container mb-4 md:mb-6 lg:mb-8">
				<section class="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
					<h1 class="text-2xl xl:text-3xl font-bold mb-3 text-slate-800">
						{{ getLocalizedText(faqsShow.question) }}
					</h1>
					<div class="flex flex-wrap text-sm text-gray-500 gap-x-4 gap-y-1">
						<span v-if="faqsShow.publishDate">{{ t("faqs.detail.published_at", { date: formatDate(faqsShow.publishDate) }) }}</span>
						<span v-if="faqsShow.category && faqsShow.category.sub">{{ t("faqs.detail.subcategory", { name: getLocalizedText(faqsShow.category.sub) }) }}</span>
					</div>
					<div v-if="getLocalizedText(faqsShow.summary)" class="prose max-w-none border-l-4 border-primary pl-4 italic text-gray-700 md:text-lg mt-4">
						{{ getLocalizedText(faqsShow.summary) }}
					</div>
				</section>
			</div>

			<!-- 主要內容網格 -->
			<div class="container">
				<div class="lg:grid lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
					<!-- 左側固定資訊欄 -->
					<aside class="hidden lg:block lg:col-span-5">
						<div class="lg:sticky lg:top-8 space-y-4 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto no-scrollbar">
							<!-- 標題/摘要已移至麵包屑下方 -->

							<!-- 主要圖片 -->
							<section v-if="faqsShow.imageUrl && faqsShow.imageUrl.length > 0" class="rounded-lg overflow-hidden shadow-lg border border-slate-200">
								<NuxtImg
									:src="getImageUrl(faqsShow.imageUrl[0])"
									:alt="getLocalizedText(faqsShow.question)"
									class="w-full h-auto object-cover"
									format="webp"
									quality="85"
									loading="lazy"
									:placeholder="[50, 50, 75, 5]"
								/>
							</section>

							<!-- 公司簡介卡片移至底部相關區塊左側 -->
						</div>
					</aside>

					<!-- 右側內容區 -->
					<main class="lg:col-span-7">
						<div class="space-y-6 lg:space-y-0">
							<!-- 行動裝置封面圖 -->
							<section v-if="faqsShow.imageUrl && faqsShow.imageUrl.length > 0" class="lg:hidden bg-white rounded-xl overflow-hidden shadow-lg">
								<NuxtImg
									:src="getImageUrl(faqsShow.imageUrl[0])"
									:alt="getLocalizedText(faqsShow.question)"
									class="w-full h-auto"
									format="webp"
									quality="85"
									loading="lazy"
									:placeholder="[50, 50, 75, 5]"
								/>
							</section>

							<!-- 答案內容 -->
							<section class="bg-white p-4 md:p-6 lg:pb-8 lg:px-8 rounded-lg shadow-lg border border-slate-200" style="padding-top: 0 !important">
								<TiptapRenderer v-if="answerIsTiptap" :content="localizedAnswer" class="tiptap-renderer-content" />
								<!-- eslint-disable-next-line vue/no-v-html -->
								<div v-else class="tiptap-renderer-content" v-html="localizedAnswer"></div>
							</section>

							<!-- 相關圖片 (顯示除了第一張以外的圖片) -->
							<section v-if="faqsShow.imageUrl && faqsShow.imageUrl.length > 1" class="bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-lg border border-slate-200">
								<h3 class="text-xl font-semibold mb-4 text-slate-700">{{ t("faqs.detail.images") }}</h3>
								<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
									<a
										v-for="(url, index) in faqsShow.imageUrl.slice(1)"
										:key="`img-${index}`"
										:href="url"
										target="_blank"
										class="block rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
									>
										<NuxtImg
											:src="getImageUrl(url)"
											:alt="`${getLocalizedText(faqsShow.question)} - ${t('faqs.detail.images')} ${index + 2}`"
											class="object-cover w-full h-32 md:h-40"
											format="webp"
											quality="85"
											loading="lazy"
											:placeholder="[50, 50, 75, 5]"
										/>
									</a>
								</div>
							</section>

							<!-- 教學影片 -->
							<section v-if="faqsShow.videoUrl && faqsShow.videoUrl.length > 0" class="bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-lg border border-slate-200">
								<h3 class="text-xl font-semibold mb-4 text-slate-700">{{ t("faqs.detail.tutorial") }}</h3>
								<div class="space-y-6">
									<div v-for="(url, index) in faqsShow.videoUrl" :key="`vid-${index}`" class="aspect-w-16 aspect-h-9">
										<iframe
											:src="getEmbedUrl(url)"
											frameborder="0"
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
											allowfullscreen
											class="rounded-lg w-full h-full"
											:title="`${t('faqs.detail.tutorial')} ${index + 1}`"
										></iframe>
									</div>
								</div>
							</section>

							<!-- 相關文件 -->
							<section
								v-if="faqsShow.documentUrl && faqsShow.documentUrl.length > 0"
								class="bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-lg border border-slate-200"
							>
								<h3 class="text-xl font-semibold mb-4 text-slate-700">{{ t("faqs.detail.documents") }}</h3>
								<ul class="list-disc list-inside space-y-2">
									<li v-for="(url, index) in faqsShow.documentUrl" :key="`doc-${index}`">
										<a :href="url" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">
											{{ t("faqs.detail.download", { index: index + 1 }) }}
											<span class="text-xs text-slate-500 ml-1">({{ getFileName(url) || t("faqs.detail.file") }})</span>
										</a>
									</li>
								</ul>
							</section>

							<!-- 相關問題：統一移至內容底部顯示 -->

							<!-- 公司簡介卡片移至底部相關區塊左側 -->
						</div>
					</main>
				</div>
			</div>
		</article>

		<!-- 底部兩欄：左公司卡片 + 右相關列表（共用元件） -->
		<section v-if="faqsShow && faqsShow.relatedFaqs && faqsShow.relatedFaqs.length > 0" class="container mt-8 lg:mt-12">
			<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
				<div class="lg:col-span-5">
					<CompanyProfileCard />
				</div>
				<div class="lg:col-span-7">
					<RelatedList :title="t('faqs.detail.related')" :items="relatedFaqItems" route-name="faqs-slug" :columns="1" :show-date="false" />
				</div>
			</div>
		</section>

		<!-- 返回按鈕 -->
		<div class="py-4 md:py-8 text-center">
			<NuxtLink :to="localePath('/faqs')" class="text-blue-600 hover:underline"> &larr; {{ t("faqs.back_center") }} </NuxtLink>
		</div>
	</div>
</template>

<script setup>
import { useFaqsStore } from "~/stores/faqsStore";
import { useLanguageStore } from "~/stores/core/languageStore";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import TiptapRenderer from "~/components/common/TiptapRenderer.vue";
import CompanyProfileCard from "~/components/common/CompanyProfileCard.vue";
import RelatedList from "~/components/common/RelatedList.vue";

const { t } = useI18n();
definePageMeta({
	key: (route) => route.fullPath
});

const route = useRoute();
const localePath = useLocalePath();
const runtimeConfig = useRuntimeConfig();
const faqsStore = useFaqsStore();
const languageStore = useLanguageStore();

const { pending, error } = await useAsyncData(`faqs-show-${route.params.slug}`, () => faqsStore.fetchFaqsBySlug(route.params.slug));

if (error.value) {
	console.error("Failed to fetch FAQs:", error.value);
}

const faqsShow = computed(() => faqsStore.currentFaqsItem || null);

// 將後端資料轉成共用元件需要的結構
const relatedFaqItems = computed(() => {
	if (!faqsShow.value?.relatedFaqs) return [];
	return faqsShow.value.relatedFaqs.map((f) => ({
		slug: f.slug,
		titleText: f.question, // 直接傳入多語言物件，讓 RelatedList 組件處理
		imageUrl: Array.isArray(f.imageUrl) && f.imageUrl.length > 0 ? getImageUrl(f.imageUrl[0]) : null,
		date: f.publishDate ? new Date(f.publishDate).toLocaleDateString("sv-SE") : null
	}));
});

const getImageUrl = (imageUrl) => {
	if (!imageUrl) return "";
	if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
		return imageUrl;
	}
	const base = runtimeConfig.public.apiBaseUrl?.replace(/\/$/, "") || "";
	let imagePath = imageUrl.replace(/^\//, "");

	const encodedPath = imagePath
		.split("/")
		.map((segment) => encodeURIComponent(segment))
		.join("/");

	return `${base}/${encodedPath}`;
};

const getLocalizedText = (field) => {
	if (typeof field === "object" && field !== null) {
		const lang = languageStore.currentLang.toUpperCase();
		return field[lang] || field.TW || field.EN || "";
	} else if (typeof field === "string") {
		return field;
	}
	return "";
};

const localizedAnswer = computed(() => {
	if (!faqsShow.value?.answer) return "";

	const answer = faqsShow.value.answer;
	if (typeof answer === "object" && answer !== null) {
		const lang = languageStore.currentLang.toUpperCase();
		return answer[lang] || answer.TW || answer.EN || "";
	}
	return answer;
});

const answerIsTiptap = computed(() => {
	const content = localizedAnswer.value;
	return typeof content === "object" && content !== null && content.type === "doc";
});

const formatDate = (dateString) => {
	if (!dateString) return "";
	return new Date(dateString).toLocaleDateString("sv-SE");
};

const getEmbedUrl = (url) => {
	try {
		const urlObj = new URL(url);
		if (urlObj.hostname.includes("youtube.com") || urlObj.hostname.includes("youtu.be")) {
			const videoId = urlObj.searchParams.get("v") || urlObj.pathname.split("/").pop();
			return `https://www.youtube.com/embed/${videoId}`;
		}
		return url;
	} catch (e) {
		return url;
	}
};

const getFileName = (url) => {
	try {
		const urlObj = new URL(url);
		const pathParts = urlObj.pathname.split("/");
		return pathParts.pop() || "檔案";
	} catch (e) {
		return "檔案";
	}
};

const pageTitle = computed(() => {
	if (!faqsShow.value) return "常見問題";
	return getLocalizedText(faqsShow.value.question);
});

const pageDescription = computed(() => {
	if (!faqsShow.value) return "查找關於遠岫科技產品、服務及解決方案的常見問題與解答。";
	const desc = getLocalizedText(faqsShow.value.metaDescription);
	if (desc) return desc;

	// Fallback to a generated description from question
	const questionText = getLocalizedText(faqsShow.value.question);
	return `查找「${questionText}」的常見問題與解答。`;
});

const pageOgImage = computed(() => {
	if (faqsShow.value && faqsShow.value.imageUrl && faqsShow.value.imageUrl.length > 0) {
		return getImageUrl(faqsShow.value.imageUrl[0]);
	}
	return `${runtimeConfig.public.baseURL}/images/og-image.jpg`;
});

useHead(() => ({
	title: pageTitle.value,
	meta: [
		{ hid: "description", name: "description", content: pageDescription.value },
		{ hid: "og:title", property: "og:title", content: pageTitle.value },
		{ hid: "og:description", property: "og:description", content: pageDescription.value },
		{ hid: "og:image", property: "og:image", content: pageOgImage.value },
		{ hid: "og:url", property: "og:url", content: `${runtimeConfig.public.baseURL}/faqs/${route.params.slug}` }
	],
	link: [{ rel: "canonical", href: `${runtimeConfig.public.baseURL}/faqs/${route.params.slug}` }]
}));
</script>

<style>
/* 隱藏滾動條但保留滾動功能（與新聞詳情頁一致） */
.no-scrollbar::-webkit-scrollbar {
	display: none; /* for Chrome, Safari and Opera */
}
.no-scrollbar {
	-ms-overflow-style: none; /* for IE and Edge */
	scrollbar-width: none; /* for Firefox */
}
</style>
