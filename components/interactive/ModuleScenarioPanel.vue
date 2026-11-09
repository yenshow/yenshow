<template>
	<div class="space-y-3">
		<div class="flex flex-wrap gap-1.5" role="group" :aria-label="t(`${root}.scenario_heading`)">
			<button
				v-for="item in scenarioList"
				:key="item.id"
				type="button"
				class="rounded-full border px-3 py-1.5 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 md:text-base"
				:class="
					scenarioId === item.id
						? 'border-emerald-600 bg-emerald-600 text-white'
						: 'border-slate-300 bg-white text-slate-700 hover:border-emerald-400'
				"
				:aria-pressed="scenarioId === item.id ? 'true' : 'false'"
				@click="handleScenario(item.id)"
			>
				{{ item.label }}
			</button>
		</div>

		<Transition name="scenario-fade" mode="out-in">
			<div
				:key="scenarioId"
				class="rounded-xl border p-4"
				:class="{
					'border-emerald-200 bg-emerald-50/80': scenario.status === 'grant',
					'border-rose-200 bg-rose-50/80': scenario.status === 'deny',
					'border-amber-200 bg-amber-50/80': scenario.status === 'warning'
				}"
				aria-live="polite"
			>
				<div class="flex flex-wrap items-center justify-between gap-2">
					<h4 class="text-base font-semibold text-primary md:text-lg">{{ scenario.title }}</h4>
					<span class="rounded bg-primary px-2 py-0.5 font-mono text-xs text-secondary">{{ scenario.badge }}</span>
				</div>
				<p class="mt-1.5 text-sm text-slate-600 md:text-base">{{ scenario.desc }}</p>

				<ol class="mt-3 space-y-1.5">
					<li
						v-for="(step, index) in scenario.steps"
						:key="index"
						class="flex gap-2.5 text-sm text-slate-700 md:text-base"
					>
						<span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
							{{ index + 1 }}
						</span>
						<span class="pt-0.5">{{ step }}</span>
					</li>
				</ol>

				<dl class="mt-3 grid gap-2 border-t border-black/5 pt-3 text-sm sm:grid-cols-2 md:text-base">
					<div v-for="(value, key) in scenario.outcomes" :key="key">
						<dt class="text-slate-500">{{ t(`${root}.outcome_${key}`) }}</dt>
						<dd class="font-medium text-primary">{{ value }}</dd>
					</div>
				</dl>
			</div>
		</Transition>
	</div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useModuleStudio } from "~/composables/useModuleStudio.js";

const props = defineProps({
	moduleId: { type: String, required: true }
});

const { t } = useI18n();
const { scenarioId, scenario, scenarioList, handleScenario, i18nRoot } = useModuleStudio(props.moduleId);
const root = i18nRoot;
</script>

<style scoped>
.scenario-fade-enter-active,
.scenario-fade-leave-active {
	transition:
		opacity 0.25s ease,
		transform 0.25s ease;
}
.scenario-fade-enter-from,
.scenario-fade-leave-to {
	opacity: 0;
	transform: translateY(4px);
}
</style>
