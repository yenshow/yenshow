<template>
	<div class="space-y-3" aria-live="polite">
		<div>
			<p class="text-sm font-medium text-emerald-800">{{ t(`${root}.device_heading`) }}</p>
			<h3 class="mt-1 text-lg font-semibold text-primary md:text-xl">{{ device.title }}</h3>
		</div>
		<p class="text-base leading-relaxed text-slate-700">{{ device.desc }}</p>
		<p class="text-sm leading-relaxed text-slate-600">{{ device.note }}</p>
		<NuxtLink
			v-if="device.productCode"
			:to="localePath(toProductPath(device.productCode))"
			class="inline-block text-sm font-medium text-emerald-800 underline underline-offset-2"
		>
			{{ t(`${root}.product_link`, { model: device.productCode }) }}
		</NuxtLink>
	</div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useModuleStudio } from "~/composables/useModuleStudio.js";
import { toProductPath } from "~/utils/productUrl.js";

const props = defineProps({
	moduleId: { type: String, required: true }
});

const { t } = useI18n();
const localePath = useLocalePath();
const { device, i18nRoot } = useModuleStudio(props.moduleId);
const root = i18nRoot;
</script>
