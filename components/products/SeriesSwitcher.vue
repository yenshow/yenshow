<template>
	<article
		ref="seriesSwitcherRef"
		style="opacity: 0"
		class="relative w-full aspect-video md:w-2/3 md:aspect-square md:absolute md:top-0 md:right-0 md:translate-x-1/3 md:-translate-y-1/3 z-20"
	>
		<!-- 互動UI -->
		<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-10">
			<!-- Up Button with Hint -->
			<div class="flex flex-col items-center group min-h-[112px] justify-end">
				<span
					v-if="previousSeriesLabel"
					class="text-gray-500 text-sm md:text-base lg:text-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300 mb-1"
				>
					{{ $t(previousSeriesLabel) }}
				</span>
				<button @click="changeSeries(-1)" class="p-2 rounded-full hover:bg-gray-200/50 transition-colors" aria-label="Previous Series">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16">
						<path fill="currentColor" d="m7 15l5-5l5 5z" />
					</svg>
				</button>
			</div>

			<!-- Series Display -->
			<div class="h-10 md:h-12 lg:h-16 overflow-hidden relative" @click="navigate" style="cursor: pointer">
				<div ref="seriesContainerRef" class="flex flex-col">
					<div
						v-for="link in availableSeries"
						:key="link.to"
						class="h-10 md:h-12 lg:h-16 text-lg md:text-2xl lg:text-3xl flex items-center justify-center px-4 md:px-6 lg:px-8 py-2 rounded-md text-primary transition-all duration-300 hover:shadow-lg hover:bg-primary hover:text-white"
					>
						{{ $t(link.label) }}
					</div>
				</div>
			</div>

			<!-- Down Button with Hint -->
			<div class="flex flex-col items-center group min-h-[112px] justify-start">
				<button @click="changeSeries(1)" class="p-2 rounded-full hover:bg-gray-200/50 transition-colors" aria-label="Next Series">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16">
						<path fill="currentColor" d="m7 9l5 5l5-5z" />
					</svg>
				</button>
				<span
					v-if="nextSeriesLabel"
					class="text-gray-500 text-sm md:text-base lg:text-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300 mt-1"
				>
					{{ $t(nextSeriesLabel) }}
				</span>
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
const seriesContainerRef = ref(null);
const svgRef = ref(null);
let svgTimeline;

const allSeries = ref([
	{ label: "Video Intercom", to: "/products/video-intercom" },
	{ label: "Access Control", to: "/products/access-control" },
	{ label: "Surveillance & Monitoring", to: "/products/surveillance-monitoring" },
	{ label: "Security Solutions", to: "/products/security-solutions" },
	{ label: "Devices & Accessories", to: "/products/devices-accessories" }
]);

const availableSeries = computed(() => allSeries.value.filter((s) => s.to.toLowerCase() !== route.path.toLowerCase()));
const currentIndex = ref(0);
const itemHeight = ref(48); // Default height, will be updated dynamically

const previousSeriesLabel = computed(() => {
	if (availableSeries.value.length < 2) return "";
	const total = availableSeries.value.length;
	const prevIndex = (currentIndex.value - 1 + total) % total;
	return availableSeries.value[prevIndex].label;
});

const nextSeriesLabel = computed(() => {
	if (availableSeries.value.length < 2) return "";
	const total = availableSeries.value.length;
	const nextIndex = (currentIndex.value + 1) % total;
	return availableSeries.value[nextIndex].label;
});

const changeSeries = (direction) => {
	const newIndex = currentIndex.value + direction;
	const total = availableSeries.value.length;
	currentIndex.value = (newIndex + total) % total;

	gsap.to(seriesContainerRef.value, {
		y: -currentIndex.value * itemHeight.value,
		duration: 0.5,
		ease: "power2.inOut"
	});

	if (svgTimeline) {
		gsap.to(svgTimeline, {
			timeScale: 4,
			duration: 0.3,
			onComplete: () => {
				gsap.to(svgTimeline, { timeScale: 1, duration: 1, ease: "power2.out" });
			}
		});
	}
};

const navigate = () => {
	if (availableSeries.value.length > 0) {
		const targetRoute = availableSeries.value[currentIndex.value].to;
		router.push(targetRoute);
	}
};

let updateItemHeight;

onMounted(async () => {
	const { initScrollPlugins } = useScrollAnimation();
	await initScrollPlugins();

	// RWD setup for itemHeight
	updateItemHeight = () => {
		if (window.matchMedia("(min-width: 1024px)").matches) {
			itemHeight.value = 64; // For lg: h-16
		} else if (window.matchMedia("(min-width: 768px)").matches) {
			itemHeight.value = 48; // For md: h-12
		} else {
			itemHeight.value = 40; // For sm: h-10
		}
	};

	updateItemHeight();
	window.addEventListener("resize", updateItemHeight);

	if (seriesSwitcherRef.value) {
		gsap.to(seriesSwitcherRef.value, {
			opacity: 1,
			duration: 1.5,
			ease: "power3.out",
			delay: 0.2
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

	if (seriesContainerRef.value) {
		gsap.set(seriesContainerRef.value, { y: 0 });
	}
});

onUnmounted(() => {
	if (updateItemHeight) {
		window.removeEventListener("resize", updateItemHeight);
	}
});
</script>

<style scoped>
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
