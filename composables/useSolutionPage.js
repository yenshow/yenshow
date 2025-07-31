import { ref, computed, onMounted, nextTick, reactive } from "vue";
import { useHead } from "#app";
import { solutions } from "~/data/solutions.js";
import { useScrollAnimation } from "~/composables/useScrollAnimation";
import { useLanguageStore } from "~/stores/core/languageStore";
import { useHierarchyStore } from "~/stores/hierarchyStore";

export function useSolutionPage(slug) {
	// --- Data ---
	const solutionData = computed(() => solutions[slug]);
	const featuresData = computed(() => solutionData.value.features || []);

	const embedUrl = computed(() => {
		if (!solutionData.value.videoUrl) return "";
		try {
			const url = new URL(solutionData.value.videoUrl);
			const videoId = url.searchParams.get("v");
			if (videoId) {
				return `https://www.youtube.com/embed/${videoId}?mute=1&rel=0`;
			}
		} catch (error) {
			console.error("Invalid video URL:", error);
		}
		return "";
	});

	// --- Navigation ---
	const solutionSlugs = Object.keys(solutions);
	const currentIndex = solutionSlugs.indexOf(slug);

	const getSolutionByOffset = (offset) => {
		const targetIndex = (currentIndex + offset + solutionSlugs.length) % solutionSlugs.length;
		const targetSlug = solutionSlugs[targetIndex];
		return {
			...solutions[targetSlug],
			slug: targetSlug
		};
	};

	const prevSolution = getSolutionByOffset(-1);
	const nextSolution = getSolutionByOffset(1);

	// --- Head ---
	useHead({
		title: `${solutionData.value.meta.title}`,
		meta: [{ name: "description", content: solutionData.value.meta.description }]
	});

	// --- Product Logic (from useSolution) ---
	const languageStore = useLanguageStore();
	const hierarchyStore = useHierarchyStore();
	const isLoadingProducts = ref(false);
	const productsError = ref(null);
	const allProducts = ref([]);
	const activeFilters = reactive({});

	if (solutionData.value && solutionData.value.features) {
		solutionData.value.features.forEach((feature) => {
			if (feature.buttons && feature.buttons.length > 0) {
				activeFilters[feature.id] = feature.buttons[0];
			}
		});
	}

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
		if (!solutionData.value || !solutionData.value.relevantSeries) {
			console.warn("Solution data or relevantSeries is missing.");
			return;
		}

		isLoadingProducts.value = true;
		productsError.value = null;

		try {
			const seriesToFetch = solutionData.value.relevantSeries || [];
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

	const filteredProductsByFeature = computed(() => {
		const result = {};

		if (!solutionData.value || !solutionData.value.features) {
			return result;
		}

		if (!allProducts.value.length) {
			solutionData.value.features.forEach((feature) => {
				result[feature.id] = [];
			});
			return result;
		}

		solutionData.value.features.forEach((feature) => {
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

	const handleFilterSelection = (payload) => {
		const { featureId, ...filterOptions } = payload;
		if (activeFilters[featureId] !== undefined) {
			activeFilters[featureId] = filterOptions;
		}
	};

	// --- Animations & Interactions ---
	const { initScrollPlugins, createElementEntrance, gsap, isMobile } = useScrollAnimation();

	const scrollToFeature = (featureId) => {
		const element = document.getElementById(featureId);
		if (element && gsap) {
			gsap.to(window, {
				duration: 1,
				ease: "power2.inOut",
				scrollTo: {
					y: element,
					offsetY: isMobile.value ? 80 : 100
				}
			});
		} else if (element) {
			element.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	const getFeatureTagClass = (color) => {
		const base =
			"transform inline-block rounded-lg border px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:text-white hover:shadow-lg";
		const colorMap = {
			orange: "border-orange-400/80 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:shadow-orange-500/30",
			green: "border-green-400/80 bg-green-50 text-green-600 hover:bg-green-500 hover:shadow-green-500/30",
			blue: "border-blue-400/80 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:shadow-blue-500/30",
			purple: "border-purple-400/80 bg-purple-50 text-purple-600 hover:bg-purple-500 hover:shadow-purple-500/30",
			sky: "border-sky-400/80 bg-sky-50 text-sky-600 hover:bg-sky-500 hover:shadow-sky-500/30",
			emerald: "border-emerald-400/80 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-500/30",
			amber: "border-amber-400/80 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:shadow-amber-500/30",
			indigo: "border-indigo-400/80 bg-indigo-50 text-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/30",
			default: "border-gray-400/80 bg-gray-50 text-gray-600 hover:bg-gray-500 hover:shadow-gray-500/30"
		};
		return `${base} ${colorMap[color] || colorMap.default}`;
	};

	const animateHeroSection = () => {
		if (!gsap) return;
		const tl = gsap.timeline({ defaults: { duration: 0.9, ease: "power2.out" } });
		tl.from(".hero-anim-h1", { opacity: 0, y: 20, delay: 0.2 })
			.from(".hero-anim-h2", { opacity: 0, y: 30 }, "-=0.7")
			.from(".hero-anim-p", { opacity: 0, y: 30 }, "-=0.7")
			.from(".hero-anim-nav", { opacity: 0, y: 20, stagger: 0.1 }, "-=0.6")
			.from(".hero-anim-img", { opacity: 0, scale: 0.9, duration: 1.2 }, "-=0.8")
			.from(".hero-anim-prev", { opacity: 0, x: -50 }, "-=1")
			.from(".hero-anim-next", { opacity: 0, x: 50 }, "-=1");
	};

	const setupScrollAnimations = () => {
		if (!createElementEntrance) return;
		const featureSections = document.querySelectorAll(".feature-section");
		if (featureSections.length) {
			featureSections.forEach((section) => {
				createElementEntrance({
					elements: section,
					trigger: section,
					fromY: isMobile.value ? 40 : 80,
					duration: 1,
					delay: 0,
					start: "top 85%",
					toggleActions: "play none none none"
				});
			});
		}
	};

	// Lifecycle hooks
	onMounted(async () => {
		await initScrollPlugins();
		nextTick(() => {
			animateHeroSection();
			setupScrollAnimations();
		});
	});

	return {
		solutionData,
		featuresData,
		embedUrl,
		prevSolution,
		nextSolution,
		scrollToFeature,
		getFeatureTagClass,
		isLoadingProducts,
		productsError,
		activeFilters,
		filteredProductsByFeature,
		fetchAllProducts,
		handleFilterSelection
	};
}
