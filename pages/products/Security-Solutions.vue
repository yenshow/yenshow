<template>
	<ProductSeriesLayout
		title="安全防護"
		subtitle="結合無線感測、火災預警與安檢設備"
		subtitle2="提供多層次主動安全防護方案"
		:series-id="SERIES_ID"
		:series-slug="SERIES_SLUG"
		:introduction-items-map="introductionItemsMap"
	/>
</template>

<script setup>
import { useHead } from "#app";
import { useHierarchyStore } from "~/stores/hierarchyStore";
import ProductSeriesLayout from "~/components/products/ProductSeriesLayout.vue";

const SERIES_ID = "67ed0512296210e234e0deb2";
const SERIES_SLUG = "security-solutions";

useHead({
	title: " - 安全防護",
	meta: [{ name: "description", content: "了解遠岫科技的安全防護方案，我們結合無線感測、火災預警與安檢設備，提供多層次的主動安全防護。" }]
});

const hierarchyStore = useHierarchyStore();
hierarchyStore.setCurrentSeries({
	name: "安全防護",
	slug: SERIES_SLUG
});

const introductionItemsMap = {
	火災警報: [
		{ title: "工廠/倉儲區", content: "堆料易燃物集中，高風險區域主動監控" },
		{ title: "電力/機房設備室", content: "即時偵測過熱預防電氣火災" },
		{ title: "農業林地/建築工地", content: "戶外獨立型部署，第一時間掌握火源" },
		{ title: "停車場/地下室", content: "空氣不流通處提早預警火煙異常" }
	],
	金屬檢測門: [
		{ title: "機場/車站", content: "確保旅客行李與身上無攜帶危險物品" },
		{ title: "考場/法務單位", content: "杜絕舞弊與防止違禁品帶入" },
		{ title: "展演會場/大型活動", content: "防範不明攜帶物造成突發危安事件" },
		{ title: "工廠/倉儲入口", content: "防止工具或金屬外流，提高財物管理控管" }
	],
	人體測溫: [
		{ title: "醫療院所", content: "人員體溫監控搭配緊急警報機制，守護醫療場域穩定" },
		{ title: "工廠與倉儲", content: "結合防爆火警警報、金屬探測與人體測溫，防範工安意外" },
		{ title: "百貨商場/交通場站", content: "整合金屬偵測、人流測溫與火警通報，提升營運安全水準" }
	],
	無線警報: [
		{ title: "高階住宅/別墅", content: "快速布建、無需拉線，支援室內外感測與語音通知，提升主動防護力" },
		{ title: "臨時工地與活動場域", content: "採用4G/Wi-Fi雙通道連線＋鋰電備援設計，適合無電源場域臨時部署" },
		{ title: "學校/診所/門市", content: "可透過App監控與管理人員進出，支援警報語音提示與通知推播" },
		{ title: "連鎖場域/中小型商業", content: "中央平台統一管理多據點布撤防與事件記錄，減輕人力依賴" }
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
