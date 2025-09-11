<template>
	<div v-if="solutionData">
		<!-- ============ Hero Section ============ -->
		<SolutionHero
			:solution-data="solutionData"
			:prev-solution="prevSolution"
			:next-solution="nextSolution"
			:embed-url="embedUrl"
			:scroll-to-feature="scrollToFeature"
			:get-feature-tag-class="getFeatureTagClass"
		/>

		<main class="bg-white text-gray-800">
			<!-- Section 1: 什麼是智慧型視訊會議？ -->
			<section id="use-cases" class="py-12 sm:py-24 feature-section opacity-0">
				<div class="container mx-auto px-4 text-center">
					<h2 class="text-3xl lg:text-4xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text mb-6">什麼是智慧型視訊會議？</h2>
					<p class="text-lg lg:text-xl text-gray-600 mb-8">
						智慧型會議室是政府機構和企業單位舉行各種會議、學術討論和多媒體會議的主要場所。<br />
						它運用了先進的技術，如視聽技術、通信、網絡連接和自動化控制，將傳統會議室升級為數位化和智能化的工作環境。<br />
						它為政府和企業單位提供了更加便捷高效的會議空間，旨在提升會議效率、改善會議體驗，並降低會議成本。
					</p>
					<div class="mt-12">
						<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
							<div
								v-for="intro in solutionData.introduction"
								:key="intro.id"
								class="flex flex-col items-center text-center p-6 rounded-xl shadow-lg border border-b-4 border-b-indigo-600 border-r-2 border-r-indigo-600 bg-white"
							>
								<NuxtImg
									:src="intro.icon"
									:alt="intro.title"
									class="w-[120px] lg:w-[140px] aspect-square object-contain mb-4 text-indigo-600"
									format="webp"
									quality="85"
									loading="lazy"
									:placeholder="[50, 50, 75, 5]"
								/>
								<h3 class="text-lg lg:text-xl font-bold mb-2">{{ intro.title }}</h3>
								<p class="text-sm lg:text-base text-gray-600">{{ intro.description }}</p>
							</div>
						</div>
					</div>
				</div>
			</section>
			<!-- Section 2: 常見痛點 -->
			<section id="painpoints" class="py-12 sm:py-24 feature-section opacity-0 bg-gray-50">
				<div class="container mx-auto px-4">
					<div class="text-center mb-12">
						<h2 class="text-3xl lg:text-4xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text mb-4">會議體驗的常見痛點</h2>
					</div>

					<div v-if="solutionData.painPoints" class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
						<!-- Arrow connectors for desktop view -->
						<div class="hidden md:block absolute top-1/2 -mt-16 left-0 right-0">
							<div class="flex justify-center items-center">
								<div class="w-1/3 flex justify-center">
									<svg class="w-24 h-24 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5l7 7-7 7" />
									</svg>
								</div>
								<div class="w-1/3 flex justify-center">
									<svg class="w-24 h-24 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5l7 7-7 7" />
									</svg>
								</div>
							</div>
						</div>

						<div v-for="point in solutionData.painPoints" :key="point.id" class="text-center flex flex-col items-center z-10">
							<!-- Advantage Title -->
							<h3 class="text-xl lg:text-2xl font-bold text-indigo-600 mb-4">{{ point.advantage }}</h3>

							<!-- Arrow Down -->
							<div class="w-full flex justify-center mb-4">
								<svg class="w-12 h-12 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
								</svg>
							</div>

							<!-- Image -->
							<div class="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg mb-6">
								<NuxtImg
									:src="point.image"
									:alt="point.title"
									class="w-full h-full object-cover"
									format="webp"
									quality="85"
									loading="lazy"
									:placeholder="[50, 50, 75, 5]"
								/>
							</div>

							<!-- Pain Point Title -->
							<h4 class="text-2xl font-bold text-gray-800 mb-3">{{ point.title }}</h4>

							<!-- Description -->
							<p class="text-gray-600 max-w-xs">{{ point.description }}</p>
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

const slug = "meeting-reservation-system";

const { solutionData, embedUrl, prevSolution, nextSolution, scrollToFeature, getFeatureTagClass } = useSolutionPage(slug);
</script>
