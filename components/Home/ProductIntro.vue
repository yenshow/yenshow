<template>
	<div>
		<!-- ProductIntro -->
		<section class="marquee-background bg-primary relative my-[128px] md:my-[512px] h-screen md:h-[120vh] overflow-hidden">
			<article class="search-overlay absolute inset-0 z-50 pt-[64px] md:pt-[128px] flex flex-col items-center gap-[24px] lg:gap-[48px] text-secondary">
				<div class="search-container w-full max-w-[80%] md:max-w-[60%] lg:max-w-[50%] xl:max-w-[45%] 2xl:max-w-[40%] z-10 relative">
					<div class="text-center space-y-[12px] md:space-y-[24px] mb-[24px] md:mb-[48px]">
						<h2 class="text-secondary text-[24px] sm:text-[28px] md:text-[36px] lg:text-[64px] xl:text-[72px] 2xl:text-[80px] font-bold">探索產品</h2>
						<h3 class="text-secondary text-[16px] sm:text-[18px] md:text-[24px] lg:text-[36px] xl:text-[40px] 2xl:text-[44px]">打造科技便捷的生活</h3>
						<p class="text-secondary/80 text-[12px] sm:text-[14px] md:text-[16px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px]">
							各類產品系統整合，提供多種優質的安全產品和服務，<br />
							不用複雜的管理軟體，便可創造無限的價值
						</p>
					</div>

					<!-- 搜尋輸入區域 -->
					<div ref="searchInputWrapperRef" class="relative mb-[8px]">
						<input
							ref="searchInput"
							v-model="keyword"
							@input="handleInput"
							@focus="handleFocus"
							@blur="handleBlur"
							@keydown.esc="closeResultsPanel"
							@keydown.enter="triggerSearchFromEnter"
							class="w-full rounded-lg px-[48px] py-[12px] outline-none focus:ring-2 focus:ring-blue-500 bg-slate-100 text-slate-700 border border-slate-200 shadow-sm hover:shadow-md transition-shadow placeholder-slate-400"
							placeholder="搜尋產品、系列、分類..."
						/>
						<svg
							class="absolute left-[16px] top-1/2 transform -translate-y-1/2 w-[20px] h-[20px] text-slate-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
						</svg>
						<button
							v-if="keyword"
							@click="clearInputAndSearch"
							class="absolute right-[16px] top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-200 transition-colors"
							aria-label="清除搜尋內容"
						>
							<svg class="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<title>清除搜尋內容</title>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
							</svg>
						</button>
					</div>

					<!-- 搜尋結果面板 -->
					<div
						v-if="showResults"
						class="search-results absolute top-full left-0 right-0 mt-[2px] bg-white border border-slate-200 rounded-xl max-h-[60vh] overflow-hidden z-20 shadow-xl flex flex-col"
						@mousedown.prevent
					>
						<!-- 內容區域 -->
						<div class="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
							<!-- 加載中 -->
							<div v-if="isLoading" class="p-[24px] text-center text-slate-400">
								<div class="animate-spin inline-block w-[32px] h-[32px] border-4 rounded-full border-slate-200 border-t-blue-500"></div>
								<p class="mt-[12px]">搜尋中...</p>
							</div>

							<!-- 最近搜尋 -->
							<div v-else-if="!keyword && recentSearches.length > 0" class="p-[16px]">
								<div class="flex justify-between items-center mb-[12px]">
									<h3 class="text-[16px] text-slate-500">最近搜尋</h3>
									<button @click="clearRecentSearchesAndClose" class="text-[14px] text-blue-400 hover:text-blue-300 transition-colors">清除</button>
								</div>
								<div class="flex flex-wrap gap-[8px]">
									<button
										v-for="(item, index) in recentSearches"
										:key="index"
										@click="searchRecent(item)"
										class="px-[12px] py-[6px] rounded-full text-[14px] bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
									>
										{{ item }}
									</button>
								</div>
							</div>

							<!-- 無結果 -->
							<div v-else-if="keyword && !isLoading && !hasResults" class="p-[24px] text-center text-slate-500">
								<p>找不到與「{{ keyword }}」相關的結果</p>
							</div>

							<!-- 搜尋結果 -->
							<div v-else-if="keyword && hasResults" class="flex flex-col">
								<!-- 分類標籤 -->
								<div
									class="flex overflow-x-auto whitespace-nowrap px-[16px] py-[8px] gap-[12px] bg-slate-100 border-b border-slate-200 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent sticky top-0 z-10"
								>
									<button
										class="px-[12px] py-[6px] rounded-full transition-colors text-sm"
										:class="activeTab === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'"
										@click="setActiveTab('all')"
									>
										全部 ({{ resultCounts.total }})
									</button>
									<button
										v-for="(count, type) in resultCounts"
										:key="type"
										v-show="type !== 'total' && count > 0"
										class="px-[12px] py-[6px] rounded-full transition-colors text-sm"
										:class="activeTab === type ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'"
										@click="setActiveTab(type)"
									>
										{{ entityTypeNames[type] }} ({{ count }})
									</button>
								</div>

								<!-- 結果列表 -->
								<div class="p-[16px]">
									<template v-if="activeTab === 'all'">
										<!-- 所有結果 -->
										<div v-for="(items, type) in currentTabResults" :key="type" v-show="items.length > 0">
											<h3 class="text-[16px] mb-[8px] text-slate-500 font-medium mt-4 first:mt-0">{{ entityTypeNames[type] }}</h3>
											<div class="mb-[16px] space-y-1">
												<button
													v-for="item in items.slice(0, 3)"
													:key="item._id"
													@mousedown="handleResultClick(type, item)"
													class="block w-full text-left px-[12px] py-[8px] rounded-lg transition-colors hover:bg-slate-100 text-slate-800"
												>
													<div class="flex items-center gap-[12px]">
														<!-- 產品圖片 -->
														<div v-if="type === 'products' && item.images && item.images.length > 0" class="flex-shrink-0">
															<nuxt-img
																:src="item.images[0]"
																:alt="getEntityName(item)"
																class="w-[40px] h-[40px] object-cover rounded-md"
																loading="lazy"
																format="webp"
																width="40"
																height="40"
																sizes="40px"
																:placeholder="[20, 20, 75, 5]"
															/>
														</div>
														<!-- 其他類型的圖示 -->
														<div
															v-else-if="type !== 'products'"
															class="flex-shrink-0 w-[40px] h-[40px] bg-slate-100 rounded-md flex items-center justify-center"
														>
															<svg class="w-[20px] h-[20px] text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	stroke-width="2"
																	d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
																></path>
															</svg>
														</div>
														<!-- 無圖片時的佔位符 -->
														<div v-else class="flex-shrink-0 w-[40px] h-[40px] bg-slate-100 rounded-md flex items-center justify-center">
															<svg class="w-[20px] h-[20px] text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	stroke-width="2"
																	d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
																></path>
															</svg>
														</div>
														<!-- 文字內容 -->
														<div class="flex-1 min-w-0">
															<div class="text-[16px] truncate">{{ getEntityName(item) }}</div>
															<div v-if="item.code" class="text-[14px] text-slate-500 truncate">{{ item.code }}</div>
														</div>
													</div>
												</button>
											</div>
											<button
												v-if="items.length > 3"
												@click="setActiveTab(type)"
												class="text-[14px] text-blue-400 hover:text-blue-300 mt-[4px] transition-colors"
											>
												查看更多 {{ entityTypeNames[type] }} ({{ items.length }})
											</button>
										</div>
									</template>
									<template v-else>
										<!-- 特定分類結果 -->
										<div v-for="(items, type) in currentTabResults" :key="type" v-show="items.length > 0">
											<h3 class="text-[16px] mb-[8px] text-slate-500 font-medium">{{ entityTypeNames[type] }}</h3>
											<div class="mb-[16px] space-y-1">
												<button
													v-for="item in items"
													:key="item._id"
													@mousedown="handleResultClick(type, item)"
													class="block w-full text-left px-[12px] py-[8px] rounded-lg transition-colors hover:bg-slate-100 text-slate-800"
												>
													<div class="flex items-center gap-[12px]">
														<!-- 產品圖片 -->
														<div v-if="type === 'products' && item.images && item.images.length > 0" class="flex-shrink-0">
															<nuxt-img
																:src="item.images[0]"
																:alt="getEntityName(item)"
																class="w-[40px] h-[40px] object-contain rounded-md"
																loading="lazy"
																format="webp"
																width="40"
																height="40"
																sizes="40px"
																:placeholder="[20, 20, 75, 5]"
															/>
														</div>
														<!-- 其他類型的圖示 -->
														<div
															v-else-if="type !== 'products'"
															class="flex-shrink-0 w-[40px] h-[40px] bg-slate-100 rounded-md flex items-center justify-center"
														>
															<svg class="w-[20px] h-[20px] text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	stroke-width="2"
																	d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
																></path>
															</svg>
														</div>
														<!-- 無圖片時的佔位符 -->
														<div v-else class="flex-shrink-0 w-[40px] h-[40px] bg-slate-100 rounded-md flex items-center justify-center">
															<svg class="w-[20px] h-[20px] text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	stroke-width="2"
																	d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
																></path>
															</svg>
														</div>
														<!-- 文字內容 -->
														<div class="flex-1 min-w-0">
															<div class="text-[16px] truncate">{{ getEntityName(item) }}</div>
															<div v-if="item.code" class="text-[14px] text-slate-500 truncate">{{ item.code }}</div>
														</div>
													</div>
												</button>
											</div>
										</div>
									</template>
								</div>
							</div>

							<!-- 初始提示或無最近搜尋 -->
							<div v-else-if="!keyword && recentSearches.length === 0" class="p-[24px] text-center text-slate-400">
								<span class="material-icons text-3xl">search</span>
								<p class="mt-2">輸入關鍵字開始搜尋</p>
							</div>
						</div>

						<!-- 底部操作區 -->
						<div class="p-[16px] border-t border-slate-200">
							<div class="flex justify-end">
								<button @click="closeResultsPanel" class="px-[16px] py-[8px] rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
									關閉
								</button>
							</div>
						</div>
					</div>
				</div>

				<!-- 快速導航區塊 -->
				<div ref="quickNavRef" class="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8">
					<NuxtLink
						v-for="link in quickNavLinks"
						:key="link.to"
						:to="link.to"
						class="flex flex-col items-center justify-center w-[125px] xl:w-[150px] aspect-square bg-white/90 hover:bg-blue-50 border border-slate-200 rounded-2xl shadow-md transition-all duration-200 group"
					>
						<NuxtImg :src="link.imgSrc" :alt="link.alt" class="w-[64px] xl:w-[96px] aspect-square object-contain" loading="lazy" />
						<span class="text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] text-primary group-hover:text-blue-600">{{ link.label }}</span>
					</NuxtLink>
				</div>

				<ButtonCTA ref="exploreButtonRef" label="智慧方案" to="/products" color="white" class="w-fit" />
			</article>
			<aside class="flex flex-col justify-center items-center -rotate-6">
				<div v-for="(row, rowIndex) in rows" :key="rowIndex" class="marquee-wrapper w-[120%]">
					<div class="marquee" :class="rowIndex % 2 === 0 ? '' : 'marquee--reverse'">
						<div class="marquee__group">
							<div v-for="(image, imgIndex) in getRowImages(rowIndex - 1)" :key="`row-${rowIndex}-img-${imgIndex}`" class="marquee__item">
								<nuxt-img
									:src="image"
									alt="Location image"
									class="w-[200px] h-[150px] sm:w-[300px] sm:h-[225px] lg:w-[400px] lg:h-[300px] xl:w-[400px] xl:h-[300px] object-cover rounded-lg shadow-md"
									width="400"
									height="300"
									loading="lazy"
									sizes="(max-width: 640px) 200px, (max-width: 1024px) 300px, 400px"
								/>
							</div>
						</div>

						<div aria-hidden="true" class="marquee__group">
							<div v-for="(image, imgIndex) in getRowImages(rowIndex - 1)" :key="`row-${rowIndex}-dup-img-${imgIndex}`" class="marquee__item">
								<nuxt-img
									:src="image"
									alt="Location image"
									class="w-[200px] h-[150px] sm:w-[300px] sm:h-[225px] lg:w-[400px] lg:h-[300px] xl:w-[400px] xl:h-[300px] object-cover rounded-lg shadow-md"
									width="400"
									height="300"
									loading="lazy"
									sizes="(max-width: 640px) 200px, (max-width: 1024px) 300px, 400px"
								/>
							</div>
						</div>
					</div>
				</div>
			</aside>
		</section>
	</div>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted } from "vue";
import { useScrollAnimation } from "~/composables/useScrollAnimation";
import { useGlobalSearch } from "~/composables/useGlobalSearch";
import ButtonCTA from "~/components/common/Button-CTA.vue";

// 注入滾動動畫控制器
const scrollAnimation = useScrollAnimation();
const { gsap, ScrollTrigger } = scrollAnimation;

// DOM 引用
const searchInput = ref(null);
const searchInputWrapperRef = ref(null);
const quickNavRef = ref(null);
const exploreButtonRef = ref(null);

// 全局搜尋 Composable
const {
	isLoading,
	keyword,
	activeTab,
	resultCounts,
	hasResults,
	currentTabResults,
	recentSearches,
	setActiveTab,
	debouncedSearch,
	navigateToResult,
	clearSearch,
	getEntityName,
	entityTypeNames,
	clearRecentSearches,
	search
} = useGlobalSearch();

// 本地狀態
const showResults = ref(false);
let blurTimeout = null;
let mainTl = null;
let searchTriggeredBySubmit = false;

// --- 快速導航連結 ---
const quickNavLinks = ref([
	{ to: "/products/video-intercom", imgSrc: "/solutions/可視對講系統.webp", alt: "可視對講", label: "可視對講" },
	{ to: "/products/access-control", imgSrc: "/solutions/人臉門禁控制.webp", alt: "門禁管理", label: "門禁管理" },
	{ to: "/products/surveillance-monitoring", imgSrc: "/solutions/智慧宅系統整合.webp", alt: "影像監控", label: "影像監控" },
	{ to: "/products/security-solutions", imgSrc: "/solutions/無線保全系統.webp", alt: "安全防護", label: "安全防護" },
	{ to: "/products/devices-accessories", imgSrc: "/solutions/智慧工地管理.webp", alt: "其他應用", label: "其他應用" }
]);

// --- 搜尋事件處理 ---
const handleInput = () => {
	showResults.value = true;
	debouncedSearch(keyword.value);
};

const handleFocus = () => {
	showResults.value = true;
	searchTriggeredBySubmit = false;
	if (!keyword.value) {
		// Composable 會處理顯示最近搜尋
	}
};

const handleBlur = () => {
	blurTimeout = setTimeout(() => {
		if (searchTriggeredBySubmit) {
			searchTriggeredBySubmit = false;
		} else {
			showResults.value = false;
		}
	}, 150);
};

const closeResultsPanel = () => {
	showResults.value = false;
	searchInput.value?.blur();
};

const handleResultClick = (entityType, item) => {
	if (blurTimeout) clearTimeout(blurTimeout);
	searchTriggeredBySubmit = false;
	navigateToResult(entityType, item);
	closeResultsPanel();
};

const searchRecent = (term) => {
	if (blurTimeout) clearTimeout(blurTimeout);
	search(term);
	showResults.value = true;
	searchInput.value?.focus();
};

const clearInputAndSearch = () => {
	clearSearch();
	keyword.value = "";
	showResults.value = true;
	searchInput.value?.focus();
};

const clearRecentSearchesAndClose = () => {
	clearRecentSearches();
	searchInput.value?.focus();
};

const triggerSearchFromEnter = () => {
	if (keyword.value.trim()) {
		if (blurTimeout) clearTimeout(blurTimeout);
		searchTriggeredBySubmit = true;
		search(keyword.value.trim());
		showResults.value = true;
	} else {
		closeResultsPanel();
	}
};
// --- 搜尋事件處理結束 ---

// --- 跑馬燈圖片資源 ---
const baseImages = ref([
	"/Location/location01.webp",
	"/Location/location02.webp",
	"/Location/location03.webp",
	"/Location/location04.webp",
	"/Location/location05.webp",
	"/Location/location06.webp"
]);

const rows = ref(5);

const getRowImages = (rowIndex) => {
	const shuffled = [...baseImages.value];
	const offset = rowIndex % shuffled.length;
	const reordered = [...shuffled.slice(offset), ...shuffled.slice(0, offset)];
	return reordered;
};

// 設置跑馬燈動畫
const setupMarqueeAnimation = async () => {
	await scrollAnimation.initScrollPlugins();
	if (!ScrollTrigger.value || !searchInputWrapperRef.value) {
		return;
	}

	// 初始設置
	gsap.set(
		[
			".marquee-wrapper",
			".search-container h2",
			".search-container h3",
			".search-container p",
			searchInputWrapperRef.value,
			quickNavRef.value,
			exploreButtonRef.value?.$el
		],
		{
			autoAlpha: 0
		}
	);
	gsap.set(".marquee-wrapper", {
		x: (index) => (index % 2 === 0 ? -100 : 100),
		scale: 0.95
	});
	gsap.set(
		[".search-container h2", ".search-container h3", ".search-container p", searchInputWrapperRef.value, quickNavRef.value, exploreButtonRef.value?.$el],
		{
			y: -40, // 改回從上方開始
			scale: 1 // 移除縮放效果
		}
	);

	gsap.set(".marquee-background", {
		backgroundColor: "rgba(33, 42, 55, 0)"
	});
	gsap.set(".search-overlay", {
		autoAlpha: 0
	});

	mainTl = gsap.timeline({
		scrollTrigger: {
			trigger: ".marquee-background",
			start: "top 70%",
			end: "bottom 20%",
			toggleActions: "play none none reverse",
			markers: false
		}
	});

	mainTl
		.to(".marquee-background", {
			backgroundColor: "rgba(33, 42, 55, 1)",
			duration: 1,
			ease: "power2.inOut"
		})
		.to(
			".search-overlay",
			{
				autoAlpha: 1,
				duration: 0.8,
				ease: "power2.inOut"
			},
			"-=0.6"
		)
		.to(
			gsap.utils.toArray(".marquee-wrapper"),
			{
				autoAlpha: 1,
				x: 0,
				scale: 1,
				duration: 0.8,
				ease: "power2.out",
				stagger: 0.15
			},
			">-0.4"
		)
		.to(
			[".search-container h2", ".search-container h3", ".search-container p", searchInputWrapperRef.value, quickNavRef.value, exploreButtonRef.value?.$el],
			{
				autoAlpha: 1,
				y: 0,
				duration: 0.6,
				ease: "power2.out",
				stagger: 0.2
			},
			">-0.3"
		);
};

onMounted(async () => {
	try {
		await nextTick();
		await setupMarqueeAnimation();
	} catch (error) {
		console.error("ProductIntro 動畫設置錯誤:", error);
	}
});

onUnmounted(() => {
	if (blurTimeout) clearTimeout(blurTimeout);
	if (mainTl) {
		mainTl.kill();
		mainTl = null;
	}
	if (scrollAnimation && typeof scrollAnimation.cleanupScrollTriggers === "function") {
		scrollAnimation.cleanupScrollTriggers();
	}
});
</script>

<style scoped>
.search-overlay {
	background-color: rgba(33, 42, 55, 0.6);
}

/* 跑馬燈基本樣式 */
.marquee-wrapper {
	position: relative;
	overflow: hidden;
	--gap: 24px;
	margin-bottom: 16px;
	will-change: transform, opacity;
}

.marquee {
	display: flex;
	position: relative;
	overflow: hidden;
	user-select: none;
	gap: var(--gap);
	will-change: transform; /* 提高動畫性能 */
}

.marquee__group {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: space-around;
	gap: var(--gap);
	min-width: 100%;
	animation: scroll 40s linear infinite;
	will-change: transform; /* 提高動畫性能 */
}

.marquee--reverse .marquee__group {
	animation-direction: reverse;
	animation-duration: 50s;
}

.marquee__item {
	flex: 0 0 auto;
	max-width: 100%;
	transform: translateZ(0); /* 促進硬體加速 */
	backface-visibility: hidden; /* 減少閃爍 */
}

/* 為不同行設定不同速度 */
.marquee-wrapper:nth-child(1) .marquee__group {
	animation-duration: 80s;
}

.marquee-wrapper:nth-child(2) .marquee__group {
	animation-duration: 100s;
}

.marquee-wrapper:nth-child(3) .marquee__group {
	animation-duration: 120s;
}

.marquee-wrapper:nth-child(4) .marquee__group {
	animation-duration: 90s;
}

.marquee-wrapper:nth-child(5) .marquee__group {
	animation-duration: 110s;
}

@keyframes scroll {
	0% {
		transform: translateX(0);
	}
	100% {
		transform: translateX(calc(-100% - var(--gap)));
	}
}

/* === 搜尋相關樣式開始 === */
.search-container {
	will-change: transform, opacity;
}

.search-results {
	transform-origin: top center;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	animation: fadeInScale 0.2s ease-out;
	/* 確保結果面板在搜尋框之上，但在 overlay 之下 */
	/* z-index 在 Tailwind 中為 z-20，已足夠 */
}

@keyframes fadeInScale {
	from {
		opacity: 0;
		transform: translateY(-10px) scale(0.98);
	}
	to {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}

/* 自定義滾動條 */
.scrollbar-thin::-webkit-scrollbar {
	width: 6px;
	height: 6px;
}

.scrollbar-thumb-slate-300::-webkit-scrollbar-thumb {
	background-color: #cbd5e1; /* slate-300 */
	border-radius: 6px;
}

.scrollbar-thumb-slate-300:hover::-webkit-scrollbar-thumb {
	background-color: #94a3b8; /* slate-400 */
}

.scrollbar-track-transparent::-webkit-scrollbar-track {
	background-color: transparent;
}
/* === 搜尋相關樣式結束 === */
</style>
