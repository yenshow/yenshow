<template>
	<ProductSeriesLayout
		title="影像監控"
		subtitle="影像結合 AI 模組取得更多智慧洞察"
		subtitle2="即時識別異常、守護資產與人員安全"
		:series-id="SERIES_ID"
		:series-slug="SERIES_SLUG"
		:introduction-items-map="introductionItemsMap"
	/>
</template>

<script setup>
import { useHead } from "#app";
import { useHierarchyStore } from "~/stores/hierarchyStore";
import ProductSeriesLayout from "~/components/products/ProductSeriesLayout.vue";

const SERIES_ID = "67ed0512296210e234e0de64";
const SERIES_SLUG = "surveillance-monitoring";

useHead({
	title: " - 影像監控",
	meta: [{ name: "description", content: "探索遠岫科技的影像監控系統，整合AI智能分析，即時識別異常，全天候守護您的資產與人員安全。" }]
});

const hierarchyStore = useHierarchyStore();
hierarchyStore.setCurrentSeries({
	name: "影像監控",
	slug: SERIES_SLUG
});

const introductionItemsMap = {
	IPC: [
		{ title: "商業門市", content: "客流熱區分析、性別年齡統計，助攻行銷決策" },
		{ title: "社區住宅", content: "即時偵測陌生人徘徊、逗留行為，提高社區警覺性" },
		{ title: "公共空間", content: "車牌辨識、人數統計、口罩穿戴辨識，實現精準防控" }
	],
	NVR: [
		{ title: "辦公廠區", content: "AI辨識異常行為、自動告警，提升管理效率" },
		{ title: "醫療機構", content: "跌倒偵測、非授權區域入侵提醒，守護患者安全" },
		{ title: "商業門市", content: "客流熱區分析、性別年齡統計，助攻行銷決策" }
	]
};
</script>
