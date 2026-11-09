<template>
	<section
		class="interactive-studio overflow-hidden rounded-2xl border border-slate-200/90 bg-white/90 text-base shadow-sm backdrop-blur-sm md:text-lg"
		:class="heightClass"
		:aria-label="ariaLabel"
	>
		<div
			class="grid h-full lg:items-stretch"
			:class="
				stackOnMobile
					? 'lg:grid-cols-[minmax(0,1.25fr)_minmax(22rem,30rem)] xl:grid-cols-[minmax(0,1.3fr)_minmax(24rem,34rem)]'
					: 'grid-cols-1'
			"
		>
			<div
				class="flex min-h-0 min-w-0 flex-col border-b border-slate-200/80 bg-slate-50/50 p-3 sm:p-4 md:p-5 lg:border-b-0 lg:border-r"
				:class="stageHidden ? 'hidden lg:flex' : 'flex'"
			>
				<slot name="stage" />
			</div>

			<div class="flex min-h-0 flex-col bg-white/85">
				<div v-if="showRailChrome" class="shrink-0 border-b border-slate-200/80 px-3 py-2.5 sm:px-4 md:px-5">
					<div class="flex flex-wrap items-center justify-between gap-2">
						<div v-if="tabs.length" class="flex flex-wrap gap-1.5" role="tablist" :aria-label="tabsLabel">
							<button
								v-for="(item, index) in tabs"
								:id="`${idPrefix}-tab-${item.id}`"
								:key="item.id"
								type="button"
								role="tab"
								class="rounded-lg px-3 py-1.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 sm:px-3.5 sm:py-2 md:text-base"
								:class="
									activeTab === item.id
										? 'bg-emerald-600 text-white'
										: 'bg-slate-100 text-slate-700 hover:bg-slate-200'
								"
								:aria-selected="activeTab === item.id ? 'true' : 'false'"
								:tabindex="activeTab === item.id ? 0 : -1"
								:aria-controls="`${idPrefix}-panel-${item.id}`"
								@click="emit('update:activeTab', item.id)"
								@keydown="handleTabKeydown($event, index)"
							>
								{{ item.label }}
							</button>
						</div>
						<button
							v-if="collapsible"
							type="button"
							class="inline-flex items-center text-sm font-medium text-emerald-700 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 lg:hidden"
							:aria-expanded="!stageHidden ? 'true' : 'false'"
							@click="emit('update:stageHidden', !stageHidden)"
						>
							{{ stageHidden ? showStageLabel : hideStageLabel }}
						</button>
					</div>
					<p
						v-if="guide"
						class="mt-2 flex flex-wrap items-center justify-center gap-2 rounded-lg border border-emerald-200/80 bg-emerald-50 px-3 py-2 text-center text-sm leading-snug text-emerald-950"
						aria-live="polite"
					>
						<span
							class="shrink-0 rounded bg-emerald-600 px-1.5 py-0.5 text-[11px] font-bold tracking-wide text-white"
						>
							{{ guideBadge }}
						</span>
						<span>{{ guide }}</span>
					</p>
					<slot name="rail-header" />
				</div>

				<div
					:id="activeTab ? `${idPrefix}-panel-${activeTab}` : undefined"
					role="tabpanel"
					:aria-labelledby="activeTab ? `${idPrefix}-tab-${activeTab}` : undefined"
					class="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4 md:p-5"
				>
					<slot name="rail" />
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { computed } from "vue";

import { useI18n } from "vue-i18n";

const props = defineProps({
	ariaLabel: { type: String, default: "" },
	idPrefix: { type: String, default: "studio" },
	tabs: { type: Array, default: () => [] },
	tabsLabel: { type: String, default: "" },
	activeTab: { type: String, default: "" },
	guide: { type: String, default: "" },
	stageHidden: { type: Boolean, default: false },
	collapsible: { type: Boolean, default: true },
	showStageLabel: { type: String, default: "" },
	hideStageLabel: { type: String, default: "" },
	stackOnMobile: { type: Boolean, default: true },
	density: { type: String, default: "default" }
});

const emit = defineEmits(["update:activeTab", "update:stageHidden"]);
const { t } = useI18n();
const guideBadge = computed(() => t("interactive.ux.guide_badge"));

const showRailChrome = computed(
	() => props.tabs.length > 0 || Boolean(props.guide) || (props.collapsible && Boolean(props.showStageLabel))
);

const heightClass = computed(() => {
	if (props.density === "compact") return "lg:h-[min(64vh,34rem)] xl:h-[min(68vh,38rem)]";
	if (props.density === "tall") return "lg:h-[min(76vh,44rem)] xl:h-[min(78vh,48rem)]";
	return "lg:h-[min(68vh,36rem)] xl:h-[min(72vh,42rem)]";
});

const handleTabKeydown = (event, index) => {
	const ids = props.tabs.map((item) => item.id);
	const len = ids.length;
	if (!len) return;
	if (event.key === "ArrowRight" || event.key === "ArrowDown") {
		event.preventDefault();
		emit("update:activeTab", ids[(index + 1) % len]);
		return;
	}
	if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
		event.preventDefault();
		emit("update:activeTab", ids[(index - 1 + len) % len]);
		return;
	}
	if (event.key === "Home") {
		event.preventDefault();
		emit("update:activeTab", ids[0]);
		return;
	}
	if (event.key === "End") {
		event.preventDefault();
		emit("update:activeTab", ids[len - 1]);
	}
};
</script>
