<template>
	<InteractivePageShell main-class="space-y-3 md:space-y-4" padding-class="py-3 sm:py-4 md:py-5">
		<InteractivePageHeader
			:title="t(titleKey)"
			:lead="t(leadKey)"
			:back-label="t('interactive.nav.hub')"
		/>

		<InteractiveStudioShell
			:id-prefix="`planned-${moduleId}`"
			:aria-label="t(titleKey)"
			:collapsible="false"
			density="tall"
			:stack-on-mobile="true"
			:guide="t('interactive.planned.guide')"
		>
			<template #stage>
				<PlannedModuleDiagram
					:module-id="moduleId"
					:selected="selectedNodeId"
					@update:selected="handleSelectNode"
				/>
			</template>
			<template #rail>
				<div class="space-y-5">
					<div v-if="device" aria-live="polite">
						<h3 class="text-lg font-semibold text-primary md:text-xl">
							{{ t("interactive.planned.node_heading") }}：{{ device.title }}
						</h3>
						<p class="mt-2 text-sm leading-relaxed text-slate-700 md:text-base">{{ device.desc }}</p>
						<p class="mt-2 text-sm leading-relaxed text-slate-600">{{ device.note }}</p>
					</div>

					<div :class="device ? 'border-t border-slate-200/80 pt-4' : ''">
						<h2 class="text-lg font-semibold text-primary">{{ t("interactive.planned.next_title") }}</h2>
						<p class="mt-1 text-sm text-slate-600">{{ t("interactive.planned.next_desc") }}</p>
						<div class="mt-3 flex flex-col gap-3">
							<ButtonCTA :label="t('interactive.hub.cta_access')" to="/interactive/access" />
							<ButtonCTA :label="t('interactive.hub.cta_cctv')" to="/interactive/cctv" color="white" />
						</div>
					</div>
				</div>
			</template>
		</InteractiveStudioShell>
	</InteractivePageShell>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import ButtonCTA from "~/components/common/Button-CTA.vue";
import InteractivePageShell from "~/components/interactive/InteractivePageShell.vue";
import InteractivePageHeader from "~/components/interactive/InteractivePageHeader.vue";
import InteractiveStudioShell from "~/components/interactive/InteractiveStudioShell.vue";
import PlannedModuleDiagram from "~/components/interactive/PlannedModuleDiagram.vue";
import { getPlannedModule } from "~/data/interactive/plannedContent.js";

const props = defineProps({
	moduleId: {
		type: String,
		required: true
	}
});

const { t } = useI18n();

const path = computed(() => `/interactive/${props.moduleId}`);
const titleKey = computed(() => `interactive.modules.${props.moduleId}.title`);
const leadKey = computed(() => `interactive.planned.${props.moduleId}.lead`);

const selectedNodeId = ref(null);

const syncDefaultNode = () => {
	const spec = getPlannedModule(props.moduleId);
	selectedNodeId.value = spec?.defaultNodeId || null;
};

watch(() => props.moduleId, syncDefaultNode, { immediate: true });

const device = computed(() => {
	const id = selectedNodeId.value;
	if (!id) return null;
	const base = `interactive.planned.${props.moduleId}.devices.${id}`;
	return {
		id,
		title: t(`interactive.planned.${props.moduleId}.nodes.${id}`),
		desc: t(`${base}.desc`),
		note: t(`${base}.note`)
	};
});

const handleSelectNode = (id) => {
	selectedNodeId.value = id;
};

usePageSeo({
	title: t(`interactive.meta.${props.moduleId}_title`),
	description: t(`interactive.meta.${props.moduleId}_description`),
	path: path.value
});
</script>
