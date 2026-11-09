<template>
	<section class="flex h-full min-h-0 flex-col gap-2" :aria-labelledby="titleId">
		<div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
			<h2 :id="titleId" class="text-base font-semibold text-primary md:text-lg">
				{{ t("interactive.planned.diagram_title") }}
			</h2>
		</div>

		<div class="planned-diagram-frame flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-xl border border-slate-200/80">
			<svg
				class="mx-auto h-auto max-h-full w-full min-w-[760px]"
				viewBox="0 0 960 560"
				preserveAspectRatio="xMidYMid meet"
				role="img"
				:aria-label="t('interactive.planned.diagram_title')"
			>
				<defs>
					<pattern :id="gridId" width="18" height="18" patternUnits="userSpaceOnUse">
						<circle cx="1.2" cy="1.2" r="1.1" fill="#cbd5e1" />
					</pattern>
				</defs>
				<rect width="960" height="560" fill="#f8fafc" />
				<rect width="960" height="560" :fill="`url(#${gridId})`" opacity="0.55" />

				<g v-for="lane in lanes" :key="lane.id">
					<text :x="lane.x" y="34" fill="#64748b" style="font-size: 14px; font-weight: 700; letter-spacing: 0.04em">
						{{ lane.title }}
					</text>
				</g>

				<g fill="none">
					<path
						v-for="wire in wires"
						:key="wire.id"
						:d="wire.d"
						class="planned-wire"
						:stroke="kindStyle[wire.kind].stroke"
						:stroke-width="kindStyle[wire.kind].width"
						:stroke-dasharray="kindStyle[wire.kind].dash || undefined"
						stroke-linecap="round"
						stroke-linejoin="round"
						opacity="0.95"
					/>
				</g>

				<g>
					<template v-for="node in nodes" :key="node.id">
						<g
							:transform="`translate(${node.x},${node.y})`"
							role="button"
							tabindex="0"
							:aria-label="`${node.label}: ${node.desc}`"
							:aria-pressed="selected === node.id ? 'true' : 'false'"
							class="cursor-pointer outline-none"
							@click="handleSelect(node.id)"
							@keydown="handleKeydown($event, node.id)"
							@mouseenter="hovered = node.id"
							@mouseleave="hovered = null"
							@focus="hovered = node.id"
							@blur="hovered = null"
						>
							<rect
								:width="NODE_W"
								:height="NODE_H"
								rx="16"
								class="planned-node-rect"
								:fill="nodeStyle(node.id).fill"
								:stroke="nodeStyle(node.id).stroke"
								:stroke-width="nodeStyle(node.id).strokeWidth"
							/>
							<text
								x="18"
								y="30"
								:fill="nodeStyle(node.id).tagFill"
								style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; pointer-events: none"
							>
								{{ node.tag }}
							</text>
							<text
								x="18"
								y="58"
								:fill="nodeStyle(node.id).titleFill"
								style="font-size: 19px; font-weight: 700; pointer-events: none"
							>
								{{ node.label }}
							</text>
							<text
								x="18"
								y="84"
								:fill="nodeStyle(node.id).descFill"
								style="font-size: 13px; pointer-events: none"
							>
								{{ node.desc }}
							</text>
						</g>
					</template>
				</g>

				<rect x="24" y="498" width="912" height="46" rx="12" fill="#0f172a" />
				<g v-for="(item, index) in legend" :key="item.id">
					<line
						:x1="48 + index * 280"
						:y1="521"
						:x2="92 + index * 280"
						:y2="521"
						:stroke="item.color"
						:stroke-width="item.width"
						:stroke-dasharray="item.dash"
						stroke-linecap="round"
					/>
					<text :x="102 + index * 280" y="526" fill="#e2e8f0" style="font-size: 13px; font-weight: 500">
						{{ item.label }}
					</text>
				</g>
			</svg>
		</div>
	</section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import {
	PLANNED_LANE_X,
	PLANNED_NODE_H,
	PLANNED_NODE_W,
	getPlannedModule,
	plannedNodePosition
} from "~/data/interactive/plannedContent.js";

const NODE_W = PLANNED_NODE_W;
const NODE_H = PLANNED_NODE_H;

const props = defineProps({
	moduleId: { type: String, required: true },
	selected: { type: String, default: null }
});

const emit = defineEmits(["update:selected"]);
const { t } = useI18n();
const hovered = ref(null);

const titleId = computed(() => `planned-${props.moduleId}-diagram-title`);
const gridId = computed(() => `planned-dot-grid-${props.moduleId}`);

const spec = computed(() => getPlannedModule(props.moduleId));

const lanes = computed(() => {
	if (!spec.value) return [];
	return spec.value.laneIds.map((id, index) => ({
		id,
		x: PLANNED_LANE_X[index] ?? PLANNED_LANE_X[0],
		title: t(`interactive.planned.${props.moduleId}.lanes.${id}`)
	}));
});

const nodes = computed(() => {
	if (!spec.value) return [];
	return spec.value.nodes.map((node) => {
		const pos = plannedNodePosition(node);
		return {
			...node,
			x: pos.x,
			y: pos.y,
			label: t(`interactive.planned.${props.moduleId}.nodes.${node.id}`),
			desc: t(`interactive.planned.${props.moduleId}.node_desc.${node.id}`)
		};
	});
});

const mid = (id) => {
	const node = nodes.value.find((item) => item.id === id);
	if (!node) return { x: 0, y: 0, l: 0, r: 0, t: 0, b: 0 };
	return {
		x: node.x + NODE_W / 2,
		y: node.y + NODE_H / 2,
		l: node.x,
		r: node.x + NODE_W,
		t: node.y,
		b: node.y + NODE_H
	};
};

const wires = computed(() => {
	if (!spec.value) return [];
	return spec.value.wires.map((wire) => {
		const from = mid(wire.from);
		const to = mid(wire.to);
		let d;
		if (Math.abs(from.x - to.x) < 8) {
			d = `M${from.x} ${from.b < to.t ? from.b : from.t} V${from.b < to.t ? to.t : to.b}`;
		} else if (Math.abs(from.y - to.y) < 8) {
			d = `M${from.r < to.l ? from.r : from.l} ${from.y} H${from.r < to.l ? to.l : to.r}`;
		} else if (from.r <= to.l) {
			d = `M${from.r} ${from.y} H${to.l - 16} V${to.y} H${to.l}`;
		} else {
			d = `M${from.x} ${from.b} V${to.t - 12} H${to.x} V${to.t}`;
		}
		return { ...wire, d };
	});
});

const kindStyle = {
	signal: { stroke: "#2563eb", width: 2.75, dash: null },
	manage: { stroke: "#7c3aed", width: 2.5, dash: "7 6" },
	pending: { stroke: "#d97706", width: 2.4, dash: "2 6" }
};

const legend = computed(() => {
	const kinds = spec.value?.legendKinds || ["signal", "manage", "pending"];
	return kinds.map((id) => ({
		id,
		label: t(`interactive.planned.legend_${id}`),
		color: kindStyle[id].stroke,
		width: kindStyle[id].width,
		dash: kindStyle[id].dash
	}));
});

const familyAccent = {
	field: "#38bdf8",
	talk: "#38bdf8",
	control: "#38bdf8",
	door: "#94a3b8",
	platform: "#a78bfa",
	pending: "#fb7185"
};

const nodeStyle = (id) => {
	const node = nodes.value.find((item) => item.id === id);
	const family = node?.family || "door";
	const active = props.selected === id || hovered.value === id;

	if (active) {
		return {
			fill: "#ecfdf5",
			stroke: "#059669",
			strokeWidth: 2.5,
			tagFill: "#047857",
			titleFill: "#064e3b",
			descFill: "#047857"
		};
	}

	return {
		fill: "#ffffff",
		stroke: familyAccent[family] || "#94a3b8",
		strokeWidth: 1.75,
		tagFill: "#64748b",
		titleFill: "#0f172a",
		descFill: "#64748b"
	};
};

const handleSelect = (id) => {
	emit("update:selected", id);
};

const handleKeydown = (event, id) => {
	if (event.key !== "Enter" && event.key !== " ") return;
	event.preventDefault();
	handleSelect(id);
};
</script>

<style scoped>
.planned-diagram-frame {
	background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}
.planned-wire,
.planned-node-rect {
	transition:
		fill 0.35s ease,
		stroke 0.35s ease,
		stroke-width 0.35s ease;
}
</style>
