<template>
	<ProductSeriesLayout
		title="其他應用"
		subtitle="提供 PoE 供電、顯示、柵欄與雷達等設備"
		subtitle2="滿足系統整合與特殊場域需求"
		:series-id="SERIES_ID"
		:series-slug="SERIES_SLUG"
		:introduction-items-map="introductionItemsMap"
	/>
</template>

<script setup>
import { useHead } from "#app";
import { useHierarchyStore } from "~/stores/hierarchyStore";
import ProductSeriesLayout from "~/components/products/ProductSeriesLayout.vue";

const SERIES_ID = "67ed0512296210e234e0df00";
const SERIES_SLUG = "devices-accessories";

useHead({
	title: " - 其他應用",
	meta: [{ name: "description", content: "探索遠岫科技的PoE供電、顯示螢幕、智能柵欄與雷達等其他應用產品，滿足多樣化的系統整合與特殊場域需求。" }]
});

const hierarchyStore = useHierarchyStore();
hierarchyStore.setCurrentSeries({
	name: "其他應用",
	slug: SERIES_SLUG
});

const introductionItemsMap = {
	LED螢幕: [
		{ title: "高畫質與高亮度", content: "適用於室內外各種環境，提供清晰、生動的視覺效果" },
		{ title: "多元應用場景", content: "廣泛應用於廣告看板、資訊公告、活動展演等，提升資訊傳達效率" },
		{ title: "無縫系統整合", content: "可與現有的中央監控或內容管理系統整合，實現智慧化管理" }
	],
	周邊設備: [
		{ title: "各類場域整合應用", content: "提供支架、出口按鈕、電源供應等基礎配件，確保系統穩定運作" },
		{ title: "弱電/機房建置", content: "結合交換器、UPS、路由器等網路設備，打造完整後端架構" },
		{ title: "智慧升級彈性", content: "未來如需擴充 AI 模組、人臉機、NVR 等，設備可無縫對接，保留彈性空間" }
	],
	網路設備及軟體: [
		{ title: "智慧建案與社區", content: "一條網路線供電與傳輸影像，應用於攝影機、人臉機、IP對講等多元設備部署" },
		{ title: "企業/工廠場域", content: "大量PoE IPC或NVR集中佈線，避免電力施工干擾生產運作，確保設備穩定通訊" },
		{ title: "智慧出入口車道", content: "車牌辨識攝影機、PoE LED字幕機、IP喇叭同步供電與網路串接，整合管理簡單快速" },
		{ title: "臨時活動/移動式佈署現場", content: "可搭配PoE供電型4G路由器與設備，彈性佈建臨時監控或警報感測網" }
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
</style>
