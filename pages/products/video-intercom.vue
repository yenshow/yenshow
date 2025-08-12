<template>
	<ProductSeriesLayout
		:title="t('products.series_pages.video_intercom.title')"
		:subtitle="t('products.series_pages.video_intercom.subtitle')"
		:subtitle2="t('products.series_pages.video_intercom.subtitle2')"
		:series-id="SERIES_ID"
		:series-slug="SERIES_SLUG"
		:introduction-items-map="introductionItemsMap"
	/>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useHead } from "#app";
import { useHierarchyStore } from "~/stores/hierarchyStore";
import ProductSeriesLayout from "~/components/products/ProductSeriesLayout.vue";
import { useI18n } from "vue-i18n";
import { useApi } from "~/composables/useApi";
import { useLanguageStore } from "~/stores/core/languageStore";

const SERIES_ID = "67ed0511296210e234e0ddd7";
const SERIES_SLUG = "video-intercom";
const { t, locale } = useI18n();
const languageStore = useLanguageStore();

useHead({
	title: () => ` - ${t("products.series_pages.video_intercom.title")}`,
	meta: [{ name: "description", content: () => t("products.series_pages.video_intercom.meta") }]
});

const hierarchyStore = useHierarchyStore();
hierarchyStore.setCurrentSeries({
	name: t("products.series_pages.video_intercom.title"),
	slug: SERIES_SLUG
});

// 後端載入（依語系切換重抓）
const serverIntroItemsMap = ref(null);
async function fetchIntroFromApi() {
	try {
		const { hierarchyApi } = useApi();
		const resp = await hierarchyApi.getSubHierarchy("series", SERIES_ID, { maxDepth: 2, lang: languageStore.mapLocaleToBackend() });
		if (resp && Array.isArray(resp.categories)) {
			const term = { group: t("products.series_pages.video_intercom.intro_items.terminal.group"), items: [] };
			const mast = { group: t("products.series_pages.video_intercom.intro_items.master.group"), items: [] };
			resp.categories.forEach((cat) => {
				const name = (cat && (cat.name?.[languageStore.mapLocaleToBackend()] || cat.name?.zh || cat.name?.en)) || "";
				if (!name) return;
				(/主機|console|control/i.test(name) ? mast : term).items.push({ title: name, content: "" });
			});
			const result = {};
			if (term.items.length) result[term.group] = term.items;
			if (mast.items.length) result[mast.group] = mast.items;
			serverIntroItemsMap.value = result;
		} else {
			serverIntroItemsMap.value = null;
		}
	} catch (e) {
		serverIntroItemsMap.value = null;
	}
}

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
onMounted(fetchIntroFromApi);
watch(
	() => locale.value,
	() => fetchIntroFromApi()
);
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
