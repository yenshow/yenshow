<template>
	<ProductSeriesLayout
		title="可視對講"
		subtitle="以雙向視訊溝通與遠端開鎖"
		subtitle2="讓出入口管理更安全、便利且人性化"
		:series-id="SERIES_ID"
		:series-slug="SERIES_SLUG"
		:introduction-items-map="introductionItemsMap"
	/>
</template>

<script setup>
import { useHead } from "#app";
import { useHierarchyStore } from "~/stores/hierarchyStore";
import ProductSeriesLayout from "~/components/products/ProductSeriesLayout.vue";

const SERIES_ID = "67ed0511296210e234e0ddd7";
const SERIES_SLUG = "video-intercom";

useHead({
	title: " - 可視對講",
	meta: [{ name: "description", content: "體驗遠岫科技的可視對講系統，結合雙向視訊溝通與遠端開鎖功能，讓出入口管理更安全、便利且人性化。" }]
});

const hierarchyStore = useHierarchyStore();
hierarchyStore.setCurrentSeries({
	name: "可視對講",
	slug: SERIES_SLUG
});

const introductionItemsMap = {
	可視對講機: [
		{ title: "社區大樓", content: "訪客視訊確認、遠端開門" },
		{ title: "校園／醫院", content: "入口即時通話、緊急通報" },
		{ title: "辦公大樓", content: "提升接待效率、降低前台負荷" },
		{ title: "工廠／倉儲", content: "車輛與人員進出即時對講" }
	],
	管理中心主機: [
		{ title: "大型社區中控室", content: "集中應答、保全巡邏" },
		{ title: "醫院／校園警衛室", content: "快速辨識訪客、提升安全" },
		{ title: "政府與金融單位", content: "高敏感區域集中監控" }
	]
};
</script>

<style scoped>
/* Introduction Card List Animations */
.introduction-card-list-enter-active,
.introduction-card-list-leave-active {
	transition: all 0.5s ease;
}
.introduction-card-list-enter-from,
.introduction-card-list-leave-to {
	opacity: 0;
	transform: translateY(30px);
}

/* Staggering effect for enter */
.introduction-card-list-enter-active {
	transition-delay: calc(0.1s * var(--stagger-index, 0));
}

/* For leave, items usually disappear more simultaneously or with a reverse stagger if desired */
.introduction-card-list-leave-active {
	position: absolute; /* Important for leave animations to not affect layout */
}

/* Responsive adjustments for circles */
@media (max-width: 640px) {
}
</style>
