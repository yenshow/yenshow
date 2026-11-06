<template>
	<section
		:class="embedded ? 'space-y-4' : 'space-y-4 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm'"
		aria-labelledby="cctv-storage-title"
	>
		<h2
			id="cctv-storage-title"
			:class="embedded ? 'text-lg font-semibold text-primary md:text-xl' : 'text-xl font-bold text-primary md:text-2xl'"
		>
			{{ t("interactive.cctv.storage_heading") }}
		</h2>
		<p class="text-sm text-slate-600">{{ t("interactive.cctv.formula_note") }}</p>

		<form class="grid gap-3 sm:grid-cols-2" @submit.prevent>
			<label class="block text-sm">
				<span class="mb-1 block font-medium text-primary">{{ t("interactive.cctv.cameras") }}</span>
				<input
					v-model.number="form.cameras"
					class="field"
					type="number"
					min="1"
					max="128"
					inputmode="numeric"
					:aria-label="t('interactive.cctv.cameras')"
					@blur="handleNormalize"
				/>
			</label>
			<label class="block text-sm">
				<span class="mb-1 block font-medium text-primary">{{ t("interactive.cctv.bitrate") }}</span>
				<input
					v-model.number="form.bitrateMbps"
					class="field"
					type="number"
					min="0.5"
					max="20"
					step="0.5"
					inputmode="decimal"
					:aria-label="t('interactive.cctv.bitrate')"
					@blur="handleNormalize"
				/>
			</label>
			<label class="block text-sm">
				<span class="mb-1 block font-medium text-primary">{{ t("interactive.cctv.days") }}</span>
				<input
					v-model.number="form.days"
					class="field"
					type="number"
					min="1"
					max="365"
					inputmode="numeric"
					:aria-label="t('interactive.cctv.days')"
					@blur="handleNormalize"
				/>
			</label>
			<label class="block text-sm">
				<span class="mb-1 block font-medium text-primary">{{ t("interactive.cctv.hours") }}</span>
				<input
					v-model.number="form.hoursPerDay"
					class="field"
					type="number"
					min="1"
					max="24"
					inputmode="numeric"
					:aria-label="t('interactive.cctv.hours')"
					@blur="handleNormalize"
				/>
			</label>
		</form>

		<div class="grid gap-2 sm:grid-cols-3" aria-live="polite">
			<div class="rounded-xl bg-primary p-3 text-secondary sm:p-4">
				<div class="text-xl font-bold tabular-nums md:text-2xl">{{ result.rawTB.toFixed(4) }} TB</div>
				<div class="text-xs opacity-80">{{ t("interactive.cctv.raw") }}</div>
			</div>
			<div class="rounded-xl bg-emerald-700 p-3 text-white sm:p-4">
				<div class="text-xl font-bold tabular-nums md:text-2xl">{{ result.planningTB.toFixed(4) }} TB</div>
				<div class="text-xs opacity-90">{{ t("interactive.cctv.planning") }}</div>
			</div>
			<div class="rounded-xl border border-slate-200 bg-slate-50 p-3 text-primary sm:p-4">
				<div class="text-xl font-bold tabular-nums md:text-2xl">{{ result.aggregateMbps }} Mbps</div>
				<div class="text-xs text-slate-600">{{ t("interactive.cctv.bandwidth") }}</div>
			</div>
		</div>

		<button
			type="button"
			class="rounded-lg bg-primary px-4 py-2 text-sm text-secondary hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
			:aria-label="t('interactive.cctv.reset')"
			@click="handleReset"
		>
			{{ t("interactive.cctv.reset") }}
		</button>
	</section>
</template>

<script setup>
import { computed, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { cameraStorage, DEFAULT_CCTV_STORAGE, normalizeCctvStorage } from "~/utils/interactive/model.js";

defineProps({
	embedded: { type: Boolean, default: false }
});

const { t } = useI18n();

const form = reactive({
	cameras: DEFAULT_CCTV_STORAGE.cameras,
	bitrateMbps: DEFAULT_CCTV_STORAGE.bitrateMbps,
	days: DEFAULT_CCTV_STORAGE.days,
	hoursPerDay: DEFAULT_CCTV_STORAGE.hoursPerDay
});

const result = computed(() => cameraStorage({ ...form }));

const handleNormalize = () => {
	Object.assign(form, normalizeCctvStorage(form));
};

const handleReset = () => {
	Object.assign(form, normalizeCctvStorage(DEFAULT_CCTV_STORAGE));
};
</script>

<style scoped>
.field {
	@apply w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-primary focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200;
}
</style>
