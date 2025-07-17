<template>
	<ProductSeriesLayout
		title="門禁管理"
		subtitle="以人臉、卡片、QR Code 或車牌等多元識別技術"
		subtitle2="打造可追蹤的出入口權限控制"
		:series-id="SERIES_ID"
		:series-slug="SERIES_SLUG"
		:introduction-items-map="introductionItemsMap"
	/>
</template>

<script setup>
import { useHead } from "#app";
import { useHierarchyStore } from "~/stores/hierarchyStore";
import ProductSeriesLayout from "~/components/products/ProductSeriesLayout.vue";

const SERIES_ID = "67ed0512296210e234e0de10";
const SERIES_SLUG = "access-control";

useHead({
	title: " - 門禁管理",
	meta: [{ name: "description", content: "探索遠岫科技的門禁管理解決方案，包括人臉辨識、卡片、QR Code 及車牌辨識技術，打造可追蹤的出入口權限控制。" }]
});

const hierarchyStore = useHierarchyStore();
hierarchyStore.setCurrentSeries({
	name: "門禁管理",
	slug: SERIES_SLUG
});

const introductionItemsMap = {
	門禁控制: [
		{ title: "辦公大樓", content: "員工刷臉即通行，無接觸、卡片遺失困擾" },
		{ title: "工業園區", content: "結合人臉+排班資料控管進出紀錄，強化考勤與權限管理" },
		{ title: "住宅社區", content: "住戶刷臉進出社區、電梯自動到樓層，提升尊榮感與安全" },
		{ title: "校園與補習班", content: "師生/學生進出刷臉紀錄，家長即時接收進出通知" }
	],
	通關機: [
		{ title: "學校/補習班", content: "學生臉部識別＋體溫偵測，結合家長通報系統" },
		{ title: "醫療場域", content: "自動化訪客控管流程，降低人力負擔、提升通行效率" },
		{ title: "建案社區", content: "結合門禁及電梯通行權限，打造智能化社區通行體驗" },
		{ title: "工地管理", content: "工人刷臉進出、搭配工時與出勤紀錄，強化現場安全與紀律管理" }
	],
	車牌辨識管理系統: [
		{ title: "社區與建案停車場", content: "自動辨識住戶車牌，自動開啟柵欄，提升通行效率與便利性" },
		{ title: "企業/工廠車道管理", content: "自動記錄員工與物流車輛出入時間，結合雷達偵測防止追車闖關" },
		{ title: "收費停車場", content: "搭配通關機與票證系統，整合臨停與月租邏輯" },
		{ title: "物流倉儲中心", content: "系統化管理貨車進出時段，結合監控即時畫面與資料留存" }
	],
	訪客管理系統: [
		{ title: "企業辦公大樓", content: "訪客預約與到場身份驗證，提升櫃台效率與專業形象" },
		{ title: "科技廠區/物流場域", content: "控管訪客、外包人員進出紀錄與逗留時長，落實安控紀錄" },
		{ title: "醫療院所/養護機構", content: "每日訪客實名制與健康資料快篩，提高感染防控力" },
		{ title: "社區建案接待中心", content: "搭配人臉建檔、動線引導與臨時通行整合，提升住戶與訪客雙方體驗" }
	]
};
</script>
