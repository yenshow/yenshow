<template>
	<div
		class="flex items-center gap-3 text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] hoverBlock-[21px] pointer-auto"
		style="text-shadow: 0 0 10px rgba(0, 0, 0, 0.5)"
	>
		<button
			@click="toggleLocale($event, 'zh')"
			:class="locale === 'zh' ? 'font-bold opacity-100' : 'opacity-50'"
			class="transition-opacity hover:opacity-100 cursor-pointer"
		>
			TW
		</button>
		<span>/</span>
		<button
			@click="toggleLocale($event, 'en')"
			:class="locale === 'en' ? 'font-bold opacity-100' : 'opacity-50'"
			class="transition-opacity hover:opacity-100 cursor-pointer"
		>
			EN
		</button>
	</div>
</template>

<script setup>
import { nextTick } from "vue";
const { locale, setLocale } = useI18n();

// 確保點擊時語言切換有效
const toggleLocale = async (event, lang) => {
	event.stopPropagation();

	// if (locale.value !== lang) {
	// 	await setLocale(lang);
	// 	await nextTick();
	// }
};
</script>
