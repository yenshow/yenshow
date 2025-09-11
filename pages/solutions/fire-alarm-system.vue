<template>
	<div v-if="solutionData">
		<!-- ================= Hero Section ================= -->
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
			<!-- ================= Section A : 聯動流程 ================= -->
			<section id="workflow" class="py-12 sm:py-24 feature-section opacity-0">
				<div class="container mx-auto px-4">
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
						<!-- left side: Content Display -->
						<div>
							<h2 class="text-center text-3xl lg:text-4xl font-bold text-transparent bg-gradient-to-r from-[#dd1c1c] to-[#770f0f] bg-clip-text mb-8 lg:mb-12">
								火警發生時的聯動流程
							</h2>
							<div class="flex items-center">
								<transition name="fade" mode="out-in">
									<div
										v-if="activeStepData"
										:key="activeStepData.id"
										class="p-8 rounded-xl shadow-lg border-l-4 border-red-500 w-full min-h-[200px] lg:min-h-[240px] flex flex-col justify-center"
									>
										<h3 class="text-2xl lg:text-3xl font-bold mb-3 text-gray-800">{{ activeStepData.title }}</h3>
										<p class="text-lg lg:text-xl text-gray-600">{{ activeStepData.description }}</p>
									</div>
								</transition>
							</div>
						</div>
						<!-- right side: Circular Stepper -->
						<div class="flex justify-center items-center">
							<div class="relative w-[380px] h-[380px] lg:w-[500px] lg:h-[500px]">
								<!-- Dashed circle path -->
								<div
									class="absolute top-1/2 left-1/2 w-[320px] h-[320px] lg:w-[400px] lg:h-[400px] -translate-x-1/2 -translate-y-1/2 border-2 border-dashed border-red-200 rounded-full"
								></div>

								<!-- Arrows on path -->
								<div v-for="i in solutionData.workflow.length" :key="`arrow-${i}`" class="absolute text-red-300" :style="getArrowStyle(i)">
									<svg class="w-4 h-4 lg:w-5 lg:h-5" viewBox="0 0 10 10" fill="currentColor">
										<path d="M0 0L10 5L0 10Z"></path>
									</svg>
								</div>

								<!-- Central Icon -->
								<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-red-700">
									<svg
										class="h-20 w-20 lg:h-24 lg:w-24"
										viewBox="0 0 64 64"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										stroke-width="3"
										stroke="currentColor"
									>
										<path d="M32.0002 10.1333L53.8668 49.3333H10.1335L32.0002 10.1333Z" stroke-linecap="round" stroke-linejoin="round"></path>
										<path d="M32 24.6667L43.4641 44H20.5359L32 24.6667Z" stroke-linecap="round" stroke-linejoin="round"></path>
									</svg>
									<span class="mt-2 font-bold text-xl lg:text-2xl">聯動流程</span>
								</div>

								<!-- Step Items -->
								<div v-for="(step, index) in solutionData.workflow" :key="step.id" class="absolute" :style="getStepStyle(index)" @click="activeStep = step.id">
									<div
										class="w-28 h-28 lg:w-32 lg:h-32 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 text-center p-2 shadow-md"
										:class="activeStep === step.id ? 'bg-red-600 scale-110 ring-4 ring-red-100' : 'bg-white hover:bg-red-50 border border-gray-200'"
									>
										<span class="text-2xl lg:text-3xl font-bold" :class="activeStep === step.id ? 'text-white' : 'text-red-600'">{{ step.id }}</span>
										<h5 class="font-semibold text-base leading-tight mt-1" :class="activeStep === step.id ? 'text-red-50' : 'text-gray-600'">
											{{ step.title }}
										</h5>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<!-- ================= Section B : 方案核心組件 ================= -->
			<section id="core-components" class="py-12 sm:py-24 feature-section opacity-0">
				<div class="container mx-auto px-4">
					<div class="text-center mb-12">
						<h2 class="text-3xl lg:text-4xl font-bold text-transparent bg-gradient-to-r from-[#dd1c1c] to-[#770f0f] bg-clip-text mb-4">方案核心組件</h2>
						<p class="text-lg lg:text-xl text-gray-600">三大設備協同，完成即時火災預警與告警</p>
					</div>

					<div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
						<div
							v-for="intro in solutionData.introduction"
							:key="intro.id"
							class="flex flex-col items-center text-center p-6 rounded-xl shadow-lg border border-b-4 border-b-red-600 border-r-2 border-r-red-600"
						>
							<NuxtImg
								:src="intro.icon"
								:alt="intro.title"
								class="w-[150px] lg:w-[200px] aspect-square object-contain mb-4"
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
			</section>

			<!-- ================= Section C : 產品特色 (Feature Blocks) ================= -->
			<section class="bg-gray-50 space-y-12 py-12 md:py-24 text-gray-800">
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
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useSolutionPage } from "~/composables/useSolutionPage";
import SolutionHero from "~/components/solutions/SolutionHero.vue";
import FeatureBlock from "~/components/solutions/FeatureBlock.vue";

// ==============================
// Page-specific Logic
// ==============================
const slug = "fire-alarm-system";

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

// ==============================
// Workflow Stepper State
// ==============================
const activeStep = ref(1);

const activeStepData = computed(() => {
	if (!solutionData.value || !solutionData.value.workflow) {
		return null;
	}
	return solutionData.value.workflow.find((step) => step.id === activeStep.value);
});

// ==============================
// Responsive Circular Layout Logic
// ==============================

// --- Reactive state for screen size ---
const isLargeScreen = ref(false);

// --- Centralized dimensions based on screen size ---
const dimensions = computed(() => {
	if (isLargeScreen.value) {
		return {
			radius: 200,
			containerSize: 500,
			itemSize: 128, // Corresponds to lg:w-32, h-32
			arrowSize: 20 // Corresponds to lg:w-5, h-5
		};
	}
	return {
		radius: 160,
		containerSize: 380,
		itemSize: 112, // Corresponds to w-28, h-28
		arrowSize: 16 // Corresponds to w-4, h-4
	};
});

// --- Methods to calculate element positions ---
const getStepStyle = (index) => {
	if (!solutionData.value || !solutionData.value.workflow) return {};

	const numSteps = solutionData.value.workflow.length;
	const angle = ((2 * Math.PI) / numSteps) * index - Math.PI / 2; // Start from top (-90deg)
	const { radius, containerSize, itemSize } = dimensions.value;

	const x = containerSize / 2 + radius * Math.cos(angle);
	const y = containerSize / 2 + radius * Math.sin(angle);

	return {
		top: `${y - itemSize / 2}px`,
		left: `${x - itemSize / 2}px`
	};
};

const getArrowStyle = (stepIndex) => {
	if (!solutionData.value || !solutionData.value.workflow) return {};

	const numSteps = solutionData.value.workflow.length;
	const angle = ((2 * Math.PI) / numSteps) * (stepIndex - 0.5) - Math.PI / 2;
	const rotation = (360 / numSteps) * (stepIndex - 0.5);
	const { radius, containerSize, arrowSize } = dimensions.value;

	const x = containerSize / 2 + radius * Math.cos(angle);
	const y = containerSize / 2 + radius * Math.sin(angle);

	return {
		top: `${y - arrowSize / 2}px`,
		left: `${x - arrowSize / 2}px`,
		transform: `rotate(${rotation}deg)`
	};
};

// --- Lifecycle hooks to handle responsive updates ---
const updateScreenSize = () => {
	if (typeof window !== "undefined") {
		isLargeScreen.value = window.matchMedia("(min-width: 1024px)").matches;
	}
};

onMounted(() => {
	fetchAllProducts();
	updateScreenSize();
	window.addEventListener("resize", updateScreenSize);
});

onBeforeUnmount(() => {
	if (typeof window !== "undefined") {
		window.removeEventListener("resize", updateScreenSize);
	}
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
	transform: translateY(10px);
}
</style>
