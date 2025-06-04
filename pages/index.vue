<template>
	<div>
		<!-- HeroPic -->
		<HeroPic />

		<!-- Story -->
		<Story id="story" />

		<!-- Intro -->
		<Intro />

		<!-- Product -->
		<ProductIntro id="products" />

		<!-- CaseStudiesIntro -->
		<CaseStudiesIntro id="cases" />

		<!-- News -->
		<News />
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

useHead({
	title: "",
	meta: [{ name: "description", content: "遠岫科技專注於提供創新的軟體解決方案與專業的技術諮詢服務，探索我們的故事、使命與最新產品。" }]
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
