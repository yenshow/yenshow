<template>
	<div v-if="product">
		<PlatformHero
			v-bind="hero"
			:hero-image="product.heroImage"
			:platform-url="product.platformUrl"
			:external-link="externalLink"
			:nav-sections="navSections"
			:prev-platform="prevPlatform"
			:next-platform="nextPlatform"
			:scroll-to-section="scrollToSection"
			:get-nav-tag-class="getNavTagClass"
		/>

		<PlatformOverviewSection
			class="platform-section"
			:overview-title="overview.title"
			:overview-description="overview.description"
			:highlights="overviewHighlights"
			:accent-text="product.textAccent"
			:accent-solid="product.accentSolid"
		/>

		<PlatformModuleShowcase
			class="platform-section"
			:title="t('platform.modules_heading')"
			:description="t('platform.modules_subheading')"
			:modules="moduleGroups"
			:accent-text="product.textAccent"
			:accent-solid="product.accentSolid"
		/>

		<AdvantageSection
			class="platform-section"
			:title="advantages.title"
			:rows="advantages.rows"
			:traditional-label="t('platform.advantages.traditional')"
			:ours-label="t('platform.advantages.ours')"
			:accent-text="product.textAccent"
		/>
	</div>
</template>

<script setup>
import PlatformHero from "~/components/products/platform/PlatformHero.vue";
import PlatformOverviewSection from "~/components/products/platform/PlatformOverviewSection.vue";
import PlatformModuleShowcase from "~/components/products/platform/PlatformModuleShowcase.vue";
import AdvantageSection from "~/components/products/platform/AdvantageSection.vue";

const props = defineProps({
	slug: { type: String, required: true }
});

const { t } = useI18n();
const {
	product,
	meta,
	hero,
	overview,
	overviewHighlights,
	moduleGroups,
	navSections,
	prevPlatform,
	nextPlatform,
	advantages,
	externalLink,
	jsonLd,
	scrollToSection,
	getNavTagClass
} = usePlatformProduct(props.slug);

if (!product) {
	throw createError({ statusCode: 404, statusMessage: "Product not found" });
}

usePageSeo(() => ({
	title: ` - ${meta.value.title}`,
	description: meta.value.description,
	path: `/products/${props.slug}`,
	jsonLd: jsonLd.value
}));
</script>
