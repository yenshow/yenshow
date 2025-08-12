<template>
	<div class="relative" ref="productListContainerRef">
		<button
			v-if="showLeftArrow && !isGridView"
			@click="scrollLeft"
			class="absolute hidden md:block left-[-5%] top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
			:aria-label="t('products.scroll_left')"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6 text-gray-700"
				aria-hidden="true"
			>
				<title>{{ t("products.left_arrow") }}</title>
				<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
			</svg>
		</button>

		<div v-if="loading" class="flex justify-center items-center p-8" role="status" aria-live="polite">
			<div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
			<span class="sr-only">{{ t("products.loading") }}</span>
		</div>
		<div v-else-if="!products || products.length === 0" class="text-center py-8 text-gray-500" aria-live="polite">{{ t("products.no_results") }}</div>
		<div
			v-else
			ref="scrollContainerRef"
			:class="[
				'px-4 py-4 transition-all duration-300',
				isGridView
					? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
					: 'flex overflow-x-auto whitespace-nowrap space-x-6 horizontal-scroll-container'
			]"
			@scroll="updateArrowVisibility"
			role="list"
		>
			<div
				v-for="product in paginatedProducts"
				:key="product._id"
				:class="[
					'bg-white p-4 rounded-lg hover:shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary',
					isGridView ? '' : 'w-72 flex-shrink-0'
				]"
				role="listitem"
				@click="handleProductClick(product)"
				@keydown.enter="handleProductClick(product)"
				@keydown.space.prevent="handleProductClick(product)"
				tabindex="0"
			>
				<div class="aspect-square rounded-md mb-4 flex items-center justify-center">
					<NuxtImg
						v-if="product.images && product.images.length > 0"
						:src="product.images[0]"
						:alt="product.displayName || t('products.product_image')"
						class="h-[80%] object-contain"
						loading="lazy"
						format="webp"
						width="288"
						height="288"
						sizes="288px"
						:placeholder="[20, 20, 75, 5]"
					/>
					<div v-else class="w-full h-full flex items-center justify-center text-gray-400">{{ t("products.no_image") }}</div>
				</div>
				<h4 class="text-[16px] md:text-[18px] font-medium text-gray-800 overflow-hidden text-ellipsis">
					{{ product.code }}
				</h4>
				<p v-if="locale === 'zh'" class="text-[12px] md:text-[16px] text-gray-500 overflow-hidden text-ellipsis">
					{{ product.displayName || t("products.unnamed_product") }}
				</p>
			</div>
		</div>

		<button
			v-if="showRightArrow && !isGridView"
			@click="scrollRight"
			class="absolute hidden md:block right-[-5%] top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
			:aria-label="t('products.scroll_right')"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6 text-gray-700"
				aria-hidden="true"
			>
				<title>{{ t("products.right_arrow") }}</title>
				<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
			</svg>
		</button>
		<!-- Controls -->
		<div v-if="showControlsContainer" class="mt-8 relative px-4 min-h-[24px]">
			<!-- Pagination -->
			<div v-if="hasPagination" class="flex justify-center items-center space-x-2 sm:space-x-4">
				<button
					@click="changePage(currentPage - 1)"
					:disabled="currentPage === 1"
					class="px-3 py-1 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{{ t("products.prev_page") }}
				</button>
				<div class="flex items-center space-x-1 sm:space-x-2">
					<button
						v-for="page in totalPages"
						:key="page"
						@click="changePage(page)"
						:class="['px-3 py-1 text-sm rounded-md', currentPage === page ? 'bg-primary text-white font-semibold' : 'bg-white text-gray-600 hover:bg-gray-50']"
					>
						{{ page }}
					</button>
				</div>
				<button
					@click="changePage(currentPage + 1)"
					:disabled="currentPage === totalPages"
					class="px-3 py-1 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{{ t("products.next_page") }}
				</button>
			</div>

			<!-- Toggle Button -->
			<div v-if="hasToggleButton" class="mt-4 text-center md:mt-0 md:absolute md:right-4 md:bottom-0">
				<button
					@click="toggleGridView"
					class="inline-flex items-center justify-center px-4 py-2 border border-primary hover:border-primary/50 rounded-md text-primary hover:text-primary/50 transition-all duration-300"
				>
					<span>{{ isGridView ? t("products.collapse_list") : t("products.view_all") }}</span>
					<svg
						v-if="!isGridView"
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 ml-2"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="1.5"
						aria-hidden="true"
					>
						<title>{{ t("products.view_all_icon") }}</title>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25v2.25A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z"
						/>
					</svg>
					<svg
						v-else
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 ml-2"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="1.5"
						aria-hidden="true"
					>
						<title>{{ t("products.collapse_list_icon") }}</title>
						<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
					</svg>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useI18n } from "vue-i18n";

gsap.registerPlugin(ScrollToPlugin);
const { t, locale } = useI18n();

const props = defineProps({
	products: {
		type: Array,
		default: () => []
	},
	loading: {
		type: Boolean,
		default: false
	},
	autoScrollSpeed: {
		type: Number,
		default: 7
	}
});

const emit = defineEmits(["view-product"]);
const router = useRouter();
const localePath = useLocalePath();

const scrollContainerRef = ref(null);
const productListContainerRef = ref(null); // Ref for the main container
const showLeftArrow = ref(false);
const showRightArrow = ref(false);
const isGridView = ref(false);

const scrollAnimationId = ref(null);
const currentScrollDirection = ref(null);

// Responsive pagination state
const isDesktop = ref(false);
const productsPerPage = computed(() => (isDesktop.value ? 15 : 6));

// Pagination state
const currentPage = ref(1);

const totalPages = computed(() => {
	if (!props.products || props.products.length === 0) return 0;
	return Math.ceil(props.products.length / productsPerPage.value);
});

const paginatedProducts = computed(() => {
	if (!isGridView.value) {
		return props.products;
	}
	const start = (currentPage.value - 1) * productsPerPage.value;
	const end = start + productsPerPage.value;
	return props.products.slice(start, end);
});

const hasPagination = computed(() => isGridView.value && totalPages.value > 1);
const hasToggleButton = computed(() => props.products.length > 5);

const showControlsContainer = computed(() => {
	return hasPagination.value || hasToggleButton.value;
});

const toggleGridView = () => {
	isGridView.value = !isGridView.value;
	currentPage.value = 1;
	if (!isGridView.value) {
		nextTick(() => {
			updateArrowVisibility();
		});
	}
};

const changePage = (page) => {
	if (page >= 1 && page <= totalPages.value) {
		currentPage.value = page;
		// Scroll to the top of the component smoothly
		if (productListContainerRef.value) {
			gsap.to(window, { duration: 0.5, scrollTo: { y: productListContainerRef.value, offsetY: 120 } });
		}
	}
};

const scrollLeft = () => {
	if (scrollContainerRef.value) {
		const container = scrollContainerRef.value;
		const target = Math.max(container.scrollLeft - container.clientWidth, 0);
		gsap.to(container, {
			scrollLeft: target,
			duration: 2,
			ease: "power2.out",
			onUpdate: updateArrowVisibility
		});
	}
};

const scrollRight = () => {
	if (scrollContainerRef.value) {
		const container = scrollContainerRef.value;
		const maxScroll = container.scrollWidth - container.clientWidth;
		const target = Math.min(container.scrollLeft + container.clientWidth, maxScroll);
		gsap.to(container, {
			scrollLeft: target,
			duration: 2,
			ease: "power2.out",
			onUpdate: updateArrowVisibility
		});
	}
};

const updateArrowVisibility = () => {
	if (isGridView.value || !scrollContainerRef.value) {
		showLeftArrow.value = false;
		showRightArrow.value = false;
		return;
	}

	const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.value;
	const tolerance = 1;

	showLeftArrow.value = scrollLeft > tolerance;
	showRightArrow.value = scrollLeft < scrollWidth - clientWidth - tolerance;
};

const viewProduct = (product) => {
	if (product && product.code) {
		router.push(localePath(`/products/${product.code.toLowerCase()}`));
	}
};

const startAutoScroll = (direction) => {
	if (isGridView.value || currentScrollDirection.value === direction) {
		return;
	}
	stopAutoScroll();
	currentScrollDirection.value = direction;

	const scrollStep = () => {
		if (scrollContainerRef.value) {
			const scrollAmount = direction === "left" ? -props.autoScrollSpeed : props.autoScrollSpeed;
			scrollContainerRef.value.scrollLeft += scrollAmount;
			updateArrowVisibility();
			scrollAnimationId.value = requestAnimationFrame(scrollStep);
		}
	};
	scrollStep();
};

const stopAutoScroll = () => {
	if (scrollAnimationId.value) {
		cancelAnimationFrame(scrollAnimationId.value);
		scrollAnimationId.value = null;
	}
	currentScrollDirection.value = null;
};

const handleContainerMousemove = (event) => {
	if (isGridView.value || !productListContainerRef.value) {
		return;
	}

	const rect = productListContainerRef.value.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const width = rect.width;
	const scrollZoneWidth = 100; // 100px from each edge

	if (width < scrollZoneWidth * 2.5) {
		// If container is too small, disable hover scroll
		stopAutoScroll();
		return;
	}

	if (x < scrollZoneWidth) {
		startAutoScroll("left");
	} else if (x > width - scrollZoneWidth) {
		startAutoScroll("right");
	} else {
		stopAutoScroll();
	}
};

const handleProductClick = (product) => {
	stopAutoScroll();
	// 如果 product 物件上有自訂的 onClick 方法，就執行它
	if (typeof product.onClick === "function") {
		product.onClick();
	} else {
		// 否則，使用舊的 viewProduct 方法
		viewProduct(product);
	}
};

let mediaQuery;
const handleResize = (e) => {
	isDesktop.value = e.matches;
};

onMounted(() => {
	mediaQuery = window.matchMedia("(min-width: 768px)");
	handleResize(mediaQuery);
	mediaQuery.addEventListener("change", handleResize);

	if (productListContainerRef.value) {
		productListContainerRef.value.addEventListener("mousemove", handleContainerMousemove);
		productListContainerRef.value.addEventListener("mouseleave", stopAutoScroll);
	}

	nextTick(() => {
		updateArrowVisibility();
	});
});

onBeforeUnmount(() => {
	if (scrollContainerRef.value) {
		scrollContainerRef.value.removeEventListener("scroll", updateArrowVisibility);
	}
	if (productListContainerRef.value) {
		productListContainerRef.value.removeEventListener("mousemove", handleContainerMousemove);
		productListContainerRef.value.removeEventListener("mouseleave", stopAutoScroll);
	}
	stopAutoScroll();
	if (mediaQuery) {
		mediaQuery.removeEventListener("change", handleResize);
	}
});

watch(
	[isGridView, () => props.products],
	() => {
		currentPage.value = 1;
		nextTick(() => {
			updateArrowVisibility();
		});
	},
	{ deep: true, immediate: true }
);
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
/* Target the container to hide scrollbar */
.horizontal-scroll-container {
	scrollbar-width: none; /* For Firefox */
	-ms-overflow-style: none; /* For Internet Explorer and Edge */
}

/* For Webkit browsers (Chrome, Safari) */
.horizontal-scroll-container::-webkit-scrollbar {
	display: none;
}

.scrollbar-thin {
	scrollbar-width: thin; /* For Firefox */
}

/* For Webkit browsers (Chrome, Safari) */
.scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
	background-color: #d1d5db; /* gray-300 */
	border-radius: 6px;
}
.scrollbar-track-gray-100::-webkit-scrollbar-track {
	background-color: #f3f4f6; /* gray-100 */
	border-radius: 6px;
}
::-webkit-scrollbar {
	height: 8px; /* Height of the horizontal scrollbar */
}

/* Style adjustments for arrow positioning if needed */
/* Ensure the parent div has position: relative */
</style>
