<template>
	<div>
		<!-- 主容器 -->
		<div class="bg-secondary">
			<!-- Skeleton Loader (顯示於載入時) -->
			<div v-if="isLoading" class="bg-secondary animate-pulse" aria-hidden="true">
				<!-- Skeleton for Breadcrumbs -->
				<div class="p-4 md:p-6 lg:p-8">
					<div class="h-4 bg-gray-300 rounded w-1/2 md:w-1/3"></div>
				</div>

				<!-- Skeleton for Main Product Section -->
				<section class="container flex flex-col md:flex-row py-4 md:py-6 lg:py-8 justify-center items-center gap-4 md:gap-8 lg:gap-12">
					<!-- Skeleton for Image -->
					<div class="bg-gray-300 rounded-lg w-[282px] h-[282px] md:w-[384px] md:h-[384px]"></div>

					<!-- Skeleton for Info -->
					<div class="space-y-4 md:space-y-6 w-full md:w-1/2 py-4 md:py-6 lg:py-8">
						<div class="h-8 bg-gray-300 rounded w-3/4"></div>
						<div class="h-4 bg-gray-300 rounded w-1/4"></div>
						<div class="space-y-3 pt-4">
							<div class="h-4 bg-gray-300 rounded w-1/3"></div>
							<div class="h-4 bg-gray-300 rounded w-full"></div>
							<div class="h-4 bg-gray-300 rounded w-5/6"></div>
						</div>
						<div class="h-10 bg-gray-300 rounded w-24 mt-4"></div>
					</div>
				</section>

				<!-- Skeleton for Features Section -->
				<section class="bg-gray-50 py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20">
					<div class="container">
						<div class="space-y-6 md:space-y-8">
							<div class="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-8"></div>
							<!-- 網格骨架載入 -->
							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto">
								<div v-for="n in 6" :key="n" class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6">
									<div class="flex items-start space-x-3 sm:space-x-4">
										<!-- 圖標骨架 -->
										<div class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-300 rounded-full"></div>
										<!-- 內容骨架 -->
										<div class="flex-1 min-w-0">
											<div class="h-5 bg-gray-300 rounded w-4/5"></div>
										</div>
									</div>
								</div>
							</div>
							<!-- 按鈕骨架 -->
							<div class="flex justify-center mt-6 sm:mt-8 md:mt-10">
								<div class="h-12 bg-gray-300 rounded-full w-40"></div>
							</div>
						</div>
					</div>
				</section>

				<!-- Skeleton for CTA Section -->
				<section class="bg-primary bg-opacity-5 py-8 md:py-12 space-y-4 md:space-y-6 text-center">
					<div class="h-8 bg-gray-300 rounded w-1/2 mx-auto"></div>
					<div class="h-6 bg-gray-300 rounded w-3/4 mx-auto"></div>
					<div class="flex justify-center gap-3 md:gap-4 pt-4">
						<div class="h-10 bg-gray-300 rounded w-24"></div>
						<div class="h-10 bg-gray-300 rounded w-24"></div>
					</div>
				</section>
			</div>

			<!-- 錯誤訊息 -->
			<div v-else-if="error" class="min-h-screen flex items-center justify-center">
				<div class="bg-red-50 text-red-500 p-8 rounded-lg text-center">
					<h2 class="text-2xl font-bold mb-4">無法載入產品資訊</h2>
					<p>{{ error.message }}</p>
					<NuxtLink :to="localePath('/products')" class="text-blue-600 hover:underline">{{ t("products.browse_all_products") }}</NuxtLink>
				</div>
			</div>

			<!-- 產品內容 -->
			<div v-else-if="product">
				<!-- 現代化導航區 -->
				<div class="container py-4 sm:py-5 md:py-6">
					<!-- 返回按鈕與路徑 -->
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-4">
							<!-- 返回按鈕 -->
							<button
								@click="$router.go(-1)"
								class="flex items-center justify-center px-3 py-2 text-sm md:text-base lg:text-lg text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-200 transition-colors duration-200 group"
							>
								<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
								</svg>
								{{ t("common.back") }}
							</button>

							<!-- 路徑指示 -->
							<div class="flex items-center justify-center space-x-2 text-sm md:text-base lg:text-lg text-gray-500">
								<NuxtLink :to="localePath('/products')" class="hover:text-primary transition-colors duration-200">
									{{ t("nav.smart_solutions") }}
								</NuxtLink>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
								</svg>
								<NuxtLink :to="localePath(parentCategory.link)" class="hover:text-primary transition-colors duration-200">
									{{ getLocalizedCategoryName(parentCategory) }}
								</NuxtLink>
							</div>
						</div>
					</div>
				</div>

				<!-- 產品主體區塊 -->
				<section
					class="container flex flex-col md:flex-row py-4 sm:py-5 md:py-6 lg:py-8 xl:py-10 justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12"
				>
					<!-- 產品圖片區 -->
					<div
						class="bg-white rounded-lg overflow-hidden flex flex-col items-center justify-center aspect-square w-full max-w-xs sm:max-w-sm md:flex-none md:w-[384px] lg:w-[420px] xl:w-[480px] relative group"
					>
						<NuxtImg
							v-if="currentImage"
							:src="currentImage"
							:alt="getLocalizedName(product)"
							class="w-3/4 aspect-square object-contain cursor-pointer rounded transition-transform duration-300 group-hover:scale-105"
							@click="openImageModal(currentImage, $event.target)"
							tabindex="0"
							role="button"
							@keydown.enter="openImageModal(currentImage, $event.target)"
							@keydown.space.prevent="openImageModal(currentImage, $event.target)"
							format="webp"
							quality="90"
							loading="eager"
						/>
						<div v-else class="text-gray-500 py-20">{{ t("products.product_detail.no_image_available") }}</div>

						<!-- 圖片提示文字 -->
						<div v-if="currentImage" class="absolute bottom-4 left-1/2 transform -translate-x-1/2">
							<div class="bg-black/75 text-white text-sm px-3 py-1 rounded-full flex items-center space-x-1">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
									/>
								</svg>
								<span>{{ t("products.product_detail.image_click_to_enlarge") }}</span>
							</div>
						</div>
					</div>

					<!-- 產品信息區 -->
					<div class="w-full max-w-xs sm:max-w-sm md:w-1/2 md:max-w-none space-y-6 sm:space-y-7 md:space-y-8 py-4 sm:py-5 md:py-6 lg:py-8 xl:py-10">
						<!-- 產品標題與狀態 -->
						<div class="space-y-4 sm:space-y-5">
							<!-- 產品名稱 -->
							<h1 class="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[40px] font-bold text-gray-900 leading-tight">
								{{ getLocalizedName(product) }}
							</h1>

							<!-- 產品型號 (僅中文顯示) -->
							<div v-if="product.code && locale === 'zh'" class="inline-flex items-center bg-gray-100 border border-gray-400 rounded-lg px-4 py-2">
								<span class="text-[12px] sm:text-[13px] md:text-[14px] text-gray-600 font-medium mr-2">{{ t("products.product_detail.product_model") }}</span>
								<span class="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] font-bold text-gray-900 flex items-center">
									{{ formatCodeForDisplay(product.code) }}
								</span>
							</div>
						</div>

						<!-- 產品說明 -->
						<div v-if="getLocalizedDescription(product)" class="space-y-3">
							<h2 class="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] font-semibold text-gray-900 flex items-center">
								<svg class="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
								{{ t("products.product_detail.product_description") }}
							</h2>
							<div class="prose prose-gray max-w-none">
								<p class="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-gray-700 leading-relaxed">
									{{ getLocalizedDescription(product) }}
								</p>
							</div>
						</div>

						<!-- 行動按鈕組 -->
						<div class="space-y-4 pt-2">
							<!-- 主要按鈕 -->
							<div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
								<!-- 免費諮詢按鈕 -->
								<NuxtLink
									:to="localePath('/contact')"
									class="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white text-[14px] sm:text-[16px] font-semibold rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex-1 sm:flex-none"
								>
									<svg class="w-6 h-6 lg:w-8 lg:h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
										/>
									</svg>
									{{ t("buttons.free_consultation") }}
								</NuxtLink>

								<!-- 下載規格按鈕 -->
								<button
									v-if="product?.documents && product.documents.length > 0"
									@click="handleDownloadSpecsClick"
									class="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary text-[14px] sm:text-[16px] font-semibold border-2 border-primary rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
								>
									<svg class="w-6 h-6 lg:w-8 lg:h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
									{{ t("products.product_detail.cta_download_spec", "下載規格") }}
								</button>
							</div>
						</div>
					</div>
				</section>

				<!-- 詳細特點與規格區塊 -->
				<section ref="featuresSectionRef" class="bg-gray-50 py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20">
					<div class="container">
						<!-- 特點區塊 -->
						<div class="space-y-6 md:space-y-8">
							<div class="text-center mb-8 sm:mb-10 md:mb-12">
								<h2 class="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[40px] font-bold text-gray-900 mb-3 sm:mb-4">
									{{ t("products.product_detail.features_title") }}
								</h2>
								<div class="w-16 h-1 bg-gradient-to-r from-primary to-primary/60 mx-auto rounded-full"></div>
							</div>

							<div v-if="product.features && product.features.length > 0">
								<!-- 網格佈局的特點卡片 -->
								<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto">
									<div
										v-for="(feature, index) in displayedFeatures"
										:key="feature._id"
										class="feature-card group relative bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6"
										:style="{
											animationDelay: `${index * 100}ms`
										}"
									>
										<!-- 特點圖標區域 -->
										<div class="flex items-center h-full space-x-4">
											<!-- 動態圖標 -->
											<div
												:class="[
													'flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12',
													'rounded-full flex items-center justify-center',
													getFeatureIconStyle(index)
												]"
											>
												<svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24" :aria-hidden="true">
													<path :d="getFeatureIconPath(index)" />
												</svg>
											</div>

											<!-- 特點標題 -->
											<h3 class="text-[16px] md:text-[21px] lg:text-[24px] font-semibold text-gray-800">
												{{ getLocalizedFeature(feature) }}
											</h3>
										</div>
									</div>
								</div>
								<!-- 顯示更多/收合按鈕 -->
								<div v-if="product.features.length > displayedFeaturesCount" class="flex justify-center mt-6 sm:mt-8 md:mt-10">
									<button
										@click="toggleShowAllFeatures"
										class="group relative inline-flex items-center justify-center px-4 py-2 md:px-6 md:py-3 lg:px-8 lg:py-4 bg-white border-2 border-primary/20 rounded-full text-primary transition-all duration-300 shadow-sm hover:-translate-y-0.5 hover:scale-105"
									>
										<span class="text-[14px] sm:text-[16px] md:text-[18px] font-medium mr-2">
											{{ showAllFeatures ? t("products.product_detail.collapse_features") : t("products.product_detail.show_more_features") }}
										</span>

										<!-- 動態箭頭圖標 -->
										<svg
											:class="['w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300', showAllFeatures ? 'rotate-180' : '']"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
										</svg>

										<!-- 特點數量提示 -->
										<span
											v-if="!showAllFeatures && product.features.length > displayedFeaturesCount"
											class="absolute -top-2 -right-2 bg-primary text-white text-[12px] md:text-[14px] lg:text-[16px] font-bold rounded-full w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 flex items-center justify-center"
										>
											+{{ product.features.length - displayedFeaturesCount }}
										</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</section>

				<!-- 產品影片區塊 -->
				<section v-if="product && product.videos && product.videos.length > 0" class="container py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20">
					<h2 class="text-[21px] sm:text-[24px] md:text-[28px] lg:text-[36px] xl:text-[40px] font-bold text-gray-800 mb-4 sm:mb-6 md:mb-8 lg:mb-10 text-center">
						{{ t("products.product_detail.product_video") }}
					</h2>
					<div class="flex justify-center">
						<video
							:src="`${config.public.fileServiceBaseUrl}${product.videos[0].startsWith('/') ? '' : '/'}${product.videos[0]}`"
							controls
							class="max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl rounded-lg shadow-lg"
							preload="metadata"
						>
							{{ t("products.product_detail.video_not_supported") }}
						</video>
					</div>
				</section>
			</div>

			<!-- 找不到產品 -->
			<div v-else class="min-h-screen flex items-center justify-center">
				<div class="text-center py-12 text-gray-500">
					<h2 class="text-2xl font-bold mb-4">找不到指定的產品</h2>
					<NuxtLink :to="localePath('/products')" class="mt-4 inline-block text-blue-600 hover:underline">{{ t("products.browse_all_products") }}</NuxtLink>
				</div>
			</div>
			<!-- 圖片預覽彈窗 -->
			<div
				v-if="isImageModalOpen && product"
				class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
				role="dialog"
				aria-modal="true"
				:aria-labelledby="`product-modal-title-${product._id}`"
				@click.self="closeImageModal"
				@keydown.esc="closeImageModal"
			>
				<h2 :id="`product-modal-title-${product._id}`" class="sr-only">
					{{ getLocalizedName(product) }} {{ t("products.product_detail.image_preview_title") }}
				</h2>
				<button
					ref="closeModalButtonRef"
					@click="closeImageModal"
					class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-2 bg-white/80 hover:bg-white transition-all duration-200"
					:aria-label="t('products.product_detail.close_preview')"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
						aria-hidden="true"
					>
						<title>關閉圖示</title>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
					</svg>
				</button>
				<div class="relative bg-white rounded-lg p-4 shadow-2xl max-w-4xl w-full mx-4">
					<!-- 圖片容器 -->
					<div class="aspect-square w-full max-w-2xl mx-auto rounded-lg overflow-hidden">
						<NuxtImg :src="modalImage" :alt="getLocalizedName(product)" class="w-full h-full object-contain" format="webp" quality="95" loading="eager" />
					</div>
					<!-- 圖片信息 -->
					<div class="mt-4 text-center">
						<h3 class="text-lg md:text-xl font-semibold text-gray-900 mb-2">{{ getLocalizedName(product) }}</h3>
					</div>
				</div>
			</div>

			<!-- 登入對話框 -->
			<LoginDialog v-model="isLoginDialogOpen" @login-success="handleLoginSuccessAndDownload" />
		</div>
	</div>
</template>

<script setup>
import { ref, computed, nextTick, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { useLanguageStore } from "~/stores/core/languageStore";
import { useProductsStore } from "~/stores/models/products";
import { useUserStore } from "~/stores/userStore";
import LoginDialog from "~/components/common/LoginDialog.vue";
import { useRuntimeConfig, useAsyncData, useHead, createError } from "#app";
import { useHierarchyStore } from "~/stores/hierarchyStore";

const route = useRoute();
const localePath = useLocalePath();
const { t, locale } = useI18n();
const languageStore = useLanguageStore();
const productsStore = useProductsStore();
const userStore = useUserStore();
const config = useRuntimeConfig();
const hierarchyStore = useHierarchyStore();

const productCode = computed(() => route.params.code);

const formatCodeForDisplay = (value) => {
	if (value == null) return "";
	const str = String(value);
	return str.replace("-", " ");
};

const normalizeCode = (str) => {
	if (!str) return "";
	return str.toLowerCase().replace(/[^a-z0-9]/g, "");
};

const {
	data: product,
	pending: isLoading,
	error
} = useAsyncData(
	`product-${productCode.value}`,
	async () => {
		const normalizedCodeFromUrl = normalizeCode(productCode.value);

		let productSummary = productsStore.items.find((item) => normalizeCode(item.code) === normalizedCodeFromUrl);

		if (!productSummary) {
			await productsStore.fetchProducts({ limit: 10000 });
			productSummary = productsStore.items.find((item) => normalizeCode(item.code) === normalizedCodeFromUrl);
		}

		if (!productSummary) {
			throw createError({ statusCode: 404, statusMessage: `找不到產品代碼為 ${productCode.value} 的產品。`, fatal: true });
		}

		const detailedProduct = await productsStore.fetchProductById(productSummary._id);
		if (!detailedProduct) {
			throw createError({ statusCode: 404, statusMessage: `無法載入產品 (ID: ${productSummary._id}) 的詳細資訊。`, fatal: true });
		}

		if (detailedProduct.series_id) {
			const series = await hierarchyStore.fetchSeriesById(detailedProduct.series_id);
			if (series) {
				hierarchyStore.setCurrentSeries(series);
			}
		}

		useHead({
			title: ` - ${languageStore.getLocalizedField(detailedProduct, "name") || "產品詳情"}`,
			meta: [
				{
					name: "description",
					content:
						languageStore.getLocalizedField(detailedProduct, "description") ||
						`查看 ${languageStore.getLocalizedField(detailedProduct, "name") || "該產品"} 的詳細資訊`
				}
			]
		});

		return detailedProduct;
	},
	{
		lazy: true
	}
);

// After data is fetched, set the primary image
const currentImage = computed(() => {
	if (product.value?.images && product.value.images.length > 0) {
		return product.value.images[0];
	}
	return null;
});

// 產品特點顯示相關
const showAllFeatures = ref(false);
const displayedFeaturesCount = 6;
const featuresSectionRef = ref(null);

const displayedFeatures = computed(() => {
	if (!product.value || !product.value.features) {
		return [];
	}
	if (showAllFeatures.value) {
		return product.value.features;
	}
	return product.value.features.slice(0, displayedFeaturesCount);
});

const toggleShowAllFeatures = () => {
	showAllFeatures.value = !showAllFeatures.value;
	nextTick(() => {
		if (featuresSectionRef.value) {
			featuresSectionRef.value.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	});
};

// 登入狀態
const isLogin = computed(() => userStore.isLogin);

// 登入對話框狀態
const isLoginDialogOpen = ref(false);

// 圖片展示相關
const isImageModalOpen = ref(false);
const modalImage = ref(null);
const closeModalButtonRef = ref(null);
let triggerElement = null;

const getLocalizedField = (item, field) => {
	return item ? languageStore.getLocalizedField(item, field) : "";
};

const getLocalizedName = (item) => getLocalizedField(item, "name");
const getLocalizedDescription = (item) => getLocalizedField(item, "description");

const parentCategory = computed(() => {
	const series = hierarchyStore.currentSeries;
	if (series) {
		return {
			name: series.name, // The name is already a plain string
			link: `/products/${series.slug}`
		};
	}
	// Fallback in case series data is not available
	return { name: t("nav.product_series"), link: "/products" };
});

const getLocalizedCategoryName = (category) => {
	// 如果是fallback的情況，直接返回翻譯後的名稱
	if (category.name === t("nav.product_series")) {
		return category.name;
	}
	// 否則嘗試獲取本地化名稱
	return languageStore.getLocalizedField({ name: category.name }, "name") || category.name;
};

const getLocalizedFeature = (feature) => {
	if (!feature) return "";

	// 如果特點是字串，直接返回
	if (typeof feature === "string") {
		return feature;
	}

	// 如果特點是物件，只支援 TW 和 EN 兩種語言
	const currentLang = locale.value; // 'zh' | 'en'

	if (currentLang === "zh") {
		// 中文環境：TW > EN
		return feature.TW || feature.EN || "";
	} else {
		// 英文環境：EN > TW
		return feature.EN || feature.TW || "";
	}
};

// 特點圖標樣式
const getFeatureIconStyle = (index) => {
	const styles = [
		"bg-blue-100 text-blue-600", // 性能
		"bg-green-100 text-green-600", // 安全
		"bg-purple-100 text-purple-600", // 智慧
		"bg-orange-100 text-orange-600", // 便利
		"bg-red-100 text-red-600", // 可靠
		"bg-indigo-100 text-indigo-600", // 創新
		"bg-yellow-100 text-yellow-600" // 效率
	];
	return styles[index % styles.length];
};

// 特點圖標路徑
const getFeatureIconPath = (index) => {
	const icons = [
		// 性能 - 閃電
		"M13 10V3L4 14h7v7l9-11h-7z",
		// 安全 - 盾牌
		"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
		// 智慧 - 大腦/燈泡
		"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
		// 便利 - 手指點擊
		"M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",
		// 可靠 - 齒輪
		"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
		// 創新 - 星星
		"M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
		// 效率 - 時鐘
		"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
	];
	return icons[index % icons.length];
};

// 圖片預覽功能
const openImageModal = (image, eventTarget) => {
	modalImage.value = image;
	isImageModalOpen.value = true;
	document.body.style.overflow = "hidden";
	triggerElement = eventTarget || document.activeElement;
	nextTick(() => {
		if (closeModalButtonRef.value) {
			closeModalButtonRef.value.focus();
		}
	});
};

const closeImageModal = () => {
	isImageModalOpen.value = false;
	document.body.style.overflow = "";
	if (triggerElement && typeof triggerElement.focus === "function") {
		triggerElement.focus();
	}
	triggerElement = null;
};

onBeforeUnmount(() => {
	// 確保在組件卸載時恢復滾動條
	if (isImageModalOpen.value) {
		document.body.style.overflow = "";
	}
});

// 實際執行下載的函數
const triggerActualDownload = () => {
	if (product.value?.documents && product.value.documents.length > 0) {
		let specUrlRelative = product.value.documents[0]; // 原始的 "/storage/..."

		// 確保 specUrlRelative 是以 / 開頭的相對路徑 (例如 /storage/...)
		// 如果它不是以 / 開頭，我們補上。如果它已經是 /storage/... 這樣的形式，則不變。
		if (!specUrlRelative.startsWith("/")) {
			specUrlRelative = `/${specUrlRelative}`;
		}

		// 從 runtimeConfig 獲取檔案服務的基礎 URL
		const fileServiceBase = config.public.fileServiceBaseUrl;

		if (!fileServiceBase) {
			alert(t("products.product_detail.download_error"));
			return;
		}
		const fullSpecUrl = `${fileServiceBase}${specUrlRelative}`;

		// 修改為在新分頁開啟連結
		window.open(fullSpecUrl, "_blank");
	} else {
		// 理論上，如果按鈕可見，這裡不應觸發，但作為防護
		alert(t("products.product_detail.no_spec_available"));
	}
};

// 處理「下載規格」按鈕點擊事件
const handleDownloadSpecsClick = () => {
	if (!product.value?.documents || product.value.documents.length === 0) {
		alert(t("products.product_detail.no_spec_available"));
		return;
	}

	if (isLogin.value) {
		triggerActualDownload();
	} else {
		isLoginDialogOpen.value = true; // 開啟登入對話框
	}
};

// 處理登入成功後的下載
const handleLoginSuccessAndDownload = () => {
	isLoginDialogOpen.value = false; // 關閉登入對話框
	// 確保產品資料仍然存在且有文件
	if (product.value?.documents && product.value.documents.length > 0) {
		triggerActualDownload();
	} else {
		alert(t("products.product_detail.spec_info_changed"));
	}
};
</script>

<style scoped>
.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border-width: 0;
}

/* 特點卡片動畫效果 */
.feature-card {
	opacity: 0;
	transform: translateY(20px);
	animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* 響應式網格優化 */
@media (max-width: 768px) {
	.feature-card {
		transform: translateY(10px);
	}
}

/* Hover 效果增強 */
.feature-card:hover {
	box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* 特點圖標動畫 */
.feature-card .group:hover svg {
	animation: pulse 0.8s ease-in-out infinite;
}

@keyframes pulse {
	0%,
	100% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.05);
	}
}

/* 載入動畫優化 */
.feature-card:nth-child(1) {
	animation-delay: 0ms;
}
.feature-card:nth-child(2) {
	animation-delay: 100ms;
}
.feature-card:nth-child(3) {
	animation-delay: 200ms;
}
.feature-card:nth-child(4) {
	animation-delay: 300ms;
}
.feature-card:nth-child(5) {
	animation-delay: 400ms;
}
.feature-card:nth-child(6) {
	animation-delay: 500ms;
}
.feature-card:nth-child(7) {
	animation-delay: 600ms;
}
.feature-card:nth-child(8) {
	animation-delay: 700ms;
}
.feature-card:nth-child(9) {
	animation-delay: 800ms;
}
</style>
