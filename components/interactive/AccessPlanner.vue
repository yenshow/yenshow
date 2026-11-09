<template>
	<div class="space-y-4">
		<p class="text-sm text-slate-600">{{ t("interactive.access.planner_flow") }}</p>

		<section class="space-y-3" aria-labelledby="plan-step-1">
			<h3 id="plan-step-1" class="flex items-center gap-2 text-base font-semibold text-primary">
				<span class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs text-white" aria-hidden="true">1</span>
				{{ t("interactive.access.plan_step_inputs") }}
			</h3>
			<form class="grid grid-cols-2 gap-3" @submit.prevent>
				<label class="block">
					<span class="mb-1 block text-sm font-medium text-primary">{{ t("interactive.access.doors") }}</span>
					<input
						v-model.number="plan.doors"
						class="field"
						type="number"
						min="1"
						max="60"
						inputmode="numeric"
						:aria-label="t('interactive.access.doors')"
						@focus="handleFocusField('doors')"
						@blur="handleNormalizeField"
					/>
				</label>
				<label class="block">
					<span class="mb-1 block text-sm font-medium text-primary">{{ t("interactive.access.people") }}</span>
					<input
						v-model.number="plan.people"
						class="field"
						type="number"
						min="10"
						max="3000"
						inputmode="numeric"
						:aria-label="t('interactive.access.people')"
						@focus="handleFocusField('people')"
						@blur="handleNormalizeField"
					/>
				</label>
			</form>

			<button
				type="button"
				class="accordion-btn"
				:aria-expanded="moreOpen ? 'true' : 'false'"
				:aria-label="t('interactive.access.more_conditions')"
				@click="moreOpen = !moreOpen"
			>
				<span>{{ t("interactive.access.more_conditions") }}</span>
				<span class="text-slate-400" aria-hidden="true">{{ moreOpen ? "−" : "+" }}</span>
			</button>
			<div v-if="moreOpen" class="grid gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3 sm:grid-cols-2">
				<label class="block">
					<span class="mb-1 block text-sm font-medium text-primary">{{ t("interactive.access.sites") }}</span>
					<input
						v-model.number="plan.sites"
						class="field"
						type="number"
						min="1"
						max="10"
						inputmode="numeric"
						:aria-label="t('interactive.access.sites')"
						@focus="handleFocusField('sites')"
						@blur="handleNormalizeField"
					/>
				</label>
				<label class="block">
					<span class="mb-1 block text-sm font-medium text-primary">{{ t("interactive.access.direction") }}</span>
					<select
						v-model="plan.direction"
						class="field"
						:aria-label="t('interactive.access.direction')"
						@focus="handleFocusField('direction')"
						@blur="handleBlurField"
					>
						<option value="entry">{{ t("interactive.access.direction_entry") }}</option>
						<option value="both">{{ t("interactive.access.direction_both") }}</option>
					</select>
				</label>
				<label class="block">
					<span class="mb-1 block text-sm font-medium text-primary">{{ t("interactive.access.design") }}</span>
					<select
						v-model="plan.design"
						class="field"
						:aria-label="t('interactive.access.design')"
						@focus="handleFocusField('design')"
						@blur="handleBlurField"
					>
						<option value="separate">{{ t("interactive.access.design_separate") }}</option>
						<option value="integrated">{{ t("interactive.access.design_integrated") }}</option>
					</select>
				</label>
				<label class="block">
					<span class="mb-1 block text-sm font-medium text-primary">{{ t("interactive.access.context") }}</span>
					<select
						v-model="plan.context"
						class="field"
						:aria-label="t('interactive.access.context')"
						@focus="handleFocusField('context')"
						@blur="handleBlurField"
					>
						<option value="factory">{{ t("interactive.access.context_factory") }}</option>
						<option value="office">{{ t("interactive.access.context_office") }}</option>
						<option value="other">{{ t("interactive.access.context_other") }}</option>
					</select>
				</label>
			</div>

			<div class="rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-700" aria-live="polite">
				<p class="flex flex-wrap gap-x-4 gap-y-1">
					<span>
						{{ t("interactive.access.kpi_readers") }}
						<strong class="ml-1 tabular-nums text-primary">{{ bom.readers }}</strong>
					</span>
					<span>
						{{ t("interactive.access.kpi_locks") }}
						<strong class="ml-1 tabular-nums text-primary">{{ bom.plan.doors }}</strong>
					</span>
					<span>
						{{ t("interactive.access.kpi_controllers") }}
						<strong class="ml-1 text-primary">{{ controllerLabel }}</strong>
					</span>
				</p>
			</div>
		</section>

		<section class="space-y-2 border-t border-slate-100 pt-3" aria-labelledby="plan-step-2">
			<h3 id="plan-step-2" class="flex items-center gap-2 text-base font-semibold text-primary">
				<span class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs text-white" aria-hidden="true">2</span>
				{{ t("interactive.access.plan_step_review") }}
			</h3>
			<button
				type="button"
				class="accordion-btn"
				:aria-expanded="bomOpen ? 'true' : 'false'"
				:aria-label="t('interactive.access.bom_section')"
				@click="bomOpen = !bomOpen"
			>
				<span>
					{{ t("interactive.access.bom_section") }}
					<span class="ml-1 font-normal text-slate-500">
						{{ t("interactive.access.bom_summary", { total: localizedRows.length, known: knownCount }) }}
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
							<span class="font-medium text-slate-700">{{ t("interactive.access.bom_basis") }}：</span>
							{{ row.basis }}
						</p>
						<p v-if="row.note" class="mt-1">{{ row.note }}</p>
					</div>
				</li>
			</ul>
		</section>

		<section class="space-y-3 border-t border-slate-100 pt-3" aria-labelledby="plan-step-3">
			<h3 id="plan-step-3" class="flex items-center gap-2 text-base font-semibold text-primary">
				<span class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs text-white" aria-hidden="true">3</span>
				{{ t("interactive.access.plan_step_output") }}
			</h3>

			<div class="grid grid-cols-2 gap-2">
				<button
					type="button"
					class="btn btn--ghost w-full"
					:aria-label="t('interactive.access.export')"
					@click="handleExport"
				>
					{{ t("interactive.access.export") }}
				</button>
				<NuxtLink
					:to="consultTo"
					class="btn btn--emerald flex w-full items-center justify-center"
					:aria-label="t('interactive.access.consult')"
					@click="handleConsultClick"
				>
					{{ t("interactive.access.consult") }}
				</NuxtLink>
			</div>

			<button
				type="button"
				class="text-sm font-medium text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
				:aria-label="t('interactive.access.reset_link')"
				@click="handleReset"
			>
				{{ t("interactive.access.reset_link") }}
			</button>
		</section>
	</div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { normalizePlan, planSummary } from "~/utils/interactive/model.js";
import { useAccessStudio } from "~/composables/useAccessStudio.js";

const { t } = useI18n();
const localePath = useLocalePath();
const { plan, bom, moreOpen, bomOpen, handleResetPlan, handleFocusField, handleBlurField } = useAccessStudio();

const expandedBomId = ref(null);

const controllerLabel = computed(() => {
	if (bom.value.plan.design === "integrated") return t("interactive.access.kpi_integrated");
	const qty = bom.value.controllers;
	if (qty == null) return t("interactive.access.pending");
	return String(qty);
});

const localizedRows = computed(() =>
	bom.value.rows.map((row) => {
		const unit = t(`interactive.access.bom_items.${row.unitKey}`);
		return {
			id: row.id,
			category: t(`interactive.access.bom_items.${row.id}.category`),
			name: t(`interactive.access.bom_items.${row.id}.name`),
			basis: t(`interactive.access.bom_items.${row.id}.${row.basisKey}`, row.basisParams),
			note: t(`interactive.access.bom_items.${row.id}.${row.noteKey}`),
			qtyLabel: row.qty === null ? t("interactive.access.pending") : `${row.qty} ${unit}`
		};
	})
);

const knownCount = computed(() => bom.value.rows.filter((row) => row.qty !== null).length);

const summaryText = computed(() => planSummary({ ...plan }, t));

const consultTo = computed(() =>
	localePath({
		path: "/contact",
		query: {
			subject: t("interactive.access.summary.consult_subject"),
			type: t("interactive.access.summary.consult_type")
		}
	})
);

const handleNormalizeField = () => {
	Object.assign(plan, normalizePlan(plan));
	handleBlurField();
};

const handleToggleBom = (id) => {
	expandedBomId.value = expandedBomId.value === id ? null : id;
};

const handleReset = () => {
	handleResetPlan();
	expandedBomId.value = null;
};

const persistSummary = () => {
	if (!import.meta.client) return;
	try {
		sessionStorage.setItem("interactiveContactSummary", summaryText.value);
	} catch {
		/* ignore */
	}
};

const handleConsultClick = () => {
	persistSummary();
};

const handleExport = () => {
	if (!import.meta.client) return;
	const file = new Blob(["\ufeff", summaryText.value], { type: "text/plain;charset=utf-8" });
	const href = URL.createObjectURL(file);
	const link = document.createElement("a");
	link.href = href;
	link.download = t("interactive.access.summary.filename");
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
