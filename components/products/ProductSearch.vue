<template>
	<div class="max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
		<h2 class="text-2xl sm:text-3xl font-bold text-center mb-6 text-slate-800">搜尋所有產品</h2>
		<div class="relative">
			<!-- 搜尋輸入區域 -->
			<div class="relative mb-[8px]">
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
			<div v-if="showResults" class="search-results" @mousedown.prevent>
				<!-- 內容區域 -->
				<div class="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
					<!-- 加載中 -->
					<div v-if="isSearchLoading" class="p-[24px] text-center text-slate-400">
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
					<div v-else-if="keyword && !isSearchLoading && !hasResults" class="p-[24px] text-center text-slate-500">
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
												<div v-else-if="type !== 'products'" class="flex-shrink-0 w-[40px] h-[40px] bg-slate-100 rounded-md flex items-center justify-center">
													<svg class="w-[20px] h-[20px] text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
														></path>
													</svg>
												</div>
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
												<div class="flex-1 min-w-0">
													<div class="text-[16px] truncate">{{ getEntityName(item) }}</div>
													<div v-if="item.code" class="text-[14px] text-slate-500 truncate">{{ item.code }}</div>
												</div>
											</div>
										</button>
									</div>
									<button v-if="items.length > 3" @click="setActiveTab(type)" class="text-[14px] text-blue-400 hover:text-blue-300 mt-[4px] transition-colors">
										查看更多 {{ entityTypeNames[type] }} ({{ items.length }})
									</button>
								</div>
							</template>
							<template v-else>
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
												<div v-else-if="type !== 'products'" class="flex-shrink-0 w-[40px] h-[40px] bg-slate-100 rounded-md flex items-center justify-center">
													<svg class="w-[20px] h-[20px] text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
														></path>
													</svg>
												</div>
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
	</div>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import { useGlobalSearch } from "~/composables/useGlobalSearch";

const {
	isLoading: isSearchLoading,
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

const showResults = ref(false);
let blurTimeout = null;
let searchTriggeredBySubmit = false;
const searchInput = ref(null);

const handleInput = () => {
	showResults.value = true;
	debouncedSearch(keyword.value);
};

const handleFocus = () => {
	showResults.value = true;
	searchTriggeredBySubmit = false;
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

onUnmounted(() => {
	if (blurTimeout) clearTimeout(blurTimeout);
});
</script>

<style scoped>
/* === 搜尋相關樣式開始 === */
.search-results {
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	z-index: 20;
	margin-top: 2px;
	max-height: 60vh;
	overflow: hidden;
	background-color: white;
	border: 1px solid #e2e8f0; /* slate-200 */
	border-radius: 0.75rem; /* rounded-xl */
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	animation: fadeInScale 0.2s ease-out;
	display: flex;
	flex-direction: column;
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
