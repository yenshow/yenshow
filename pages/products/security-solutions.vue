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
import { useI18n } from "vue-i18n";
import { useHierarchyStore } from "~/stores/hierarchyStore";
import ProductSeriesLayout from "~/components/products/ProductSeriesLayout.vue";

const SERIES_ID = "67ed0512296210e234e0deb2";
const SERIES_SLUG = "security-solutions";

const { t } = useI18n();

usePageSeo({
	title: ` - ${t("products.series_pages.security_solutions.title")}`,
	description: t("products.series_pages.security_solutions.meta"),
	path: "/products/security-solutions"
});

const hierarchyStore = useHierarchyStore();
hierarchyStore.setCurrentSeries({
	name: t("products.series_pages.security_solutions.title"),
	slug: SERIES_SLUG
});
</script>
