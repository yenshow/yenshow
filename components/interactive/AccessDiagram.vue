<template>
	<section class="flex h-full min-h-0 flex-col gap-2" aria-labelledby="access-diagram-title">
		<div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
			<h2 id="access-diagram-title" class="text-base font-semibold text-primary md:text-lg">
				{{ t("interactive.access.diagram_title") }}
			</h2>
			<p v-if="diagramHint" class="text-sm text-slate-500">{{ diagramHint }}</p>
		</div>
		<p class="text-sm text-slate-600">
			{{ t(`interactive.access.architecture_${integrated ? "integrated" : "separate"}`) }}
		</p>

		<div class="access-diagram-frame flex min-h-0 flex-1 items-center overflow-auto rounded-xl border border-slate-200/80">
			<svg
				class="mx-auto h-auto max-h-full w-full min-w-[760px]"
				viewBox="0 0 960 560"
				preserveAspectRatio="xMidYMid meet"
				role="group"
				:aria-label="t('interactive.access.diagram_title')"
			>
				<defs>
					<pattern id="access-dot-grid" width="18" height="18" patternUnits="userSpaceOnUse">
						<circle cx="1.2" cy="1.2" r="1.1" fill="#cbd5e1" />
					</pattern>
					<marker id="access-signal-arrow" viewBox="0 0 8 8" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" refX="8" refY="4" orient="auto">
						<path d="M0 0 L8 4 L0 8 Z" fill="#2563eb" />
					</marker>
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
						:opacity="wireOpacity(wire)"
						:stroke="kindStyle[wire.kind].color"
						:stroke-width="kindStyle[wire.kind].width + (isWireActive(wire) ? 1.5 : 0)"
						:stroke-dasharray="kindStyle[wire.kind].dash"
						:marker-end="wire.kind === 'signal' ? 'url(#access-signal-arrow)' : undefined"
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
								:key="`${node.id}-${routeAnimKey}`"
								:width="NODE_W"
								:height="NODE_H"
								rx="16"
								class="access-node-rect"
								:class="{
									'access-node--pulse': mode === 'scenario' && isOnRoute(node.id)
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
						:x1="42 + index * 304"
						:y1="521"
						:x2="86 + index * 304"
						:y2="521"
						:stroke="item.color"
						:stroke-width="item.width"
						:stroke-dasharray="item.dash"
						stroke-linecap="round"
					/>
					<text :x="98 + index * 304" y="526" fill="#e2e8f0" style="font-size: 14px; font-weight: 500">
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
import { accessDeviceProducts, accessHasDevice } from "~/data/interactive/accessContent.js";

const NODE_W = 200;
const NODE_H = 104;

const props = defineProps({
	mode: { type: String, default: "learn" },
	selected: { type: String, default: "face" },
	highlightIds: { type: Array, default: null },
	activeWireIds: { type: Array, default: null },
	integrated: { type: Boolean, default: false },
	nodeBadges: { type: Object, default: null },
	scenarioStatus: { type: String, default: null },
	routeAnimKey: { type: Number, default: 0 }
});

const emit = defineEmits(["update:selected"]);
const { t } = useI18n();
const hovered = ref(null);

const POS = {
	face: { x: 28, y: 228 },
	platform: { x: 260, y: 64 },
	controller: { x: 260, y: 228 },
	lock: { x: 492, y: 64 },
	sensor: { x: 492, y: 228 },
	exit: { x: 492, y: 344 },
	fire: { x: 724, y: 64 },
	power: { x: 724, y: 228 }
};

const position = (id) => {
	if (props.integrated && id === "face") return POS.controller;
	if (props.integrated && id === "power") return POS.face;
	return POS[id];
};

const mid = (id) => {
	const { x, y } = position(id);
	return { x: x + NODE_W / 2, y: y + NODE_H / 2, l: x, r: x + NODE_W, t: y, b: y + NODE_H };
};

const lanes = computed(() => [
	{ id: "field", x: 28, title: t(`interactive.access.diagram_lane_${props.integrated ? "power" : "field"}`) },
	{ id: "control", x: 260, title: t("interactive.access.diagram_lane_control") },
	{ id: "door", x: 492, title: t("interactive.access.diagram_lane_door") },
	{ id: "safety", x: 724, title: t(`interactive.access.diagram_lane_${props.integrated ? "fire" : "safety"}`) }
]);

const nodes = computed(() =>
	[
		{ id: "face", family: "field", tag: accessDeviceProducts.face.model },
		{ id: "platform", family: "platform", tag: accessDeviceProducts.platform.model },
		{ id: "controller", family: "control", tag: accessDeviceProducts.controller.model },
		{ id: "lock", family: "door", tag: "RELAY OUT" },
		{ id: "sensor", family: "door", tag: "DOOR IN" },
		{ id: "exit", family: "door", tag: "REX IN" },
		{ id: "fire", family: "safety", tag: "FIRE" },
		{ id: "power", family: "door", tag: "POWER" }
	].filter(({ id }) => !props.integrated || id !== "controller").map((node) => ({
		...node,
		...position(node.id),
		label: t(`interactive.access.nodes.${props.integrated && node.id === "face" ? "integrated" : node.id}`),
		desc: t(`interactive.access.node_desc.${props.integrated && node.id === "face" ? "integrated" : node.id}`)
	}))
);

const wires = computed(() => {
	const f = mid("face");
	const controlId = props.integrated ? "face" : "controller";
	const c = mid(controlId);
	const p = mid("platform");
	const l = mid("lock");
	const s = mid("sensor");
	const e = mid("exit");
	const fire = mid("fire");
	const paths = [
		{
			id: "management",
			kind: "manage",
			from: controlId,
			to: "platform",
			d: `M${c.x} ${c.t} V${p.b}`
		},
		{
			id: "lock-output",
			kind: "signal",
			from: controlId,
			to: "lock",
			d: `M${c.r} ${c.y - 28} H${l.l - 16} V${l.y} H${l.l}`
		},
		{
			id: "door-contact",
			kind: "signal",
			from: "sensor",
			to: controlId,
			d: `M${s.l} ${s.y} H${c.r}`
		},
		{
			id: "exit-request",
			kind: "signal",
			from: "exit",
			to: controlId,
			d: `M${e.l} ${e.y} H${e.l - 16} V${c.y + 28} H${c.r}`
		},
		{
			id: "fire-linkage",
			kind: "safety",
			from: "fire",
			to: "lock",
			d: `M${fire.l} ${fire.y} H${l.r}`
		}
	];
	if (!props.integrated) {
		paths.push({ id: "credential", kind: "signal", from: "face", to: "controller", d: `M${f.r} ${f.y} H${c.l}` });
	}
	return paths;
});

const kindStyle = {
	signal: { color: "#2563eb", width: 2.75 },
	manage: { color: "#7c3aed", width: 2.5, dash: "7 6" },
	safety: { color: "#e11d48", width: 2.5, dash: "8 5" }
};

const legend = computed(() => Object.entries(kindStyle).map(([id, style]) => ({
	id,
	...style,
	label: t(`interactive.access.diagram_legend_${id}`)
})));

const familyAccent = {
	field: "#38bdf8",
	control: "#38bdf8",
	platform: "#a78bfa",
	door: "#94a3b8",
	safety: "#fb7185"
};

const routeMode = computed(() => props.mode === "scenario" || props.mode === "plan");
const routeSet = computed(() => (Array.isArray(props.highlightIds) ? new Set(props.highlightIds) : null));

const diagramHint = computed(() => {
	if (props.mode === "scenario") return t("interactive.access.diagram_hint_scenario");
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

const isWireActive = (wire) => {
	if (props.mode === "scenario") return props.activeWireIds?.includes(wire.id);
	return props.mode === "plan" && isOnRoute(wire.from) && isOnRoute(wire.to);
};

const wireOpacity = (wire) => !routeMode.value || isWireActive(wire) ? 1 : 0.2;

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
.access-node--pulse {
	animation: access-node-pulse 0.75s ease;
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
</style>
