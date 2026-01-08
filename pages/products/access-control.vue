<template>
	<ProductSeriesLayout
		:title="t('products.series_pages.access_control.title')"
		:subtitle="t('products.series_pages.access_control.subtitle')"
		:subtitle2="t('products.series_pages.access_control.subtitle2')"
		:series-id="SERIES_ID"
		:series-slug="SERIES_SLUG"
	/>
</template>

<script setup>
import { useHead } from "#app";
import { useI18n } from "vue-i18n";
import { useHierarchyStore } from "~/stores/hierarchyStore";
import ProductSeriesLayout from "~/components/products/ProductSeriesLayout.vue";

const SERIES_ID = "67ed0512296210e234e0de10";
const SERIES_SLUG = "access-control";

const { t } = useI18n();

useHead({
	title: () => ` - ${t("products.series_pages.access_control.title")}`,
	meta: [{ name: "description", content: () => t("products.series_pages.access_control.meta") }]
});

const hierarchyStore = useHierarchyStore();
hierarchyStore.setCurrentSeries({
	name: t("products.series_pages.access_control.title"),
	slug: SERIES_SLUG
});
</script>
