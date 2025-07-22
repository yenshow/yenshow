import { ref, reactive, computed } from "vue";
import { useLanguageStore } from "~/stores/core/languageStore";
import { useHierarchyStore } from "~/stores/hierarchyStore";

export function useSolution(solutionData) {
	const languageStore = useLanguageStore();
	const hierarchyStore = useHierarchyStore();

	// State
	const isLoadingProducts = ref(false);
	const productsError = ref(null);
	const allProducts = ref([]);
	const activeFilters = reactive({});

	// Initialization
	if (solutionData && solutionData.features) {
		solutionData.features.forEach((feature) => {
			if (feature.buttons && feature.buttons.length > 0) {
				activeFilters[feature.id] = feature.buttons[0];
			}
		});
	}

	// Methods
	const prepareProductsForList = (products) => {
		if (!products) return [];
		return products.map((product) => ({
			...product,
			displayName: languageStore.getCategoryName(product)
		}));
	};

	const extractProductsFromHierarchy = (subHierarchy) => {
		if (!subHierarchy || !Array.isArray(subHierarchy.categories)) {
			return [];
		}
		return subHierarchy.categories.flatMap(
			(category) =>
				category.subCategories?.flatMap(
					(subCategory) =>
						subCategory.specifications?.flatMap(
							(spec) =>
								spec.products?.map((p) => ({
									...p,
									_category: category,
									_subCategory: subCategory
								})) || []
						) || []
				) || []
		);
	};

	const fetchAllProducts = async () => {
		if (!solutionData || !solutionData.relevantSeries) {
			console.warn("Solution data or relevantSeries is missing.");
			return;
		}

		isLoadingProducts.value = true;
		productsError.value = null;

		try {
			const seriesToFetch = solutionData.relevantSeries || [];
			if (seriesToFetch.length === 0) {
				allProducts.value = [];
				return;
			}

			const seriesPromises = seriesToFetch.map((seriesId) =>
				hierarchyStore.fetchSubHierarchy("series", seriesId).catch((error) => {
					console.warn(`Failed to fetch products from series ${seriesId}:`, error);
					return null;
				})
			);

			const results = await Promise.all(seriesPromises);
			const products = results.flatMap((subHierarchy) => extractProductsFromHierarchy(subHierarchy));
			allProducts.value = products;
		} catch (error) {
			console.error("Error fetching products:", error);
			productsError.value = "無法載入產品資料：" + (error.message || "未知錯誤");
		} finally {
			isLoadingProducts.value = false;
		}
	};

	// Computed Properties
	const filteredProductsByFeature = computed(() => {
		const result = {};

		if (!allProducts.value.length) {
			solutionData.features.forEach((feature) => {
				result[feature.id] = [];
			});
			return result;
		}

		solutionData.features.forEach((feature) => {
			const featureId = feature.id;
			const activeFilter = activeFilters[featureId];

			if (!activeFilter) {
				result[featureId] = [];
				return;
			}

			const { category: targetCategory, subCategory: targetSubCategory } = activeFilter;

			if (!targetCategory) {
				result[featureId] = [];
				return;
			}

			const filtered = allProducts.value.filter((product) => {
				const categoryName = product._category ? languageStore.getCategoryName(product._category) : "";
				const subCategoryName = product._subCategory ? languageStore.getCategoryName(product._subCategory) : "";
				const isCategoryMatch = categoryName.toLowerCase() === targetCategory.toLowerCase();

				if (targetSubCategory) {
					return isCategoryMatch && subCategoryName.toLowerCase() === targetSubCategory.toLowerCase();
				} else {
					return isCategoryMatch;
				}
			});

			result[featureId] = prepareProductsForList(filtered.slice(0, 4));
		});

		return result;
	});

	// Event Handlers
	const handleFilterSelection = (payload) => {
		const { featureId, ...filterOptions } = payload;
		if (activeFilters[featureId] !== undefined) {
			activeFilters[featureId] = filterOptions;
		}
	};

	return {
		isLoadingProducts,
		productsError,
		activeFilters,
		filteredProductsByFeature,
		fetchAllProducts,
		handleFilterSelection
	};
}
