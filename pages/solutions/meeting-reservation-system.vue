<template>
	<div v-if="solutionData">
		<!-- ============ Hero Section ============ -->
		<SolutionHero
			:solution-data="solutionData"
			:features="featuresData"
			:prev-solution="prevSolution"
			:next-solution="nextSolution"
			:embed-url="embedUrl"
			:scroll-to-feature="scrollToFeature"
			:get-feature-tag-class="getFeatureTagClass"
		/>

		<main class="bg-white text-gray-800">
			<!-- Section 1: 應用場景 (Introduction) -->
			<section id="use-cases" class="py-12 sm:py-24 feature-section opacity-0">
				<div class="container mx-auto px-4">
					<div class="text-center mb-12">
						<h2 class="text-3xl lg:text-4xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text mb-4">應用場景</h2>
						<p class="text-lg lg:text-xl text-gray-600">多元場域，一站式智慧會議體驗</p>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
						<div
							v-for="intro in solutionData.introduction"
							:key="intro.id"
							class="flex flex-col items-center text-center p-6 rounded-xl shadow-lg border border-b-4 border-b-indigo-600 border-r-2 border-r-indigo-600 bg-white"
						>
							<NuxtImg :src="intro.icon" :alt="intro.title" class="w-[120px] lg:w-[140px] aspect-square object-contain mb-4" />
							<h3 class="text-lg lg:text-xl font-bold mb-2">{{ intro.title }}</h3>
							<p class="text-sm lg:text-base text-gray-600">{{ intro.description }}</p>
						</div>
					</div>
				</div>
			</section>

			<!-- Section 2: 系統痛點 / 挑戰 -->
			<section id="challenges" class="py-12 sm:py-24 feature-section opacity-0 bg-gray-50">
				<div class="container mx-auto px-4">
					<div class="text-center mb-12">
						<h2 class="text-3xl lg:text-4xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text mb-4">系統痛點</h2>
						<p class="text-lg lg:text-xl text-gray-600">會議空間常見管理與效率挑戰</p>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div v-for="challenge in solutionData.challenges" :key="challenge.id" class="bg-white rounded-xl shadow-lg overflow-hidden">
							<div class="relative h-48">
								<NuxtImg :src="challenge.image" :alt="challenge.title" class="w-full h-full object-cover" loading="lazy" />
								<span
									class="absolute top-4 left-4 inline-block px-3 py-1 rounded-full text-sm font-semibold text-white"
									:class="
										(challenge.color === 'purple' && 'bg-purple-600') ||
										(challenge.color === 'blue' && 'bg-blue-600') ||
										(challenge.color === 'orange' && 'bg-orange-600')
									"
								>
									{{ challenge.title }}
								</span>
							</div>
							<div class="p-6">
								<h3 class="text-xl font-bold text-gray-900 mb-3">{{ challenge.description }}</h3>
								<ul class="space-y-2">
									<li v-for="point in challenge.points" :key="point" class="flex items-start text-gray-600 text-sm">• {{ point }}</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- Section 3: 產品特色 (Feature Blocks) -->
			<section class="bg-white space-y-12 py-12 md:py-24">
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
			</section>
		</main>
	</div>
</template>

<script setup>
import { onMounted } from "vue";
import { useSolutionPage } from "~/composables/useSolutionPage";
import SolutionHero from "~/components/solutions/SolutionHero.vue";
import FeatureBlock from "~/components/solutions/FeatureBlock.vue";

const slug = "meeting-reservation-system";

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

onMounted(() => {
	fetchAllProducts();
});
</script>
