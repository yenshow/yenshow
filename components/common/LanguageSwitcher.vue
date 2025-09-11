<template>
	<div
		v-if="showSwitcher"
		class="flex items-center gap-3 text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] hoverBlock-[21px] pointer-auto bg-black/40 text-white rounded-full px-3 py-1 ring-1 ring-white/30 shadow-lg backdrop-blur-sm"
		role="group"
		aria-label="語言切換"
		style="text-shadow: 0 0 10px rgba(0, 0, 0, 0.5)"
	>
		<!-- 載入狀態指示器 -->
		<div v-if="isSwitching" class="flex items-center">
			<svg class="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
		</div>
		<!-- 語言圖示 -->
		<svg v-else xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 512 512">
			<path
				fill="#ffffff"
				d="M352 256c0 22.2-1.2 43.6-3.3 64l-185.3 0c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64l185.3 0c2.2 20.4 3.3 41.8 3.3 64zm28.8-64l123.1 0c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64l-123.1 0c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32l-116.7 0c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0l-176.6 0c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0L18.6 160C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192l123.1 0c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64L8.1 320C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6l176.6 0c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352l116.7 0zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6l116.7 0z"
			/>
		</svg>
		<button
			@click="toggleLocale($event, 'zh')"
			:disabled="!canSwitch"
			:class="[
				'font-bold transition-all duration-200 px-2 py-0.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60',
				currentLocale === 'zh' ? 'opacity-100' : 'opacity-70',
				!canSwitch ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-100'
			]"
			:aria-pressed="currentLocale === 'zh' ? 'true' : 'false'"
			title="切換為繁體中文"
		>
			TW
		</button>
		<span>/</span>
		<button
			@click="toggleLocale($event, 'en')"
			:disabled="!canSwitch"
			:class="[
				'font-bold transition-all duration-200 px-2 py-0.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60',
				currentLocale === 'en' ? 'opacity-100' : 'opacity-70',
				!canSwitch ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-100'
			]"
			:aria-pressed="currentLocale === 'en' ? 'true' : 'false'"
			title="Switch to English"
		>
			EN
		</button>
	</div>
</template>

<script setup>
import { computed } from "vue";

// 使用優化的語言切換 composable
const { isSwitching, switchError, canSwitch, availableLocales, currentLocale, switchLanguage } = useLanguageSwitcher();

const showSwitcher = computed(() => {
	return availableLocales.value.length > 1;
});

// 優化的語言切換函數
const toggleLocale = async (event, lang) => {
	event.stopPropagation();

	if (canSwitch.value) {
		const success = await switchLanguage(lang, {
			timeout: 8000, // 8秒超時
			minLoadingTime: 200, // 最小載入時間
			showLoading: true
		});

		if (!success && switchError.value) {
			// 可以在這裡添加錯誤提示，例如使用 toast 通知
			console.warn("語言切換失敗:", switchError.value);
		}
	}
};
</script>
