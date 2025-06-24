<template>
	<div>
		<!-- 系列介紹 -->
		<section class="bg-white relative overflow-hidden space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-12 pb-4 sm:pb-6 md:pb-8 lg:pb-10 xl:pb-12">
			<article
				ref="seriesIntroductionArticleRef"
				style="opacity: 0"
				class="hidden md:block md:w-2/3 aspect-square absolute top-0 right-0 translate-x-1/3 -translate-y-1/3"
			>
				<span class="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
					>應用介紹</span
				>
				<svg viewBox="0 0 800 800" class="circles">
					<circle cx="400" cy="400" r="200" class="circle-inline" />
					<circle cx="400" cy="400" r="400" class="circle-outline" />
				</svg>
			</article>
			<!-- content -->
			<aside class="md:min-h-screen flex flex-col">
				<!-- title -->
				<div ref="titleContentRef" style="opacity: 0" class="ms-4 sm:ms-6 md:ms-8 lg:ms-12 xl:ms-16 space-y-2 md:space-y-4">
					<h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl opacity-50 font-bold">門禁管理</h1>
					<p class="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl opacity-30">以人臉、卡片、QR Code 或車牌等多元識別技術</p>
					<p class="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl opacity-30 ms-8 sm:ms-12 md:ms-16 lg:ms-20 xl:ms-24">
						打造可追蹤的出入口權限控制
					</p>
				</div>
				<!-- List CTA -->
				<div class="mt-4 sm:mt-6 md:mt-8 lg:mt-10 xl:mt-12">
					<div v-if="navError" class="text-red-500 p-4">{{ navError }}</div>
					<NavList
						v-else
						ref="navListRef"
						:categories="productCategories"
						:is-loading="isLoadingNav"
						@category-selected="handleCategorySelected"
						@subitem-selected="handleSubItemSelected"
					/>
				</div>
			</aside>
			<!-- introduction -->
			<div
				class="mx-auto md:absolute md:top-2/3 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10 w-2/3 md:w-1/2 px-4 sm:px-6 md:px-0"
				ref="introductionContainerRef"
			>
				<SkeletonIntroduction v-if="isLoadingNav" />
				<TransitionGroup
					v-else-if="currentIntroductionDisplayItems.length > 0"
					tag="div"
					name="introduction-card-list"
					class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"
				>
					<div
						v-for="(item, index) in currentIntroductionDisplayItems"
						:key="item.title"
						:data-index="index"
						class="bg-slate-50 border border-slate-200 rounded-lg shadow-md p-3 sm:p-4 text-center"
					>
						<h4 class="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-slate-800 mb-1 sm:mb-2">{{ item.title }}</h4>
						<p class="text-xs sm:text-sm md:text-base text-slate-600">{{ item.content }}</p>
					</div>
				</TransitionGroup>
				<div v-else-if="!isLoadingNav && productCategories.length === 0" class="text-center text-gray-500 py-6 sm:py-8">
					<p class="text-sm sm:text-base">目前沒有可供選擇的介紹項目。</p>
				</div>
			</div>
		</section>

		<!-- 產品列表 -->
		<section class="bg-gray-50">
			<div class="container mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16 lg:py-20 space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20 xl:space-y-24">
				<!-- 載入狀態和錯誤處理 -->
				<div v-if="isLoadingProducts" class="text-center py-10 sm:py-12">
					<!-- Skeleton Loader -->
					<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
						<SkeletonProductCard v-for="n in 8" :key="n" />
					</div>
				</div>
				<div v-else-if="productsError" class="bg-red-50 text-red-500 p-3 sm:p-4 rounded-lg my-3 sm:my-4 text-sm sm:text-base">{{ productsError }}</div>
				<div v-else>
					<!-- 各分類區塊 -->
					<div v-for="category in computedDisplayCategories" :key="category._id" class="space-y-6 sm:space-y-8 md:space-y-12 lg:space-y-16">
						<!-- 分類標題 -->
						<h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold py-4 sm:py-6 md:py-8 text-center border-b-2 border-primary/50">
							{{ getCategoryName(category) }}
						</h2>
						<!-- 子分類內容 -->
						<div
							v-for="subCategory in category.subCategories || []"
							:key="subCategory._id"
							:id="`subcategory-${subCategory._id}`"
							class="scroll-mt-24 mb-10 sm:mb-12 md:mb-16 space-y-4 sm:space-y-6"
						>
							<div class="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
								<!-- 子分類標題 -->
								<h3 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-primary/80 flex-shrink-0">{{ getCategoryName(subCategory) }}</h3>
								<!-- 規格篩選器 (只在子分類級別有規格時顯示) -->
								<div v-if="hasSpecifications(subCategory)" class="w-fit">
									<FilterSection
										:options="getSpecifications(subCategory)"
										v-model="filterValues[subCategory._id]"
										:filter-key="String(subCategory._id)"
										:is-localized-options="true"
									/>
								</div>
							</div>
							<!-- 產品展示 (使用 ProductList) -->
							<ProductList :products="prepareProductsForList(getFilteredProducts(subCategory))" :loading="false" @view-product="handleViewProduct" />
						</div>
					</div>
					<!-- 如果 computedDisplayCategories 為空 -->
					<div v-if="computedDisplayCategories.length === 0 && !isLoadingProducts" class="text-center py-10 sm:py-12 text-gray-500 text-sm sm:text-base">
						沒有找到符合條件的分類或產品。
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, watch, nextTick } from "vue";
import { useLanguageStore } from "~/stores/core/languageStore";
import { useHierarchyStore } from "~/stores/hierarchyStore";
import { useScrollAnimation } from "~/composables/useScrollAnimation";
import NavList from "~/components/products/NavList.vue";
import FilterSection from "~/components/products/FilterSection.vue";
import SkeletonProductCard from "~/components/products/SkeletonProductCard.vue";
import ProductList from "~/components/products/ProductList.vue";
import SkeletonIntroduction from "~/components/products/SkeletonIntroduction.vue";
import { useRouter } from "vue-router";
import { useHead } from "#app";

const languageStore = useLanguageStore();
const hierarchyStore = useHierarchyStore();
const { gsap } = useScrollAnimation();
const router = useRouter();

// 設定網頁標題和描述
useHead({
	title: " - 門禁管理",
	meta: [{ name: "description", content: "探索遠岫科技的門禁管理解決方案，包括人臉辨識、卡片、QR Code 及車牌辨識技術，打造可追蹤的出入口權限控制。" }]
});

// 導航相關狀態
const isLoadingNav = ref(false);
const navError = ref(null);
const navListRef = ref(null);
const activeIntroductionCategoryName = ref("");
const introductionContainerRef = ref(null);
const titleContentRef = ref(null);
const seriesIntroductionArticleRef = ref(null);

// 介紹內容數據
const introductionItemsMap = {
	門禁控制: [
		{ title: "辦公大樓", content: "員工刷臉即通行，無接觸、卡片遺失困擾" },
		{ title: "工業園區", content: "結合人臉+排班資料控管進出紀錄，強化考勤與權限管理" },
		{ title: "住宅社區", content: "住戶刷臉進出社區、電梯自動到樓層，提升尊榮感與安全" },
		{ title: "校園與補習班", content: "師生/學生進出刷臉紀錄，家長即時接收進出通知" }
	],
	通關機: [
		{ title: "學校/補習班", content: "學生臉部識別＋體溫偵測，結合家長通報系統" },
		{ title: "醫療場域", content: "自動化訪客控管流程，降低人力負擔、提升通行效率" },
		{ title: "建案社區", content: "結合門禁及電梯通行權限，打造智能化社區通行體驗" },
		{ title: "工地管理", content: "工人刷臉進出、搭配工時與出勤紀錄，強化現場安全與紀律管理" }
	],
	車牌辨識管理系統: [
		{ title: "社區與建案停車場", content: "自動辨識住戶車牌，自動開啟柵欄，提升通行效率與便利性" },
		{ title: "企業/工廠車道管理", content: "自動記錄員工與物流車輛出入時間，結合雷達偵測防止追車闖關" },
		{ title: "收費停車場", content: "搭配通關機與票證系統，整合臨停與月租邏輯" },
		{ title: "物流倉儲中心", content: "系統化管理貨車進出時段，結合監控即時畫面與資料留存" }
	],
	訪客管理系統: [
		{ title: "企業辦公大樓", content: "訪客預約與到場身份驗證，提升櫃台效率與專業形象" },
		{ title: "科技廠區/物流場域", content: "控管訪客、外包人員進出紀錄與逗留時長，落實安控紀錄" },
		{ title: "醫療院所/養護機構", content: "每日訪客實名制與健康資料快篩，提高感染防控力" },
		{ title: "社區建案接待中心", content: "搭配人臉建檔、動線引導與臨時通行整合，提升住戶與訪客雙方體驗" }
	]
};

const currentIntroductionDisplayItems = computed(() => {
	return introductionItemsMap[activeIntroductionCategoryName.value] || [];
});

// 產品相關狀態
const productCategories = ref([]);
const filterValues = reactive({});
const isLoadingProducts = ref(false);
const productsError = ref(null);

// 假設 'video-intercom' 是此系列在資料庫中的 ID 或唯一標識符
const SERIES_ID = "67ed0512296210e234e0de10";

// 獲取本地化名稱的輔助函數
const getCategoryName = (item) => {
	if (!item) return "";
	return languageStore.getLocalizedField(item, "name") || item.title || "";
};

// 檢查子分類是否有規格
const hasSpecifications = (subCategory) => {
	return subCategory && Array.isArray(subCategory.specifications) && subCategory.specifications.length > 0;
};

// 獲取子分類的規格選項
const getSpecifications = (subCategory) => {
	if (!hasSpecifications(subCategory)) return [];
	return [{ _id: "ALL", name: { zh: "ALL" } }, ...subCategory.specifications];
};

// 獲取經過篩選的產品
const getFilteredProducts = (subCategory) => {
	// 檢查 subCategory 和 specifications 是否有效
	if (!subCategory || !Array.isArray(subCategory.specifications)) {
		return [];
	}

	const filterValue = filterValues[subCategory._id] || "ALL";
	let productsToShow = [];

	// 遍歷子分類下的所有規格
	for (const specification of subCategory.specifications) {
		// 檢查該規格下是否有產品陣列
		if (specification && Array.isArray(specification.products)) {
			if (filterValue === "ALL") {
				// 如果篩選器是 ALL，添加該規格下的所有產品
				productsToShow = productsToShow.concat(specification.products);
			} else if (specification._id === filterValue) {
				// 如果篩選器匹配當前規格 ID，只添加該規格下的產品
				productsToShow = productsToShow.concat(specification.products);
				// 因為篩選器值對應單一規格，找到匹配的就可以停止遍歷此子分類的規格了
				break;
			}
		}
	}

	return productsToShow;
};

// 使用 Computed Property 計算需要顯示的分類
const computedDisplayCategories = computed(() => {
	return productCategories.value;
});

// NavList 選擇事件處理
const handleCategorySelected = (category) => {
	const name = getCategoryName(category);
	activeIntroductionCategoryName.value = name;
};

const handleSubItemSelected = ({ subItem }) => {
	if (subItem && subItem._id) {
		const elementId = `#subcategory-${subItem._id}`;
		nextTick(() => {
			const element = document.querySelector(elementId);
			if (element && gsap) {
				gsap.to(window, {
					duration: 1.2,
					scrollTo: {
						y: element,
						offsetY: 100 // 考慮到頂部可能有固定的導航欄，保留一些空間
					},
					ease: "power2.inOut"
				});
			}
		});
	}
};

// Handle product click from ProductList
const handleViewProduct = (product) => {
	if (product && product._id) {
		router.push(`/products/${product._id}`);
	}
};

// 添加 watch 來監控 filterValues 的變化
watch(filterValues, (newValue, oldValue) => {}, { deep: true });

// 監聽導航載入狀態，觸發動畫
watch(isLoadingNav, (newVal, oldVal) => {
	if (gsap) {
		// NavList animation - Animate only when NavList is actually rendered and not in loading state
		if (!newVal && oldVal === true && navListRef.value && productCategories.value.length > 0) {
			nextTick(() => {
				const targetNavList = navListRef.value.$el || navListRef.value;
				if (targetNavList && targetNavList.offsetParent !== null) {
					gsap.from(targetNavList, {
						x: -50,
						opacity: 0,
						duration: 1.5, // Adjusted duration
						ease: "power3.out"
					});
				}
				// Series Introduction Article animation
				if (seriesIntroductionArticleRef.value) {
					gsap.to(seriesIntroductionArticleRef.value, {
						opacity: 1,
						duration: 1.5, // Adjusted duration
						ease: "power3.out",
						delay: 0.2 // Adjusted delay
					});
				}
			});
		}
	}
});

const prepareProductsForList = (products) => {
	if (!products) return [];
	return products.map((product) => ({
		...product,
		displayName: getCategoryName(product)
	}));
};

onMounted(async () => {
	const { initScrollPlugins: initGsapScrollPlugins, gsap: gsapInstance } = useScrollAnimation();
	await initGsapScrollPlugins();

	isLoadingNav.value = true;
	isLoadingProducts.value = true;
	navError.value = null;
	productsError.value = null;
	activeIntroductionCategoryName.value = ""; // 初始化

	// Title content animation
	if (gsapInstance && titleContentRef.value) {
		gsapInstance.from(titleContentRef.value.children, {
			opacity: 0,
			y: 30,
			stagger: 0.25,
			duration: 0.7,
			ease: "power2.out",
			delay: 0.3
		});
		gsapInstance.to(titleContentRef.value, {
			opacity: 1,
			duration: 0.01,
			delay: 0.3
		});
	}

	try {
		const subHierarchy = await hierarchyStore.fetchSubHierarchy("series", SERIES_ID);

		// 處理 productCategories 資料
		if (subHierarchy && Array.isArray(subHierarchy.categories)) {
			productCategories.value = subHierarchy.categories;
		} else if (Array.isArray(subHierarchy)) {
			// 兼容直接返回陣列的情況
			productCategories.value = subHierarchy;
		} else {
			productCategories.value = [];
		}

		// 初始化 filterValues 之前
		productCategories.value.forEach((category) => {
			filterValues[category._id] = "ALL";
			if (category.subCategories) {
				category.subCategories.forEach((subCategory) => {
					filterValues[subCategory._id] = "ALL";
				});
			}
		});

		// 設置默認選中的介紹內容
		if (productCategories.value.length > 0) {
			const firstCategoryName = getCategoryName(productCategories.value[0]);
			activeIntroductionCategoryName.value = firstCategoryName;
		}

		isLoadingNav.value = false;
	} catch (error) {
		navError.value = "無法載入導覽選單：" + (error.message || "未知錯誤");
		productsError.value = "無法載入產品資料：" + (error.message || "未知錯誤");
		productCategories.value = [];
		isLoadingNav.value = false;
	} finally {
		isLoadingProducts.value = false;
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
	stroke-dasharray: 100 50;
	animation-duration: 20s;
	animation-timing-function: linear;
	animation-iteration-count: infinite;
}

.circle-inline {
	stroke: #00a8a9;
	animation-name: dash-clockwise;
}

.circle-outline {
	stroke: #39b3cc;
	animation-name: dash-counter-clockwise;
}

@keyframes dash-clockwise {
	from {
		stroke-dashoffset: 0;
	}
	to {
		stroke-dashoffset: 600;
	}
}

@keyframes dash-counter-clockwise {
	from {
		stroke-dashoffset: 600;
	}
	to {
		stroke-dashoffset: 0;
	}
}

/* Introduction Card List Animations */
.introduction-card-list-enter-active,
.introduction-card-list-leave-active {
	transition: all 0.5s ease;
}
.introduction-card-list-enter-from,
.introduction-card-list-leave-to {
	opacity: 0;
	transform: translateY(30px);
}

/* Staggering effect for enter */
.introduction-card-list-enter-active {
	transition-delay: calc(0.1s * var(--stagger-index, 0));
}

/* For leave, items usually disappear more simultaneously or with a reverse stagger if desired */
.introduction-card-list-leave-active {
	position: absolute; /* Important for leave animations to not affect layout */
}

/* Responsive adjustments for circles */
@media (max-width: 640px) {
	.circle-inline,
	.circle-outline {
		stroke-dasharray: 70 35; /* Smaller dash pattern for smaller screens */
		stroke-width: 1.5; /* Slightly thinner lines */
	}
}
</style>
