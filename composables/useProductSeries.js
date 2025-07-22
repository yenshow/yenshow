import { ref, onMounted, reactive, computed, watch, nextTick } from "vue";
import { useLanguageStore } from "~/stores/core/languageStore";
import { useHierarchyStore } from "~/stores/hierarchyStore";
import { useScrollAnimation } from "~/composables/useScrollAnimation";
import { useRouter } from "vue-router";

export function useProductSeries(config) {
	const { seriesId, seriesSlug, introductionItemsMap } = config;

	const languageStore = useLanguageStore();
	const hierarchyStore = useHierarchyStore();
	const { gsap } = useScrollAnimation();
	const router = useRouter();

	// === STATE ===
	const isLoadingNav = ref(false);
	const navError = ref(null);
	const productCategories = ref([]);
	const filterValues = reactive({});
	const isLoadingProducts = ref(false);
	const productsError = ref(null);
	const activeIntroductionCategoryName = ref("");

	// Template Refs
	const navListRef = ref(null);
	const introductionContainerRef = ref(null);
	const titleContentRef = ref(null);

	// === COMPUTED ===
	const currentIntroductionDisplayItems = computed(() => {
		return introductionItemsMap[activeIntroductionCategoryName.value] || [];
	});

	const computedDisplayCategories = computed(() => {
		return productCategories.value;
	});

	// === METHODS ===
	const hasSpecifications = (subCategory) => {
		return subCategory && Array.isArray(subCategory.specifications) && subCategory.specifications.length > 0;
	};

	const getSpecifications = (subCategory) => {
		if (!hasSpecifications(subCategory)) return [];
		return [{ _id: "ALL", name: { zh: "ALL" } }, ...subCategory.specifications];
	};

	const prepareProductsForList = (products, subCategoryId) => {
		if (!products) return [];
		return products.map((product) => ({
			...product,
			displayName: languageStore.getCategoryName(product),
			onClick: () => {
				// 記住當前子分類ID
				hierarchyStore.setLastActiveSubCategoryId(subCategoryId);
				router.push(`/products/${product.code.toLowerCase()}`);
			}
		}));
	};

	const getFilteredProducts = (subCategory) => {
		if (!subCategory || !Array.isArray(subCategory.specifications)) {
			return [];
		}

		const filterValue = filterValues[subCategory._id] || "ALL";
		let productsToShow = [];

		for (const specification of subCategory.specifications) {
			if (specification && Array.isArray(specification.products)) {
				if (filterValue === "ALL") {
					productsToShow = productsToShow.concat(specification.products);
				} else if (specification._id === filterValue) {
					productsToShow = productsToShow.concat(specification.products);
					break;
				}
			}
		}
		return productsToShow;
	};

	const handleCategorySelected = (category) => {
		const name = languageStore.getCategoryName(category);
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
						scrollTo: { y: element, offsetY: 100 },
						ease: "power2.inOut"
					});
				}
			});
		}
	};

	// === WATCHERS ===
	watch(
		filterValues,
		(newFilters) => {
			hierarchyStore.setSeriesPageFilter(seriesSlug, newFilters);
		},
		{ deep: true }
	);

	watch(isLoadingNav, (newVal, oldVal) => {
		if (gsap && !newVal && oldVal === true && navListRef.value && productCategories.value.length > 0) {
			nextTick(() => {
				const targetNavList = navListRef.value.$el || navListRef.value;
				if (targetNavList && targetNavList.offsetParent !== null) {
					gsap.from(targetNavList, {
						x: -50,
						opacity: 0,
						duration: 1.5,
						ease: "power3.out"
					});
				}
			});
		}
	});

	// === LIFECYCLE HOOKS ===
	onMounted(async () => {
		const { initScrollPlugins: initGsapScrollPlugins, gsap: gsapInstance } = useScrollAnimation();
		await initGsapScrollPlugins();

		isLoadingNav.value = true;
		isLoadingProducts.value = true;
		navError.value = null;
		productsError.value = null;
		activeIntroductionCategoryName.value = "";

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
			const subHierarchy = await hierarchyStore.fetchSubHierarchy("series", seriesId);

			if (subHierarchy && Array.isArray(subHierarchy.categories)) {
				productCategories.value = subHierarchy.categories;
			} else if (Array.isArray(subHierarchy)) {
				productCategories.value = subHierarchy;
			} else {
				productCategories.value = [];
			}

			const savedFilters = hierarchyStore.seriesPageFilters[seriesSlug];

			productCategories.value.forEach((category) => {
				if (!savedFilters) {
					filterValues[category._id] = "ALL";
				}
				if (category.subCategories) {
					category.subCategories.forEach((subCategory) => {
						filterValues[subCategory._id] = savedFilters?.[subCategory._id] || "ALL";
					});
				}
			});

			if (productCategories.value.length > 0) {
				const firstCategoryName = languageStore.getCategoryName(productCategories.value[0]);
				activeIntroductionCategoryName.value = firstCategoryName;
			}
		} catch (error) {
			const errorMessage = error.message || "未知錯誤";
			navError.value = "無法載入導覽選單：" + errorMessage;
			productsError.value = "無法載入產品資料：" + errorMessage;
			productCategories.value = [];
		} finally {
			isLoadingNav.value = false;
			isLoadingProducts.value = false;

			// 檢查是否需要滾動到特定位置
			nextTick(() => {
				const targetId = hierarchyStore.lastActiveSubCategoryId;
				if (targetId) {
					const element = document.querySelector(`#subcategory-${targetId}`);
					if (element && gsap) {
						gsap.to(window, {
							duration: 1.0,
							scrollTo: { y: element, offsetY: 100 },
							ease: "power2.inOut",
							onComplete: () => {
								// 滾動完成後清除ID，避免下次載入時再次觸發
								hierarchyStore.setLastActiveSubCategoryId(null);
							}
						});
					} else {
						// 如果找不到元素，也要清除ID
						hierarchyStore.setLastActiveSubCategoryId(null);
					}
				}
			});
		}
	});

	// === RETURN ===
	return {
		// State & Refs
		isLoadingNav,
		navError,
		productCategories,
		filterValues,
		isLoadingProducts,
		productsError,
		currentIntroductionDisplayItems,
		computedDisplayCategories,
		navListRef,
		introductionContainerRef,
		titleContentRef,
		// Methods
		hasSpecifications,
		getSpecifications,
		prepareProductsForList,
		getFilteredProducts,
		handleCategorySelected,
		handleSubItemSelected
	};
}
