<template>
	<div class="space-y-3" aria-live="polite">
		<div>
			<p class="text-sm font-medium text-emerald-800">{{ t("interactive.access.device_heading") }}</p>
			<h3 class="mt-1 text-lg font-semibold text-primary md:text-xl">{{ device.title }}</h3>
		</div>
		<p class="text-base leading-relaxed text-slate-700">{{ device.desc }}</p>
		<p class="text-sm leading-relaxed text-slate-600">{{ device.note }}</p>
		<NuxtLink
			v-if="product"
			:to="localePath(toProductPath(product.productCode))"
			class="inline-block text-sm font-medium text-emerald-800 underline underline-offset-2"
		>
			{{ t(`interactive.access.product_links.${device.id}`) }}
		</NuxtLink>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { accessDeviceProducts } from "~/data/interactive/accessContent.js";
import { useAccessStudio } from "~/composables/useAccessStudio.js";
import { toProductPath } from "~/utils/productUrl.js";

const { t } = useI18n();
const localePath = useLocalePath();
const { device } = useAccessStudio();
const product = computed(() => accessDeviceProducts[device.value.id]);
</script>
