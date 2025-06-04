import { defineStore } from "pinia";
import { useNuxtApp } from "#app"; // 導入 useNuxtApp
import { computed, ref } from "vue"; // 確保導入 computed 和 ref

export const useLanguageStore = defineStore("language", () => {
	// 獲取 Nuxt app 實例
	const nuxtApp = useNuxtApp();

	// 透過 nuxtApp.$i18n 訪問 i18n 屬性
	// 檢查 $i18n 是否存在，避免在應用早期初始化或模組未加載時出錯
	const i18n = nuxtApp.$i18n;

	if (!i18n) {
		// 提供預設值或錯誤狀態
		const currentLang = ref("zh"); // 預設語言
		const availableLanguages = ref(["zh", "en"]); // 預設可用語言
		const setLanguage = (lang) => console.warn("無法設置語言, i18n 不可用。");
		const getLocalizedField = (item, field) => item?.[field]?.["zh"] || item?.[field]?.["en"] || item?.[field] || ""; // 基本回退

		return {
			currentLang,
			availableLanguages,
			setLanguage,
			getLocalizedField,
			error: ref("i18n not available")
		};
	}

	// --- 使用 i18n 實例 ---

	// 使用基於 i18n 響應式屬性的 computed properties
	const currentLang = computed(() => i18n.locale.value);

	const availableLanguages = computed(() => {
		const localesValue = i18n.locales.value; // 訪問響應式的 locales 值
		return Array.isArray(localesValue) ? localesValue.map((l) => (typeof l === "string" ? l : l.code)) : [];
	});

	/**
	 * 設置當前語言
	 * @param {string} lang - 語言代碼
	 */
	function setLanguage(lang) {
		if (availableLanguages.value.includes(lang)) {
			// 直接修改 i18n locale - 使用 @nuxtjs/i18n 提供的 setLocale 方法
			i18n.setLocale(lang);
		} else {
			console.warn(`不支援的語言: ${lang}，可用語言: ${availableLanguages.value.join(", ")}`);
		}
	}

	/**
	 * 從多語言欄位中獲取當前語言的值
	 * @param {Object} item - 資料項
	 * @param {string} field - 欄位名稱
	 * @returns {string} - 本地化後的值
	 */
	function getLocalizedField(item, field) {
		if (!item) return "";

		// 如果欄位本身不是物件，直接返回
		if (!item[field] || typeof item[field] !== "object") {
			return item[field] || "";
		}

		// 檢查國際化欄位格式
		const langField = item[field];

		// 優先使用當前語言 (使用 computed property)
		const lang = currentLang.value; // 使用計算屬性
		if (langField[lang]) {
			return langField[lang];
		}

		// 退化機制: 按順序嘗試繁體中文、英文
		if (langField.zh) return langField.zh;
		if (langField.en) return langField.en;

		// 使用 computed availableLanguages
		const langsAvailable = availableLanguages.value;
		// 找出任何有值的語言
		for (const availLang of langsAvailable) {
			if (langField[availLang] && typeof langField[availLang] === "string" && langField[availLang].trim()) {
				return langField[availLang];
			}
		}

		// 嘗試從物件中獲取第一個非空值
		for (const key in langField) {
			if (langField[key] && typeof langField[key] === "string" && langField[key].trim()) {
				return langField[key];
			}
		}

		// 都沒有找到，返回空字串
		return "";
	}

	return {
		currentLang,
		availableLanguages,
		setLanguage,
		getLocalizedField
	};
});
