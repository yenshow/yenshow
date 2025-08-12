<template>
	<article
		ref="seriesSwitcherRef"
		style="opacity: 0"
		class="relative w-full aspect-video md:w-2/3 md:aspect-square md:absolute md:top-0 md:right-0 md:translate-x-1/3 md:-translate-y-1/3 z-20"
		:class="visibilityClass"
	>
		<!-- 互動UI -->
		<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-10">
			<template v-for="series in filteredSeries" :key="series.to">
				<div
					@click="navigate(series.to)"
					class="text-[24px] lg:text-[28px] px-6 lg:px-8 py-2 rounded-md transition-all duration-300 cursor-pointer"
					:class="['text-primary hover:shadow-lg hover:bg-primary hover:text-white', series.to === '/' ? 'border border-transparent hover:border-primary' : '']"
				>
					{{ series.label }}
				</div>
				<hr v-if="series.to === '/' && filteredSeries.length > 1" class="w-2/3 border-primary/50 my-1" />
			</template>
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

import { useI18n } from "vue-i18n";
const { t } = useI18n();
// 依目前語系即時計算標籤
const allSeries = computed(() => [
	{ label: t("nav.home"), to: "/" },
	{ label: t("footer.nav.products.links.video_intercom"), to: "/products/video-intercom" },
	{ label: t("footer.nav.products.links.access_control"), to: "/products/access-control" },
	{ label: t("footer.nav.products.links.surveillance_monitoring"), to: "/products/surveillance-monitoring" },
	{ label: t("footer.nav.products.links.security_solutions"), to: "/products/security-solutions" },
	{ label: t("footer.nav.products.links.devices_accessories"), to: "/products/devices-accessories" }
]);

const isActive = (path) => {
	return route.path.toLowerCase() === path.toLowerCase();
};

const filteredSeries = computed(() => {
	return allSeries.value.filter((series) => !isActive(series.to));
});

const localePath = useLocalePath();

const navigate = (path) => {
	if (!isActive(path)) {
		router.push(localePath(path));
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
