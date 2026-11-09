<template>
	<InteractiveStudioShell
		id-prefix="cctv"
		:aria-label="t('interactive.cctv.aria_label')"
		:tabs="modes"
		:tabs-label="t('interactive.cctv.title')"
		:active-tab="mode"
		:guide="modeGuide"
		:stage-hidden="diagramCollapsed"
		:show-stage-label="t('interactive.cctv.show_diagram')"
		:hide-stage-label="t('interactive.cctv.hide_diagram')"
		density="tall"
		@update:active-tab="handleMode"
		@update:stage-hidden="diagramCollapsed = $event"
	>
		<template #stage>
			<CctvDiagram
				:view-id="viewId"
				:selected="selectedDevice"
				:path-ids="pathIds"
				:invite-nodes="inviteNodes"
				@update:selected="handleSelectWithCoach"
				@update:view-id="handleView"
			/>
		</template>
		<template #rail>
			<CctvInspectPanel v-if="mode === 'inspect'" />
			<CctvStoragePanel v-else embedded />
		</template>
	</InteractiveStudioShell>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import InteractiveStudioShell from "~/components/interactive/InteractiveStudioShell.vue";
import CctvDiagram from "~/components/interactive/CctvDiagram.vue";
import CctvInspectPanel from "~/components/interactive/CctvInspectPanel.vue";
import CctvStoragePanel from "~/components/interactive/CctvStoragePanel.vue";
import { provideCctvStudio } from "~/composables/useCctvStudio.js";
import { useInteractiveCoach } from "~/composables/useInteractiveCoach.js";

const { t } = useI18n();
const {
	mode,
	viewId,
	selectedDevice,
	pathIds,
	diagramCollapsed,
	handleMode,
	handleView,
	handleSelectDevice
} = provideCctvStudio();
const { inviteNodes, markNodeTap } = useInteractiveCoach();

const modes = computed(() => [
	{ id: "inspect", label: t("interactive.cctv.mode_inspect") },
	{ id: "storage", label: t("interactive.cctv.mode_storage") }
]);

const modeGuide = computed(() =>
	mode.value === "storage" ? t("interactive.ux.guide_storage") : t("interactive.ux.guide_inspect")
);

const handleSelectWithCoach = (id) => {
	markNodeTap();
	handleSelectDevice(id);
};
</script>
