<template>
	<div>
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
useHead({
	htmlAttrs: {
		lang: locale.value
	}
});
</script>
