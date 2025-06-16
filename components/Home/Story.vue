<template>
	<div>
		<section id="story" class="my-[64px] sm:my-[128px] md:my-[256px] lg:my-[512px] space-y-[128px] md:space-y-[256px] overflow-hidden">
			<!-- Block 1: Intro Section -->
			<div id="story-intro-block" class="min-h-screen relative flex justify-center items-center overflow-hidden">
				<!-- Centered Intro text container, arranging vertical texts horizontally -->
				<div ref="introContainerRef" class="flex flex-row-reverse gap-[6px] md:gap-[24px] lg:gap-[48px] xl:gap-[60px] 2xl:gap-[72px] opacity-0">
					<p
						v-for="(text, i) in introTexts"
						:key="i"
						:ref="(el) => (introTextRefs[i] = el)"
						class="vertical-text text-[18px] md:text-[24px] lg:text-[36px] xl:text-[40px] 2xl:text-[44px]"
					>
						{{ $t(text) }}
					</p>
				</div>
			</div>

			<!-- Block 2: Themes Section -->
			<div id="story-themes-block" ref="storyThemesBlockRef" class="h-screen relative flex justify-center items-center py-[64px] md:py-[128px]">
				<!-- Theme Items -->
				<div
					v-for="(theme, key) in themes"
					:key="key"
					:ref="(el) => (themeRefs[key].container = el)"
					class="absolute transition-opacity duration-300"
					:class="getThemePositionClass(key)"
					@mouseenter="handleThemeMouseEnter(key)"
					@mouseleave="handleThemeMouseLeave(key)"
				>
					<!-- Aura Effect Div -->
					<div :class="['theme-aura', `aura-${key}`]" :ref="(el) => (themeRefs[key].aura = el)"></div>

					<button
						type="button"
						:ref="(el) => (themeRefs[key].title = el)"
						class="vertical-title text-[36px] md:text-[60px] lg:text-[80px] xl:text-[90px] 2xl:text-[100px] p-[8px] rounded-lg opacity-0 cursor-pointer"
						style="position: relative; z-index: 10"
						@click="handleThemeClick(key)"
						:aria-expanded="activeThemeKey === key ? 'true' : 'false'"
						:aria-controls="`theme-details-${key}`"
					>
						{{ $t(theme.title) }}
						<span :ref="(el) => (themeRefs[key].indicator = el)" class="theme-indicator">+</span>
					</button>
				</div>

				<!-- Unified Details Box - Replaced with individual theme detail containers -->
				<div ref="cloudDetailsContainerRef" class="details-set md:gap-[24px] lg:gap-[48px] xl:gap-[60px] 2xl:gap-[72px]" :id="`theme-details-cloud`">
					<p
						v-for="(text, i) in themes.cloud.texts"
						:key="`cloud-${i}`"
						:ref="(el) => (cloudDetailParaRefs[i] = el)"
						class="vertical-text text-[18px] md:text-[21px] lg:text-[28px] xl:text-[30px] 2xl:text-[32px] opacity-0"
					>
						{{ $t(text) }}
					</p>
				</div>
				<div ref="mountainDetailsContainerRef" class="details-set md:gap-[24px] lg:gap-[48px] xl:gap-[60px] 2xl:gap-[72px]" :id="`theme-details-mountain`">
					<p
						v-for="(text, i) in themes.mountain.texts"
						:key="`mountain-${i}`"
						:ref="(el) => (mountainDetailParaRefs[i] = el)"
						class="vertical-text text-[18px] md:text-[21px] lg:text-[28px] xl:text-[30px] 2xl:text-[32px] opacity-0"
					>
						{{ $t(text) }}
					</p>
				</div>
				<div ref="skyDetailsContainerRef" class="details-set md:gap-[24px] lg:gap-[48px] xl:gap-[60px] 2xl:gap-[72px]" :id="`theme-details-sky`">
					<p
						v-for="(text, i) in themes.sky.texts"
						:key="`sky-${i}`"
						:ref="(el) => (skyDetailParaRefs[i] = el)"
						class="vertical-text text-[18px] md:text-[21px] lg:text-[28px] xl:text-[30px] 2xl:text-[32px] opacity-0"
					>
						{{ $t(text) }}
					</p>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
import { ref, onMounted, nextTick, inject, reactive, watch } from "vue";
import gsap from "gsap"; // Import GSAP

// Keep intro texts separate
const introTexts = ["poem intro", "story inspiration", "cloud mountain description", "natural scenery", "harmony philosophy"];

// Main themes data
const themes = reactive({
	cloud: {
		title: "cloud title",
		texts: ["cloud agile", "symbolizes innovation", "innovation core", "breakthrough solutions", "overcoming challenges"],
		auraOpacity: 0.45
	},
	mountain: {
		title: "mountain title",
		texts: ["mountain symbolizes", "excellence commitment", "reliable attitude", "long term partnership"],
		auraOpacity: 0.4
	},
	sky: {
		title: "sky title",
		texts: ["clear sky", "future vision", "helping clients", "shaping future", "achieving results"],
		auraOpacity: 0.5
	}
});

// Refs for intro section
const introContainerRef = ref(null);
const introTextRefs = ref([]);

// Refs for main themes
const themeRefs = reactive({
	cloud: { container: null, title: null, aura: null, indicator: null },
	mountain: { container: null, title: null, aura: null, indicator: null },
	sky: { container: null, title: null, aura: null, indicator: null }
});

const storyThemesBlockRef = ref(null);

// Refs for individual theme detail containers and their paragraphs
const cloudDetailsContainerRef = ref(null);
const mountainDetailsContainerRef = ref(null);
const skyDetailsContainerRef = ref(null);
const cloudDetailParaRefs = ref([]);
const mountainDetailParaRefs = ref([]);
const skyDetailParaRefs = ref([]);

const activeThemeKey = ref(null);
const clickedThemeKey = ref(null); // To store the key of the clicked theme on desktop

const scrollAnimation = inject("scrollAnimation");

const AURA_TARGET_SCALE = 1.8;
const AURA_INITIAL_SCALE = 0.3;

let detailAnimationTl = null;
let introTl = null;
let themesTl = null;

// Adjusted timings for better user reaction and visibility
const THEME_TITLE_STAGGER = 0.35; // Increased from 0.2
const THEME_PULSE_DELAY_AFTER_TITLE = 0.5; // Increased from 0.3
const THEME_PULSE_DURATION = 0.45; // Increased from 0.35
const INDICATOR_ANIM_DURATION = 0.4; // Increased from 0.3
const PARAGRAPH_ANIM_DURATION = 0.8; // Increased from 0.7
const PARAGRAPH_STAGGER_EACH = 0.15; // Decreased from 0.2

const themeElementMap = {
	cloud: { container: cloudDetailsContainerRef, paras: cloudDetailParaRefs },
	mountain: { container: mountainDetailsContainerRef, paras: mountainDetailParaRefs },
	sky: { container: skyDetailsContainerRef, paras: skyDetailParaRefs }
};

const showAura = (key) => {
	const auraEl = themeRefs[key]?.aura;
	const themeData = themes[key];
	if (auraEl && themeData) {
		auraEl.style.opacity = String(themeData.auraOpacity || 0.45);
		auraEl.style.transform = `translate(-50%, -50%) scale(${AURA_TARGET_SCALE})`;
	}
};

const hideAura = (key) => {
	const auraEl = themeRefs[key]?.aura;
	if (auraEl) {
		auraEl.style.opacity = "0";
		auraEl.style.transform = `translate(-50%, -50%) scale(${AURA_INITIAL_SCALE})`;
	}
};

watch(activeThemeKey, async (newKey, oldKey) => {
	await nextTick(); // Ensure Vue has processed any pending DOM updates and refs are settled

	if (detailAnimationTl) detailAnimationTl.kill();

	const oldThemeElements = oldKey ? themeRefs[oldKey] : null;
	const newThemeElements = newKey ? themeRefs[newKey] : null;

	const oldTitleEl = oldThemeElements?.title;
	const oldIndicatorEl = oldThemeElements?.indicator;
	const newTitleEl = newThemeElements?.title;
	const newIndicatorEl = newThemeElements?.indicator;

	// Handle old theme's title styling, aura, and indicator
	if (oldKey) {
		hideAura(oldKey);
		if (oldTitleEl) {
			oldTitleEl.classList.remove("theme-title-active");
			oldTitleEl.style.removeProperty("--theme-glow-color");
		}
		if (oldIndicatorEl) {
			gsap.to(oldIndicatorEl, { rotation: 0, scale: 1, duration: 0.3, ease: "power2.out" });
		}
	}

	// Handle new theme's title styling, aura, and indicator
	if (newKey) {
		showAura(newKey);
		if (newTitleEl) {
			newTitleEl.classList.add("theme-title-active");
			let glowColor = "rgba(255, 255, 255, 0.7)"; // Default white glow
			if (newKey === "cloud") glowColor = "rgba(200, 220, 255, 0.8)"; // Light blueish
			else if (newKey === "mountain") glowColor = "rgba(230, 240, 235, 0.8)"; // Light greenish/white for contrast
			else if (newKey === "sky") glowColor = "rgba(180, 230, 220, 0.8)"; // Light cyanish
			newTitleEl.style.setProperty("--theme-glow-color", glowColor);
		}
		if (newIndicatorEl) {
			gsap.to(newIndicatorEl, { rotation: 135, scale: 1.1, duration: INDICATOR_ANIM_DURATION, ease: "power2.out" });
		}
	}

	const oldDetailElements = oldKey ? themeElementMap[oldKey] : null;
	const newDetailElements = newKey ? themeElementMap[newKey] : null;

	// Animate out old elements if they exist and are different from new ones
	if (oldDetailElements && oldKey !== newKey) {
		const parasToHide = oldDetailElements.paras.value.filter(Boolean);
		if (parasToHide.length > 0) {
			await gsap
				.to(parasToHide, {
					opacity: 0,
					y: -20, // Animate upwards for exit
					duration: 0.3,
					ease: "power3.in",
					stagger: 0.05
				})
				.then();
		}
		if (oldDetailElements.container.value) {
			gsap.to(oldDetailElements.container.value, { opacity: 0, duration: 0.2 }); // Quick fade for container
			oldDetailElements.container.value.style.pointerEvents = "none";
		}
	}

	// Animate in new elements if they exist
	if (newDetailElements) {
		if (newDetailElements.container.value) {
			newDetailElements.container.value.style.pointerEvents = "auto";
			// Ensure container is set to opacity 0 before fade in, in case it wasn't fully faded out by a rapid switch
			if (oldKey !== null) {
				gsap.set(newDetailElements.container.value, { opacity: 0 });
			}
			gsap.to(newDetailElements.container.value, { opacity: 1, duration: 0.3, ease: "power3.out", delay: oldDetailElements && oldKey !== newKey ? 0.1 : 0 }); // Slight delay if old one was fading
		}

		const parasToShow = newDetailElements.paras.value.filter(Boolean);
		if (parasToShow.length > 0) {
			// Reset starting state for paragraphs before animating them in
			gsap.set(parasToShow, { opacity: 0, y: 30 }); // Animate from downwards

			detailAnimationTl = gsap.timeline();
			detailAnimationTl.to(
				parasToShow,
				{
					opacity: 1,
					y: 0,
					duration: PARAGRAPH_ANIM_DURATION,
					ease: "circ.out", // Changed ease
					stagger: { each: PARAGRAPH_STAGGER_EACH, from: "start" }
				},
				oldDetailElements && oldKey !== newKey ? "+=0.2" : "+=0.1"
			); // Delay based on whether an old element was present
		}
	} else if (oldDetailElements) {
		// If newKey is null, but there was an oldKey, ensure it's hidden
		const parasToHide = oldDetailElements.paras.value.filter(Boolean);
		if (parasToHide.length > 0) {
			// No await needed if we just want to kick off the hide animation
			gsap.to(parasToHide, { opacity: 0, y: -20, duration: 0.3, ease: "power3.in", stagger: 0.05 });
		}
		if (oldDetailElements.container.value) {
			gsap.to(oldDetailElements.container.value, { opacity: 0, duration: 0.2 });
			oldDetailElements.container.value.style.pointerEvents = "none";
		}
	}
});

const handleThemeClick = (key) => {
	if (scrollAnimation.isMobile.value) {
		if (activeThemeKey.value === key) {
			activeThemeKey.value = null;
		} else {
			activeThemeKey.value = key;
		}
	} else {
		// Desktop: click to pin/unpin
		if (clickedThemeKey.value === key) {
			clickedThemeKey.value = null; // Unpin, activeThemeKey remains to keep content visible
		} else {
			activeThemeKey.value = key; // Set active and pin
			clickedThemeKey.value = key;
		}
	}
};

const handleThemeMouseEnter = (key) => {
	if (!scrollAnimation.isMobile.value && !clickedThemeKey.value) {
		// Only hover if not mobile and no theme is pinned
		activeThemeKey.value = key;
	}
};

const handleThemeMouseLeave = (key) => {
	if (!scrollAnimation.isMobile.value && clickedThemeKey.value && activeThemeKey.value !== clickedThemeKey.value) {
		activeThemeKey.value = clickedThemeKey.value;
	}
};

const getThemePositionClass = (key) => {
	switch (key) {
		case "cloud":
			return "top-[15%] right-[20%]";
		case "mountain":
			return "bottom-[10%] left-[30%] md:left-[25%]";
		case "sky":
			return "top-[20%] left-[5%] md:left-[15%]";
		default:
			return "";
	}
};

const setupStoryAnimation = () => {
	introTl = scrollAnimation.createTimelineAnimation({
		trigger: `#story-intro-block`,
		start: "top 70%",
		end: "bottom 20%",
		toggleActions: "play none none none"
	});

	if (introContainerRef.value && introTextRefs.value.length) {
		introTl.fromTo(introContainerRef.value, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }).fromTo(
			introTextRefs.value,
			{ opacity: 0, y: 20 },
			{
				opacity: 1,
				y: 0,
				duration: 0.8,
				ease: "power3.out",
				stagger: {
					each: 0.15,
					from: "start"
				}
			},
			"-=0.4"
		);
	}

	themesTl = scrollAnimation.createTimelineAnimation({
		trigger: `#story-themes-block`,
		start: "top 70%",
		end: "bottom 20%",
		toggleActions: "play none none none"
	});

	const THEME_ANIM_DURATION = 1.0;
	const themeOrder = ["cloud", "mountain", "sky"];
	const lastThemeKey = themeOrder[themeOrder.length - 1];

	themeOrder.forEach((themeKey, index) => {
		const titleEl = themeRefs[themeKey]?.title;
		const indicatorEl = themeRefs[themeKey]?.indicator;

		if (titleEl) {
			const startTime = index * THEME_TITLE_STAGGER;
			themesTl.fromTo(titleEl, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: THEME_ANIM_DURATION, ease: "power3.out" }, startTime);

			if (indicatorEl) {
				themesTl.fromTo(
					indicatorEl,
					{ opacity: 0, scale: 0.5, y: 20 },
					{ opacity: 1, scale: 1, y: 0, duration: THEME_ANIM_DURATION * 0.8, ease: "back.out(1.7)" },
					startTime + THEME_ANIM_DURATION * 0.2
				);
			}

			// 在每個標題的入場動畫基本完成後，為其添加單獨的脈動提示
			themesTl.fromTo(
				titleEl,
				{ scale: 1 },
				{
					scale: 1.06,
					duration: THEME_PULSE_DURATION,
					yoyo: true,
					repeat: 1,
					ease: "power1.inOut"
				},
				startTime + THEME_ANIM_DURATION + THEME_PULSE_DELAY_AFTER_TITLE
			);

			// 如果這是最後一個主題的標題動畫，仍然添加標籤用於後續的 activeThemeKey 設置
			if (themeKey === lastThemeKey) {
				themesTl.addLabel("lastTitleAnimationEnd", startTime + THEME_ANIM_DURATION);
			}
		}
	});

	// Use the label for the .call() to trigger it precisely when the last title animation should end
	// 移除之前在這裡的全局脈動動畫，只保留 activeThemeKey 的設置
	themesTl.call(
		() => {
			if (activeThemeKey.value === null) {
				activeThemeKey.value = "cloud";
			}
		},
		[],
		"lastTitleAnimationEnd"
	);
};

onMounted(async () => {
	try {
		await nextTick();
		introTextRefs.value = introTextRefs.value.filter(Boolean);

		// Initialize auras and detail containers to hidden state
		Object.keys(themes).forEach((key) => {
			const auraEl = themeRefs[key]?.aura;
			if (auraEl) {
				auraEl.style.opacity = "0";
				auraEl.style.transform = `translate(-50%, -50%) scale(${AURA_INITIAL_SCALE})`;
			}
			// Initialize detail containers
			const elements = themeElementMap[key];
			if (elements && elements.container.value) {
				elements.container.value.style.opacity = "0";
				elements.container.value.style.pointerEvents = "none";
			}
		});

		await scrollAnimation.initScrollPlugins();
		setupStoryAnimation();
	} catch (error) {
		console.error("Story 動畫設置錯誤:", error);
	}
});

import { onUnmounted } from "vue";
onUnmounted(() => {
	if (detailAnimationTl) {
		detailAnimationTl.kill();
	}
	if (introTl) {
		introTl.kill();
	}
	if (themesTl) {
		themesTl.kill();
	}
});
</script>

<style scoped>
.vertical-text {
	writing-mode: vertical-lr;
	height: fit-content;
	padding: 16px 8px;
	letter-spacing: 10px;
	text-orientation: upright;
	color: rgb(255, 255, 255);
	background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 25%, rgba(255, 255, 255, 0.3) 75%, rgba(255, 255, 255, 0) 100%);
	font-family: "LXGW WenKai Mono TC", "Noto Sans TC";
	border-radius: 8px;
	text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}

.vertical-title {
	writing-mode: vertical-lr;
	height: fit-content;
	padding-top: 10px;
	letter-spacing: 10px;
	text-orientation: upright;
	color: rgb(255, 255, 255);
	text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
	font-family: "LXGW WenKai Mono TC", "Noto Sans TC";
	font-weight: 600;
}

.theme-indicator {
	display: inline-block;
	font-size: 0.6em; /* Relative to parent (title) font size */
	line-height: 1;
	color: rgba(255, 255, 255, 0.7);
	transition: color 0.3s ease-out; /* Keep color transition for active state */
	opacity: 0; /* Start hidden, animated by GSAP */
	margin-left: 12px; /* Adjust as needed for vertical text spacing */
	transform-origin: center center; /* Ensure rotation is centered */
	position: absolute; /* For finer control if needed */
	right: -15px;
	top: 50%;
	transform: translateY(-50%);
}
.theme-title-active .theme-indicator {
	color: rgb(255, 255, 255);
}

.details-set {
	position: absolute;
	display: flex;
	flex-direction: row-reverse;
	gap: 6px;
	opacity: 0;
	pointer-events: none;
}

@media (min-width: 768px) {
	/* md */
	.details-set {
		gap: 24px;
	}
}

@media (min-width: 1024px) {
	/* lg */
	.details-set {
		gap: 48px;
	}
}

.theme-aura {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%) scale(0.3);
	border-radius: 50%;
	pointer-events: none;
	z-index: 0;
	opacity: 0;
	transition: opacity 0.3s ease-out, transform 0.4s ease-out;
	width: 100px;
	height: 100px;
}

/* Medium screens (md) aura size adjustment */
@media (min-width: 768px) {
	.theme-aura {
		width: 100px;
		height: 100px;
	}
}

/* Large screens (lg) aura size adjustment */
@media (min-width: 1024px) {
	.theme-aura {
		width: 300px;
		height: 300px;
	}
}

/* Color definitions remain specific */
.aura-cloud {
	background: radial-gradient(circle, rgba(235, 245, 255, 0.6) 10%, rgba(200, 220, 255, 0) 70%);
	box-shadow: 0 0 30px 15px rgba(210, 230, 250, 0.25);
}

.aura-mountain {
	background: radial-gradient(ellipse at center, rgba(60, 90, 70, 0.5) 15%, rgba(40, 60, 50, 0) 70%);
	box-shadow: 0 0 35px 15px rgba(50, 80, 60, 0.2);
}

.aura-sky {
	background: radial-gradient(circle, rgba(120, 220, 180, 0.55) 15%, rgba(80, 180, 150, 0) 70%);
	box-shadow: 0 0 30px 15px rgba(100, 200, 160, 0.25);
}

.theme-title-active {
	text-shadow: 0 0 5px var(--theme-glow-color, #fff), 0 0 10px var(--theme-glow-color, #fff);
	transition: text-shadow 0.3s ease-out;
}
</style>
