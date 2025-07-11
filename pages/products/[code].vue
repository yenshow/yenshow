<template>
	<div>
		<!-- 主容器 -->
		<div class="bg-secondary">
			<ClientOnly>
				<SkeletonProductDetail v-if="isLoading" />
				<div v-else-if="error" class="min-h-screen flex items-center justify-center">
					<div class="bg-red-50 text-red-500 p-8 rounded-lg text-center">
						<h2 class="text-2xl font-bold mb-4">無法載入產品資訊</h2>
						<p>{{ error }}</p>
						<NuxtLink to="/Products" class="text-blue-600 hover:underline">返回產品列表</NuxtLink>
					</div>
				</div>
				<div v-else-if="product">
					<!-- 麵包屑導航 -->
					<div class="p-4 sm:p-5 md:p-6 lg:p-8">
						<nav class="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] 2xl:text-[21px] text-gray-500" aria-label="breadcrumb">
							<ol class="flex flex-wrap items-center">
								<li><NuxtLink to="/" class="hover:text-primary">首頁</NuxtLink></li>
								<li class="mx-2">/</li>
								<li><NuxtLink to="/products" class="hover:text-primary">智慧方案</NuxtLink></li>
								<li class="mx-2">/</li>
								<li>
									<NuxtLink :to="parentCategory.link" class="hover:text-primary">{{ parentCategory.name }}</NuxtLink>
								</li>
								<li class="mx-2">/</li>
								<li class="text-gray-700 font-medium truncate" aria-current="page">{{ getLocalizedName(product) }}</li>
							</ol>
						</nav>
					</div>

					<!-- 產品主體區塊 -->
					<section
						class="container flex flex-col md:flex-row py-4 sm:py-5 md:py-6 lg:py-8 xl:py-10 justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12"
					>
						<!-- 產品圖片區 -->
						<div
							class="bg-white rounded-lg overflow-hidden flex items-center justify-center aspect-square w-full max-w-xs sm:max-w-sm md:flex-none md:w-[384px] lg:w-[420px] xl:w-[480px]"
						>
							<NuxtImg
								v-if="currentImage"
								:src="currentImage"
								:alt="getLocalizedName(product)"
								class="w-3/4 aspect-square object-contain cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded"
								loading="lazy"
								format="webp"
								width="480"
								height="480"
								sizes="sm:320px md:384px lg:420px xl:480px"
								:placeholder="[20, 20, 75, 5]"
								@click="openImageModal(currentImage, $event.target)"
								tabindex="0"
								role="button"
								@keydown.enter="openImageModal(currentImage, $event.target)"
								@keydown.space.prevent="openImageModal(currentImage, $event.target)"
							/>
							<div v-else class="text-gray-500 py-20">尚無圖片</div>
						</div>

						<!-- 產品信息區 -->
						<div
							class="text-gray-800 space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5 xl:space-y-6 py-4 sm:py-5 md:py-6 lg:py-8 xl:py-10 w-full max-w-xs sm:max-w-sm md:w-1/2 md:max-w-none"
						>
							<!-- 產品基本信息 -->
							<h1 class="text-[21px] sm:text-[24px] md:text-[28px] lg:text-[36px] xl:text-[40px] font-bold text-gray-900 whitespace-nowrap">
								{{ getLocalizedName(product) }}
							</h1>
							<p v-if="product.code" class="text-gray-500 text-[12px] sm:text-[14px] md:text-[16px] lg:text-[21px] xl:text-[24px]">
								產品編號：{{ product.code }}
							</p>

							<!-- 產品說明 -->
							<div v-if="getLocalizedDescription(product)">
								<h2 class="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[21px] xl:text-[24px] font-semibold mb-1 sm:mb-2 md:mb-3 lg:mb-4">產品說明</h2>
								<p class="text-gray-700 text-[12px] sm:text-[14px] md:text-[16px] lg:text-[21px] xl:text-[24px]">
									{{ getLocalizedDescription(product) }}
								</p>
							</div>

							<!-- 按鈕組 -->
							<div class="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 md:gap-4 pt-3 sm:pt-4 md:pt-5">
								<Button-CTA label="免費諮詢" to="/contact" class="w-fit"></Button-CTA>
								<Button-CTA
									v-if="product?.documents && product.documents.length > 0"
									label="下載規格"
									@click="handleDownloadSpecsClick"
									class="w-fit"
								></Button-CTA>
							</div>
						</div>
					</section>

					<!-- 詳細特點與規格區塊 -->
					<section ref="featuresSectionRef" class="bg-gray-50 py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20">
						<div class="container">
							<!-- 特點區塊 -->
							<div v-show="activeTab === 'features'" class="space-y-6 md:space-y-8">
								<h2
									class="text-[21px] sm:text-[24px] md:text-[28px] lg:text-[36px] xl:text-[40px] font-bold text-gray-800 mb-4 sm:mb-6 md:mb-8 lg:mb-10 text-center"
								>
									產品特點
								</h2>

								<div v-if="product.features && product.features.length > 0">
									<ul class="mx-auto feature-list space-y-4 md:space-y-6 md:max-w-4xl">
										<li
											v-for="feature in displayedFeatures"
											:key="feature._id"
											class="flex items-center bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100"
										>
											<span class="text-primary text-[16px] sm:text-[21px] md:text-[24px] lg:text-[36px] xl:text-[40px] mr-2 sm:mr-3">◎</span>
											<div>
												<h3 class="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[21px] xl:text-[24px] font-medium text-gray-800">
													{{ getLocalizedFeature(feature) }}
												</h3>
											</div>
										</li>
									</ul>
									<div
										v-if="product.features.length > displayedFeaturesCount"
										class="mx-auto md:max-w-2xl bg-white/70 text-center mt-4 sm:mt-6 md:mt-8 p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100"
									>
										<button
											@click="toggleShowAllFeatures"
											class="text-primary/70 hover:text-primary w-full text-[12px] sm:text-[14px] md:text-[16px] lg:text-[21px] xl:text-[24px] transition-colors duration-300"
										>
											{{ showAllFeatures ? "收合部分" : "顯示更多" }}
										</button>
									</div>
								</div>
							</div>
						</div>
					</section>

					<!-- 產品影片區塊 -->
					<section v-if="product && product.videos && product.videos.length > 0" class="container py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20">
						<h2
							class="text-[21px] sm:text-[24px] md:text-[28px] lg:text-[36px] xl:text-[40px] font-bold text-gray-800 mb-4 sm:mb-6 md:mb-8 lg:mb-10 text-center"
						>
							產品影片
						</h2>
						<div class="flex justify-center">
							<video
								:src="`${config.public.fileServiceBaseUrl}${product.videos[0].startsWith('/') ? '' : '/'}${product.videos[0]}`"
								controls
								class="max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl rounded-lg shadow-lg"
								preload="metadata"
							>
								您的瀏覽器不支援影片播放。
							</video>
						</div>
					</section>

					<!-- 諮詢區塊 -->
					<section
						class="bg-primary bg-opacity-5 py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16 space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5 xl:space-y-6 text-center"
					>
						<h2 class="text-[21px] sm:text-[24px] md:text-[28px] lg:text-[36px] xl:text-[40px] font-bold text-gray-800">了解更多產品資訊？</h2>
						<p class="text-[14px] sm:text-[16px] md:text-[21px] lg:text-[24px] xl:text-[28px] text-gray-600">
							我們的專業團隊隨時為您提供諮詢服務，解答所有關於產品的疑問
						</p>
						<div class="flex flex-row justify-center gap-2 sm:gap-3 md:gap-4">
							<Button-CTA label="立即諮詢" to="/contact" class="w-fit"></Button-CTA>
							<Button-CTA label="產品一覽" to="/Products" class="w-fit"></Button-CTA>
						</div>
					</section>
				</div>
				<div v-else class="min-h-screen flex items-center justify-center">
					<div class="text-center py-12 text-gray-500">
						<h2 class="text-2xl font-bold mb-4">找不到指定的產品</h2>
						<NuxtLink to="/products" class="mt-4 inline-block text-blue-600 hover:underline">返回產品列表</NuxtLink>
					</div>
				</div>

				<!-- 圖片預覽彈窗 -->
				<div
					v-if="isImageModalOpen"
					class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
					role="dialog"
					aria-modal="true"
					:aria-labelledby="`product-modal-title-${product._id}`"
					@click.self="closeImageModal"
					@keydown.esc="closeImageModal"
				>
					<h2 :id="`product-modal-title-${product._id}`" class="sr-only">{{ getLocalizedName(product) }} 圖片預覽</h2>
					<button
						ref="closeModalButtonRef"
						@click="closeImageModal"
						class="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white rounded-full p-1"
						aria-label="關閉圖片預覽"
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
					<div class="max-w-5xl max-h-[90vh]">
						<NuxtImg
							:src="modalImage"
							:alt="getLocalizedName(product)"
							class="max-w-full max-h-[90vh] object-contain"
							loading="lazy"
							format="webp"
							width="1280"
							height="1280"
							sizes="90vw lg:1280px"
							:placeholder="[50, 50, 75, 5]"
						/>
					</div>
				</div>

				<!-- 登入對話框 -->
				<LoginDialog v-model="isLoginDialogOpen" @login-success="handleLoginSuccessAndDownload" />

				<template #fallback>
					<!-- Fallback to show skeleton loader on server and on client until mount -->
					<SkeletonProductDetail />
				</template>
			</ClientOnly>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, nextTick, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLanguageStore } from "~/stores/core/languageStore";
import { useProductsStore } from "~/stores/models/products";
import { useUserStore } from "~/stores/userStore";
import ButtonCTA from "~/components/common/Button-CTA.vue";
import SkeletonProductDetail from "~/components/products/SkeletonProductDetail.vue";
import LoginDialog from "~/components/LoginDialog.vue";
import { useRuntimeConfig, useAsyncData, useHead, showError } from "#app";
import { useHierarchyStore } from "~/stores/hierarchyStore";

const route = useRoute();
const router = useRouter();
const languageStore = useLanguageStore();
const productsStore = useProductsStore();
const userStore = useUserStore();
const config = useRuntimeConfig();
const hierarchyStore = useHierarchyStore();

const productCode = ref(route.params.code);
const product = ref(null);
const isLoading = ref(true);
const error = ref(null);

const {
	data: pageData,
	pending,
	error: asyncError
} = useAsyncData(
	`product-${productCode.value}`,
	async () => {
		let productSummary = productsStore.getProductByCode(productCode.value);

		// If product is not in the store, fetch all products
		if (!productSummary) {
			await productsStore.fetchProducts({ limit: 10000 }); // Fetch all products
			productSummary = productsStore.getProductByCode(productCode.value);
		}

		// If still not found, it's a 404
		if (!productSummary) {
			throw new Error(`找不到產品代碼為 ${productCode.value} 的產品。`);
		}

		// Now fetch the detailed product info using the ID
		const detailedProduct = await productsStore.fetchProductById(productSummary._id);
		if (!detailedProduct) {
			throw new Error(`無法載入產品 (ID: ${productSummary._id}) 的詳細資訊。`);
		}

		// Update head metadata inside the async data callback
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
		lazy: true,
		watch: [() => route.params.code]
	}
);

// Use watchEffect to react to changes from useAsyncData
watchEffect(() => {
	isLoading.value = pending.value;
	if (asyncError.value) {
		error.value = asyncError.value.message || "載入產品時發生未知錯誤。";
		showError({ statusCode: 404, statusMessage: "Product Not Found", fatal: true });
	} else {
		product.value = pageData.value;
		error.value = null; // Clear previous errors on success
	}
});

// After data is fetched, set the primary image
const currentImage = computed(() => {
	if (product.value?.images && product.value.images.length > 0) {
		return product.value.images[0];
	}
	return null;
});

const relatedProducts = ref([]);

// 產品特點顯示相關
const showAllFeatures = ref(false);
const displayedFeaturesCount = 5;
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

// 標籤頁相關
const tabs = [
	{ id: "features", label: "產品特點" },
	{ id: "specs", label: "技術規格" },
	{ id: "applications", label: "應用場景" }
];
const activeTab = ref("features");

// 推薦語輪播相關
const testimonialIndex = ref(0);
const currentTestimonial = computed(() => {
	if (!product.value?.testimonials?.length) return { content: "", author: "" };
	return product.value.testimonials[testimonialIndex.value];
});

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
	return { name: "產品系列", link: "/products" };
});

const getLocalizedFeature = (feature) => {
	if (!feature) return "";
	const currentLang = languageStore.currentLanguage ? languageStore.currentLanguage.toUpperCase() : "TW";
	return feature[currentLang] || feature["TW"] || feature["EN"] || Object.values(feature)[0] || "";
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

// 推薦語輪播
const nextTestimonial = () => {
	if (!product.value?.testimonials?.length) return;
	testimonialIndex.value = (testimonialIndex.value + 1) % product.value.testimonials.length;
};

const prevTestimonial = () => {
	if (!product.value?.testimonials?.length) return;
	testimonialIndex.value = testimonialIndex.value === 0 ? product.value.testimonials.length - 1 : testimonialIndex.value - 1;
};

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
			alert("下載功能配置錯誤，請聯繫管理員。");
			return;
		}
		const fullSpecUrl = `${fileServiceBase}${specUrlRelative}`;

		// 修改為在新分頁開啟連結
		window.open(fullSpecUrl, "_blank");
	} else {
		// 理論上，如果按鈕可見，這裡不應觸發，但作為防護
		alert("目前尚無規格文件可供下載，請聯繫我們以獲取更多資訊。");
	}
};

// 處理「下載規格」按鈕點擊事件
const handleDownloadSpecsClick = () => {
	if (!product.value?.documents || product.value.documents.length === 0) {
		alert("目前尚無規格文件可供下載，請聯繫我們以獲取更多資訊。");
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
		alert("產品規格資訊似乎已變更或無法取得，請重試。");
	}
};

// 型錄下載功能
const downloadCatalog = () => {
	if (product.value?.catalogUrl) {
		window.open(product.value.catalogUrl, "_blank");
	} else {
		// 如果沒有型錄，可以改為導向到聯絡頁面
		navigateTo("/contact?subject=產品型錄索取&product=" + product.value?.code);
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
</style>
