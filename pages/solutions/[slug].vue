<template>
	<div v-if="solutionData">
		<!-- Section 1: Hero -->
		<section class="relative bg-gradient-to-br from-blue-900/95 via-teal-800/90 to-emerald-900/95 overflow-hidden">
			<!-- 背景裝飾元素 -->
			<div class="container mx-auto grid grid-cols-1 items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24 relative z-10">
				<div class="relative py-12 lg:py-24 text-center">
					<!-- Prev Solution Link -->
					<NuxtLink :to="`/solutions/${prevSolution.slug}`" class="absolute left-0 top-0 z-20 group hero-anim-prev">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="280"
							height="150"
							fill="currentColor"
							viewBox="0 0 280 150"
							class="w-[180px] h-auto lg:w-[280px] text-white opacity-20 hover:opacity-40 rotate-[-30deg] transition-all duration-300 ease-in-out"
						>
							<path
								fill="currentColor"
								d="M150 16.18c0-7.433-7.823-12.268-14.472-8.944l-130 65A10 10 0 0 0 0 81.18v52.64c0 7.433 7.823 12.268 14.472 8.944L150 75V16.18Z"
							/>
							<path
								fill="currentColor"
								d="M130 16.18c0-7.433 7.823-12.268 14.472-8.944l130 65A10 10 0 0 1 280 81.18v52.64c0 7.433-7.823 12.268-14.472 8.944L130 75V16.18Z"
							/>
						</svg>
						<p class="absolute top-[25%] left-[30%] rotate-[-30deg] text-[16px] lg:text-[21px] font-bold text-white">
							{{ prevSolution.shortTitle }}
						</p>
					</NuxtLink>

					<h1 class="font-bold uppercase text-cyan-300 drop-shadow-lg hero-anim-h1">智慧方案</h1>
					<h2 class="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl hero-anim-h2">{{ solutionData.title }}</h2>
					<p class="mt-6 text-lg md:text-xl lg:text-2xl leading-8 text-white/90 hero-anim-p">{{ solutionData.subtitle }}</p>

					<!-- Quick Navigation -->
					<div class="my-10 flex flex-wrap items-center justify-center gap-4 hero-anim-nav">
						<a
							v-for="feature in featuresData"
							:key="feature.id"
							:href="`#${feature.id}`"
							:class="getFeatureTagClass(feature.color)"
							@click.prevent="scrollToFeature(feature.id)"
						>
							{{ feature.title }}
						</a>
					</div>

					<!-- Next Solution Link -->
					<NuxtLink :to="`/solutions/${nextSolution.slug}`" class="absolute right-0 bottom-0 z-20 group hero-anim-next">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="280"
							height="150"
							fill="currentColor"
							viewBox="0 0 280 150"
							class="w-[180px] h-auto lg:w-[280px] text-white opacity-20 hover:opacity-40 rotate-[150deg] transition-all duration-300 ease-in-out"
						>
							<path
								fill="currentColor"
								d="M150 16.18c0-7.433-7.823-12.268-14.472-8.944l-130 65A10 10 0 0 0 0 81.18v52.64c0 7.433 7.823 12.268 14.472 8.944L150 75V16.18Z"
							/>
							<path
								fill="currentColor"
								d="M130 16.18c0-7.433 7.823-12.268 14.472-8.944l130 65A10 10 0 0 1 280 81.18v52.64c0 7.433-7.823 12.268-14.472 8.944L130 75V16.18Z"
							/>
						</svg>
						<p class="absolute bottom-[25%] right-[30%] rotate-[-30deg] text-[16px] lg:text-[21px] font-bold text-white">
							{{ nextSolution.shortTitle }}
						</p>
					</NuxtLink>
				</div>
				<div class="flex items-center justify-center">
					<NuxtImg
						:src="solutionData.heroImage"
						:alt="solutionData.title"
						class="max-h-[60vh] w-auto rounded-lg object-contain shadow-2xl hero-anim-img"
						format="webp"
						loading="eager"
						fetchpriority="high"
					/>
				</div>
			</div>
		</section>
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
import { ref, onMounted, nextTick, computed } from "vue";
import { useRoute } from "vue-router";
import { useHead } from "#app";
import FeatureBlock from "~/components/solutions/FeatureBlock.vue";
import { solutions } from "~/data/solutions.js";
import { useScrollAnimation } from "~/composables/useScrollAnimation";
import { useSolution } from "~/composables/useSolution.js";

const { initScrollPlugins, createElementEntrance, gsap, isMobile } = useScrollAnimation();

const scrollToFeature = (featureId) => {
	const element = document.getElementById(featureId);
	if (element && gsap) {
		// 使用 GSAP 的 ScrollToPlugin 實現平滑滾動
		gsap.to(window, {
			duration: 1, // 動畫時間 1 秒
			ease: "power2.inOut", // 緩動效果
			scrollTo: {
				y: element, // 滾動到目標元素
				offsetY: isMobile.value ? 80 : 100 // 考慮到 Header 的高度，給予一個偏移量
			}
		});
	} else if (element) {
		// 如果 GSAP 無法使用，則退回原生的方法
		element.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	}
};

const getFeatureTagClass = (color) => {
	const base =
		"transform inline-block rounded-lg border px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:text-white hover:shadow-lg";
	const colorMap = {
		orange: "border-orange-400/80 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:shadow-orange-500/30",
		green: "border-green-400/80 bg-green-50 text-green-600 hover:bg-green-500 hover:shadow-green-500/30",
		blue: "border-blue-400/80 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:shadow-blue-500/30",
		purple: "border-purple-400/80 bg-purple-50 text-purple-600 hover:bg-purple-500 hover:shadow-purple-500/30",
		sky: "border-sky-400/80 bg-sky-50 text-sky-600 hover:bg-sky-500 hover:shadow-sky-500/30",
		emerald: "border-emerald-400/80 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-500/30",
		amber: "border-amber-400/80 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:shadow-amber-500/30",
		indigo: "border-indigo-400/80 bg-indigo-50 text-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/30",
		default: "border-gray-400/80 bg-gray-50 text-gray-600 hover:bg-gray-500 hover:shadow-gray-500/30"
	};
	return `${base} ${colorMap[color] || colorMap.default}`;
};

const route = useRoute();
const slug = route.params.slug;
const solutionData = solutions[slug];

// 使用新的 Composable
const { isLoadingProducts, activeFilters, filteredProductsByFeature, fetchAllProducts, handleFilterSelection } = useSolution(solutionData);

// 從 solutionData 獲取功能區塊資料
const featuresData = ref(solutionData.features);

// 找到上一個和下一個解決方案
const solutionSlugs = Object.keys(solutions);
const currentIndex = solutionSlugs.indexOf(slug);
const getSolutionByOffset = (offset) => {
	const targetIndex = (currentIndex + offset + solutionSlugs.length) % solutionSlugs.length;
	const targetSlug = solutionSlugs[targetIndex];
	return {
		...solutions[targetSlug],
		slug: targetSlug
	};
};
const prevSolution = getSolutionByOffset(-1);
const nextSolution = getSolutionByOffset(1);

// 設定網頁標題和描述
useHead({
	title: `${solutionData.meta.title}`,
	meta: [{ name: "description", content: solutionData.meta.description }]
});

// Animation setup
const animateHeroSection = () => {
	if (!gsap) return;

	const tl = gsap.timeline({
		defaults: { duration: 0.9, ease: "power2.out" }
	});

	tl.from(".hero-anim-h1", { opacity: 0, y: 20, delay: 0.2 })
		.from(".hero-anim-h2", { opacity: 0, y: 30 }, "-=0.7")
		.from(".hero-anim-p", { opacity: 0, y: 30 }, "-=0.7")
		.from(".hero-anim-nav", { opacity: 0, y: 20, stagger: 0.1 }, "-=0.6")
		.from(".hero-anim-img", { opacity: 0, scale: 0.9, duration: 1.2 }, "-=0.8")
		.from(".hero-anim-prev", { opacity: 0, x: -50 }, "-=1")
		.from(".hero-anim-next", { opacity: 0, x: 50 }, "-=1");
};

const setupScrollAnimations = () => {
	if (!createElementEntrance) return;

	const featureSections = document.querySelectorAll(".feature-section");
	if (featureSections.length) {
		featureSections.forEach((section) => {
			createElementEntrance({
				elements: section,
				trigger: section,
				fromY: isMobile.value ? 40 : 80,
				duration: 1,
				delay: 0,
				start: "top 85%",
				toggleActions: "play none none none"
			});
		});
	}
};

onMounted(async () => {
	// 先初始化 GSAP 插件
	await initScrollPlugins();

	// 等待 DOM 更新後，立即開始 Hero Section 的動畫，提供即時反饋
	nextTick(() => {
		animateHeroSection();
	});

	// 獲取產品資料
	await fetchAllProducts();

	// 當產品資料載入完成且 DOM 更新後，再設定滾動動畫
	nextTick(() => {
		setupScrollAnimations();
	});
});
</script>
