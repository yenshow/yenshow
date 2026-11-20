<template>
	<section class="flex h-full min-h-0 flex-col gap-2" :aria-labelledby="titleId">
		<div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
			<h2 :id="titleId" class="text-base font-semibold text-primary md:text-lg">
				{{ t(diagramTitleKey) }}
			</h2>
			<p v-if="diagramHint" class="text-sm text-slate-500">{{ diagramHint }}</p>
		</div>

		<div class="module-diagram-frame flex min-h-0 flex-1 items-center overflow-auto rounded-xl border border-slate-200/80">
			<svg
				class="mx-auto h-auto max-h-full w-full min-w-[760px]"
				viewBox="0 0 960 560"
				preserveAspectRatio="xMidYMid meet"
				role="group"
				:aria-label="t(diagramTitleKey)"
			>
				<defs>
					<pattern :id="gridId" width="18" height="18" patternUnits="userSpaceOnUse">
						<circle cx="1.2" cy="1.2" r="1.1" fill="#cbd5e1" />
					</pattern>
					<template v-if="directionalWires">
						<marker v-for="item in legend" :id="arrowId(item.id)" :key="item.id" viewBox="0 0 8 8"
							markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" refX="8" refY="4" orient="auto-start-reverse">
							<path d="M0 0 L8 4 L0 8 Z" :fill="item.color" />
						</marker>
					</template>
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
						:key="`${wire.id}-${routeAnimKey}`"
						:d="wire.d"
						class="module-wire"
						:class="{ 'module-wire--flow': wireStyle(wire).flow }"
						:opacity="wireStyle(wire).opacity"
						:stroke="wireStyle(wire).stroke"
						:stroke-width="wireStyle(wire).width"
						:stroke-dasharray="wireStyle(wire).dash || undefined"
						:marker-start="directionalWires && wire.bidirectional ? `url(#${arrowId(wire.kind)})` : undefined"
						:marker-end="directionalWires ? `url(#${arrowId(wire.kind)})` : undefined"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</g>

				<g>
					<template v-for="node in nodes" :key="node.id">
						<g
							:transform="`translate(${node.x},${node.y})`"
							role="button"
							tabindex="0"
							:aria-label="nodeAriaLabel(node)"
							:aria-pressed="mode === 'learn' && selected === node.id ? 'true' : 'false'"
							class="cursor-pointer outline-none"
							:opacity="nodeStyle(node.id).opacity"
							style="transition: opacity 0.35s ease"
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
								class="module-node-rect"
								:class="{
									'module-node--pulse': mode === 'scenario' && isOnRoute(node.id)
								}"
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
							<template v-if="badges[node.id]">
								<rect
									:x="NODE_W - badges[node.id].width + 4"
									y="-14"
									:width="badges[node.id].width"
									height="28"
									rx="14"
									fill="#047857"
								/>
								<text
									:x="NODE_W - badges[node.id].width / 2 + 4"
									y="6"
									text-anchor="middle"
									fill="#fff"
									style="font-size: 14px; font-weight: 700; pointer-events: none"
								>
									{{ badges[node.id].label }}
								</text>
							</template>
						</g>
					</template>
				</g>

				<rect x="24" y="498" width="912" height="46" rx="12" fill="#0f172a" />
				<g v-for="(item, index) in legend" :key="item.id">
					<line
						:x1="48 + index * legendSpacing"
						:y1="521"
						:x2="92 + index * legendSpacing"
						:y2="521"
						:stroke="item.color"
						:stroke-width="item.width"
						:stroke-dasharray="item.dash"
						stroke-linecap="round"
					/>
					<text :x="102 + index * legendSpacing" y="526" fill="#e2e8f0" style="font-size: 13px; font-weight: 500">
						{{ item.label }}
					</text>
				</g>
			</svg>
		</div>
		<p v-if="mode === 'learn'" class="text-xs text-slate-500 md:text-sm">{{ t("interactive.ux.select_node") }}</p>
	</section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { DIAGRAM_LANE_X, DIAGRAM_NODE_H, DIAGRAM_NODE_W, diagramNodePosition } from "~/data/interactive/diagramLayout.js";
import { getStudioDiagram } from "~/data/interactive/studioSpecs.js";

const NODE_W = DIAGRAM_NODE_W;
const NODE_H = DIAGRAM_NODE_H;

const props = defineProps({
	moduleId: { type: String, required: true },
	mode: { type: String, default: "learn" },
	selected: { type: String, default: null },
	highlightIds: { type: Array, default: null },
	scenarioWireIds: { type: Array, default: null },
	nodeBadges: { type: Object, default: null },
	scenarioStatus: { type: String, default: null },
	routeAnimKey: { type: Number, default: 0 }
});

const emit = defineEmits(["update:selected"]);
const { t } = useI18n();
const hovered = ref(null);

const i18nRoot = computed(() => `interactive.${props.moduleId}`);
const diagramTitleKey = computed(() => `${i18nRoot.value}.diagram_title`);
const titleId = computed(() => `module-${props.moduleId}-diagram-title`);
const gridId = computed(() => `module-dot-grid-${props.moduleId}`);
const spec = computed(() => getStudioDiagram(props.moduleId));
const directionalWires = computed(() => spec.value?.directionalWires);
const arrowId = (kind) => `${props.moduleId}-arrow-${kind}`;

const lanes = computed(() => {
	if (!spec.value) return [];
	return spec.value.laneIds.map((id, index) => ({
		id,
		x: DIAGRAM_LANE_X[index] ?? DIAGRAM_LANE_X[0],
		title: t(`${i18nRoot.value}.lanes.${id}`)
	}));
});

const nodes = computed(() => {
	if (!spec.value) return [];
	return spec.value.nodes.map((node) => {
		const pos = diagramNodePosition(node);
		return {
			...node,
			x: pos.x,
			y: pos.y,
			label: t(`${i18nRoot.value}.nodes.${node.id}`),
			desc: t(`${i18nRoot.value}.node_desc.${node.id}`)
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
		const startY = from.y + (wire.fromOffsetY ?? 0);
		const endY = to.y + (wire.toOffsetY ?? 0);
		let d;
		if (wire.viaBottomY != null) {
			d = `M${from.x} ${from.b} V${wire.viaBottomY} H${to.x} V${to.b}`;
		} else if (wire.viaX != null) {
			const leftToRight = from.r <= to.l;
			d = `M${leftToRight ? from.r : from.l} ${startY} H${wire.viaX} V${endY} H${leftToRight ? to.l : to.r}`;
		} else if (Math.abs(from.x - to.x) < 8) {
			d = `M${from.x} ${from.b < to.t ? from.b : from.t} V${from.b < to.t ? to.t : to.b}`;
		} else if (Math.abs(from.y - to.y) < 8) {
			d = `M${from.r < to.l ? from.r : from.l} ${from.y} H${from.r < to.l ? to.l : to.r}`;
		} else if (from.r <= to.l) {
			d = `M${from.r} ${startY} H${to.l - 16} V${endY} H${to.l}`;
		} else {
			d = `M${from.x} ${from.b} V${to.t - 12} H${to.x} V${to.t}`;
		}
		return { ...wire, d };
	});
});

const kindStyle = {
	signal: { stroke: "#2563eb", width: 2.75, dash: null },
	relay: { stroke: "#059669", width: 2.75, dash: null },
	safety: { stroke: "#e11d48", width: 2.5, dash: "8 5" },
	manage: { stroke: "#7c3aed", width: 2.5, dash: "7 6" },
	pending: { stroke: "#d97706", width: 2.4, dash: "2 6" }
};

const legend = computed(() => {
	const kinds = spec.value?.legendKinds || ["signal", "manage", "pending"];
	const root = directionalWires.value ? i18nRoot.value : "interactive.ux";
	return kinds.map((id) => ({
		id,
		label: t(`${root}.legend_${id}`),
		color: kindStyle[id].stroke,
		width: kindStyle[id].width,
		dash: kindStyle[id].dash
	}));
});
const legendSpacing = computed(() => legend.value.length > 3 ? 216 : 280);

const familyAccent = {
	field: "#38bdf8",
	talk: "#38bdf8",
	control: "#38bdf8",
	door: "#94a3b8",
	platform: "#a78bfa",
	pending: "#fb7185"
};

const routeMode = computed(() => props.mode === "scenario" || props.mode === "plan");
const routeSet = computed(() => (Array.isArray(props.highlightIds) ? new Set(props.highlightIds) : null));

const routeStroke = computed(() => {
	if (props.scenarioStatus === "deny") return "#e11d48";
	if (props.scenarioStatus === "warning") return "#d97706";
	return "#059669";
});

const diagramHint = computed(() => {
	if (props.mode === "scenario") return t(`${i18nRoot.value}.diagram_hint_scenario`);
	return "";
});

const badges = computed(() => {
	const source = props.nodeBadges;
	if (!source) return {};
	const next = {};
	for (const [id, raw] of Object.entries(source)) {
		if (raw == null || raw === "") continue;
		const text = String(raw);
		const label = /^\d+$/.test(text) ? `×${text}` : text;
		next[id] = { label, width: Math.max(56, label.length * 12 + 20) };
	}
	return next;
});

const isOnRoute = (id) => routeSet.value?.has(id) ?? false;

const nodeAriaLabel = (node) => {
	const badge = badges.value[node.id];
	return badge ? `${node.label} ${badge.label}` : `${node.label}：${node.desc}`;
};

const nodeStyle = (id) => {
	const node = nodes.value.find((item) => item.id === id);
	const family = node?.family || "door";
	const active = (props.mode === "learn" && props.selected === id) || hovered.value === id;
	const onRoute = routeMode.value && isOnRoute(id);
	const dimmed = routeMode.value && routeSet.value && !onRoute;

	let fill = "#ffffff";
	let titleFill = "#0f172a";
	let descFill = "#64748b";
	let tagFill = "#64748b";
	let stroke = familyAccent[family] || "#94a3b8";
	let strokeWidth = 1.75;

	if (active) {
		fill = "#ecfdf5";
		stroke = "#059669";
		strokeWidth = 2.5;
		tagFill = "#047857";
		titleFill = "#064e3b";
		descFill = "#047857";
	} else if (onRoute) {
		if (props.scenarioStatus === "deny") {
			fill = "#fff1f2";
			stroke = "#e11d48";
			tagFill = "#be123c";
		} else if (props.scenarioStatus === "warning") {
			fill = "#fffbeb";
			stroke = "#d97706";
			tagFill = "#b45309";
		} else {
			fill = "#f0fdf4";
			stroke = "#10b981";
			tagFill = "#047857";
		}
		strokeWidth = 2.25;
	}

	return {
		opacity: dimmed ? 0.38 : 1,
		fill,
		stroke,
		strokeWidth,
		tagFill,
		titleFill,
		descFill
	};
};

const wireStyle = (wire) => {
	const base = kindStyle[wire.kind] || kindStyle.signal;
	if (!routeMode.value || !routeSet.value) {
		return { opacity: 0.95, stroke: base.stroke, width: base.width, dash: base.dash, flow: false };
	}
	const active = props.mode === "scenario" && props.scenarioWireIds
		? props.scenarioWireIds.includes(wire.id)
		: isOnRoute(wire.from) && isOnRoute(wire.to);
	const animate = active && props.mode === "scenario" && !directionalWires.value;
	return {
		opacity: active ? 1 : 0.18,
		stroke: active && !directionalWires.value ? routeStroke.value : base.stroke,
		width: active ? base.width + 1 : base.width,
		dash: animate ? "10 12" : base.dash,
		flow: animate
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
.module-diagram-frame {
	background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}
.module-wire,
.module-node-rect {
	transition:
		opacity 0.35s ease,
		fill 0.35s ease,
		stroke 0.35s ease,
		stroke-width 0.35s ease;
}
.module-wire--flow {
	animation: module-wire-flow 0.85s linear infinite;
}
.module-node--pulse {
	animation: module-node-pulse 0.75s ease;
}
@keyframes module-wire-flow {
	to {
		stroke-dashoffset: -44;
	}
}
@keyframes module-node-pulse {
	0%,
	100% {
		filter: brightness(1);
	}
	45% {
		filter: brightness(1.08);
	}
}
</style>
