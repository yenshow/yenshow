/** Structural parking studio data; copy lives in i18n. */

export const PARKING_DEVICE_IDS = Object.freeze([
	"camera",
	"trigger",
	"barrier",
	"sensor",
	"allowlist"
]);

export const parkingDeviceProducts = Object.freeze({
	camera: "YS-TCG405-E",
	trigger: "YS-TMG01",
	barrier: "YS-TMG4BX",
	sensor: "YS-TMG02",
	allowlist: "YSOP"
});

export const parkingDiagram = Object.freeze({
	laneIds: ["capture", "decide", "barrier", "safety"],
	defaultNodeId: "camera",
	directionalWires: true,
	legendKinds: ["signal", "relay", "safety", "manage"],
	nodes: [
		{ id: "trigger", tag: parkingDeviceProducts.trigger, lane: 0, y: 228, family: "field" },
		{ id: "camera", tag: parkingDeviceProducts.camera, lane: 1, y: 228, family: "control" },
		{ id: "allowlist", tag: "YSOP PARKING", lane: 1, y: 64, family: "platform" },
		{ id: "barrier", tag: parkingDeviceProducts.barrier, lane: 2, y: 228, family: "door" },
		{ id: "sensor", tag: parkingDeviceProducts.sensor, lane: 3, y: 228, family: "door" }
	],
	wires: [
		{ id: "trigger-camera", from: "trigger", to: "camera", kind: "signal" },
		{ id: "camera-barrier", from: "camera", to: "barrier", kind: "relay" },
		{ id: "sensor-barrier", from: "sensor", to: "barrier", kind: "safety" },
		{ id: "camera-allowlist", from: "camera", to: "allowlist", kind: "manage", bidirectional: true }
	]
});

export const parkingScenarios = Object.freeze({
	allow: {
		badge: "ALLOWLIST PASS",
		status: "grant",
		routes: ["trigger", "camera", "barrier"],
		outcomeKeys: ["decision", "barrier", "note"]
	},
	deny: {
		badge: "DENY ENTRY",
		status: "deny",
		routes: ["trigger", "camera"],
		outcomeKeys: ["decision", "barrier", "note"]
	},
	sensor: {
		badge: "ANTI-CRUSH",
		status: "warning",
		routes: ["barrier", "sensor"],
		outcomeKeys: ["decision", "barrier", "note"]
	},
	review: {
		badge: "MANUAL REVIEW",
		status: "warning",
		routes: ["trigger", "camera", "allowlist"],
		outcomeKeys: ["decision", "barrier", "note"]
	}
});

export const PARKING_SCENARIO_IDS = Object.freeze(Object.keys(parkingScenarios));

export const DEFAULT_PARKING_PLAN = Object.freeze({
	lanes: 2,
	direction: "entry",
	allowlistPeople: 200
});

export const PARKING_PLAN_BASE_HIGHLIGHT = Object.freeze([
	"camera",
	"barrier",
	"sensor",
	"allowlist"
]);
export const PARKING_FOCUS_HIGHLIGHT = Object.freeze({
	lanes: ["camera", "barrier", "sensor"],
	direction: ["camera"],
	allowlistPeople: ["camera", "allowlist"]
});

export const parkingHasDevice = (id) => PARKING_DEVICE_IDS.includes(id);
export const parkingHasScenario = (id) => Object.hasOwn(parkingScenarios, id);
