<template>
	<div v-if="solutionData">
		<SolutionHero
			:solution-data="solutionData"
			:features="featuresData"
			:prev-solution="prevSolution"
			:next-solution="nextSolution"
			:embed-url="embedUrl"
			:scroll-to-feature="scrollToFeature"
			:get-feature-tag-class="getFeatureTagClass"
		/>

		<!-- Section 2: 方案特點與產品展示 -->
		<main class="bg-gray-50 space-y-12 py-12 md:py-24">
			<div v-for="(feature, index) in featuresData" :key="feature.id" :id="feature.id" class="container mx-auto feature-section opacity-0">
				<FeatureBlock
					:feature-data="feature"
					:layout-order="index % 2 === 0 ? 'normal' : 'reversed'"
					:is-loading="isLoadingProducts"
					:products="filteredProductsByFeature[feature.id] || []"
					:active-filter="activeFilters[feature.id] || {}"
					@select-product-type="handleFilterSelection"
				/>
			</div>
		</main>
	</div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useSolutionPage } from "~/composables/useSolutionPage";
import SolutionHero from "~/components/solutions/SolutionHero.vue";
import FeatureBlock from "~/components/solutions/FeatureBlock.vue";
import { onMounted } from "vue";

const route = useRoute();
const slug = route.params.slug;

// Use the new composable for shared page logic
const {
	solutionData,
	featuresData,
	embedUrl,
	prevSolution,
	nextSolution,
	scrollToFeature,
	getFeatureTagClass,
	isLoadingProducts,
	activeFilters,
	filteredProductsByFeature,
	fetchAllProducts,
	handleFilterSelection
} = useSolutionPage(slug);

// Fetch products on mount
onMounted(async () => {
	await fetchAllProducts();
});
</script>
