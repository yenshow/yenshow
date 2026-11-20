<template>
	<section
		class="interactive-studio overflow-hidden rounded-2xl border border-slate-200/90 bg-white/90 text-base shadow-sm backdrop-blur-sm md:text-lg lg:h-[min(76vh,44rem)] xl:h-[min(78vh,48rem)]"
		:aria-label="ariaLabel"
	>
		<div class="grid h-full lg:grid-cols-[minmax(0,1.25fr)_minmax(22rem,30rem)] lg:items-stretch xl:grid-cols-[minmax(0,1.3fr)_minmax(24rem,34rem)]">
			<div
				:id="`${idPrefix}-diagram`"
				class="flex min-h-0 min-w-0 flex-col border-b border-slate-200/80 bg-slate-50/50 p-3 sm:p-4 md:p-5 lg:border-b-0 lg:border-r"
				:class="stageHidden ? 'hidden lg:flex' : 'flex'"
			>
				<slot name="stage" />
			</div>

			<div class="flex min-h-0 flex-col bg-white/85">
				<div class="shrink-0 border-b border-slate-200/80 px-3 py-2.5 sm:px-4 md:px-5">
					<div class="flex flex-wrap items-center justify-between gap-2">
						<div class="flex flex-wrap gap-1.5" role="tablist" :aria-label="tabsLabel">
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
							type="button"
							class="inline-flex items-center text-sm font-medium text-emerald-700 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 lg:hidden"
							:aria-expanded="!stageHidden ? 'true' : 'false'"
							:aria-controls="`${idPrefix}-diagram`"
							@click="emit('update:stageHidden', !stageHidden)"
						>
							{{ stageHidden ? showStageLabel : hideStageLabel }}
						</button>
					</div>
				</div>

				<div
					v-for="item in tabs"
					v-show="item.id === activeTab"
					:id="`${idPrefix}-panel-${item.id}`"
					:key="item.id"
					role="tabpanel"
					:aria-labelledby="`${idPrefix}-tab-${item.id}`"
					tabindex="0"
					class="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4 md:p-5"
				>
					<slot v-if="item.id === activeTab" name="rail" />
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
const props = defineProps({
	ariaLabel: { type: String, default: "" },
	idPrefix: { type: String, default: "studio" },
	tabs: { type: Array, required: true },
	tabsLabel: { type: String, default: "" },
	activeTab: { type: String, default: "" },
	stageHidden: { type: Boolean, default: false },
	showStageLabel: { type: String, default: "" },
	hideStageLabel: { type: String, default: "" }
});

const emit = defineEmits(["update:activeTab", "update:stageHidden"]);
const handleTabKeydown = (event, index) => {
	const len = props.tabs.length;
	const targets = {
		ArrowRight: (index + 1) % len,
		ArrowLeft: (index - 1 + len) % len,
		Home: 0,
		End: len - 1
	};
	if (!Object.hasOwn(targets, event.key)) return;
	event.preventDefault();
	const { id } = props.tabs[targets[event.key]];
	emit("update:activeTab", id);
	document.getElementById(`${props.idPrefix}-tab-${id}`)?.focus();
};
</script>
