<template>
	<article
		ref="seriesSwitcherRef"
		style="opacity: 0"
		class="relative w-full aspect-video md:w-2/3 md:aspect-square md:absolute md:top-0 md:right-0 md:translate-x-1/3 md:-translate-y-1/3 z-20"
		:class="visibilityClass"
	>
		<!-- 互動UI -->
		<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-10">
			<div
				v-for="series in allSeries"
				:key="series.to"
				@click="navigate(series.to)"
				class="text-[24px] lg:text-[28px] px-6 lg:px-8 py-2 rounded-md transition-all duration-300 cursor-pointer"
				:class="isActive(series.to) ? 'bg-primary text-white shadow-lg' : 'text-primary hover:shadow-lg hover:bg-primary hover:text-white'"
			>
				{{ series.label }}
			</div>
		</div>

		<!-- SVG 背景 -->
		<svg viewBox="0 0 800 800" class="circles" ref="svgRef">
			<circle cx="400" cy="400" r="200" class="circle-inline" />
			<circle cx="400" cy="400" r="400" class="circle-outline" />
		</svg>
	</article>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useScrollAnimation } from "~/composables/useScrollAnimation";

const route = useRoute();
const router = useRouter();
const { gsap } = useScrollAnimation();

const seriesSwitcherRef = ref(null);
const svgRef = ref(null);
let svgTimeline;

// New reactive state for screen size
const isLargeScreen = ref(true);

const visibilityClass = computed(() => {
	return isLargeScreen.value ? "" : "hide-component";
});

const allSeries = ref([
	{ label: "品牌首頁", to: "/" },
	{ label: "可視對講", to: "/products/video-intercom" },
	{ label: "門禁系統", to: "/products/access-control" },
	{ label: "影像監控", to: "/products/surveillance-monitoring" },
	{ label: "安全防護", to: "/products/security-solutions" },
	{ label: "其他設備", to: "/products/devices-accessories" }
]);

const isActive = (path) => {
	return route.path.toLowerCase() === path.toLowerCase();
};

const navigate = (path) => {
	if (!isActive(path)) {
		router.push(path);
	}
};

let checkScreenSize = null;

onMounted(async () => {
	const { initScrollPlugins } = useScrollAnimation();
	await initScrollPlugins();

	// New logic for responsive visibility
	checkScreenSize = () => {
		isLargeScreen.value = window.innerWidth >= 1024; // lg breakpoint
	};
	checkScreenSize();
	window.addEventListener("resize", checkScreenSize);

	if (seriesSwitcherRef.value) {
		gsap.to(seriesSwitcherRef.value, {
			opacity: 1,
			duration: 1.5,
			ease: "power3.out",
			delay: 0.5 // Slightly increased delay to ensure visibility after page transition
		});
	}

	if (svgRef.value && gsap) {
		const circles = svgRef.value.querySelectorAll("circle");
		const circle1 = circles[0];
		const circle2 = circles[1];
		svgTimeline = gsap.timeline({ repeat: -1 });
		svgTimeline
			.fromTo(circle1, { attr: { "stroke-dashoffset": 0 } }, { attr: { "stroke-dashoffset": -628 }, duration: 20, ease: "none" })
			.fromTo(circle2, { attr: { "stroke-dashoffset": 0 } }, { attr: { "stroke-dashoffset": 1256 }, duration: 20, ease: "none" }, 0);
	}
});

onUnmounted(() => {
	// Cleanup for screen size checker
	if (checkScreenSize) {
		window.removeEventListener("resize", checkScreenSize);
	}
});
</script>

<style scoped>
.hide-component {
	opacity: 0 !important;
	pointer-events: none;
	position: absolute !important;
	transition: opacity 0.3s ease;
}

.circles {
	width: 100%;
	height: 100%;
	overflow: visible;
}

.circle-inline,
.circle-outline {
	fill: none;
	stroke-width: 2;
}

.circle-inline {
	stroke: #00a8a9;
	stroke-dasharray: 100 50;
}

.circle-outline {
	stroke: #39b3cc;
	stroke-dasharray: 100 50;
}

@media (max-width: 640px) {
	.circle-inline,
	.circle-outline {
		stroke-dasharray: 70 35;
		stroke-width: 1.5;
	}
}
</style>
