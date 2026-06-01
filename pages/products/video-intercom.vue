<template>
	<ProductSeriesLayout
		:title="t('products.series_pages.video_intercom.title')"
		:subtitle="t('products.series_pages.video_intercom.subtitle')"
		:subtitle2="t('products.series_pages.video_intercom.subtitle2')"
		:series-id="SERIES_ID"
		:series-slug="SERIES_SLUG"
	/>
</template>

<script setup>
import { useHierarchyStore } from "~/stores/hierarchyStore";
import ProductSeriesLayout from "~/components/products/ProductSeriesLayout.vue";
import { useI18n } from "vue-i18n";

const SERIES_ID = "67ed0511296210e234e0ddd7";
const SERIES_SLUG = "video-intercom";
const { t } = useI18n();

usePageSeo({
	title: ` - ${t("products.series_pages.video_intercom.title")}`,
	description: t("products.series_pages.video_intercom.meta"),
	path: "/products/video-intercom"
});

const hierarchyStore = useHierarchyStore();
hierarchyStore.setCurrentSeries({
	name: t("products.series_pages.video_intercom.title"),
	slug: SERIES_SLUG
});
</script>
