<template>
	<div>
		<!-- 系列介紹 -->
		<section class="bg-white relative overflow-hidden space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-12 pb-4 sm:pb-6 md:pb-8 lg:pb-10 xl:pb-12">
			<SeriesSwitcher />
			<!-- content -->
			<aside class="md:min-h-screen flex flex-col">
				<!-- title -->
				<div ref="titleContentRef" style="opacity: 0" class="ms-4 sm:ms-6 md:ms-8 lg:ms-12 xl:ms-16 space-y-2 md:space-y-4">
					<h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl opacity-50 font-bold">安全防護</h1>
					<p class="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl opacity-30">結合無線感測、火災預警與安檢設備</p>
					<p class="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl opacity-30 ms-8 sm:ms-12 md:ms-16 lg:ms-20 xl:ms-24">
						提供多層次主動安全防護方案
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
				<ProductSearch />
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
							<ProductList :products="prepareProductsForList(getFilteredProducts(subCategory))" :loading="false" />
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
import SeriesSwitcher from "~/components/products/SeriesSwitcher.vue";
import ProductSearch from "~/components/products/ProductSearch.vue";

const languageStore = useLanguageStore();
const hierarchyStore = useHierarchyStore();
const { gsap } = useScrollAnimation();
const router = useRouter();

useHead({
	title: " - 安全防護",
	meta: [{ name: "description", content: "了解遠岫科技的安全防護方案，我們結合無線感測、火災預警與安檢設備，提供多層次的主動安全防護。" }]
});

// 設置當前系列資訊
hierarchyStore.setCurrentSeries({
	name: "安全防護",
	slug: "security-solutions"
});

// 導航相關狀態
const isLoadingNav = ref(false);
const navError = ref(null);
const navListRef = ref(null);
const activeIntroductionCategoryName = ref("");
const introductionContainerRef = ref(null);
const titleContentRef = ref(null);

// 介紹內容數據
const introductionItemsMap = {
	火災警報: [
		{ title: "工廠/倉儲區", content: "堆料易燃物集中，高風險區域主動監控" },
		{ title: "電力/機房設備室", content: "即時偵測過熱預防電氣火災" },
		{ title: "農業林地/建築工地", content: "戶外獨立型部署，第一時間掌握火源" },
		{ title: "停車場/地下室", content: "空氣不流通處提早預警火煙異常" }
	],
	金屬檢測門: [
		{ title: "機場/車站", content: "確保旅客行李與身上無攜帶危險物品" },
		{ title: "考場/法務單位", content: "杜絕舞弊與防止違禁品帶入" },
		{ title: "展演會場/大型活動", content: "防範不明攜帶物造成突發危安事件" },
		{ title: "工廠/倉儲入口", content: "防止工具或金屬外流，提高財物管理控管" }
	],
	人體測溫: [
		{ title: "醫療院所", content: "人員體溫監控搭配緊急警報機制，守護醫療場域穩定" },
		{ title: "工廠與倉儲", content: "結合防爆火警警報、金屬探測與人體測溫，防範工安意外" },
		{ title: "百貨商場/交通場站", content: "整合金屬偵測、人流測溫與火警通報，提升營運安全水準" }
	],
	無線警報: [
		{ title: "高階住宅/別墅", content: "快速布建、無需拉線，支援室內外感測與語音通知，提升主動防護力" },
		{ title: "臨時工地與活動場域", content: "採用4G/Wi-Fi雙通道連線＋鋰電備援設計，適合無電源場域臨時部署" },
		{ title: "學校/診所/門市", content: "可透過App監控與管理人員進出，支援警報語音提示與通知推播" },
		{ title: "連鎖場域/中小型商業", content: "中央平台統一管理多據點布撤防與事件記錄，減輕人力依賴" }
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
const SERIES_ID = "67ed0512296210e234e0deb2";

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
	activeIntroductionCategoryName.value = "";

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
</style>
