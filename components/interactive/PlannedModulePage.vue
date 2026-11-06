<template>
	<InteractivePageShell main-class="space-y-3 md:space-y-4" padding-class="py-3 sm:py-4 md:py-5">
		<InteractivePageHeader
			:title="t(titleKey)"
			:lead="t(leadKey)"
			:badge="t('interactive.modules.tags.planned')"
			:back-label="t('interactive.nav.hub')"
		/>

		<InteractiveStudioShell
			:id-prefix="`planned-${moduleId}`"
			:aria-label="t(titleKey)"
			:collapsible="false"
			density="tall"
			:stack-on-mobile="true"
		>
			<template #stage>
				<div class="flex h-full flex-col gap-4">
					<div class="rounded-xl border border-dashed border-slate-300 bg-white/70 p-4 md:p-5">
						<h2 :id="headingId" class="text-lg font-semibold text-primary md:text-xl">
							{{ t("interactive.planned.overview_title") }}
						</h2>
						<p class="mt-2 text-sm leading-relaxed text-slate-700 md:text-base">{{ t(overviewKey) }}</p>
					</div>
					<div class="rounded-xl border border-slate-200 bg-white/90 p-4 md:p-5">
						<h2 class="text-lg font-semibold text-primary md:text-xl">
							{{ t("interactive.planned.points_title") }}
						</h2>
						<ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 md:text-base">
							<li v-for="key in pointKeys" :key="key">{{ t(key) }}</li>
						</ul>
					</div>
					<p class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950" role="note">
						{{ t("interactive.planned.notice") }}
					</p>
				</div>
			</template>
			<template #rail>
				<div class="space-y-4">
					<h2 class="text-lg font-semibold text-primary">{{ t("interactive.planned.next_title") }}</h2>
					<p class="text-sm text-slate-600">{{ t("interactive.planned.next_desc") }}</p>
					<div class="flex flex-col gap-3">
						<ButtonCTA :label="t('interactive.hub.cta_access')" to="/interactive/access" />
						<ButtonCTA :label="t('interactive.hub.cta_cctv')" to="/interactive/cctv" color="white" />
					</div>
				</div>
			</template>
		</InteractiveStudioShell>
	</InteractivePageShell>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import ButtonCTA from "~/components/common/Button-CTA.vue";
import InteractivePageShell from "~/components/interactive/InteractivePageShell.vue";
import InteractivePageHeader from "~/components/interactive/InteractivePageHeader.vue";
import InteractiveStudioShell from "~/components/interactive/InteractiveStudioShell.vue";

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
const overviewKey = computed(() => `interactive.planned.${props.moduleId}.overview`);
const pointKeys = computed(() =>
	[1, 2, 3].map((n) => `interactive.planned.${props.moduleId}.point_${n}`)
);
const headingId = computed(() => `planned-${props.moduleId}-overview`);

usePageSeo({
	title: t(`interactive.meta.${props.moduleId}_title`),
	description: t(`interactive.meta.${props.moduleId}_description`),
	path: path.value
});
</script>
