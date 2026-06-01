<template>
	<ProductSeriesLayout
		:title="t('products.series_pages.devices_accessories.title')"
		:subtitle="t('products.series_pages.devices_accessories.subtitle')"
		:subtitle2="t('products.series_pages.devices_accessories.subtitle2')"
		:series-id="SERIES_ID"
		:series-slug="SERIES_SLUG"
	/>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useHierarchyStore } from "~/stores/hierarchyStore";
import ProductSeriesLayout from "~/components/products/ProductSeriesLayout.vue";

const SERIES_ID = "67ed0512296210e234e0df00";
const SERIES_SLUG = "devices-accessories";

const { t } = useI18n();

usePageSeo({
	title: ` - ${t("products.series_pages.devices_accessories.title")}`,
	description: t("products.series_pages.devices_accessories.meta"),
	path: "/products/devices-accessories"
});

const hierarchyStore = useHierarchyStore();
hierarchyStore.setCurrentSeries({
	name: t("products.series_pages.devices_accessories.title"),
	slug: SERIES_SLUG
});
</script>
