<template>
	<InteractiveStudioShell
		id-prefix="access"
		:aria-label="t('interactive.access.aria_label')"
		:tabs="modes"
		:tabs-label="t('interactive.access.mode_label')"
		:active-tab="mode"
		:guide="modeGuide"
		:stage-hidden="diagramCollapsed"
		:show-stage-label="t('interactive.access.show_diagram')"
		:hide-stage-label="t('interactive.access.hide_diagram')"
		density="tall"
		@update:active-tab="handleMode"
		@update:stage-hidden="diagramCollapsed = $event"
	>
		<template #stage>
			<AccessDiagram
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
			<AccessLearnPanel v-if="mode === 'learn'" />
			<AccessScenarioPanel v-else-if="mode === 'scenario'" />
			<AccessPlanner v-else />
		</template>
	</InteractiveStudioShell>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import InteractiveStudioShell from "~/components/interactive/InteractiveStudioShell.vue";
import AccessDiagram from "~/components/interactive/AccessDiagram.vue";
import AccessLearnPanel from "~/components/interactive/AccessLearnPanel.vue";
import AccessScenarioPanel from "~/components/interactive/AccessScenarioPanel.vue";
import AccessPlanner from "~/components/interactive/AccessPlanner.vue";
import { provideAccessStudio } from "~/composables/useAccessStudio.js";
import { useInteractiveCoach } from "~/composables/useInteractiveCoach.js";

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
	handleSelectDevice
} = provideAccessStudio();
const { inviteNodes, markNodeTap } = useInteractiveCoach();

const modes = computed(() => [
	{ id: "learn", label: t("interactive.access.mode_learn") },
	{ id: "scenario", label: t("interactive.access.mode_scenario") },
	{ id: "plan", label: t("interactive.access.mode_plan") }
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
