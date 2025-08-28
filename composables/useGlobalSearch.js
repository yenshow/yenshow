import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useSearchStore } from "@/stores/core/searchStore";
import { useLanguageStore } from "@/stores/core/languageStore";

export function useGlobalSearch() {
	const { t } = useI18n();
	const searchStore = useSearchStore();
	const languageStore = useLanguageStore();
	const router = useRouter();
	const localePath = useLocalePath();

	// 本地輸入關鍵字，用於防抖處理
	const inputKeyword = ref("");

	// 系列 ID 到路由 slug 的映射
	const seriesIdToSlugMap = {
		"67ed0511296210e234e0ddd7": "video-intercom", // 可視對講
		"67ed0512296210e234e0de10": "access-control", // 門禁管理
		"67ed0512296210e234e0df00": "devices-accessories", // 其他設備
		"67ed0512296210e234e0deb2": "security-solutions", // 安全防護
		"67ed0512296210e234e0de64": "surveillance-monitoring" // 影像監控
	};

	// 從 series ID 獲取 slug 的輔助函數
	function getSeriesSlug(seriesId) {
		return seriesIdToSlugMap[seriesId] || null;
	}

	// 搜尋結果統計
	const resultCounts = computed(() => {
		return {
			series: searchStore.results.series?.length || 0,
			categories: searchStore.results.categories?.length || 0,
			subCategories: searchStore.results.subCategories?.length || 0,
			specifications: searchStore.results.specifications?.length || 0,
			products: searchStore.results.products?.length || 0,
			total: searchStore.totalResults
		};
	});

	// 實體類型對應的在地化名稱（統一使用 useI18n().t）
	const entityTypeNames = computed(() => ({
		series: t("products.search_panel.entity_types.series"),
		categories: t("products.search_panel.entity_types.categories"),
		subCategories: t("products.search_panel.entity_types.subCategories"),
		specifications: t("products.search_panel.entity_types.specifications"),
		products: t("products.search_panel.entity_types.products")
	}));

	// 獲取實體的本地化名稱
	function getEntityName(entity) {
		if (!entity) return "";
		return languageStore.getLocalizedField(entity, "name");
	}

	// 搜尋函數
	async function performSearch(keyword = inputKeyword.value) {
		if (!keyword || keyword.trim() === "") return;

		inputKeyword.value = keyword;
		await searchStore.search(keyword);
	}

	// 防抖搜尋，延遲 300ms
	let searchTimeout = null;
	function debouncedSearch(keyword) {
		inputKeyword.value = keyword;

		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}

		searchTimeout = setTimeout(() => {
			performSearch(keyword);
		}, 500);
	}

	// 點擊搜尋結果進行導航
	function navigateToResult(entityType, item) {
		closeSearch();

		if (!item || !item._id) return;

		// let seriesSlug = null; // seriesSlug 的聲明和使用最好在各自 case 內部，避免混淆
		// let targetPath = "/products"; // 移除此處的預設 targetPath，因為它可能不適用所有情況

		// 根據實體類型跳轉到不同頁面
		switch (entityType) {
			case "products": {
				const productTargetPath = `/products/${item.code}`;
				router.push({ path: localePath(productTargetPath) });
				break;
			}
			case "series": {
				const seriesSlug = getSeriesSlug(item._id);
				if (seriesSlug) {
					const seriesTargetPath = `/products/${seriesSlug}`;
					router.push({ path: localePath(seriesTargetPath) });
				} else {
					router.push({ path: localePath("/") }); // 改為首頁
				}
				break;
			}
			case "categories":
			case "subCategories":
			case "specifications": {
				const entitySeriesId = item.series?._id;
				if (entitySeriesId) {
					const resolvedSeriesSlug = getSeriesSlug(entitySeriesId);
					if (resolvedSeriesSlug) {
						const seriesTargetPath = `/products/${resolvedSeriesSlug}`;
						router.push({
							path: localePath(seriesTargetPath),
							query: { entityId: item._id, entityType: entityType }
						});
					} else {
						router.push({ path: localePath("/") }); // 改為首頁
					}
				} else {
					router.push({ path: localePath("/") }); // 改為首頁
				}
				break;
			}
			default:
				router.push({ path: localePath("/") }); // 預設情況也跳轉到首頁
		}
	}

	// 清空搜尋
	function clearSearch() {
		inputKeyword.value = "";
		searchStore.closeSearch();
	}

	// 載入最近搜尋
	function loadRecentSearches() {
		searchStore.loadRecentSearches();
	}

	// 初始化
	loadRecentSearches();

	// 修改 closeSearch 函數
	function closeSearch() {
		inputKeyword.value = "";
		searchStore.closeSearch();
	}

	return {
		// 狀態
		isVisible: computed(() => searchStore.isVisible),
		isLoading: computed(() => searchStore.isLoading),
		keyword: inputKeyword,
		activeTab: computed(() => searchStore.activeTab),

		// 結果
		results: computed(() => searchStore.results),
		resultCounts,
		hasResults: computed(() => searchStore.hasResults),
		currentTabResults: computed(() => searchStore.currentTabResults),
		recentSearches: computed(() => searchStore.recentSearches),

		// 工具函數
		toggleSearch: () => searchStore.toggleSearch(),
		closeSearch,
		setActiveTab: (tab) => searchStore.setActiveTab(tab),
		search: performSearch,
		debouncedSearch,
		navigateToResult,
		clearSearch,
		getEntityName,
		entityTypeNames,
		clearRecentSearches: () => searchStore.clearRecentSearches()
	};
}
