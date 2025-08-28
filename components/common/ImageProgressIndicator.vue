<template>
	<div class="image-progress-container" :class="containerClass">
		<!-- 進度條 -->
		<div v-if="showProgress && !isComplete" class="progress-bar">
			<div class="progress-fill" :style="{ width: `${progress}%` }" :class="progressClass"></div>
		</div>

		<!-- 載入狀態文字 -->
		<div v-if="showText && !isComplete" class="progress-text">
			{{ progressText }}
		</div>

		<!-- 完成狀態 -->
		<div v-if="isComplete && showComplete" class="complete-indicator">
			<svg class="complete-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
			<span class="complete-text">{{ completeText }}</span>
		</div>

		<!-- 錯誤狀態 -->
		<div v-if="hasError" class="error-indicator">
			<svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
			<span class="error-text">{{ errorText }}</span>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
	// 載入進度 (0-100)
	progress: {
		type: Number,
		default: 0,
		validator: (value) => value >= 0 && value <= 100
	},
	// 是否顯示進度條
	showProgress: {
		type: Boolean,
		default: true
	},
	// 是否顯示文字
	showText: {
		type: Boolean,
		default: true
	},
	// 是否顯示完成狀態
	showComplete: {
		type: Boolean,
		default: true
	},
	// 容器樣式
	containerClass: {
		type: String,
		default: ""
	},
	// 進度條樣式
	progressClass: {
		type: String,
		default: "bg-blue-500"
	},
	// 載入文字
	loadingText: {
		type: String,
		default: "載入中..."
	},
	// 完成文字
	completeText: {
		type: String,
		default: "載入完成"
	},
	// 錯誤文字
	errorText: {
		type: String,
		default: "載入失敗"
	},
	// 自動隱藏完成狀態的時間 (毫秒)
	autoHideDelay: {
		type: Number,
		default: 2000
	},
	// 是否有錯誤
	hasError: {
		type: Boolean,
		default: false
	}
});

const emit = defineEmits(["complete", "error"]);

// 響應式狀態
const isComplete = ref(false);
const autoHideTimer = ref(null);

// 計算屬性
const progressText = computed(() => {
	if (props.hasError) return props.errorText;
	if (isComplete.value) return props.completeText;
	return `${props.loadingText} ${Math.round(props.progress)}%`;
});

// 監聽進度變化
watch(
	() => props.progress,
	(newProgress) => {
		if (newProgress >= 100 && !isComplete.value) {
			isComplete.value = true;
			emit("complete");

			// 自動隱藏完成狀態
			if (props.autoHideDelay > 0) {
				autoHideTimer.value = setTimeout(() => {
					isComplete.value = false;
				}, props.autoHideDelay);
			}
		}
	}
);

// 監聽錯誤狀態
watch(
	() => props.hasError,
	(hasError) => {
		if (hasError) {
			isComplete.value = false;
			emit("error");
		}
	}
);

// 清理定時器
onBeforeUnmount(() => {
	if (autoHideTimer.value) {
		clearTimeout(autoHideTimer.value);
	}
});
</script>

<style scoped>
.image-progress-container {
	position: relative;
	width: 100%;
}

.progress-bar {
	width: 100%;
	height: 4px;
	background-color: #e5e7eb;
	border-radius: 2px;
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	background-color: #3b82f6;
	transition: width 0.3s ease-in-out;
	border-radius: 2px;
}

.progress-text {
	text-align: center;
	font-size: 0.875rem;
	color: #6b7280;
	margin-top: 0.5rem;
}

.complete-indicator {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	color: #10b981;
	font-size: 0.875rem;
}

.complete-icon {
	width: 1rem;
	height: 1rem;
}

.complete-text {
	font-weight: 500;
}

.error-indicator {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	color: #ef4444;
	font-size: 0.875rem;
}

.error-icon {
	width: 1rem;
	height: 1rem;
}

.error-text {
	font-weight: 500;
}

/* 動畫效果 */
.progress-fill {
	background: linear-gradient(90deg, #3b82f6, #1d4ed8);
	background-size: 200% 100%;
	animation: progress-shimmer 2s infinite;
}

@keyframes progress-shimmer {
	0% {
		background-position: -200% 0;
	}
	100% {
		background-position: 200% 0;
	}
}
</style>
