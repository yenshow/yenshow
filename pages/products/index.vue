<template>
	<div>
		<!-- Section 1: Vision & Core Strengths -->
		<section class="text-white py-16 md:py-24 flex flex-col justify-center items-center text-center px-4 sm:px-6 space-y-[24px] md:space-y-[48px]">
			<div ref="visionTitleRef" class="opacity-0 space-y-[24px] md:space-y-[48px]">
				<h1 class="text-[28px] sm:text-[36px] md:text-[48px] lg:text-[60px] xl:text-[72px] font-bold">智能科技，重塑體驗</h1>
				<p
					class="text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px] text-sky-200 max-w-4xl"
					style="text-shadow: 0 0 10px rgba(0, 0, 0, 0.8)"
				>
					遠岫科技融合尖端技術與人性化設計，致力於為您的生活與工作空間，注入前所未有的便捷、安全與高效，提升全方位智能體驗。
				</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl">
				<div
					v-for="(strength, index) in coreStrengths"
					:key="index"
					:ref="(el) => (coreStrengthRefs[index] = el)"
					class="bg-sky-700/40 backdrop-blur-sm p-4 rounded-lg shadow-lg opacity-0 flex flex-col items-center"
				>
					<div class="flex justify-center">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" :d="strength.icon" />
						</svg>
					</div>
					<h3 class="text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] font-semibold mb-4 text-sky-300">{{ strength.title }}</h3>
					<p class="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] text-secondary">{{ strength.description }}</p>
				</div>
			</div>

			<div ref="galleryIntroTextRef" class="opacity-0">
				<p class="text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] text-white max-w-3xl" style="text-shadow: 0 0 10px rgba(0, 0, 0, 0.8)">
					準備好探索遠岫科技如何將這些核心價值融入每一款產品解決方案了嗎？讓我們一同啟程，體驗智能科技如何為您打造更卓越的未來。
				</p>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-10 w-10 text-secondary mx-auto mt-8 animate-bounce"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
				</svg>
			</div>
		</section>

		<!-- Section 2: Product Gallery -->
		<div class="product-gallery-container" ref="galleryContainerToPinRef">
			<header class="text-center pt-4 md:pt-8 space-y-[12px] md:space-y-[24px]">
				<h1 class="text-[24px] sm:text-[32px] md:text-[36px] lg:text-[40px] xl:text-[48px] font-bold">產品解決方案</h1>
			</header>

			<div class="gallery-scroll-container" ref="scrollContainerRef">
				<!-- Desktop: Horizontal Scroll Sections -->
				<template v-if="!isMobileMode">
					<section v-for="(solution, index) in solutions" :key="solution.id" class="solution-section" :ref="(el) => (solutionElements[index] = el)">
						<div class="solution-content">
							<div class="image-container relative group">
								<NuxtImg
									:src="solution.image"
									:alt="solution.title"
									format="webp"
									width="1440"
									height="1024"
									quality="80"
									sizes="sm:50vw md:50vw lg:1024px"
									loading="lazy"
									fetchpriority="low"
									class="solution-image cursor-pointer transition-transform duration-300 ease-in-out"
									tabindex="0"
									role="button"
									:aria-label="`查看 ${solution.title} 詳情`"
									@click="navigateToSolution(solution)"
									@keydown.enter="navigateToSolution(solution)"
									@keydown.space.prevent="navigateToSolution(solution)"
								/>
								<button
									@click="navigateToSolution(solution)"
									class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-sky-600/80 hover:bg-sky-500/90 text-white px-4 py-2 rounded-lg text-[21px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out shadow-lg backdrop-blur-sm"
									aria-label="查看方案詳情"
								>
									查看詳情
								</button>
							</div>
						</div>
					</section>
				</template>
				<!-- Mobile: Single Active Section with Transition -->
				<template v-else-if="isMobileMode && currentSolution">
					<transition name="solution-mobile-fade" mode="out-in">
						<section :key="currentSolution.id" class="solution-section is-mobile-active-section">
							<div class="solution-content-mobile">
								<div class="image-container mb-4">
									<NuxtImg
										:src="currentSolution.image"
										:alt="currentSolution.title"
										format="webp"
										width="1440"
										height="1024"
										quality="80"
										sizes="500px"
										loading="lazy"
										fetchpriority="low"
										class="solution-image cursor-pointer"
										@click="navigateToSolution(currentSolution)"
										tabindex="0"
										role="button"
										:aria-label="`查看 ${currentSolution.title} 詳情`"
									/>
								</div>
							</div>
						</section>
					</transition>
				</template>
			</div>

			<div class="gallery-navigation-sides" ref="galleryNavSidesRef">
				<nav class="gallery-navigation-left text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px]" ref="galleryNavLeftRef">
					<button
						v-for="(solution, index) in solutions.filter((_, i) => i < Math.ceil(solutions.length / 2))"
						:key="`nav-left-${solution.id}`"
						@click="navigateToSection(solutions.findIndex((s) => s.id === solution.id))"
						:class="{ active: currentSectionIndex === solutions.findIndex((s) => s.id === solution.id) }"
					>
						{{ solution.shortTitle || solution.title }}
					</button>
				</nav>
				<nav class="gallery-navigation-right text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px]" ref="galleryNavRightRef">
					<button
						v-for="(solution, index) in solutions.filter((_, i) => i >= Math.ceil(solutions.length / 2))"
						:key="`nav-right-${solution.id}`"
						@click="navigateToSection(solutions.findIndex((s) => s.id === solution.id))"
						:class="{ active: currentSectionIndex === solutions.findIndex((s) => s.id === solution.id) }"
					>
						{{ solution.shortTitle || solution.title }}
					</button>
				</nav>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from "vue";
import { useScrollAnimation } from "@/composables/useScrollAnimation";
import { useHead } from "#app";
import { solutions as solutionsData } from "~/data/solutions.js";
import { useRouter } from "vue-router";

const router = useRouter();

// Set page title and meta description
useHead({
	title: " - 智慧方案",
	meta: [
		{
			name: "description",
			content: "探索遠岫科技全方位的智能解決方案，從可視對講、門禁管理到影像監控與安全防護，我們致力於為您的生活與工作空間提供創新技術與卓越品質。"
		}
	]
});

const { initScrollPlugins, ScrollTrigger, gsap, cleanupScrollTriggers } = useScrollAnimation();

const visionTitleRef = ref(null);
const coreStrengthRefs = ref([]);
const galleryIntroTextRef = ref(null);

const coreStrengths = ref([
	{
		icon: "M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9",
		title: "卓越品質與創新",
		description: "以最高標準打造每款產品，融合前沿技術，確保卓越性能，引領行業發展。"
	},
	{
		icon: "M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6zM6 6.75A.75.75 0 005.25 7.5v9c0 .414.336.75.75.75H15a.75.75 0 00.75-.75V15a.75.75 0 00-.75-.75H7.5a.75.75 0 01-.75-.75V7.5A.75.75 0 006 6.75z",
		title: "全方位整合方案",
		description: "提供從前端感知到後端管理的一站式服務，實現各系統無縫整合與高效協同。"
	},
	{
		icon: "M3.75 12h16.5m-16.5 0V6.75A2.25 2.25 0 016 4.5h12A2.25 2.25 0 0120.25 6.75V12m-16.5 0v5.25A2.25 2.25 0 006 19.5h12a2.25 2.25 0 002.25-2.25V12M3.75 12H20.25M12 4.5V19.5",
		title: "多樣化場景賦能",
		description: "深入理解行業獨特需求，產品廣泛應用於各類場景，提升智能化水平與運營效率。"
	}
]);

const solutions = ref(
	Object.entries(solutionsData).map(([slug, data]) => ({
		id: slug,
		title: data.title,
		shortTitle: data.shortTitle || data.title,
		image: data.heroImage
	}))
);

const navigateToSolution = (solution) => {
	if (solution && solution.id) {
		router.push(`/solutions/${solution.id}`);
	}
};

const galleryContainerToPinRef = ref(null);
const scrollContainerRef = ref(null);
const solutionElements = ref([]);
const currentSectionIndex = ref(0);
const galleryNavSidesRef = ref(null);
const galleryNavLeftRef = ref(null);
const galleryNavRightRef = ref(null);

// --- Mode Detection ---
const isMobileMode = ref(false);
const currentSolution = computed(() => {
	if (solutions.value.length > 0 && currentSectionIndex.value >= 0 && currentSectionIndex.value < solutions.value.length) {
		return solutions.value[currentSectionIndex.value];
	}
	// 返回 null 或一個默認的 solution 對象，以避免模板在初始時出錯
	return solutions.value.length > 0 ? solutions.value[0] : null;
});

onMounted(async () => {
	await initScrollPlugins();
	await nextTick(); // 確保 DOM 元素已渲染，特別是 v-if/v-else 的內容

	const checkMobileMode = () => {
		const oldMode = isMobileMode.value;
		isMobileMode.value = window.innerWidth <= 768;
		if (oldMode !== isMobileMode.value) {
			// 模式切換時，可能需要重新運行或清理 ScrollTriggers
			ScrollTrigger.value.refresh();
			// 如果從桌面切換到移動，殺掉桌面版的 ST
			if (isMobileMode.value) {
				const desktopST = ScrollTrigger.value.getById("horizontalGalleryScroll");
				if (desktopST) desktopST.kill();
			}
		}
	};
	checkMobileMode();
	window.addEventListener("resize", checkMobileMode);

	// --- Section 1: Vision & Strengths Animation (保持不變) ---
	if (visionTitleRef.value) {
		gsap.from(visionTitleRef.value.children, {
			autoAlpha: 0,
			y: 50,
			duration: 0.8,
			stagger: 0.2,
			ease: "power3.out",
			delay: 0.3
		});
		gsap.to(visionTitleRef.value, { autoAlpha: 1, duration: 0.01, delay: 0.3 });
	}
	coreStrengthRefs.value.forEach((el) => {
		if (el) {
			gsap.from(el, {
				y: 50,
				scale: 0.9
			});
			gsap.to(el, {
				autoAlpha: 1,
				y: 0,
				scale: 1,
				duration: 0.7,
				ease: "power2.out",
				scrollTrigger: {
					trigger: el,
					start: "top 85%",
					toggleActions: "play none none none"
				}
			});
		}
	});
	if (galleryIntroTextRef.value) {
		gsap.from(galleryIntroTextRef.value.children, {
			autoAlpha: 0,
			y: 40,
			duration: 0.7,
			ease: "power2.out",
			stagger: 0.15,
			scrollTrigger: {
				trigger: galleryIntroTextRef.value,
				start: "top 90%",
				toggleActions: "play none none none"
			}
		});
		gsap.to(galleryIntroTextRef.value, {
			autoAlpha: 1,
			duration: 0.01,
			scrollTrigger: {
				trigger: galleryIntroTextRef.value,
				start: "top 90%",
				toggleActions: "play none none none"
			}
		});
	}

	setTimeout(() => {
		// --- Section 2: Gallery Scroll Animation ---
		ScrollTrigger.value.matchMedia({
			// --- Desktop and larger screens ---
			"(min-width: 769px)": function () {
				// 確保在桌面模式下 isMobileMode 為 false
				if (isMobileMode.value) return;

				if (!galleryContainerToPinRef.value || !scrollContainerRef.value) {
					return;
				}
				// 確保 solutionElements 在 nextTick 後被正確填充
				nextTick(() => {
					// 新增：嚴格檢查 scrollContainerRef 的寬度
					if (!scrollContainerRef.value || scrollContainerRef.value.offsetWidth <= 0) {
						console.error("Product Gallery: scrollContainerRef has no valid width. Aborting desktop horizontal scroll setup.", scrollContainerRef.value);
						return;
					}

					const sections = solutionElements.value.filter((el) => el);
					// 新增：檢查是否有 sections
					if (sections.length === 0) {
						console.warn("Product Gallery: No sections found for horizontal scroll.");
						return;
					}

					const mainAnimation = gsap.to(sections, {
						xPercent: -100 * (sections.length - 1),
						ease: "none",
						scrollTrigger: {
							id: "horizontalGalleryScroll",
							trigger: galleryContainerToPinRef.value,
							pin: galleryContainerToPinRef.value,
							scrub: 1,
							start: "top top",
							end: () => `+=${scrollContainerRef.value.offsetWidth * (sections.length - 1) - 1}`,
							snap:
								sections.length > 1
									? {
											snapTo: 1 / (sections.length - 1),
											duration: { min: 0.2, max: 0.8 },
											delay: 0.1,
											ease: "power1.inOut",
											inertia: false
									  }
									: false,
							onUpdate: (self) => {
								const progress = Math.round(self.progress * (sections.length - 1));
								if (currentSectionIndex.value !== progress) {
									currentSectionIndex.value = progress;
								}
							},
							invalidateOnRefresh: true
						}
					});

					if (!mainAnimation) {
						console.error("主要的橫向滾動動畫 (mainAnimation) 未成功創建。");
						return;
					}
				});

				if (galleryNavSidesRef.value && galleryNavLeftRef.value && galleryNavRightRef.value) {
					gsap.to(galleryNavSidesRef.value, {
						autoAlpha: 1,
						duration: 0.01,
						scrollTrigger: {
							trigger: galleryContainerToPinRef.value,
							start: "top 50%",
							toggleActions: "play none none none"
						}
					});
					gsap.from(galleryNavLeftRef.value, {
						xPercent: -100,
						autoAlpha: 0,
						duration: 0.8,
						ease: "power3.out",
						scrollTrigger: {
							trigger: galleryContainerToPinRef.value,
							start: "top 50%",
							toggleActions: "play none none none"
						}
					});
					gsap.from(galleryNavRightRef.value, {
						xPercent: 100,
						autoAlpha: 0,
						duration: 0.8,
						ease: "power3.out",
						scrollTrigger: {
							trigger: galleryContainerToPinRef.value,
							start: "top 50%",
							toggleActions: "play none none none"
						}
					});
				}
			},

			// --- Mobile screens ---
			"(max-width: 768px)": function () {
				// 確保在手機模式下 isMobileMode 為 true
				if (!isMobileMode.value) return;

				const desktopST = ScrollTrigger.value.getById("horizontalGalleryScroll");
				if (desktopST) {
					desktopST.kill();
				}

				// 手機版底部導航按鈕的入場動畫
				if (galleryNavSidesRef.value) {
					gsap.fromTo(
						galleryNavSidesRef.value,
						{ autoAlpha: 0, y: 30 },
						{
							autoAlpha: 1,
							y: 0,
							duration: 0.5,
							ease: "power2.out",
							scrollTrigger: {
								trigger: galleryNavSidesRef.value,
								start: "top 95%",
								scroller: window,
								toggleActions: "play none none none"
							}
						}
					);
				}
			}
		});
	}, 200);
});

const navigateToSection = (index) => {
	currentSectionIndex.value = index;

	if (!isMobileMode.value) {
		// --- 桌面版的邏輯 ---
		if (!ScrollTrigger.value || !gsap || !galleryContainerToPinRef.value || !solutions.value || solutions.value.length <= 1) return;

		const stInstance = ScrollTrigger.value.getById("horizontalGalleryScroll");
		if (stInstance) {
			// 確保 solutions.value.length > 1 以避免除以零
			const progress = solutions.value.length > 1 ? index / (solutions.value.length - 1) : 0;
			const targetScrollY = stInstance.start + progress * (stInstance.end - stInstance.start);
			gsap.to(window, {
				scrollTo: {
					y: targetScrollY,
					autoKill: true
				},
				duration: 1,
				ease: "power2.inOut"
			});
		}
	}
};

onUnmounted(() => {
	window.removeEventListener("resize", () => {});
	cleanupScrollTriggers();
});
</script>

<style scoped>
.product-gallery-container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	min-height: 100vh;
	overflow: hidden;
	color: #f0f0f0;
}

.gallery-scroll-container {
	display: flex;
	width: 100%;
	overflow: hidden;
	position: relative;
}

.solution-section {
	width: 100vw;
	height: 100%;
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 40px;
	box-sizing: border-box;
	position: relative;
	overflow: hidden;
}

.solution-content {
	display: flex;
	align-items: center;
	justify-content: space-around;
	width: 100%;
	max-width: 1920px;
	gap: 40px;
}

.image-container {
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	max-width: 50%;
}

.solution-image {
	max-width: 100%;
	max-height: 70vh;
	object-fit: contain;
	border-radius: 10px;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.gallery-navigation-sides {
	position: fixed;
	top: 50%;
	left: 0;
	right: 0;
	transform: translateY(-50%);
	display: flex;
	justify-content: space-between;
	padding: 0 30px;
	z-index: 10;
	pointer-events: none;
	opacity: 0; /* Initial opacity for GSAP animation */
}

.gallery-navigation-left,
.gallery-navigation-right {
	display: flex;
	flex-direction: column;
	gap: 10px;
	pointer-events: auto;
	position: relative;
}

.gallery-navigation-left::before,
.gallery-navigation-right::before {
	content: "";
	position: absolute;
	top: 50%;
	width: 200px;
	height: 120%;
	background: radial-gradient(ellipse at center, rgba(70, 130, 180, 0.12), transparent 70%);
	border-radius: 50%;
	z-index: -1;
	opacity: 0.6;
}

.gallery-navigation-left::before {
	left: 50%;
	transform: translate(-55%, -50%) rotate(-10deg);
}

.gallery-navigation-right::before {
	right: 50%;
	transform: translate(55%, -50%) rotate(10deg);
}

.gallery-navigation-left button,
.gallery-navigation-right button {
	--pop-out-x: 0px;
	--pop-out-scale: 1;
	--hover-scale: 1;
	background-color: rgba(25, 35, 45, 0.65);
	color: #d0d0d0;
	border: 1px solid rgba(100, 116, 139, 0.4);
	padding: 10px 15px;
	border-radius: 8px;
	cursor: pointer;
	transition: background-color 0.3s, color 0.3s, border-color 0.3s, transform 0.3s ease-out, box-shadow 0.3s ease-out;
	font-size: 0.9em;
	text-align: center;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
	min-width: 120px;
}

.gallery-navigation-left button:hover,
.gallery-navigation-right button:hover {
	--hover-scale: 1.08;
	background-color: rgba(45, 55, 70, 0.75);
	color: #ffffff;
	border-color: rgba(120, 136, 159, 0.5);
}

.gallery-navigation-left button.active,
.gallery-navigation-right button.active {
	--pop-out-x: 18px;
	--pop-out-scale: 1.1;
	background-color: #007aff;
	color: #ffffff;
	border-color: #0056b3;
	font-weight: bold;
	box-shadow: 0 0 15px rgba(0, 123, 255, 0.6), 0 0 8px rgba(0, 123, 255, 0.4);
	z-index: 2;
}

.gallery-navigation-left button:nth-child(1) {
	transform: rotate(-12deg) translateX(calc(-18px + var(--pop-out-x))) translateY(-35px) scale(calc(var(--pop-out-scale) * var(--hover-scale)));
}
.gallery-navigation-left button:nth-child(2) {
	transform: rotate(-8deg) translateX(calc(-12px + var(--pop-out-x))) translateY(-15px) scale(calc(var(--pop-out-scale) * var(--hover-scale)));
}
.gallery-navigation-left button:nth-child(3) {
	transform: rotate(-3deg) translateX(calc(-5px + var(--pop-out-x))) translateY(0px) scale(calc(var(--pop-out-scale) * var(--hover-scale)));
}
.gallery-navigation-left button:nth-child(4) {
	transform: rotate(3deg) translateX(calc(-5px + var(--pop-out-x))) translateY(15px) scale(calc(var(--pop-out-scale) * var(--hover-scale)));
}
.gallery-navigation-left button:nth-child(5) {
	transform: rotate(8deg) translateX(calc(-12px + var(--pop-out-x))) translateY(30px) scale(calc(var(--pop-out-scale) * var(--hover-scale)));
}
.gallery-navigation-left button:nth-child(6) {
	transform: rotate(12deg) translateX(calc(-18px + var(--pop-out-x))) translateY(45px) scale(calc(var(--pop-out-scale) * var(--hover-scale)));
}

.gallery-navigation-right button:nth-child(1) {
	transform: rotate(12deg) translateX(calc(18px - var(--pop-out-x))) translateY(-35px) scale(calc(var(--pop-out-scale) * var(--hover-scale)));
}
.gallery-navigation-right button:nth-child(2) {
	transform: rotate(8deg) translateX(calc(12px - var(--pop-out-x))) translateY(-15px) scale(calc(var(--pop-out-scale) * var(--hover-scale)));
}
.gallery-navigation-right button:nth-child(3) {
	transform: rotate(3deg) translateX(calc(5px - var(--pop-out-x))) translateY(0px) scale(calc(var(--pop-out-scale) * var(--hover-scale)));
}
.gallery-navigation-right button:nth-child(4) {
	transform: rotate(-3deg) translateX(calc(5px - var(--pop-out-x))) translateY(15px) scale(calc(var(--pop-out-scale) * var(--hover-scale)));
}
.gallery-navigation-right button:nth-child(5) {
	transform: rotate(-8deg) translateX(calc(12px - var(--pop-out-x))) translateY(30px) scale(calc(var(--pop-out-scale) * var(--hover-scale)));
}
.gallery-navigation-right button:nth-child(6) {
	transform: rotate(-12deg) translateX(calc(18px - var(--pop-out-x))) translateY(45px) scale(calc(var(--pop-out-scale) * var(--hover-scale)));
}

@media (max-width: 768px) {
	.gallery-scroll-container {
		/* 手機版：容器不再橫向滾動，而是作為單個 solution-section 的展示區 */
		overflow: hidden; /* 確保內容不溢出，因為內部 section 可能有動畫 */
		position: relative; /* 如果內部 section 使用絕對定位做動畫，則需要 */
		/* 高度可以由內部 .solution-section is-mobile-active-section 決定，或者給定一個固定比例 */
		min-height: 50vh; /* 示例：至少有一定高度，具體值需根據內容調整 */
		display: flex; /* 讓內部的 transition 和 section 居中等 */
		align-items: center;
		justify-content: center;
	}

	.solution-section.is-mobile-active-section {
		/* 手機版活動的 section 樣式 */
		width: 100%; /* 佔滿 gallery-scroll-container */
		height: auto; /* 高度自適應內容 */
		position: relative; /* 或者 static，取決於 transition 實現方式 */
		flex-shrink: 1;
	}

	.solution-section {
		padding: 20px;
		width: 100vw; /* 雖然在手機上只顯示一個，但保持與桌面結構一致性可能有助於某些計算 */
		max-height: none; /* 移除桌面版可能有的 max-height 限制*/
	}

	.image-container {
		max-width: 90%;
		height: auto; /* 手機版高度自適應 */
	}

	.solution-image {
		max-height: 40vh; /* 調整手機版圖片最大高度，避免過大 */
		cursor: default; /* 手機上圖片通常不顯示特殊鼠標指針，除非點擊有放大以外的交互 */
	}
	.solution-image.cursor-pointer {
		cursor: pointer;
	}

	.gallery-navigation-sides {
		position: static; /* 維持原手機版佈局 */
		transform: none;
		flex-direction: row;
		padding: 12px;
		background-color: rgba(0, 0, 0, 0.3);
		overflow-x: hidden; /* 應該是 visible 或 auto 如果按鈕很多需要滑動 */
		overflow-y: visible;
		justify-content: center;
		width: 100%;
		bottom: 0;
		left: 0;
		right: 0;
		top: auto;
		gap: 12px;
		flex-wrap: wrap;
		pointer-events: auto;
		/* opacity: 1; GSAP 會控制 */
	}

	.gallery-navigation-left::before,
	.gallery-navigation-right::before {
		display: none;
	}

	.gallery-navigation-left,
	.gallery-navigation-right {
		flex-direction: row; /* 確保按鈕橫向排列 */
		gap: 8px;
		display: contents; /* 維持原樣，讓按鈕直接成為父級 flex item */
		transform: none !important;
	}

	.gallery-navigation-left button,
	.gallery-navigation-right button {
		transform: none !important; /* 移除桌面版的形變 */
		padding: 8px 16px;
		margin: 0;
		white-space: nowrap;
		background-color: rgba(25, 35, 45, 0.65);
		color: #d0d0d0;
		border: 1px solid rgba(100, 116, 139, 0.4);
		border-radius: 8px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
		flex-grow: 0; /* Revert from 1, let content define width */
		flex-basis: auto; /* Revert from calc */
		min-width: calc(30% - 8px); /* 最小寬度，避免過窄 */
		text-align: center;
		transition: background-color 0.3s, color 0.3s, border-color 0.3s, box-shadow 0.3s;
	}

	.gallery-navigation-left button:hover,
	.gallery-navigation-right button:hover {
		background-color: rgba(45, 55, 70, 0.75);
		color: #ffffff;
		border-color: rgba(120, 136, 159, 0.5);
		transform: none !important;
	}

	.gallery-navigation-left button.active,
	.gallery-navigation-right button.active {
		background-color: #007aff;
		color: #ffffff;
		border-color: #0056b3;
		font-weight: bold;
		box-shadow: 0 0 15px rgba(0, 123, 255, 0.6), 0 0 8px rgba(0, 123, 255, 0.4);
		z-index: 2;
	}
}

/* Vue Transition for mobile solution change */
.solution-mobile-fade-enter-active,
.solution-mobile-fade-leave-active {
	transition: opacity 0.3s ease-in-out;
}
.solution-mobile-fade-enter-from,
.solution-mobile-fade-leave-to {
	opacity: 0;
}

.solution-content-mobile {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
}
/* Styles for the new "View Details" button on mobile */
.view-details-btn-mobile {
	/* Styles are already applied inline in the template. */
	/* Base styles can be added here if Tailwind classes are not sufficient. */
	margin-top: 1rem; /* Add some space above the button */
}

.custom-scrollbar-lightbox::-webkit-scrollbar {
	width: 8px;
}
.custom-scrollbar-lightbox::-webkit-scrollbar-track {
	background: rgba(255, 255, 255, 0.1);
	border-radius: 10px;
}
.custom-scrollbar-lightbox::-webkit-scrollbar-thumb {
	background: rgba(100, 116, 139, 0.7); /* slate-500 with opacity */
	border-radius: 10px;
}
.custom-scrollbar-lightbox::-webkit-scrollbar-thumb:hover {
	background: rgba(100, 116, 139, 1); /* slate-500 */
}
.custom-scrollbar-lightbox {
	scrollbar-width: thin;
	scrollbar-color: rgba(100, 116, 139, 0.7) rgba(255, 255, 255, 0.1);
}
</style>
