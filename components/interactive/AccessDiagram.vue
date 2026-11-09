<template>
	<section class="flex h-full min-h-0 flex-col gap-2" aria-labelledby="access-diagram-title">
		<div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
			<h2 id="access-diagram-title" class="text-base font-semibold text-primary md:text-lg">
				{{ t("interactive.access.diagram_title") }}
			</h2>
			<p v-if="diagramHint" class="text-sm text-slate-500">{{ diagramHint }}</p>
		</div>

		<div class="access-diagram-frame flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-xl border border-slate-200/80">
			<svg
				class="mx-auto h-auto max-h-full w-full min-w-[760px]"
				viewBox="0 0 960 560"
				preserveAspectRatio="xMidYMid meet"
				role="img"
				:aria-label="t('interactive.access.diagram_title')"
			>
				<defs>
					<pattern id="access-dot-grid" width="18" height="18" patternUnits="userSpaceOnUse">
						<circle cx="1.2" cy="1.2" r="1.1" fill="#cbd5e1" />
					</pattern>
				</defs>
				<rect width="960" height="560" fill="#f8fafc" />
				<rect width="960" height="560" fill="url(#access-dot-grid)" opacity="0.55" />

				<!-- lane titles -->
				<g v-for="lane in lanes" :key="lane.id">
					<text :x="lane.x" y="34" fill="#64748b" style="font-size: 14px; font-weight: 700; letter-spacing: 0.04em">
						{{ lane.title }}
					</text>
				</g>

				<!-- wires under cards -->
				<g fill="none">
					<path
						v-for="wire in wires"
						:key="`${wire.id}-${routeAnimKey}`"
						:d="wire.d"
						class="access-wire"
						:class="{ 'access-wire--flow': wireStyle(wire).flow }"
						:opacity="wireStyle(wire).opacity"
						:stroke="wireStyle(wire).stroke"
						:stroke-width="wireStyle(wire).width"
						:stroke-dasharray="wireStyle(wire).dash || undefined"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</g>

				<!-- cards -->
				<g>
					<template v-for="node in nodes" :key="node.id">
						<g
							:transform="`translate(${node.x},${node.y})`"
							role="button"
							tabindex="0"
							:aria-label="nodeAriaLabel(node)"
							:aria-pressed="selected === node.id ? 'true' : 'false'"
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
								:key="`${node.id}-${routeAnimKey}`"
								:width="NODE_W"
								:height="NODE_H"
								rx="16"
								class="access-node-rect"
								:class="{
									'access-node--pulse': mode === 'scenario' && isOnRoute(node.id),
									'access-node--invite': inviteNodes && mode === 'learn' && selected !== node.id
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

				<!-- legend bar -->
				<rect x="24" y="498" width="912" height="46" rx="12" fill="#0f172a" />
				<g v-for="(item, index) in legend" :key="item.id">
					<line
						:x1="40 + index * 228"
						:y1="521"
						:x2="84 + index * 228"
						:y2="521"
						:stroke="item.color"
						:stroke-width="item.width"
						:stroke-dasharray="item.dash"
						stroke-linecap="round"
					/>
					<text :x="94 + index * 228" y="526" fill="#e2e8f0" style="font-size: 13px; font-weight: 500">
						{{ item.label }}
					</text>
				</g>
			</svg>
		</div>
		<p class="text-xs text-slate-500 md:text-sm">{{ t("interactive.access.diagram_click_hint") }}</p>
	</section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { accessHasDevice } from "~/data/interactive/accessContent.js";

const NODE_W = 200;
const NODE_H = 104;

const props = defineProps({
	mode: { type: String, default: "learn" },
	selected: { type: String, default: "face" },
	highlightIds: { type: Array, default: null },
	nodeBadges: { type: Object, default: null },
	scenarioStatus: { type: String, default: null },
	routeAnimKey: { type: Number, default: 0 },
	inviteNodes: { type: Boolean, default: false }
});

const emit = defineEmits(["update:selected"]);
const { t } = useI18n();
const hovered = ref(null);

/** card top-left positions — face aligns with controller for a level signal wire */
const POS = {
	face: { x: 28, y: 228 },
	platform: { x: 260, y: 64 },
	controller: { x: 260, y: 228 },
	lock: { x: 492, y: 64 },
	sensor: { x: 492, y: 204 },
	exit: { x: 492, y: 344 },
	fire: { x: 724, y: 120 },
	power: { x: 724, y: 300 }
};

const mid = (id) => ({
	x: POS[id].x + NODE_W / 2,
	y: POS[id].y + NODE_H / 2,
	l: POS[id].x,
	r: POS[id].x + NODE_W,
	t: POS[id].y,
	b: POS[id].y + NODE_H
});

const lanes = computed(() => [
	{ id: "field", x: 28, title: t("interactive.access.diagram_lane_field") },
	{ id: "control", x: 260, title: t("interactive.access.diagram_lane_control") },
	{ id: "door", x: 492, title: t("interactive.access.diagram_lane_door") },
	{ id: "safety", x: 724, title: t("interactive.access.diagram_lane_safety") }
]);

const nodes = computed(() =>
	[
		{ id: "face", family: "field", tag: "READER" },
		{ id: "platform", family: "platform", tag: "YSOP" },
		{ id: "controller", family: "control", tag: "DI / CTRL" },
		{ id: "lock", family: "door", tag: "LOCK" },
		{ id: "sensor", family: "door", tag: "SENSOR" },
		{ id: "exit", family: "door", tag: "REX" },
		{ id: "fire", family: "safety", tag: "FIRE" },
		{ id: "power", family: "safety", tag: "POWER" }
	].map((node) => ({
		...node,
		x: POS[node.id].x,
		y: POS[node.id].y,
		label: t(`interactive.access.nodes.${node.id}`),
		desc: t(`interactive.access.node_desc.${node.id}`)
	}))
);

const wires = computed(() => {
	const f = mid("face");
	const c = mid("controller");
	const p = mid("platform");
	const l = mid("lock");
	const s = mid("sensor");
	const e = mid("exit");
	const fire = mid("fire");
	const pow = mid("power");
	return [
		{
			id: "face-controller",
			kind: "signal",
			from: "face",
			to: "controller",
			d: `M${f.r} ${f.y} H${c.l}`
		},
		{
			id: "controller-platform",
			kind: "manage",
			from: "controller",
			to: "platform",
			d: `M${c.x} ${c.t} V${p.b}`
		},
		{
			id: "controller-lock",
			kind: "signal",
			from: "controller",
			to: "lock",
			d: `M${c.r} ${c.y - 12} H${l.l}`
		},
		{
			id: "controller-sensor",
			kind: "signal",
			from: "controller",
			to: "sensor",
			d: `M${c.r} ${c.y + 12} H${s.l - 16} V${s.y} H${s.l}`
		},
		{
			id: "controller-exit",
			kind: "signal",
			from: "controller",
			to: "exit",
			d: `M${c.r} ${c.y + 28} H${e.l - 28} V${e.y} H${e.l}`
		},
		{
			id: "lock-sensor",
			kind: "signal",
			from: "lock",
			to: "sensor",
			d: `M${l.x} ${l.b} V${s.t}`
		},
		{
			id: "power-controller",
			kind: "power",
			from: "power",
			to: "controller",
			d: `M${pow.l} ${pow.y} H${c.r + 36} V${c.b + 20} H${c.x} V${c.b}`
		},
		{
			id: "fire-lock",
			kind: "safety",
			from: "fire",
			to: "lock",
			d: `M${fire.l} ${fire.y} H${l.r + 24} V${l.y} H${l.r}`
		}
	];
});

const legend = computed(() => [
	{
		id: "signal",
		label: t("interactive.access.diagram_legend_signal"),
		color: "#2563eb",
		width: 3,
		dash: null
	},
	{
		id: "manage",
		label: t("interactive.access.diagram_legend_manage"),
		color: "#7c3aed",
		width: 2.5,
		dash: "7 6"
	},
	{
		id: "power",
		label: t("interactive.access.diagram_legend_power"),
		color: "#d97706",
		width: 2.5,
		dash: "2 6"
	},
	{
		id: "safety",
		label: t("interactive.access.diagram_legend_safety"),
		color: "#e11d48",
		width: 2.5,
		dash: "8 5"
	}
]);

const kindStyle = {
	signal: { stroke: "#2563eb", width: 2.75, dash: null },
	manage: { stroke: "#7c3aed", width: 2.5, dash: "7 6" },
	power: { stroke: "#d97706", width: 2.4, dash: "2 6" },
	safety: { stroke: "#e11d48", width: 2.4, dash: "8 5" }
};

const familyAccent = {
	field: "#38bdf8",
	control: "#38bdf8",
	platform: "#a78bfa",
	door: "#94a3b8",
	safety: "#fb7185"
};

const routeMode = computed(() => props.mode === "scenario" || props.mode === "plan");
const routeSet = computed(() => (Array.isArray(props.highlightIds) ? new Set(props.highlightIds) : null));

const routeStroke = computed(() => {
	if (props.scenarioStatus === "deny") return "#e11d48";
	if (props.scenarioStatus === "warning") return "#d97706";
	return "#059669";
});

const diagramHint = computed(() => {
	if (props.mode === "scenario") return t("interactive.access.diagram_hint_scenario");
	if (props.mode === "plan") return t("interactive.access.diagram_hint_plan");
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

const nodeAriaLabel = (node) => {
	const badge = badges.value[node.id];
	return badge ? `${node.label} ${badge.label}` : `${node.label}：${node.desc}`;
};

const isOnRoute = (id) => routeSet.value?.has(id) ?? false;

const nodeStyle = (id) => {
	const node = nodes.value.find((item) => item.id === id);
	const family = node?.family || "door";
	const active = props.selected === id || hovered.value === id;
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
	const active = isOnRoute(wire.from) && isOnRoute(wire.to);
	return {
		opacity: active ? 1 : 0.18,
		stroke: active ? routeStroke.value : base.stroke,
		width: active ? base.width + 1 : base.width,
		dash: active && props.mode === "scenario" ? "10 12" : base.dash,
		flow: active && props.mode === "scenario"
	};
};

const handleSelect = (id) => {
	if (!accessHasDevice(id)) return;
	emit("update:selected", id);
};

const handleKeydown = (event, id) => {
	if (event.key !== "Enter" && event.key !== " ") return;
	event.preventDefault();
	handleSelect(id);
};
</script>

<style scoped>
.access-diagram-frame {
	background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}
.access-wire,
.access-node-rect {
	transition:
		opacity 0.35s ease,
		fill 0.35s ease,
		stroke 0.35s ease,
		stroke-width 0.35s ease;
}
.access-wire--flow {
	animation: access-wire-flow 0.85s linear infinite;
}
.access-node--pulse {
	animation: access-node-pulse 0.75s ease;
}
.access-node--invite {
	animation: access-node-invite 1.8s ease-in-out infinite;
}
@keyframes access-wire-flow {
	to {
		stroke-dashoffset: -44;
	}
}
@keyframes access-node-pulse {
	0%,
	100% {
		filter: brightness(1);
	}
	45% {
		filter: brightness(1.08);
	}
}
@keyframes access-node-invite {
	0%,
	100% {
		filter: drop-shadow(0 0 0 transparent);
	}
	50% {
		filter: drop-shadow(0 0 7px rgba(5, 150, 105, 0.4));
	}
}
</style>
