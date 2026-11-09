<template>
	<div class="space-y-4">
		<p class="text-sm text-slate-600">{{ t(`${root}.planner_flow`) }}</p>

		<section class="space-y-3" aria-labelledby="module-plan-step-1">
			<h3 id="module-plan-step-1" class="flex items-center gap-2 text-base font-semibold text-primary">
				<span class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs text-white" aria-hidden="true">1</span>
				{{ t(`${root}.plan_step_inputs`) }}
			</h3>

			<form class="grid grid-cols-2 gap-3" @submit.prevent>
				<template v-if="moduleId === 'intercom'">
					<label class="block">
						<span class="mb-1 block text-sm font-medium text-primary">{{ t(`${root}.field_outdoors`) }}</span>
						<input
							v-model.number="plan.outdoors"
							class="field"
							type="number"
							min="1"
							max="40"
							inputmode="numeric"
							:aria-label="t(`${root}.field_outdoors`)"
							@focus="handleFocusField('outdoors')"
							@blur="handleNormalize"
						/>
					</label>
					<label class="block">
						<span class="mb-1 block text-sm font-medium text-primary">{{ t(`${root}.field_indoors`) }}</span>
						<input
							v-model.number="plan.indoors"
							class="field"
							type="number"
							min="1"
							max="200"
							inputmode="numeric"
							:aria-label="t(`${root}.field_indoors`)"
							@focus="handleFocusField('indoors')"
							@blur="handleNormalize"
						/>
					</label>
					<label class="col-span-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
						<input
							v-model="plan.withCenter"
							type="checkbox"
							class="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
							:aria-label="t(`${root}.field_with_center`)"
							@focus="handleFocusField('withCenter')"
							@blur="handleBlurField"
						/>
						<span class="text-sm font-medium text-primary">{{ t(`${root}.field_with_center`) }}</span>
					</label>
				</template>

				<template v-else-if="moduleId === 'parking'">
					<label class="block">
						<span class="mb-1 block text-sm font-medium text-primary">{{ t(`${root}.field_lanes`) }}</span>
						<input
							v-model.number="plan.lanes"
							class="field"
							type="number"
							min="1"
							max="20"
							inputmode="numeric"
							:aria-label="t(`${root}.field_lanes`)"
							@focus="handleFocusField('lanes')"
							@blur="handleNormalize"
						/>
					</label>
					<label class="block">
						<span class="mb-1 block text-sm font-medium text-primary">{{ t(`${root}.field_direction`) }}</span>
						<select
							v-model="plan.direction"
							class="field"
							:aria-label="t(`${root}.field_direction`)"
							@focus="handleFocusField('direction')"
							@blur="handleBlurField"
						>
							<option value="entry">{{ t(`${root}.direction_entry`) }}</option>
							<option value="both">{{ t(`${root}.direction_both`) }}</option>
						</select>
					</label>
					<label class="col-span-2 block">
						<span class="mb-1 block text-sm font-medium text-primary">{{ t(`${root}.field_allowlist`) }}</span>
						<input
							v-model.number="plan.allowlistPeople"
							class="field"
							type="number"
							min="10"
							max="5000"
							inputmode="numeric"
							:aria-label="t(`${root}.field_allowlist`)"
							@focus="handleFocusField('allowlistPeople')"
							@blur="handleNormalize"
						/>
					</label>
				</template>

				<template v-else-if="moduleId === 'visitor'">
					<label class="block">
						<span class="mb-1 block text-sm font-medium text-primary">{{ t(`${root}.field_daily`) }}</span>
						<input
							v-model.number="plan.dailyVisitors"
							class="field"
							type="number"
							min="5"
							max="2000"
							inputmode="numeric"
							:aria-label="t(`${root}.field_daily`)"
							@focus="handleFocusField('dailyVisitors')"
							@blur="handleNormalize"
						/>
					</label>
					<label class="block">
						<span class="mb-1 block text-sm font-medium text-primary">{{ t(`${root}.field_checkpoints`) }}</span>
						<input
							v-model.number="plan.checkpoints"
							class="field"
							type="number"
							min="1"
							max="10"
							inputmode="numeric"
							:aria-label="t(`${root}.field_checkpoints`)"
							@focus="handleFocusField('checkpoints')"
							@blur="handleNormalize"
						/>
					</label>
					<label class="col-span-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
						<input
							v-model="plan.issueBadge"
							type="checkbox"
							class="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
							:aria-label="t(`${root}.field_issue_badge`)"
							@focus="handleFocusField('issueBadge')"
							@blur="handleBlurField"
						/>
						<span class="text-sm font-medium text-primary">{{ t(`${root}.field_issue_badge`) }}</span>
					</label>
				</template>

				<template v-else-if="moduleId === 'platform'">
					<label class="block">
						<span class="mb-1 block text-sm font-medium text-primary">{{ t(`${root}.field_sites`) }}</span>
						<input
							v-model.number="plan.sites"
							class="field"
							type="number"
							min="1"
							max="20"
							inputmode="numeric"
							:aria-label="t(`${root}.field_sites`)"
							@focus="handleFocusField('sites')"
							@blur="handleNormalize"
						/>
					</label>
					<label class="block">
						<span class="mb-1 block text-sm font-medium text-primary">{{ t(`${root}.field_linked`) }}</span>
						<input
							v-model.number="plan.linkedSystems"
							class="field"
							type="number"
							min="1"
							max="5"
							inputmode="numeric"
							:aria-label="t(`${root}.field_linked`)"
							@focus="handleFocusField('linkedSystems')"
							@blur="handleNormalize"
						/>
					</label>
					<label class="block">
						<span class="mb-1 block text-sm font-medium text-primary">{{ t(`${root}.field_operators`) }}</span>
						<input
							v-model.number="plan.operators"
							class="field"
							type="number"
							min="1"
							max="50"
							inputmode="numeric"
							:aria-label="t(`${root}.field_operators`)"
							@focus="handleFocusField('operators')"
							@blur="handleNormalize"
						/>
					</label>
					<label class="col-span-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
						<input
							v-model="plan.multiSite"
							type="checkbox"
							class="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
							:aria-label="t(`${root}.field_multisite`)"
							@focus="handleFocusField('multiSite')"
							@blur="handleBlurField"
						/>
						<span class="text-sm font-medium text-primary">{{ t(`${root}.field_multisite`) }}</span>
					</label>
				</template>
			</form>

			<div class="rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-700" aria-live="polite">
				<p class="flex flex-wrap gap-x-4 gap-y-1">
					<span v-for="item in kpiItems" :key="item.labelKey">
						{{ t(`${root}.${item.labelKey}`) }}
						<strong class="ml-1 tabular-nums text-primary">{{ bom[item.valueKey] }}</strong>
					</span>
				</p>
			</div>
		</section>

		<section class="space-y-2 border-t border-slate-100 pt-3" aria-labelledby="module-plan-step-2">
			<h3 id="module-plan-step-2" class="flex items-center gap-2 text-base font-semibold text-primary">
				<span class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs text-white" aria-hidden="true">2</span>
				{{ t(`${root}.plan_step_review`) }}
			</h3>
			<button
				type="button"
				class="accordion-btn"
				:aria-expanded="bomOpen ? 'true' : 'false'"
				:aria-label="t(`${root}.bom_section`)"
				@click="bomOpen = !bomOpen"
			>
				<span>
					{{ t(`${root}.bom_section`) }}
					<span class="ml-1 font-normal text-slate-500">
						{{ t(`${root}.bom_summary`, { total: localizedRows.length, known: knownCount }) }}
					</span>
				</span>
				<span class="text-slate-400" aria-hidden="true">{{ bomOpen ? "−" : "+" }}</span>
			</button>
			<ul v-if="bomOpen" class="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200" role="list">
				<li v-for="row in localizedRows" :key="row.id">
					<button
						type="button"
						class="flex w-full items-start justify-between gap-3 px-3.5 py-2.5 text-left text-sm hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500 md:text-base"
						:aria-expanded="expandedBomId === row.id ? 'true' : 'false'"
						:aria-label="row.name"
						@click="handleToggleBom(row.id)"
					>
						<span class="min-w-0">
							<span class="block text-xs text-slate-500 md:text-sm">{{ row.category }}</span>
							<span class="font-medium text-primary">{{ row.name }}</span>
						</span>
						<span class="shrink-0 text-right tabular-nums text-primary">{{ row.qtyLabel }}</span>
					</button>
					<div
						v-if="expandedBomId === row.id"
						class="border-t border-slate-50 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-600"
					>
						<p>
							<span class="font-medium text-slate-700">{{ t(`${root}.bom_basis`) }}：</span>
							{{ row.basis }}
						</p>
						<p v-if="row.note" class="mt-1">{{ row.note }}</p>
					</div>
				</li>
			</ul>
		</section>

		<section class="space-y-3 border-t border-slate-100 pt-3" aria-labelledby="module-plan-step-3">
			<h3 id="module-plan-step-3" class="flex items-center gap-2 text-base font-semibold text-primary">
				<span class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs text-white" aria-hidden="true">3</span>
				{{ t(`${root}.plan_step_output`) }}
			</h3>

			<div class="grid grid-cols-2 gap-2">
				<button
					type="button"
					class="btn btn--ghost w-full"
					:aria-label="t(`${root}.export`)"
					@click="handleExport"
				>
					{{ t(`${root}.export`) }}
				</button>
				<NuxtLink
					:to="consultTo"
					class="btn btn--emerald flex w-full items-center justify-center"
					:aria-label="t(`${root}.consult`)"
					@click="handleConsultClick"
				>
					{{ t(`${root}.consult`) }}
				</NuxtLink>
			</div>

			<button
				type="button"
				class="text-sm font-medium text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
				:aria-label="t(`${root}.reset_link`)"
				@click="handleReset"
			>
				{{ t(`${root}.reset_link`) }}
			</button>
		</section>
	</div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useModuleStudio } from "~/composables/useModuleStudio.js";

const props = defineProps({
	moduleId: { type: String, required: true }
});

const { t } = useI18n();
const localePath = useLocalePath();
const {
	spec,
	plan,
	bom,
	bomOpen,
	summaryText,
	i18nRoot,
	handleResetPlan,
	normalizePlanFields,
	handleFocusField,
	handleBlurField
} = useModuleStudio(props.moduleId);

const root = i18nRoot;
const expandedBomId = ref(null);
const kpiItems = spec.kpiKeys;

const localizedRows = computed(() =>
	bom.value.rows.map((row) => {
		const unit = t(`${root}.bom_items.${row.unitKey}`);
		return {
			id: row.id,
			category: t(`${root}.bom_items.${row.id}.category`),
			name: t(`${root}.bom_items.${row.id}.name`),
			basis: t(`${root}.bom_items.${row.id}.${row.basisKey}`, row.basisParams),
			note: t(`${root}.bom_items.${row.id}.${row.noteKey}`),
			qtyLabel: row.qty === null ? t(`${root}.pending`) : `${row.qty} ${unit}`
		};
	})
);

const knownCount = computed(() => bom.value.rows.filter((row) => row.qty !== null).length);

const consultTo = computed(() =>
	localePath({
		path: "/contact",
		query: {
			subject: t(`${root}.summary.consult_subject`),
			type: t(`${root}.summary.consult_type`)
		}
	})
);

const handleNormalize = () => {
	normalizePlanFields();
};

const handleToggleBom = (id) => {
	expandedBomId.value = expandedBomId.value === id ? null : id;
};

const handleReset = () => {
	handleResetPlan();
	expandedBomId.value = null;
};

const handleConsultClick = () => {
	if (!import.meta.client) return;
	try {
		sessionStorage.setItem("interactiveContactSummary", summaryText.value);
	} catch {
		/* ignore */
	}
};

const handleExport = () => {
	if (!import.meta.client) return;
	const file = new Blob(["\ufeff", summaryText.value], { type: "text/plain;charset=utf-8" });
	const href = URL.createObjectURL(file);
	const link = document.createElement("a");
	link.href = href;
	link.download = t(`${root}.summary.filename`);
	document.body.append(link);
	link.click();
	link.remove();
	setTimeout(() => URL.revokeObjectURL(href), 3000);
};
</script>

<style scoped>
.accordion-btn {
	@apply flex w-full items-center justify-between rounded-xl border border-slate-200 px-3.5 py-2.5 text-left text-sm font-medium text-primary hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 md:text-base;
}
.field {
	@apply w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-primary focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200;
}
.btn {
	@apply rounded-lg bg-primary px-3.5 py-2 text-sm text-secondary hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500;
}
.btn--ghost {
	@apply border border-slate-300 bg-white text-primary hover:bg-slate-50;
}
.btn--emerald {
	@apply inline-flex items-center bg-emerald-600 text-white no-underline hover:bg-emerald-700;
}
</style>
