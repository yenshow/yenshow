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
			<!-- Section: 訪客機亮點（左右欄版型） -->
			<section id="highlights" class="py-12 sm:py-24 feature-section opacity-0">
				<div class="container mx-auto px-4">
					<div class="text-center mb-6 md:mb-12">
						<h2 class="text-3xl lg:text-4xl font-bold text-transparent bg-gradient-to-r from-rose-600 to-red-500 bg-clip-text">訪客機亮點</h2>
						<p class="mt-4 text-lg lg:text-xl text-gray-600">人性化設計 × 非接觸量測 × 無紙化管理 × 集中控管</p>
					</div>
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<!-- Left: 補充圖片 -->
						<NuxtImg :src="solutionData.heroImage" alt="訪客管理系統亮點" class="w-full h-auto rounded-xl shadow-2xl" loading="lazy" />
						<!-- Right: 亮點清單 -->
						<div class="grid grid-cols-1 gap-6">
							<div v-for="item in solutionData.advantages" :key="item.id" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
								<h3 class="text-lg md:text-xl font-bold text-gray-900 mb-2">{{ item.title }}</h3>
								<p class="text-gray-600">{{ item.description }}</p>
							</div>
						</div>
					</div>
				</div>
			</section>
			<!-- Section: 流程導覽（依附圖分段） -->
			<section id="workflow" class="py-12 sm:py-24 feature-section opacity-0">
				<div class="container mx-auto px-4">
					<div class="text-center mb-6 md:mb-12">
						<h2 class="text-3xl lg:text-4xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text">訪客流程總覽</h2>
						<p class="mt-4 text-lg lg:text-xl text-gray-600">從預約到簽退與紀錄，完整且漸進的愉快體驗</p>
					</div>
					<div class="grid grid-cols-1 xl:grid-cols-5 md:grid-cols-2 gap-6">
						<div v-for="(stage, idx) in solutionData.workflow" :key="stage.id" class="relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
							<div class="flex items-center mb-4">
								<div
									:class="[
										'flex items-center justify-center w-10 h-10 rounded-full text-white font-bold mr-3',
										stage.color === 'amber' && 'bg-amber-500',
										stage.color === 'blue' && 'bg-blue-500',
										stage.color === 'emerald' && 'bg-emerald-500',
										stage.color === 'purple' && 'bg-purple-500',
										stage.color === 'indigo' && 'bg-indigo-500'
									]"
								>
									{{ idx + 1 }}
								</div>
								<h3 class="text-lg md:text-xl font-bold text-gray-900">{{ stage.title }}</h3>
							</div>
							<ul class="space-y-2">
								<li v-for="step in stage.steps" :key="step" class="flex items-start text-gray-700">
									<svg class="w-5 h-5 text-gray-400 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-7.364 7.364a1 1 0 01-1.414 0L3.293 9.536a1 1 0 111.414-1.414l3.222 3.222 6.657-6.657a1 1 0 011.414 0z"
											clip-rule="evenodd"
										/>
									</svg>
									<span class="text-sm md:text-base">{{ step }}</span>
								</li>
							</ul>
							<svg
								v-if="idx < solutionData.workflow.length - 1"
								class="hidden xl:block absolute -right-6 top-1/2 -translate-y-1/2 w-8 h-8 text-indigo-300"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path d="M13.5 5.5l6 6-6 6M19.5 11.5H4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
							</svg>
						</div>
					</div>
				</div>
			</section>
			<!-- Section: 方案特點與產品展示（共用模組） -->
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

const slug = "visitor-management-system";

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
