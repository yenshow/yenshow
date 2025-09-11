import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

/**
 * 提供語言切換的統一介面，給 `components/common/LanguageSwitcher.vue` 使用。
 * 回傳：isSwitching, switchError, canSwitch, availableLocales, currentLocale, switchLanguage
 */
export function useLanguageSwitcher() {
	const { locale, locales, setLocale } = useI18n();

	const isSwitching = ref(false);
	const switchError = ref(null);

	const availableLocales = computed(() => {
		const value = locales?.value || [];
		return Array.isArray(value) ? value.map((l) => (typeof l === "string" ? l : l.code)).filter(Boolean) : [];
	});

	const currentLocale = computed(() => locale.value);
	const canSwitch = computed(() => !isSwitching.value);

	const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

	/**
	 * 切換語言
	 * @param {string} lang - 目標語言（如 'zh' | 'en'）
	 * @param {Object} options - 額外選項
	 * @param {number} options.timeout - 逾時計時（毫秒）
	 * @param {number} options.minLoadingTime - 最小載入顯示時間（毫秒）
	 * @param {boolean} options.showLoading - 是否顯示載入狀態
	 * @returns {Promise<boolean>} 是否切換成功
	 */
	const switchLanguage = async (lang, options = {}) => {
		const timeout = Number.isFinite(options.timeout) ? options.timeout : 5000;
		const minLoadingTime = Number.isFinite(options.minLoadingTime) ? options.minLoadingTime : 0;
		const showLoading = options.showLoading !== false; // 預設顯示載入

		if (!lang || lang === currentLocale.value) return true;
		if (!availableLocales.value.includes(lang)) {
			switchError.value = new Error(`不支援的語言: ${lang}`);
			return false;
		}

		const start = Date.now();
		if (showLoading) isSwitching.value = true;
		switchError.value = null;

		try {
			await Promise.race([setLocale(lang), new Promise((_, reject) => setTimeout(() => reject(new Error("語言切換逾時")), timeout))]);

			const elapsed = Date.now() - start;
			const remain = Math.max(0, minLoadingTime - elapsed);
			if (remain > 0) await wait(remain);

			return true;
		} catch (err) {
			switchError.value = err instanceof Error ? err : new Error(String(err));
			return false;
		} finally {
			if (showLoading) isSwitching.value = false;
		}
	};

	return {
		isSwitching,
		switchError,
		canSwitch,
		availableLocales,
		currentLocale,
		switchLanguage
	};
}
