<template>
	<div class="optimized-image-container" :class="containerClass">
		<!-- 骨架屏載入狀態 -->
		<div v-if="isLoading && showSkeletonFinal" class="skeleton-loader" :class="skeletonClass" :style="{ aspectRatio: aspectRatio }">
			<div class="skeleton-animation"></div>
		</div>

		<!-- 實際圖片 -->
		<NuxtImg
			v-if="src"
			:src="src"
			:alt="alt"
			:class="[imageClass, { 'oi-loading': isLoading, 'oi-loaded': !isLoading }]"
			:provider="finalProvider"
			:loading="isSvg ? 'eager' : loading"
			:format="isSvg ? undefined : format"
			:quality="isSvg ? undefined : quality"
			:width="width"
			:height="height"
			:sizes="sizes"
			:placeholder="isSvg ? undefined : placeholder"
			:fetchpriority="isSvg ? 'high' : fetchpriority"
			@load="handleImageLoad"
			@error="handleImageError"
		/>

		<!-- 錯誤狀態 -->
		<div v-else-if="hasError" class="error-placeholder" :class="errorClass" :style="{ aspectRatio: aspectRatio }">
			<svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
				/>
			</svg>
			<span class="error-text">{{ errorText }}</span>
		</div>

		<!-- 預設佔位符 -->
		<div v-else class="default-placeholder" :class="placeholderClass" :style="{ aspectRatio: aspectRatio }">
			<svg class="placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
				/>
			</svg>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
	// 圖片來源
	src: {
		type: String,
		default: ""
	},
	// 影像提供者（預設自動判斷）
	provider: {
		type: String,
		default: ""
	},
	// 替代文字
	alt: {
		type: String,
		default: "圖片"
	},
	// 載入策略
	loading: {
		type: String,
		default: "lazy",
		validator: (value) => ["lazy", "eager"].includes(value)
	},
	// 圖片格式
	format: {
		type: String,
		default: "webp"
	},
	// 圖片品質
	quality: {
		type: Number,
		default: 85,
		validator: (value) => value >= 1 && value <= 100
	},
	// 寬度
	width: {
		type: [Number, String],
		default: 400
	},
	// 高度
	height: {
		type: [Number, String],
		default: 300
	},
	// 響應式尺寸
	sizes: {
		type: String,
		default: "100vw"
	},
	// 模糊佔位符
	placeholder: {
		type: Array,
		default: () => [20, 20, 75, 5]
	},
	// 載入優先級
	fetchpriority: {
		type: String,
		default: "auto",
		validator: (value) => ["high", "low", "auto"].includes(value)
	},
	// 容器樣式
	containerClass: {
		type: String,
		default: ""
	},
	// 圖片樣式
	imageClass: {
		type: String,
		default: "w-full h-full object-cover"
	},
	// 骨架屏樣式
	skeletonClass: {
		type: String,
		default: "bg-gray-200 rounded"
	},
	// 錯誤樣式
	errorClass: {
		type: String,
		default: "bg-gray-100 rounded flex flex-col items-center justify-center"
	},
	// 佔位符樣式
	placeholderClass: {
		type: String,
		default: "bg-gray-50 rounded flex items-center justify-center"
	},
	// 長寬比
	aspectRatio: {
		type: String,
		default: "16/9"
	},
	// 是否顯示骨架屏
	showSkeleton: {
		type: Boolean,
		default: true
	},
	// 錯誤文字
	errorText: {
		type: String,
		default: "圖片載入失敗"
	}
});

const emit = defineEmits(["load", "error"]);

// 響應式狀態
const isLoading = ref(true);
const hasError = ref(false);

// 是否為 SVG（圖示）
const isSvg = computed(() => {
	if (!props.src) return false;
	return props.src.toLowerCase().endsWith(".svg");
});

// 圖示不需要骨架與轉檔
const showSkeletonFinal = computed(() => props.showSkeleton && !isSvg.value);

// 是否為站內本地資源（以 / 開頭）
const isLocalAsset = computed(() => typeof props.src === "string" && props.src.startsWith("/"));

// 最終使用的 provider：SVG 或本地資源一律使用原生圖片（避免 _ipx 404）
const finalProvider = computed(() => {
	if (isSvg.value || isLocalAsset.value) return "none";
	return props.provider || undefined;
});

// 計算屬性
const computedSizes = computed(() => {
	if (props.sizes === "100vw") {
		// 根據寬度自動生成響應式尺寸
		const width = parseInt(props.width);
		if (width <= 320) return "320px";
		if (width <= 640) return "(max-width: 640px) 320px, 640px";
		if (width <= 768) return "(max-width: 640px) 320px, (max-width: 768px) 640px, 768px";
		if (width <= 1024) return "(max-width: 640px) 320px, (max-width: 768px) 640px, (max-width: 1024px) 768px, 1024px";
		return "(max-width: 640px) 320px, (max-width: 768px) 640px, (max-width: 1024px) 768px, (max-width: 1280px) 1024px, 1280px";
	}
	return props.sizes;
});

// 事件處理
const handleImageLoad = () => {
	isLoading.value = false;
	hasError.value = false;
	emit("load");
};

const handleImageError = () => {
	isLoading.value = false;
	hasError.value = true;
	emit("error");
};
</script>

<style scoped>
.optimized-image-container {
	position: relative;
	overflow: hidden;
}

.skeleton-loader {
	position: relative;
	background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
	background-size: 200% 100%;
	animation: skeleton-loading 1.5s infinite;
}

.skeleton-animation {
	width: 100%;
	height: 100%;
}

@keyframes skeleton-loading {
	0% {
		background-position: 200% 0;
	}
	100% {
		background-position: -200% 0;
	}
}

.error-placeholder {
	color: #6b7280;
}

.error-icon {
	width: 2rem;
	height: 2rem;
	margin-bottom: 0.5rem;
}

.error-text {
	font-size: 0.875rem;
	text-align: center;
}

.default-placeholder {
	color: #9ca3af;
}

.placeholder-icon {
	width: 2rem;
	height: 2rem;
}

/* 圖片載入動畫 */
/* 載入淡入控制，避免依賴 loading 屬性造成永久透明 */
.optimized-image-container img {
	transition: opacity 0.3s ease-in-out;
}
.optimized-image-container img.oi-loading {
	opacity: 0;
}
.optimized-image-container img.oi-loaded {
	opacity: 1;
}
</style>
