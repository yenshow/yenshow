<template>
	<div>
		<!-- 系列介紹 -->
		<section class="bg-white relative overflow-hidden space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-12 pb-4 sm:pb-6 md:pb-8 lg:pb-10 xl:pb-12">
			<SeriesSwitcher :key="route.path" />
			<!-- content -->
			<aside class="md:min-h-screen flex flex-col">
				<!-- title -->
				<div ref="titleContentRef" style="opacity: 0" class="ms-4 sm:ms-6 md:ms-8 lg:ms-12 xl:ms-16">
					<h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl opacity-50 font-bold">{{ title }}</h1>
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
			<!-- subtitle -->
			<div
				ref="subtitleRef"
				style="opacity: 0"
				class="mx-auto md:absolute md:top-[60%] md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10 w-2/3 md:w-1/2 px-4 sm:px-6 md:px-0"
			>
				<div class="space-y-2 md:space-y-4 text-center">
					<p class="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl opacity-30">{{ subtitle }}</p>
					<p class="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl opacity-30">
						{{ subtitle2 }}
					</p>
				</div>
			</div>
		</section>

		<!-- 產品列表 -->
		<section class="bg-gray-50">
			<div class="container mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16 lg:py-20 space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20 xl:space-y-24">
				<ProductSearch />
				<!-- 載入狀態和錯誤處理 -->
				<div v-if="isLoadingProducts" class="text-center py-10 sm:py-12">
					<!-- SkeletonProductCard merged here -->
					<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
						<div v-for="n in 8" :key="n" class="bg-white border border-gray-200 shadow-md p-4 rounded-lg animate-pulse" aria-hidden="true">
							<div class="aspect-square bg-gray-300 rounded-md mb-4"></div>
							<div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
							<div class="h-3 bg-gray-300 rounded w-1/2"></div>
						</div>
					</div>
				</div>
				<div v-else-if="productsError" class="bg-red-50 text-red-500 p-3 sm:p-4 rounded-lg my-3 sm:my-4 text-sm sm:text-base">{{ productsError }}</div>
				<div v-else class="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-12">
					<!-- 各分類區塊 -->
					<div v-for="category in computedDisplayCategories" :key="category._id" class="space-y-6 sm:space-y-8 md:space-y-12 lg:space-y-16">
						<!-- 分類標題 -->
						<h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold py-4 sm:py-6 md:py-8 text-center border-b-2 border-primary/50">
							{{ languageStore.getLocalizedField(category, "name") }}
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
								<h3 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-primary/80 flex-shrink-0">
									{{ languageStore.getLocalizedField(subCategory, "name") }}
								</h3>
								<!-- 規格篩選器 -->
								<div v-if="hasSpecifications(subCategory)" class="w-fit">
									<FilterSection
										:options="getSpecifications(subCategory)"
										v-model="filterValues[subCategory._id]"
										:filter-key="String(subCategory._id)"
										:is-localized-options="true"
									/>
								</div>
							</div>
							<!-- 產品展示 -->
							<ProductList :products="prepareProductsForList(getFilteredProducts(subCategory), subCategory._id)" :loading="false" />
						</div>
					</div>
					<!-- 如果 computedDisplayCategories 為空 -->
					<div v-if="computedDisplayCategories.length === 0 && !isLoadingProducts" class="text-center py-10 sm:py-12 text-gray-500 text-sm sm:text-base">
						{{ t("products.no_filtered_categories") }}
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useProductSeries } from "~/composables/useProductSeries";
import SeriesSwitcher from "~/components/products/SeriesSwitcher.vue";
import NavList from "~/components/products/NavList.vue";
import ProductSearch from "~/components/products/ProductSearch.vue";
import FilterSection from "~/components/products/FilterSection.vue";
import ProductList from "~/components/products/ProductList.vue";
import { useLanguageStore } from "~/stores/core/languageStore";
import { useI18n } from "vue-i18n";

const props = defineProps({
	title: String,
	subtitle: String,
	subtitle2: String,
	seriesId: String,
	seriesSlug: String
});

const route = useRoute();
const languageStore = useLanguageStore();
const { t } = useI18n();

const subtitleRef = ref(null);

const {
	isLoadingNav,
	navError,
	productCategories,
	filterValues,
	isLoadingProducts,
	productsError,
	computedDisplayCategories,
	navListRef,
	titleContentRef,
	hasSpecifications,
	getSpecifications,
	prepareProductsForList,
	getFilteredProducts,
	handleCategorySelected,
	handleSubItemSelected
} = useProductSeries({
	seriesId: props.seriesId,
	seriesSlug: props.seriesSlug,
	subtitleRef
});
</script>
