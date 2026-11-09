<template>
	<section class="flex h-full min-h-0 flex-col gap-2" aria-labelledby="cctv-diagram-title">
		<div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
			<h2 id="cctv-diagram-title" class="text-base font-semibold text-primary md:text-lg">
				{{ t("interactive.cctv.diagram_title") }}
			</h2>
			<p v-if="diagramHint" class="text-sm text-slate-500">{{ diagramHint }}</p>
		</div>

		<div class="flex flex-wrap gap-1.5" role="group" :aria-label="t('interactive.cctv.path_all')">
			<button
				v-for="path in paths"
				:key="path.id"
				type="button"
				class="rounded-full border px-3 py-1.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
				:class="
					viewId === path.id
						? 'border-emerald-600 bg-emerald-600 text-white'
						: 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
				"
				:aria-pressed="viewId === path.id ? 'true' : 'false'"
				@click="handleView(path.id)"
			>
				{{ path.label }}
			</button>
		</div>

		<div class="cctv-diagram-frame flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-xl border border-slate-200/80">
			<svg
				class="mx-auto h-auto max-h-full w-full min-w-[760px]"
				viewBox="0 0 960 560"
				preserveAspectRatio="xMidYMid meet"
				role="img"
				:aria-label="t('interactive.cctv.diagram_title')"
			>
				<defs>
					<pattern id="cctv-dot-grid" width="18" height="18" patternUnits="userSpaceOnUse">
						<circle cx="1.2" cy="1.2" r="1.1" fill="#cbd5e1" />
					</pattern>
				</defs>
				<rect width="960" height="560" fill="#f8fafc" />
				<rect width="960" height="560" fill="url(#cctv-dot-grid)" opacity="0.55" />

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
						class="cctv-wire"
						:class="{ 'cctv-wire--flow': wireStyle(wire).flow }"
						:opacity="wireStyle(wire).opacity"
						:stroke="wireStyle(wire).stroke"
						:stroke-width="wireStyle(wire).width"
						:stroke-dasharray="wireStyle(wire).dash || undefined"
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
							:aria-label="`${node.label}：${node.desc}`"
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
								:width="NODE_W"
								:height="NODE_H"
								rx="16"
								class="cctv-node-rect"
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
		<p class="text-xs text-slate-500 md:text-sm">{{ t("interactive.cctv.diagram_click_hint") }}</p>
	</section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { cctvHasDevice } from "~/data/interactive/cctvContent.js";

const NODE_W = 200;
const NODE_H = 104;

const props = defineProps({
	viewId: { type: String, default: "all" },
	selected: { type: String, default: null },
	pathIds: { type: Array, default: null }
});

const emit = defineEmits(["update:selected", "update:viewId"]);
const { t } = useI18n();
const hovered = ref(null);

const POS = {
	ipc: { x: 28, y: 168 },
	poe: { x: 260, y: 168 },
	core: { x: 492, y: 64 },
	nvr: { x: 492, y: 300 },
	vms: { x: 724, y: 88 },
	client: { x: 724, y: 300 }
};

const mid = (id) => ({
	x: POS[id].x + NODE_W / 2,
	y: POS[id].y + NODE_H / 2,
	l: POS[id].x,
	r: POS[id].x + NODE_W,
	t: POS[id].y,
	b: POS[id].y + NODE_H
});

const paths = computed(() => [
	{ id: "all", label: t("interactive.cctv.path_all") },
	{ id: "record", label: t("interactive.cctv.path_record") },
	{ id: "live", label: t("interactive.cctv.path_live") },
	{ id: "remote", label: t("interactive.cctv.path_remote") }
]);

const lanes = computed(() => [
	{ id: "front", x: 28, title: t("interactive.cctv.diagram_lane_front") },
	{ id: "access", x: 260, title: t("interactive.cctv.diagram_lane_access") },
	{ id: "record", x: 492, title: t("interactive.cctv.diagram_lane_record") },
	{ id: "platform", x: 724, title: t("interactive.cctv.diagram_lane_platform") }
]);

const nodes = computed(() =>
	[
		{ id: "ipc", family: "front", tag: "IPC" },
		{ id: "poe", family: "access", tag: "POE" },
		{ id: "core", family: "core", tag: "CORE" },
		{ id: "nvr", family: "record", tag: "NVR" },
		{ id: "vms", family: "platform", tag: "VMS" },
		{ id: "client", family: "client", tag: "CLIENT" }
	].map((node) => ({
		...node,
		x: POS[node.id].x,
		y: POS[node.id].y,
		label: t(`interactive.cctv.nodes.${node.id}`),
		desc: t(`interactive.cctv.node_desc.${node.id}`)
	}))
);

const wires = computed(() => {
	const ipc = mid("ipc");
	const poe = mid("poe");
	const core = mid("core");
	const nvr = mid("nvr");
	const vms = mid("vms");
	const client = mid("client");
	return [
		{
			id: "ipc-poe",
			kind: "stream",
			views: ["all", "record", "live"],
			from: "ipc",
			to: "poe",
			d: `M${ipc.r} ${ipc.y} H${poe.l}`
		},
		{
			id: "poe-core",
			kind: "stream",
			views: ["all", "record", "live"],
			from: "poe",
			to: "core",
			d: `M${poe.r} ${poe.y} H${core.l - 20} V${core.y} H${core.l}`
		},
		{
			id: "core-nvr",
			kind: "stream",
			views: ["all", "record", "live"],
			from: "core",
			to: "nvr",
			d: `M${core.x} ${core.b} V${nvr.t}`
		},
		{
			id: "core-vms",
			kind: "manage",
			views: ["all", "live", "remote"],
			from: "core",
			to: "vms",
			d: `M${core.r} ${core.y} H${vms.l}`
		},
		{
			id: "vms-client",
			kind: "live",
			views: ["all", "live"],
			from: "vms",
			to: "client",
			d: `M${vms.x} ${vms.b} V${client.t}`
		},
		{
			id: "nvr-client",
			kind: "live",
			views: ["all", "live"],
			from: "nvr",
			to: "client",
			d: `M${nvr.r} ${nvr.y} H${client.l}`
		},
		{
			id: "vms-remote",
			kind: "remote",
			views: ["all", "remote"],
			from: "vms",
			to: "client",
			d: `M${vms.r - 24} ${vms.b} C${vms.r + 40} ${vms.b + 40}, ${client.r + 40} ${client.t - 40}, ${client.r - 24} ${client.t}`
		}
	];
});

const legend = computed(() => [
	{
		id: "stream",
		label: t("interactive.cctv.diagram_legend_stream"),
		color: "#2563eb",
		width: 3,
		dash: null
	},
	{
		id: "live",
		label: t("interactive.cctv.diagram_legend_live"),
		color: "#059669",
		width: 2.5,
		dash: "7 6"
	},
	{
		id: "manage",
		label: t("interactive.cctv.diagram_legend_manage"),
		color: "#7c3aed",
		width: 2.5,
		dash: "7 6"
	},
	{
		id: "remote",
		label: t("interactive.cctv.diagram_legend_remote"),
		color: "#d97706",
		width: 2.5,
		dash: "2 6"
	}
]);

const kindStyle = {
	stream: { stroke: "#2563eb", width: 2.75, dash: null },
	live: { stroke: "#059669", width: 2.5, dash: "7 6" },
	manage: { stroke: "#7c3aed", width: 2.5, dash: "7 6" },
	remote: { stroke: "#d97706", width: 2.4, dash: "2 6" }
};

const familyAccent = {
	front: "#38bdf8",
	access: "#38bdf8",
	core: "#94a3b8",
	record: "#94a3b8",
	platform: "#a78bfa",
	client: "#a78bfa"
};

const routeSet = computed(() => (Array.isArray(props.pathIds) ? new Set(props.pathIds) : null));
const pathMode = computed(() => props.viewId !== "all" && Boolean(routeSet.value));

const diagramHint = computed(() => {
	if (props.viewId === "record") return t("interactive.cctv.diagram_hint_record");
	if (props.viewId === "live") return t("interactive.cctv.diagram_hint_live");
	if (props.viewId === "remote") return t("interactive.cctv.diagram_hint_remote");
	return "";
});

const isOnRoute = (id) => routeSet.value?.has(id) ?? false;

const nodeStyle = (id) => {
	const node = nodes.value.find((item) => item.id === id);
	const family = node?.family || "core";
	const active = props.selected === id || hovered.value === id;
	const onRoute = pathMode.value && isOnRoute(id);
	const dimmed = pathMode.value && routeSet.value && !onRoute;

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
		fill = "#f0fdf4";
		stroke = "#10b981";
		tagFill = "#047857";
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
	const base = kindStyle[wire.kind] || kindStyle.stream;
	const inView = !wire.views || wire.views.includes(props.viewId);
	if (!pathMode.value || !routeSet.value) {
		return {
			opacity: inView ? 0.95 : 0.2,
			stroke: base.stroke,
			width: base.width,
			dash: base.dash,
			flow: false
		};
	}
	const lit = inView && isOnRoute(wire.from) && isOnRoute(wire.to);
	return {
		opacity: lit ? 1 : 0.18,
		stroke: lit ? "#059669" : base.stroke,
		width: lit ? base.width + 1 : base.width,
		dash: lit ? "10 12" : base.dash,
		flow: lit
	};
};

const handleView = (id) => {
	emit("update:viewId", id);
};

const handleSelect = (id) => {
	if (!cctvHasDevice(id)) return;
	emit("update:selected", id);
};

const handleKeydown = (event, id) => {
	if (event.key !== "Enter" && event.key !== " ") return;
	event.preventDefault();
	handleSelect(id);
};
</script>

<style scoped>
.cctv-diagram-frame {
	background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}
.cctv-wire,
.cctv-node-rect {
	transition:
		opacity 0.35s ease,
		fill 0.35s ease,
		stroke 0.35s ease,
		stroke-width 0.35s ease;
}
.cctv-wire--flow {
	animation: cctv-wire-flow 0.85s linear infinite;
}
@keyframes cctv-wire-flow {
	to {
		stroke-dashoffset: -44;
	}
}
</style>
