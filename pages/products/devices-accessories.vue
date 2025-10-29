<template>
	<ProductSeriesLayout
		:title="t('products.series_pages.devices_accessories.title')"
		:subtitle="t('products.series_pages.devices_accessories.subtitle')"
		:subtitle2="t('products.series_pages.devices_accessories.subtitle2')"
		:series-id="SERIES_ID"
		:series-slug="SERIES_SLUG"
		:introduction-items-map="introductionItemsMap"
	/>
</template>

<script setup>
import { useHead } from "#app";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useHierarchyStore } from "~/stores/hierarchyStore";
import ProductSeriesLayout from "~/components/products/ProductSeriesLayout.vue";

const SERIES_ID = "67ed0512296210e234e0df00";
const SERIES_SLUG = "devices-accessories";

const { t, te } = useI18n();

useHead({
	title: () => ` - ${t("products.series_pages.devices_accessories.title")}`,
	meta: [{ name: "description", content: () => t("products.series_pages.devices_accessories.meta") }]
});

const hierarchyStore = useHierarchyStore();
hierarchyStore.setCurrentSeries({
	name: t("products.series_pages.devices_accessories.title"),
	slug: SERIES_SLUG
});

const introductionItemsMap = computed(() => {
	const key = "products.series_pages.devices_accessories.intro_items";
	if (typeof te === "function" && !te(key)) return {};
	return t(key, {}, { returnObjects: true }) || {};
});
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
