import { ref, onUnmounted } from "vue";
import gsap from "gsap";

export function useScrollAnimation() {
	const ScrollTrigger = ref(null);
	const ScrollToPlugin = ref(null);
	const isInitialized = ref(false);
	const isMobile = ref(false);

	// Handle resize function to update isMobile
	let resizeHandler = null;
	const updateIsMobile = () => {
		if (typeof window !== "undefined") {
			const mediaQuery = window.matchMedia("(max-width: 768px)"); // Assume md breakpoint is 768px
			isMobile.value = mediaQuery.matches;
			if (ScrollTrigger.value) {
				ScrollTrigger.value.refresh();
			}
		}
	};

	// 初始化GSAP插件
	const initScrollPlugins = async () => {
		if (isInitialized.value) return { ScrollTrigger: ScrollTrigger.value, ScrollToPlugin: ScrollToPlugin.value };
		if (typeof window === "undefined") return { ScrollTrigger: null, ScrollToPlugin: null }; // Avoid running on server

		try {
			const ST = await import("gsap/ScrollTrigger");
			ScrollTrigger.value = ST.default || ST.ScrollTrigger;

			const STP = await import("gsap/ScrollToPlugin");
			ScrollToPlugin.value = STP.default || STP.ScrollToPlugin;

			const TP = await import("gsap/TextPlugin");
			const TextPlugin = TP.default || TP.TextPlugin;

			gsap.registerPlugin(ScrollTrigger.value, ScrollToPlugin.value, TextPlugin);
			isInitialized.value = true;

			// Initialize isMobile on client side after plugins loaded
			updateIsMobile();
			resizeHandler = updateIsMobile; // Assign the handler
			window.addEventListener("resize", resizeHandler);

			return { ScrollTrigger: ScrollTrigger.value, ScrollToPlugin: ScrollToPlugin.value };
		} catch (error) {
			return { ScrollTrigger: null, ScrollToPlugin: null };
		}
	};

	// 刷新所有滾動觸發器
	const refreshScrollTriggers = () => {
		if (ScrollTrigger.value) {
			ScrollTrigger.value.refresh();
		}
	};

	// 導航到指定區塊
	const scrollToSection = (id, offset = 50) => {
		const target = document.getElementById(id);
		if (target && ScrollToPlugin.value) {
			gsap.to(window, {
				duration: 0.8,
				scrollTo: {
					y: target,
					offsetY: offset,
					autoKill: false
				},
				ease: "power1.easeOut",
				onStart: () => {
					document.body.style.pointerEvents = "none";
				},
				onComplete: () => {
					document.body.style.pointerEvents = "auto";
				}
			});
		}
	};

	// 創建字符動畫 - 為字符逐個添加動畫效果
	const createCharAnimation = (params) => {
		const {
			selector,
			trigger,
			start = "top 70%",
			end = "bottom 20%",
			staggerAmount = 0.05,
			duration = 0.7,
			fromY = 20,
			fromOpacity = 0,
			toY = 0,
			toOpacity = 1,
			ease = "power3.out",
			delay = 0,
			toggleActions
		} = params;

		if (!ScrollTrigger.value) return null;

		const chars = document.querySelectorAll(selector);
		if (chars.length === 0) return null;

		return gsap
			.timeline({
				scrollTrigger: {
					trigger,
					start,
					end,
					toggleActions
				}
			})
			.fromTo(chars, { y: fromY, opacity: fromOpacity }, { y: toY, opacity: toOpacity, duration, stagger: staggerAmount, ease, delay });
	};

	// 創建元素入場動畫 - 針對一般元素的動畫效果
	const createElementEntrance = (params) => {
		const {
			elements,
			trigger,
			start = "top 70%",
			end = "bottom 20%",
			horizontal = false,
			fromY = 30,
			fromOpacity = 0,
			fromScale = 1,
			toY = 0,
			toOpacity = 1,
			toScale = 1,
			duration = 1,
			delay = 0,
			ease = "power2.out",
			toggleActions,
			stagger = 0
		} = params;

		if (!ScrollTrigger.value || !elements) return null;

		return gsap
			.timeline({
				scrollTrigger: {
					trigger,
					start,
					end: end || "bottom 20%",
					toggleActions,
					horizontal: horizontal,
					containerAnimation: horizontal ? trigger.closest(".gallery-scroll-container")?.scrollTrigger : undefined
				}
			})
			.fromTo(
				elements,
				{ y: fromY, opacity: fromOpacity, scale: fromScale },
				{ y: toY, opacity: toOpacity, scale: toScale, duration, ease, delay, stagger: stagger > 0 ? stagger : undefined }
			);
	};

	// 清理所有滾動觸發器
	const cleanupScrollTriggers = () => {
		if (ScrollTrigger.value) {
			// 使用 ScrollTrigger.revert() 來殺死所有 trigger 並還原 GSAP 設定的樣式
			// 這對於 SPA 路由轉換更為推薦
			ScrollTrigger.value.revert();
		}
	};

	// 窗口大小變化處理 - Combined into initScrollPlugins and onUnmounted

	// 基礎元素動畫 - 用於創建從一種狀態到另一種狀態的過渡
	const createBasicAnimation = (params) => {
		const {
			elements,
			trigger,
			start = "top 70%",
			end = "bottom 20%",
			fromProps = { opacity: 0 },
			toProps = { opacity: 1 },
			duration = 1,
			delay = 0,
			stagger = 0,
			ease = "power2.out",
			toggleActions
		} = params;

		if (!elements || !ScrollTrigger.value) return null;

		return gsap.fromTo(
			elements,
			{ ...fromProps },
			{
				...toProps,
				duration,
				delay,
				stagger: stagger > 0 ? stagger : undefined,
				ease,
				scrollTrigger: {
					trigger,
					start,
					end,
					toggleActions
				}
			}
		);
	};

	// 創建時間軸動畫 - 用於更複雜的連續動畫
	const createTimelineAnimation = (params) => {
		const { trigger, start = "top 70%", end = "bottom 20%", toggleActions } = params;

		if (!ScrollTrigger.value) return null;

		return gsap.timeline({
			scrollTrigger: {
				trigger,
				start,
				end,
				toggleActions
			}
		});
	};

	onUnmounted(() => {
		if (resizeHandler && typeof window !== "undefined") {
			window.removeEventListener("resize", resizeHandler);
		}
		cleanupScrollTriggers();
	});

	// 核心功能
	const core = {
		ScrollTrigger,
		ScrollToPlugin,
		initScrollPlugins,
		refreshScrollTriggers,
		scrollToSection,
		cleanupScrollTriggers
	};

	// 基本動畫工具
	const animationTools = {
		createBasicAnimation,
		createTimelineAnimation,
		createCharAnimation,
		createElementEntrance
	};

	return {
		...core,
		...animationTools,
		gsap,
		isMobile
	};
}
