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

		<main class="bg-white">
			<!-- Section 1: Customer Challenges -->
			<section id="challenges" class="py-12 sm:py-24 feature-section opacity-0">
				<div class="container mx-auto px-4">
					<div class="text-center mb-8 md:mb-16">
						<h2 class="text-3xl lg:text-4xl font-bold text-transparent bg-gradient-to-r from-[#dd1c1c] to-[#770f0f] bg-clip-text mb-4">解決方案概覽</h2>
						<p class="text-lg lg:text-xl text-gray-600">常見需求與停車場面臨的挑戰</p>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
						<div v-for="challenge in solutionData.challenges" :key="challenge.id" class="bg-white rounded-xl shadow-lg overflow-hidden">
							<div class="relative h-48 xl:h-64">
								<NuxtImg :src="challenge.image" :alt="challenge.title" class="w-full h-full object-cover" loading="lazy" />
								<div class="absolute top-4 left-4">
									<span
										:class="[
											'inline-block px-3 py-1 rounded-full text-sm md:text-base font-semibold text-white',
											challenge.color === 'orange' && 'bg-orange-500',
											challenge.color === 'blue' && 'bg-blue-500',
											challenge.color === 'green' && 'bg-green-500',
											challenge.color === 'purple' && 'bg-purple-500'
										]"
									>
										{{ challenge.title }}
									</span>
								</div>
							</div>
							<div class="p-6">
								<h3 class="text-xl font-bold text-gray-900 mb-3">{{ challenge.description }}</h3>
								<ul class="space-y-2">
									<li v-for="point in challenge.points" :key="point" class="flex items-start">
										<span class="text-gray-600 text-sm">• {{ point }}</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- Section 2: Solutions Overview -->
			<section id="solutions-overview" class="py-12 sm:py-24 feature-section opacity-0">
				<div class="container mx-auto px-4">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
						<!-- Parking System Image -->
						<div>
							<NuxtImg :src="solutionData.heroImage" alt="停車管理系統概覽" class="w-full h-auto rounded-lg shadow-lg" />
						</div>
						<!-- Solutions Navigation -->
						<div class="space-y-4">
							<div class="text-center mb-4 md:mb-8">
								<h2 class="text-2xl lg:text-3xl font-bold text-transparent bg-gradient-to-r from-[#dd1c1c] to-[#770f0f] bg-clip-text">解決方案介紹</h2>
								<p class="mt-4 text-base lg:text-lg leading-8 text-gray-600">我們提供：順暢進出、直覺引導、高效管理</p>
							</div>
							<div
								v-for="(solution, index) in solutionData.solutions"
								:key="solution.id"
								class="bg-blue-50 rounded-lg p-6 border border-blue-200 cursor-pointer transition-all duration-300 hover:shadow-lg hover:bg-blue-100"
								@click="scrollToFeature(featuresData[index]?.id)"
							>
								<h3 class="text-lg md:text-xl font-bold text-blue-900 mb-3">{{ solution.title }}</h3>
								<ul class="space-y-2">
									<li v-for="point in solution.points" :key="point" class="flex items-start">
										<svg class="flex-shrink-0 w-4 h-4 text-blue-500 mt-1 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
											<path
												fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clip-rule="evenodd"
											/>
										</svg>
										<span class="text-blue-800 text-sm md:text-base">{{ point }}</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- Section 3: Product Features -->
			<section class="bg-gray-50 space-y-12 py-12 md:py-24">
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

const slug = "parking-management-system";

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

// Fetch products when component mounts
onMounted(() => {
	fetchAllProducts();
});
</script>
