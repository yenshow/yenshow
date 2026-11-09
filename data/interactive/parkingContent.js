/** Structural parking studio data; copy lives in i18n. */

export const PARKING_DEVICE_IDS = Object.freeze([
	"camera",
	"recognize",
	"controller",
	"barrier",
	"sensor",
	"allowlist"
]);

export const parkingDiagram = Object.freeze({
	laneIds: ["capture", "decide", "barrier", "platform"],
	defaultNodeId: "camera",
	legendKinds: ["signal", "manage", "pending"],
	nodes: [
		{ id: "camera", tag: "CAM", lane: 0, y: 168, family: "field" },
		{ id: "recognize", tag: "LPR", lane: 1, y: 64, family: "control" },
		{ id: "controller", tag: "CTRL", lane: 1, y: 292, family: "control" },
		{ id: "barrier", tag: "GATE", lane: 2, y: 88, family: "door" },
		{ id: "sensor", tag: "SENSOR", lane: 2, y: 292, family: "door" },
		{ id: "allowlist", tag: "YSOP", lane: 3, y: 168, family: "platform" }
	],
	wires: [
		{ id: "camera-recognize", from: "camera", to: "recognize", kind: "signal" },
		{ id: "recognize-controller", from: "recognize", to: "controller", kind: "signal" },
		{ id: "controller-barrier", from: "controller", to: "barrier", kind: "signal" },
		{ id: "controller-sensor", from: "controller", to: "sensor", kind: "signal" },
		{ id: "controller-allowlist", from: "controller", to: "allowlist", kind: "manage" },
		{ id: "barrier-sensor", from: "barrier", to: "sensor", kind: "pending" }
	]
});

export const parkingScenarios = Object.freeze({
	allow: {
		badge: "ALLOWLIST PASS",
		status: "grant",
		routes: ["camera", "recognize", "controller", "barrier", "allowlist"],
		outcomeKeys: ["decision", "barrier", "note"]
	},
	deny: {
		badge: "DENY ENTRY",
		status: "deny",
		routes: ["camera", "recognize", "controller", "allowlist"],
		outcomeKeys: ["decision", "barrier", "note"]
	},
	sensor: {
		badge: "ANTI-CRUSH",
		status: "warning",
		routes: ["controller", "barrier", "sensor"],
		outcomeKeys: ["decision", "barrier", "note"]
	},
	review: {
		badge: "MANUAL REVIEW",
		status: "warning",
		routes: ["camera", "recognize", "controller", "allowlist"],
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
	"recognize",
	"controller",
	"barrier",
	"allowlist"
]);
export const PARKING_FOCUS_HIGHLIGHT = Object.freeze({
	lanes: ["camera", "barrier"],
	direction: ["camera", "recognize"],
	allowlistPeople: ["allowlist"]
});

export const parkingHasDevice = (id) => PARKING_DEVICE_IDS.includes(id);
export const parkingHasScenario = (id) => Object.hasOwn(parkingScenarios, id);
