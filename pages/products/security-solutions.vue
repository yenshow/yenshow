<template>
	<ProductSeriesLayout
		:title="t('products.series_pages.security_solutions.title')"
		:subtitle="t('products.series_pages.security_solutions.subtitle')"
		:subtitle2="t('products.series_pages.security_solutions.subtitle2')"
		:series-id="SERIES_ID"
		:series-slug="SERIES_SLUG"
	/>
</template>

<script setup>
import { useHead } from "#app";
import { useI18n } from "vue-i18n";
import { useHierarchyStore } from "~/stores/hierarchyStore";
import ProductSeriesLayout from "~/components/products/ProductSeriesLayout.vue";

const SERIES_ID = "67ed0512296210e234e0deb2";
const SERIES_SLUG = "security-solutions";

const { t } = useI18n();

useHead({
	title: () => ` - ${t("products.series_pages.security_solutions.title")}`,
	meta: [{ name: "description", content: () => t("products.series_pages.security_solutions.meta") }]
});

const hierarchyStore = useHierarchyStore();
hierarchyStore.setCurrentSeries({
	name: t("products.series_pages.security_solutions.title"),
	slug: SERIES_SLUG
});
</script>
