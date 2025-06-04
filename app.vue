<template>
	<div>
		<!-- Google Tag Manager (noscript) -->
		<noscript
			><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MDGKVSK5" height="0" width="0" style="display: none; visibility: hidden"></iframe
		></noscript>
		<!-- End Google Tag Manager (noscript) -->
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
		<SpeedInsights />
		<Analytics />
	</div>
</template>

<script setup>
import { SpeedInsights } from "@vercel/speed-insights/nuxt";
import { Analytics } from "@vercel/analytics/vue";

const { locale } = useI18n();
useHead({
	htmlAttrs: {
		lang: locale.value
	}
});
</script>
