<template>
	<div>
		<!-- Google Tag Manager (noscript) -->
		<ClientOnly>
			<noscript
				><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MDGKVSK5" height="0" width="0" style="display: none; visibility: hidden"></iframe
			></noscript>
		</ClientOnly>
		<!-- End Google Tag Manager (noscript) -->
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</div>
</template>

<script setup>
const { locale } = useI18n();
useHead({
	htmlAttrs: {
		lang: locale.value
	}
});
</script>
