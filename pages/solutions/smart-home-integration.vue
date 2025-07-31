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
			<!-- Section 2: BA System Introduction -->
			<section id="ba-introduction" class="py-16 sm:py-24 feature-section">
				<div class="container mx-auto px-4">
					<div class="text-center">
						<h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Yenshow BA 樓宇自動化系統</h2>
						<p class="mt-4 text-lg leading-8 text-gray-600">整合建築內所有機電設備，實現集中監控、高效管理與節能運營。</p>
					</div>
					<div class="mt-12">
						<NuxtImg src="/solutions/BA.png" alt="BA 系統架構圖" class="w-full h-auto rounded-lg shadow-lg" />
					</div>
				</div>
			</section>

			<!-- Section 3: Sub-systems -->
			<section class="bg-gray-50 py-16 sm:py-24">
				<div class="container mx-auto px-4 space-y-24">
					<div
						v-for="(feature, index) in featuresData"
						:key="feature.id"
						:id="feature.id"
						class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center feature-section"
					>
						<div :class="{ 'lg:order-last': index % 2 !== 0 }">
							<NuxtImg :src="feature.image" :alt="feature.title" class="w-full h-auto rounded-xl shadow-2xl" loading="lazy" />
						</div>
						<div class="prose prose-lg max-w-none">
							<h3 class="text-2xl font-bold text-gray-800">{{ feature.title }}</h3>
							<p class="text-gray-600">{{ feature.description }}</p>
							<ul v-if="feature.points" class="mt-4 space-y-2">
								<li v-for="point in feature.points" :key="point" class="flex items-start">
									<svg
										class="flex-shrink-0 w-5 h-5 text-teal-500 mt-1 mr-3"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										/>
									</svg>
									<span>{{ point }}</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</section>
		</main>
	</div>
</template>

<script setup>
import { useSolutionPage } from "~/composables/useSolutionPage";
import SolutionHero from "~/components/solutions/SolutionHero.vue";

const slug = "smart-home-integration";

// Use the new composable for shared page logic
const { solutionData, featuresData, embedUrl, prevSolution, nextSolution, scrollToFeature, getFeatureTagClass } = useSolutionPage(slug);
</script>
