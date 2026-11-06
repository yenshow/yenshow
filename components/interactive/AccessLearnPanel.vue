<template>
	<div class="space-y-3" aria-live="polite">
		<div>
			<p class="text-sm font-medium text-emerald-800">{{ t("interactive.access.device_heading") }}</p>
			<h3 class="mt-1 text-lg font-semibold text-primary md:text-xl">{{ device.title }}</h3>
		</div>
		<p class="text-base leading-relaxed text-slate-700">{{ device.desc }}</p>
		<p class="text-sm leading-relaxed text-slate-600">{{ device.note }}</p>
	</div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useAccessStudio } from "~/composables/useAccessStudio.js";

const { t } = useI18n();
const { device } = useAccessStudio();
</script>
