<template>
	<InteractiveStudioShell
		:id-prefix="moduleId"
		:aria-label="t(`${root}.aria_label`)"
		:tabs="modes"
		:tabs-label="t(`${root}.mode_label`)"
		:active-tab="mode"
		:guide="modeGuide"
		:stage-hidden="diagramCollapsed"
		:show-stage-label="t(`${root}.show_diagram`)"
		:hide-stage-label="t(`${root}.hide_diagram`)"
		density="tall"
		@update:active-tab="handleMode"
		@update:stage-hidden="diagramCollapsed = $event"
	>
		<template #stage>
			<ModuleDiagram
				:module-id="moduleId"
				:mode="mode"
				:selected="selectedDevice"
				:highlight-ids="highlightIds"
				:node-badges="nodeBadges"
				:scenario-status="scenario?.status || null"
				:route-anim-key="routeAnimKey"
				:invite-nodes="inviteNodes"
				@update:selected="handleSelectWithCoach"
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
import { useInteractiveCoach } from "~/composables/useInteractiveCoach.js";

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
const { inviteNodes, markNodeTap } = useInteractiveCoach();

const root = i18nRoot;

const modes = computed(() => [
	{ id: "learn", label: t(`${root}.mode_learn`) },
	{ id: "scenario", label: t(`${root}.mode_scenario`) },
	{ id: "plan", label: t(`${root}.mode_plan`) }
]);

const modeGuide = computed(() => {
	if (mode.value === "scenario") return t("interactive.ux.guide_scenario");
	if (mode.value === "plan") return t("interactive.ux.guide_plan");
	return t("interactive.ux.guide_learn");
});

const handleSelectWithCoach = (id) => {
	markNodeTap();
	handleSelectDevice(id);
};
</script>
