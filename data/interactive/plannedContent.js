/** Structural data for Phase-2 planned module intros; copy lives in i18n. */

export const PLANNED_MODULE_IDS = Object.freeze(["intercom", "parking", "visitor", "platform"]);

const LANE_X = Object.freeze([28, 260, 492, 724]);

/**
 * @typedef {{ id: string, tag: string, lane: number, y: number, family: string }} PlannedNode
 * @typedef {{ id: string, from: string, to: string, kind: string, d?: string }} PlannedWire
 * @typedef {{
 *   laneIds: string[],
 *   nodes: PlannedNode[],
 *   wires: { id: string, from: string, to: string, kind: string }[],
 *   legendKinds: string[],
 *   defaultNodeId: string
 * }} PlannedModuleSpec
 */

/** @type {Record<string, PlannedModuleSpec>} */
export const plannedModules = Object.freeze({
	intercom: {
		laneIds: ["field", "talk", "unlock", "link"],
		defaultNodeId: "outdoor",
		legendKinds: ["signal", "manage", "pending"],
		nodes: [
			{ id: "outdoor", tag: "DOOR", lane: 0, y: 168, family: "field" },
			{ id: "indoor", tag: "INDOOR", lane: 1, y: 64, family: "talk" },
			{ id: "center", tag: "MGMT", lane: 1, y: 292, family: "talk" },
			{ id: "unlock", tag: "RELAY", lane: 2, y: 168, family: "door" },
			{ id: "access_link", tag: "ACCESS", lane: 3, y: 88, family: "pending" },
			{ id: "video_link", tag: "VIDEO", lane: 3, y: 292, family: "pending" }
		],
		wires: [
			{ id: "outdoor-indoor", from: "outdoor", to: "indoor", kind: "signal" },
			{ id: "outdoor-center", from: "outdoor", to: "center", kind: "signal" },
			{ id: "indoor-unlock", from: "indoor", to: "unlock", kind: "signal" },
			{ id: "center-unlock", from: "center", to: "unlock", kind: "signal" },
			{ id: "unlock-access", from: "unlock", to: "access_link", kind: "pending" },
			{ id: "center-video", from: "center", to: "video_link", kind: "manage" }
		]
	},
	parking: {
		laneIds: ["capture", "decide", "barrier", "platform"],
		defaultNodeId: "camera",
		legendKinds: ["signal", "manage", "pending"],
		nodes: [
			{ id: "camera", tag: "CAM", lane: 0, y: 168, family: "field" },
			{ id: "recognize", tag: "LPR", lane: 1, y: 64, family: "control" },
			{ id: "controller", tag: "CTRL", lane: 1, y: 292, family: "control" },
			{ id: "barrier", tag: "GATE", lane: 2, y: 88, family: "door" },
			{ id: "sensor", tag: "SENSOR", lane: 2, y: 292, family: "door" },
			{ id: "allowlist", tag: "LIST", lane: 3, y: 168, family: "platform" }
		],
		wires: [
			{ id: "camera-recognize", from: "camera", to: "recognize", kind: "signal" },
			{ id: "recognize-controller", from: "recognize", to: "controller", kind: "signal" },
			{ id: "controller-barrier", from: "controller", to: "barrier", kind: "signal" },
			{ id: "controller-sensor", from: "controller", to: "sensor", kind: "signal" },
			{ id: "controller-allowlist", from: "controller", to: "allowlist", kind: "manage" },
			{ id: "barrier-sensor", from: "barrier", to: "sensor", kind: "pending" }
		]
	},
	visitor: {
		laneIds: ["book", "verify", "pass", "exit"],
		defaultNodeId: "book",
		legendKinds: ["signal", "manage", "pending"],
		nodes: [
			{ id: "book", tag: "BOOK", lane: 0, y: 168, family: "field" },
			{ id: "verify", tag: "CHECK", lane: 1, y: 64, family: "control" },
			{ id: "reception", tag: "DESK", lane: 1, y: 292, family: "control" },
			{ id: "badge", tag: "BADGE", lane: 2, y: 64, family: "door" },
			{ id: "temp_access", tag: "TEMP", lane: 2, y: 292, family: "door" },
			{ id: "exit", tag: "EXIT", lane: 3, y: 168, family: "platform" }
		],
		wires: [
			{ id: "book-verify", from: "book", to: "verify", kind: "signal" },
			{ id: "verify-reception", from: "verify", to: "reception", kind: "manage" },
			{ id: "verify-badge", from: "verify", to: "badge", kind: "signal" },
			{ id: "reception-temp", from: "reception", to: "temp_access", kind: "signal" },
			{ id: "badge-exit", from: "badge", to: "exit", kind: "signal" },
			{ id: "temp-exit", from: "temp_access", to: "exit", kind: "pending" }
		]
	},
	platform: {
		laneIds: ["ingest", "events", "ops", "sites"],
		defaultNodeId: "events",
		legendKinds: ["signal", "manage", "pending"],
		nodes: [
			{ id: "access_in", tag: "ACCESS", lane: 0, y: 64, family: "field" },
			{ id: "video_in", tag: "VIDEO", lane: 0, y: 196, family: "field" },
			{ id: "visitor_in", tag: "VISITOR", lane: 0, y: 328, family: "field" },
			{ id: "events", tag: "EVENT", lane: 1, y: 168, family: "control" },
			{ id: "ops", tag: "OPS", lane: 2, y: 168, family: "platform" },
			{ id: "multi", tag: "SITE", lane: 3, y: 168, family: "pending" }
		],
		wires: [
			{ id: "access-events", from: "access_in", to: "events", kind: "signal" },
			{ id: "video-events", from: "video_in", to: "events", kind: "signal" },
			{ id: "visitor-events", from: "visitor_in", to: "events", kind: "signal" },
			{ id: "events-ops", from: "events", to: "ops", kind: "manage" },
			{ id: "ops-multi", from: "ops", to: "multi", kind: "pending" }
		]
	}
});

export const plannedHasModule = (id) => PLANNED_MODULE_IDS.includes(id);

export const getPlannedModule = (id) => {
	if (!plannedHasModule(id)) return null;
	return plannedModules[id];
};

export const plannedNodePosition = (node) => ({
	x: LANE_X[node.lane] ?? LANE_X[0],
	y: node.y
});

export const PLANNED_NODE_W = 200;
export const PLANNED_NODE_H = 104;
export const PLANNED_LANE_X = LANE_X;
