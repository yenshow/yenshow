<template>
	<div>
		<section ref="caseStudiesIntroSection" id="case-studies-intro" class="bg-secondary/90 my-[64px] sm:my-[128px] md:my-[256px] lg:my-[512px]">
			<article class="container min-h-screen flex flex-col justify-center items-center gap-[24px] md:gap-[48px] py-[24px] md:py-[48px]">
				<!-- 標題與引言 -->
				<div class="text-center">
					<h2
						ref="headline"
						class="text-[24px] sm:text-[28px] md:text-[36px] lg:text-[64px] xl:text-[72px] 2xl:text-[80px] font-bold mb-4 text-transparent bg-gradient-to-r from-green-600 to-green-300 bg-clip-text"
					>
						{{ $t("home.case_studies.headline") }}
					</h2>
					<p
						ref="introParagraph1"
						class="text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px] text-primary/80 max-w-[80%] mx-auto"
					>
						{{ $t("home.case_studies.intro") }}
					</p>
				</div>

				<!-- 關鍵數據指標 -->
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
					<!-- 卡片一：客戶口碑 -->
					<div ref="statCard1" class="bg-white/80 px-4 py-6 md:px-6 md:py-8 rounded-xl shadow-lg flex flex-col">
						<h3 class="text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px] font-semibold text-primary/80 mb-4 text-center">
							{{ $t("home.case_studies.testimonials.title") }}
						</h3>
						<div ref="testimonialContainer" class="testimonial-scroll-container flex-grow overflow-hidden relative min-h-[150px] md:min-h-[180px]">
							<div ref="testimonialList" class="testimonial-list absolute top-0 left-0 w-full">
								<div v-for="(testimonial, index) in allTestimonials" :key="index" class="testimonial-item py-2 px-1">
									<p class="text-sm md:text-base text-primary/70 italic">"{{ testimonial.quote }}"</p>
									<p class="text-xs md:text-sm text-primary/50 text-right mt-1">- {{ testimonial.author }}</p>
								</div>
							</div>
						</div>
					</div>

					<!-- 卡片二：熱銷產品趨勢 -->
					<div ref="statCard2" class="bg-white/80 px-4 py-6 md:px-6 md:py-8 rounded-xl shadow-lg">
						<h3 class="text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px] font-semibold text-primary/80 mb-6 text-center">
							{{ $t("home.case_studies.charts.sales.title") }}
						</h3>
						<div class="flex items-center justify-center">
							<svg ref="barChart" class="w-full h-48 md:h-56" viewBox="0 0 280 180"></svg>
						</div>
					</div>

					<!-- 卡片三：多元客戶群體 -->
					<div ref="statCard3" class="bg-white/80 px-4 py-6 md:px-6 md:py-8 rounded-xl shadow-lg flex flex-col">
						<h3 class="text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px] font-semibold text-primary/80 mb-6 text-center">
							{{ $t("home.case_studies.charts.customer_base.title") }}
						</h3>
						<div class="flex items-center justify-center relative">
							<svg ref="pieChart" class="w-48 h-48 md:w-56 md:h-56" viewBox="0 0 200 200"></svg>
							<div ref="pieChartLegend" class="text-xs sm:text-sm space-y-1 ml-4">
								<!-- Legend will be populated by script -->
							</div>
						</div>
					</div>
				</div>

				<!-- 行動呼籲 -->
				<div ref="ctaButtonContainer" class="w-fit">
					<ButtonCTA to="/success-stories" :label="$t('home.case_studies.cta')" />
				</div>
			</article>
		</section>
	</div>
</template>

<script setup>
import { ref, onMounted, inject, computed } from "vue";
import ButtonCTA from "@/components/common/Button-CTA.vue";
import gsap from "gsap";
import { useI18n } from "vue-i18n";

const scrollAnimation = inject("scrollAnimation");
const { t, messages, locale } = useI18n();

const caseStudiesIntroSection = ref(null);
const headline = ref(null);
const introParagraph1 = ref(null);

const statCard1 = ref(null);
const statCard2 = ref(null);
const statCard3 = ref(null);

const testimonialContainer = ref(null);
const testimonialList = ref(null);

const barChart = ref(null);
const pieChart = ref(null);
const pieChartLegend = ref(null);
const ctaButtonContainer = ref(null);

// --- Testimonial Data (use i18n keys by index to always resolve to plain strings) ---
const baseTestimonials = computed(() => {
	const arr = messages.value?.[locale.value]?.home?.case_studies?.testimonials?.quotes;
	if (!Array.isArray(arr)) return [];
	return arr.map((_, index) => ({
		quote: t(`home.case_studies.testimonials.quotes.${index}.quote`),
		author: t(`home.case_studies.testimonials.quotes.${index}.author`)
	}));
});

const allTestimonials = computed(() => {
	if (baseTestimonials.value.length === 0) return [];
	// Duplicate content for seamless scrolling effect
	return [...baseTestimonials.value, ...baseTestimonials.value];
});
// --- End Testimonial Data ---

// --- Chart Data (from i18n) ---
const productSalesData = computed(() => [
	{ category: t("home.case_studies.charts.sales.categories.surveillance"), sales: 220, unit: t("home.case_studies.charts.sales.unit"), color: "#10B981" },
	{ category: t("home.case_studies.charts.sales.categories.access_control"), sales: 180, unit: t("home.case_studies.charts.sales.unit"), color: "#3B82F6" },
	{ category: t("home.case_studies.charts.sales.categories.intercom"), sales: 150, unit: t("home.case_studies.charts.sales.unit"), color: "#F59E0B" },
	{ category: t("home.case_studies.charts.sales.categories.security"), sales: 120, unit: t("home.case_studies.charts.sales.unit"), color: "#EF4444" },
	{ category: t("home.case_studies.charts.sales.categories.accessories"), sales: 90, unit: t("home.case_studies.charts.sales.unit"), color: "#6B7280" }
]);

const pieChartData = computed(() => [
	{ label: t("home.case_studies.charts.customer_base.segments.tech"), value: 40, color: "#34D399" },
	{ label: t("home.case_studies.charts.customer_base.segments.manufacturing"), value: 25, color: "#60A5FA" },
	{ label: t("home.case_studies.charts.customer_base.segments.education"), value: 20, color: "#FBBF24" },
	{ label: t("home.case_studies.charts.customer_base.segments.other"), value: 15, color: "#A78BFA" }
]);
// --- End Chart Data ---

const animateTestimonials = () => {
	if (!testimonialList.value || !testimonialContainer.value || allTestimonials.value.length === 0) return;

	if (testimonialList.value.scrollHeight === 0) {
		setTimeout(animateTestimonials, 100);
		return;
	}

	gsap.to(testimonialList.value, {
		y: () => `-${testimonialList.value.scrollHeight / 2}px`,
		duration: 20,
		ease: "none",
		repeat: -1,
		scrollTrigger: {
			trigger: statCard1.value,
			start: "top 80%",
			toggleActions: "play pause resume pause"
		}
	});
};

const createBarChart = () => {
	if (!barChart.value) return;
	const svg = barChart.value;
	svg.innerHTML = "";
	const dataToUse = productSalesData.value;

	const svgWidth = 280;
	const svgHeight = 180;
	const barPadding = 15;
	const chartPadding = { top: 20, right: 10, bottom: 40, left: 30 };
	const chartWidth = svgWidth - chartPadding.left - chartPadding.right;
	const chartHeight = svgHeight - chartPadding.top - chartPadding.bottom;

	const barWidth = (chartWidth - (dataToUse.length - 1) * barPadding) / dataToUse.length;
	const maxValue = Math.max(...dataToUse.map((d) => d.sales), 0) * 1.2;

	dataToUse.forEach((d, i) => {
		const barHeight = (d.sales / maxValue) * chartHeight;
		const x = chartPadding.left + i * (barWidth + barPadding);
		const y = chartPadding.top + chartHeight - barHeight;

		const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		gsap.set(rect, {
			attr: { x, y: chartPadding.top + chartHeight, width: barWidth, height: 0, fill: d.color, rx: 3, ry: 3 },
			opacity: 0.8
		});
		svg.appendChild(rect);
		gsap.to(rect, {
			attr: { height: barHeight, y },
			opacity: 1,
			duration: 1.5,
			ease: "elastic.out(1, 0.6)",
			delay: i * 0.15 + 0.5 + 0.8,
			scrollTrigger: { trigger: statCard2.value, start: "top 80%" }
		});

		const categoryLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
		const labelX = x + barWidth / 2;
		const labelY = chartPadding.top + chartHeight + 25; // 增加下方間距以配合旋轉
		gsap.set(categoryLabel, {
			attr: {
				x: labelX,
				y: labelY,
				transform: `rotate(-30 ${labelX} ${labelY})`,
				"text-anchor": "middle",
				fill: "#4B5563",
				"font-size": "9px"
			},
			textContent: d.category,
			opacity: 0
		});
		svg.appendChild(categoryLabel);
		gsap.to(categoryLabel, { opacity: 1, delay: i * 0.15 + 0.7 + 0.8, scrollTrigger: { trigger: statCard2.value, start: "top 80%" } });

		const valueLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
		gsap.set(valueLabel, {
			attr: {
				x: x + barWidth / 2,
				y: y - 5,
				"text-anchor": "middle",
				fill: d.color,
				"font-size": "10px",
				"font-weight": "bold"
			},
			textContent: `${d.sales}${d.unit ? " " + d.unit : ""}`,
			opacity: 0
		});
		svg.appendChild(valueLabel);
		gsap.to(valueLabel, { opacity: 1, delay: i * 0.15 + 1.2 + 0.8, scrollTrigger: { trigger: statCard2.value, start: "top 80%" } });
	});
};

const getPathDForPieSlice = (cx, cy, r, startAngleRad, sweepAngleRad) => {
	if (sweepAngleRad <= 0.001) return `M ${cx},${cy}`; // Effectively invisible or a point
	const almostFullCircle = Math.PI * 2 - 0.00001;
	if (sweepAngleRad >= almostFullCircle) sweepAngleRad = almostFullCircle;

	const endAngleRad = startAngleRad + sweepAngleRad;

	const x1 = cx + r * Math.cos(startAngleRad);
	const y1 = cy + r * Math.sin(startAngleRad);
	const x2 = cx + r * Math.cos(endAngleRad);
	const y2 = cy + r * Math.sin(endAngleRad);

	const largeArcFlag = sweepAngleRad > Math.PI ? 1 : 0;

	return [`M ${cx},${cy}`, `L ${x1},${y1}`, `A ${r},${r} 0 ${largeArcFlag} 1 ${x2},${y2}`, "Z"].join(" ");
};

const createPieChart = () => {
	if (!pieChart.value || !pieChartLegend.value) return;
	const svg = pieChart.value;
	const legendContainer = pieChartLegend.value;
	legendContainer.innerHTML = ""; // Clear previous legend

	const radius = 80;
	const centerX = 100;
	const centerY = 100;
	let cumulativeAngle = -Math.PI / 2; // Start from 12 o'clock

	const totalValue = pieChartData.value.reduce((sum, d) => sum + d.value, 0);

	pieChartData.value.forEach((slice, index) => {
		const sliceTrueAngleSpan = (slice.value / totalValue) * 2 * Math.PI;

		const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		gsap.set(path, {
			attr: { fill: slice.color, d: getPathDForPieSlice(centerX, centerY, radius, cumulativeAngle, 0) }, // Initial zero sweep
			opacity: 0 // Start hidden then fade in on animation start
		});
		svg.appendChild(path);

		const animProxy = { currentSweep: 0 };
		const currentSliceStartAngle = cumulativeAngle; // Capture start angle for this slice

		gsap.to(animProxy, {
			currentSweep: sliceTrueAngleSpan,
			duration: 0.7, // Duration for one slice to draw
			ease: "power1.inOut",
			delay: index * 0.2 + 0.5 + 0.8, // Staggered delay + card entry delay
			scrollTrigger: { trigger: statCard3.value, start: "top 80%" },
			onStart: () => {
				gsap.set(path, { opacity: 1 });
			},
			onUpdate: function () {
				const d = getPathDForPieSlice(centerX, centerY, radius, currentSliceStartAngle, animProxy.currentSweep);
				gsap.set(path, { attr: { d } });
			}
		});

		// Legend item
		const legendItem = document.createElement("div");
		legendItem.className = "flex items-center";
		legendItem.innerHTML = `
			<span class="inline-block w-3 h-3 rounded-sm mr-2" style="background-color: ${slice.color};"></span>
			<span>${slice.label} (${slice.value}%)</span>
		`;
		legendContainer.appendChild(legendItem);

		cumulativeAngle += sliceTrueAngleSpan;
	});
};

onMounted(async () => {
	if (scrollAnimation && typeof scrollAnimation.createBasicAnimation === "function") {
		await scrollAnimation.initScrollPlugins();

		const sectionNode = caseStudiesIntroSection.value;

		scrollAnimation.createBasicAnimation({
			elements: sectionNode,
			trigger: sectionNode,
			start: "top 85%",
			toProps: { opacity: 1 },
			duration: 0.5,
			toggleActions: "play none none none"
		});

		[headline.value, introParagraph1.value].forEach((el, index) => {
			if (el) {
				scrollAnimation.createBasicAnimation({
					elements: el,
					trigger: sectionNode,
					start: "top 80%",
					fromProps: { opacity: 0, y: 30 },
					toProps: { opacity: 1, y: 0 },
					duration: 0.8,
					delay: index * 0.15,
					ease: "power3.out",
					toggleActions: "play none none none"
				});
			}
		});

		const cards = [statCard1.value, statCard2.value, statCard3.value];
		cards.forEach((cardEl, index) => {
			if (cardEl) {
				scrollAnimation.createBasicAnimation({
					elements: cardEl,
					trigger: cardEl,
					start: "top 85%",
					fromProps: { opacity: 0, y: 50, scale: 0.95 },
					toProps: { opacity: 1, y: 0, scale: 1 },
					duration: 0.8,
					delay: index * 0.2 + 0.3,
					ease: "power2.out",
					toggleActions: "play none none none"
				});
			}
		});

		createBarChart();
		createPieChart();
		animateTestimonials();

		if (ctaButtonContainer.value) {
			scrollAnimation.createBasicAnimation({
				elements: ctaButtonContainer.value,
				trigger: ctaButtonContainer.value,
				start: "top 90%",
				fromProps: { opacity: 0, y: 20, scale: 0.9 },
				toProps: { opacity: 1, y: 0, scale: 1 },
				duration: 0.8,
				delay: 0.8,
				ease: "elastic.out(1, 0.75)",
				toggleActions: "play none none none"
			});
		}
	} else {
		if (caseStudiesIntroSection.value) caseStudiesIntroSection.value.style.opacity = 1;
	}
});
</script>

<style scoped>
/* Primary color for texts and icons where needed */
.text-primary {
	color: #059669; /* Tailwind green-600 */
}

/* Button colors (already defined in your previous CSS) */
.bg-primary {
	background-color: #059669;
}
.hover\\:bg-primary-dark:hover {
	background-color: #047857;
}

/* Additional styling for chart elements if needed */
svg text {
	font-family: inherit; /* Inherit font from page */
}
.testimonial-item {
	border-bottom: 1px solid rgba(107, 114, 128, 0.1); /* Tailwind gray-400 with alpha */
	padding-bottom: 0.5rem; /* py-2 in template, this adds to bottom */
	margin-bottom: 0.5rem; /* Space between items */
}
.testimonial-item:last-child {
	border-bottom: none;
	margin-bottom: 0;
}
</style>
