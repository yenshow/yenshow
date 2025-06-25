<template>
	<div class="relative" ref="productListContainerRef">
		<button
			v-if="showLeftArrow && !isGridView"
			@click="scrollLeft"
			class="absolute left-0 md:left-[-5%] top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
			aria-label="向左滾動產品"
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
				<title>向左箭頭</title>
				<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
			</svg>
		</button>

		<div v-if="loading" class="flex justify-center items-center p-8" role="status" aria-live="polite">
			<div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
			<span class="sr-only">正在載入產品...</span>
		</div>
		<div v-else-if="!products || products.length === 0" class="text-center py-8 text-gray-500" aria-live="polite">目前沒有符合條件的產品</div>
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
			<a
				v-for="product in paginatedProducts"
				:key="product._id"
				:href="`/products/${product._id}`"
				@click.prevent="viewProduct(product)"
				:class="[
					'bg-white p-4 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary',
					isGridView ? '' : 'w-72 flex-shrink-0'
				]"
				role="listitem"
			>
				<div class="aspect-square rounded-md mb-4 flex items-center justify-center">
					<NuxtImg
						v-if="product.images && product.images.length > 0"
						:src="product.images[0]"
						:alt="product.displayName || product.model || '產品圖片'"
						class="h-[80%] object-contain"
						loading="lazy"
						format="webp"
						width="288"
						height="288"
						sizes="288px"
						:placeholder="[20, 20, 75, 5]"
					/>
					<div v-else class="w-full h-full flex items-center justify-center text-gray-400">尚無圖片</div>
				</div>
				<h4 class="text-[16px] md:text-[18px] font-medium text-gray-800 overflow-hidden text-ellipsis">
					{{ product.displayName || product.model || "未命名產品" }}
				</h4>
				<p v-if="product.model" class="text-[14px] text-gray-500 overflow-hidden text-ellipsis">{{ product.model }}</p>
			</a>
		</div>

		<button
			v-if="showRightArrow && !isGridView"
			@click="scrollRight"
			class="absolute right-0 md:right-[-5%] top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
			aria-label="向右滾動產品"
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
				<title>向右箭頭</title>
				<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
			</svg>
		</button>
		<!-- Controls -->
		<div class="mt-8 relative px-4">
			<!-- Pagination -->
			<div v-if="isGridView && totalPages > 1" class="flex justify-center items-center space-x-2 sm:space-x-4">
				<button
					@click="changePage(currentPage - 1)"
					:disabled="currentPage === 1"
					class="px-3 py-1 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					上一頁
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
					下一頁
				</button>
			</div>

			<!-- Toggle Button -->
			<div v-if="products.length > 5" class="mt-4 text-center md:mt-0 md:absolute md:right-4 md:bottom-0">
				<button @click="toggleGridView" class="text-sm font-medium text-primary hover:text-primary-dark focus:outline-none focus:underline">
					{{ isGridView ? "收合列表" : "瀏覽全部" }}
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

gsap.registerPlugin(ScrollToPlugin);

const props = defineProps({
	products: {
		type: Array,
		default: () => []
	},
	loading: {
		type: Boolean,
		default: false
	}
});

const emit = defineEmits(["view-product"]);
const router = useRouter();

const scrollContainerRef = ref(null);
const productListContainerRef = ref(null); // Ref for the main container
const showLeftArrow = ref(false);
const showRightArrow = ref(false);
const isGridView = ref(false);

// Responsive pagination state
const isDesktop = ref(false);
const productsPerPage = computed(() => (isDesktop.value ? 15 : 8));

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

const SCROLL_AMOUNT = 300;

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
	emit("view-product", product);
};

onMounted(() => {
	const mediaQuery = window.matchMedia("(min-width: 768px)");
	const handleResize = (e) => {
		isDesktop.value = e.matches;
	};

	handleResize(mediaQuery); // Initial check
	mediaQuery.addEventListener("change", handleResize);

	nextTick(() => {
		updateArrowVisibility();
	});

	onBeforeUnmount(() => {
		mediaQuery.removeEventListener("change", handleResize);
	});
});

onBeforeUnmount(() => {
	if (scrollContainerRef.value) {
		scrollContainerRef.value.removeEventListener("scroll", updateArrowVisibility);
	}
});

watch(isGridView, (isGrid) => {
	currentPage.value = 1;
	nextTick(() => {
		updateArrowVisibility();
	});
});

watch(
	() => props.products,
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
