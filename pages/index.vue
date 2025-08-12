<template>
	<div>
		<!-- HeroPic -->
		<HeroPic />

		<!-- Story -->
		<Story v-if="locale === 'zh'" id="story" />

		<!-- Intro -->
		<Intro />

		<!-- Product -->
		<ProductIntro id="products" />

		<!-- CaseStudiesIntro -->
		<CaseStudiesIntro id="cases" />

		<!-- News -->
		<News id="news" />
	</div>
</template>

<script setup>
import { provide, onMounted, onUnmounted } from "vue";
import HeroPic from "~/components/Home/HeroPic.vue";
import Story from "~/components/Home/Story.vue";
import Intro from "~/components/Home/Intro.vue";
import ProductIntro from "~/components/Home/ProductIntro.vue";
import CaseStudiesIntro from "~/components/Home/CaseStudiesIntro.vue";
import News from "~/components/Home/News.vue";
import { useScrollAnimation } from "~/composables/useScrollAnimation";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const localePath = useLocalePath();

useHead({
	title: "",
	meta: [{ name: "description", content: t("home.meta.description") }]
});

// 使用滾動動畫 composable
const scrollAnimation = useScrollAnimation();
// 提供給子組件，使其可以共享相同的滾動管理器
provide("scrollAnimation", scrollAnimation);

// 全局滾動設置
onMounted(async () => {
	try {
		// 初始化 ScrollTrigger
		await scrollAnimation.initScrollPlugins();
	} catch (error) {
		console.error("初始化錯誤:", error);
	}
});

onUnmounted(() => {
	// 清理所有 ScrollTrigger 實例
	scrollAnimation.cleanupScrollTriggers();
});
</script>
