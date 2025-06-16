<template>
	<div class="bg-slate-100">
		<!-- 載入提示 -->
		<div v-if="pending" class="min-h-screen flex items-center justify-center">
			<div class="text-center py-12 text-gray-500">
				<h2 class="text-2xl font-bold">載入中...</h2>
			</div>
		</div>

		<!-- 錯誤訊息 -->
		<div v-else-if="error" class="min-h-screen flex items-center justify-center">
			<div class="bg-red-50 text-red-500 p-8 rounded-lg text-center shadow-md">
				<h2 class="text-2xl font-bold mb-4">無法載入內容</h2>
				<p>請稍後再試或返回說明中心。</p>
				<NuxtLink to="/Faqs" class="text-blue-600 hover:underline mt-4 inline-block">返回說明中心</NuxtLink>
			</div>
		</div>

		<!-- 主要文章區塊 -->
		<article v-else-if="faqsShow" class="pb-8 md:pb-12 lg:pb-16">
			<!-- 麵包屑導航 -->
			<div class="p-4 md:p-6 lg:p-8">
				<nav class="text-[12px] md:text-[16px] text-gray-500">
					<ol class="flex flex-wrap items-center">
						<li><NuxtLink to="/" class="hover:text-primary">首頁</NuxtLink></li>
						<li class="mx-2">/</li>
						<li><NuxtLink to="/Faqs" class="hover:text-primary">說明中心</NuxtLink></li>
						<li v-if="faqsShow.category && faqsShow.category.main" class="mx-2">/</li>
						<li v-if="faqsShow.category && faqsShow.category.main" class="text-gray-700 font-medium truncate">{{ faqsShow.category.main }}</li>
					</ol>
				</nav>
			</div>

			<!-- 主要內容網格 -->
			<div class="container">
				<div class="lg:grid lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
					<!-- 左側固定資訊欄 -->
					<aside class="hidden lg:block lg:col-span-5">
						<div class="lg:sticky lg:top-8 space-y-4">
							<!-- 標題與元資訊 -->
							<section class="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
								<h1 class="text-2xl xl:text-3xl font-bold mb-3 text-slate-800">
									{{ getLocalizedText(faqsShow.question) }}
								</h1>
								<div class="flex flex-wrap text-sm text-gray-500 gap-x-4 gap-y-1">
									<span v-if="faqsShow.publishDate">發布於: {{ formatDate(faqsShow.publishDate) }}</span>
									<span v-if="faqsShow.category && faqsShow.category.sub">子分類: {{ faqsShow.category.sub }}</span>
								</div>
							</section>

							<!-- 主要圖片 -->
							<section v-if="faqsShow.imageUrl && faqsShow.imageUrl.length > 0" class="rounded-lg overflow-hidden shadow-lg border border-slate-200">
								<img :src="faqsShow.imageUrl[0]" :alt="getLocalizedText(faqsShow.question)" class="w-full h-auto object-cover" loading="eager" />
							</section>
						</div>
					</aside>

					<!-- 右側內容區 -->
					<main class="lg:col-span-7">
						<div class="space-y-6">
							<!-- 行動裝置標題區 -->
							<section class="lg:hidden bg-white rounded-xl overflow-hidden shadow-lg">
								<div class="p-6">
									<h1 class="text-2xl md:text-3xl font-bold mb-3 text-slate-800">
										{{ getLocalizedText(faqsShow.question) }}
									</h1>
									<div class="flex flex-wrap items-center text-sm text-gray-500 gap-3">
										<span v-if="faqsShow.publishDate">發布於: {{ formatDate(faqsShow.publishDate) }}</span>
										<span v-if="faqsShow.category && faqsShow.category.sub">子分類: {{ faqsShow.category.sub }}</span>
									</div>
								</div>
								<div v-if="faqsShow.imageUrl && faqsShow.imageUrl.length > 0">
									<img :src="faqsShow.imageUrl[0]" :alt="getLocalizedText(faqsShow.question)" class="w-full h-auto" loading="eager" />
								</div>
							</section>

							<!-- 答案內容 -->
							<section class="bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-lg border border-slate-200">
								<TiptapRenderer v-if="answerIsTiptap" :content="localizedAnswer" class="prose prose-slate max-w-none" />
								<!-- eslint-disable-next-line vue/no-v-html -->
								<div v-else class="prose prose-slate max-w-none" v-html="localizedAnswer"></div>
							</section>

							<!-- 相關圖片 (顯示除了第一張以外的圖片) -->
							<section v-if="faqsShow.imageUrl && faqsShow.imageUrl.length > 1" class="bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-lg border border-slate-200">
								<h3 class="text-xl font-semibold mb-4 text-slate-700">相關圖片</h3>
								<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
									<a
										v-for="(url, index) in faqsShow.imageUrl.slice(1)"
										:key="`img-${index}`"
										:href="url"
										target="_blank"
										class="block rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
									>
										<img
											:src="url"
											:alt="`${getLocalizedText(faqsShow.question)} - 圖片 ${index + 2}`"
											class="object-cover w-full h-32 md:h-40"
											loading="lazy"
										/>
									</a>
								</div>
							</section>

							<!-- 教學影片 -->
							<section v-if="faqsShow.videoUrl && faqsShow.videoUrl.length > 0" class="bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-lg border border-slate-200">
								<h3 class="text-xl font-semibold mb-4 text-slate-700">教學影片</h3>
								<div class="space-y-6">
									<div v-for="(url, index) in faqsShow.videoUrl" :key="`vid-${index}`" class="aspect-w-16 aspect-h-9">
										<iframe
											:src="getEmbedUrl(url)"
											frameborder="0"
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
											allowfullscreen
											class="rounded-lg w-full h-full"
											:title="`教學影片 ${index + 1}`"
										></iframe>
									</div>
								</div>
							</section>

							<!-- 相關文件 -->
							<section
								v-if="faqsShow.documentUrl && faqsShow.documentUrl.length > 0"
								class="bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-lg border border-slate-200"
							>
								<h3 class="text-xl font-semibold mb-4 text-slate-700">相關文件</h3>
								<ul class="list-disc list-inside space-y-2">
									<li v-for="(url, index) in faqsShow.documentUrl" :key="`doc-${index}`">
										<a :href="url" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">
											下載附件 {{ index + 1 }}
											<span class="text-xs text-slate-500 ml-1">({{ getFileName(url) }})</span>
										</a>
									</li>
								</ul>
							</section>
						</div>
					</main>
				</div>
			</div>

			<!-- 返回按鈕 -->
			<div class="mt-8 md:mt-12 text-center">
				<NuxtLink to="/Faqs" class="text-blue-600 hover:underline"> &larr; 返回問題中心 </NuxtLink>
			</div>
		</article>

		<!-- 未找到內容 -->
		<div v-else class="min-h-screen flex items-center justify-center">
			<div class="text-center py-12 text-gray-500">
				<h2 class="text-2xl font-bold mb-4">找不到指定的內容</h2>
				<NuxtLink to="/Faqs" class="mt-4 inline-block text-blue-600 hover:underline">返回說明中心</NuxtLink>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useFaqsStore } from "~/stores/faqsStore";
import { useLanguageStore } from "~/stores/core/languageStore";
import { computed } from "vue";
import TiptapRenderer from "~/components/news/TiptapRenderer.vue";

definePageMeta({
	key: (route) => route.fullPath
});

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const faqsStore = useFaqsStore();
const languageStore = useLanguageStore();

const { pending, error } = await useAsyncData(`faqs-show-${route.params.slug}`, () => faqsStore.fetchFaqsBySlug(route.params.slug));

if (error.value) {
	console.error("Failed to fetch FAQs:", error.value);
}

const faqsShow = computed(() => faqsStore.currentFaqsItem || null);

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
	return getLocalizedText(faqsShow.value.metaTitle) || getLocalizedText(faqsShow.value.question);
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
		return faqsShow.value.imageUrl[0];
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
		{ hid: "og:url", property: "og:url", content: `${runtimeConfig.public.baseURL}/Faqs/${route.params.slug}` }
	],
	link: [{ rel: "canonical", href: `${runtimeConfig.public.baseURL}/Faqs/${route.params.slug}` }]
}));
</script>
