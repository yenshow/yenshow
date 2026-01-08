<template>
	<ProductSeriesLayout
		:title="t('products.series_pages.surveillance_monitoring.title')"
		:subtitle="t('products.series_pages.surveillance_monitoring.subtitle')"
		:subtitle2="t('products.series_pages.surveillance_monitoring.subtitle2')"
		:series-id="SERIES_ID"
		:series-slug="SERIES_SLUG"
	/>
</template>

<script setup>
import { useHead } from "#app";
import { useI18n } from "vue-i18n";
import { useHierarchyStore } from "~/stores/hierarchyStore";
import ProductSeriesLayout from "~/components/products/ProductSeriesLayout.vue";

const SERIES_ID = "67ed0512296210e234e0de64";
const SERIES_SLUG = "surveillance-monitoring";

const { t } = useI18n();

useHead({
	title: () => ` - ${t("products.series_pages.surveillance_monitoring.title")}`,
	meta: [{ name: "description", content: () => t("products.series_pages.surveillance_monitoring.meta") }]
});

const hierarchyStore = useHierarchyStore();
hierarchyStore.setCurrentSeries({
	name: t("products.series_pages.surveillance_monitoring.title"),
	slug: SERIES_SLUG
});
</script>
