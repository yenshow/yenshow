<template>
	<div class="space-y-3" aria-live="polite">
		<p class="text-xs font-mono uppercase tracking-wide text-emerald-800">
			{{ selectedDevice ? t("interactive.cctv.device_type") : inspector.type }}
		</p>
		<h3 class="text-lg font-semibold text-primary md:text-xl">{{ inspector.title }}</h3>
		<p class="text-sm leading-relaxed text-slate-700 md:text-base">{{ inspector.desc }}</p>
		<ul v-if="inspector.points?.length" class="list-disc space-y-1 pl-5 text-sm text-slate-700 md:text-base">
			<li v-for="(point, index) in inspector.points" :key="index">{{ point }}</li>
		</ul>
		<p class="text-sm leading-relaxed text-slate-600">{{ inspector.note }}</p>
		<NuxtLink
			v-if="productCode"
			:to="localePath(toProductPath(productCode))"
			class="inline-block text-sm font-medium text-emerald-800 underline underline-offset-2"
		>
			{{ t("interactive.cctv.product_link", { model: productCode }) }}
		</NuxtLink>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useCctvStudio } from "~/composables/useCctvStudio.js";
import { cctvDeviceProducts } from "~/data/interactive/cctvContent.js";
import { toProductPath } from "~/utils/productUrl.js";

const { t } = useI18n();
const { inspector, selectedDevice } = useCctvStudio();
const localePath = useLocalePath();
const productCode = computed(() => cctvDeviceProducts[selectedDevice.value]);
</script>
