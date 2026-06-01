<template>
	<div>
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useLocaleHead } from "#i18n";

const { locale } = useI18n();
const i18nHead = useLocaleHead({ addSeoAttributes: true });

useHead({
	htmlAttrs: {
		lang: () => locale.value === "en" ? "en" : "zh-Hant"
	},
	link: () => i18nHead.value.link || [],
	meta: () => i18nHead.value.meta || []
});
</script>
