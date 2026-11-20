<template>
	<InteractiveStudioShell
		:id-prefix="moduleId"
		:aria-label="t(`${root}.aria_label`)"
		:tabs="modes"
		:tabs-label="t(`${root}.mode_label`)"
		:active-tab="mode"
		:stage-hidden="diagramCollapsed"
		:show-stage-label="t(`${root}.show_diagram`)"
		:hide-stage-label="t(`${root}.hide_diagram`)"
		@update:active-tab="handleMode"
		@update:stage-hidden="diagramCollapsed = $event"
	>
		<template #stage>
			<ModuleDiagram
				:module-id="moduleId"
				:mode="mode"
				:selected="selectedDevice"
				:highlight-ids="highlightIds"
				:scenario-wire-ids="scenario?.wireIds"
				:node-badges="nodeBadges"
				:scenario-status="mode === 'scenario' ? scenario.status : null"
				:route-anim-key="routeAnimKey"
				@update:selected="handleSelectDevice"
			/>
		</template>
		<template #rail>
			<ModuleLearnPanel v-if="mode === 'learn'" :module-id="moduleId" />
			<ModuleScenarioPanel v-else-if="mode === 'scenario'" :module-id="moduleId" />
			<ModulePlanner v-else :module-id="moduleId" />
		</template>
	</InteractiveStudioShell>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import InteractiveStudioShell from "~/components/interactive/InteractiveStudioShell.vue";
import ModuleDiagram from "~/components/interactive/ModuleDiagram.vue";
import ModuleLearnPanel from "~/components/interactive/ModuleLearnPanel.vue";
import ModuleScenarioPanel from "~/components/interactive/ModuleScenarioPanel.vue";
import ModulePlanner from "~/components/interactive/ModulePlanner.vue";
import { provideModuleStudio } from "~/composables/useModuleStudio.js";

const props = defineProps({
	moduleId: { type: String, required: true }
});

const { t } = useI18n();
const {
	mode,
	selectedDevice,
	highlightIds,
	nodeBadges,
	scenario,
	routeAnimKey,
	diagramCollapsed,
	handleMode,
	handleSelectDevice,
	i18nRoot
} = provideModuleStudio(props.moduleId);

const root = i18nRoot;

const modes = computed(() => [
	{ id: "learn", label: t(`${root}.mode_learn`) },
	{ id: "scenario", label: t(`${root}.mode_scenario`) },
	{ id: "plan", label: t(`${root}.mode_plan`) }
]);

</script>
