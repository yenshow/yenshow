/** Structural visitor studio data; copy lives in i18n. */

export const VISITOR_DEVICE_IDS = Object.freeze([
	"book",
	"verify",
	"reception",
	"badge",
	"temp_access",
	"exit",
	"overstay"
]);

export const visitorDeviceProducts = Object.freeze({
	book: "YSOP",
	verify: "YS-V30",
	temp_access: "YS-AC-07"
});

export const visitorDiagram = Object.freeze({
	laneIds: ["book", "verify", "pass", "exit"],
	defaultNodeId: "book",
	directionalWires: true,
	legendKinds: ["signal", "manage", "pending"],
	nodes: [
		{ id: "book", tag: "YSOP", lane: 0, y: 64, family: "field" },
		{ id: "verify", tag: visitorDeviceProducts.verify, lane: 1, y: 184, family: "control" },
		{ id: "reception", tag: "DESK", lane: 0, y: 304, family: "control" },
		{ id: "badge", tag: "BADGE", lane: 2, y: 64, family: "door" },
		{ id: "temp_access", tag: "YS AC-07", lane: 2, y: 304, family: "door" },
		{ id: "exit", tag: "VISIT LOG", lane: 3, y: 184, family: "platform" },
		{ id: "overstay", tag: "FOLLOW-UP", lane: 3, y: 64, family: "pending" }
	],
	wires: [
		{ id: "book-verify", from: "book", to: "verify", kind: "signal", toOffsetY: -24 },
		{ id: "reception-verify", from: "reception", to: "verify", kind: "signal", toOffsetY: 24 },
		{ id: "verify-badge", from: "verify", to: "badge", kind: "pending", fromOffsetY: -24 },
		{ id: "verify-temp", from: "verify", to: "temp_access", kind: "pending", fromOffsetY: 24 },
		{ id: "verify-exit", from: "verify", to: "exit", kind: "manage" },
		{ id: "exit-temp", from: "exit", to: "temp_access", kind: "pending", viaX: 708, fromOffsetY: 28 },
		{ id: "exit-overstay", from: "exit", to: "overstay", kind: "manage" }
	]
});

export const visitorScenarios = Object.freeze({
	booked: {
		badge: "BOOKED CHECK-IN",
		status: "grant",
		routes: ["book", "verify", "badge", "temp_access", "exit"],
		wireIds: ["book-verify", "verify-badge", "verify-temp", "verify-exit"],
		outcomeKeys: ["checkin", "credential", "note"]
	},
	walkin: {
		badge: "WALK-IN DESK",
		status: "grant",
		routes: ["reception", "verify", "exit"],
		wireIds: ["reception-verify", "verify-exit"],
		outcomeKeys: ["checkin", "credential", "note"]
	},
	checkout: {
		badge: "EXIT CLOSE",
		status: "grant",
		routes: ["temp_access", "exit"],
		wireIds: ["exit-temp"],
		outcomeKeys: ["checkin", "credential", "note"]
	},
	overstay: {
		badge: "OVERSTAY REVIEW",
		status: "warning",
		routes: ["exit", "overstay"],
		wireIds: ["exit-overstay"],
		outcomeKeys: ["checkin", "credential", "note"]
	}
});

export const VISITOR_SCENARIO_IDS = Object.freeze(Object.keys(visitorScenarios));

export const DEFAULT_VISITOR_PLAN = Object.freeze({
	dailyVisitors: 40,
	checkpoints: 1,
	issueBadge: true
});

export const VISITOR_PLAN_BASE_HIGHLIGHT = Object.freeze([
	"book",
	"verify",
	"badge",
	"temp_access",
	"exit"
]);
export const VISITOR_FOCUS_HIGHLIGHT = Object.freeze({
	dailyVisitors: ["book", "verify"],
	checkpoints: ["verify", "reception"],
	issueBadge: ["badge", "temp_access"]
});

export const visitorHasDevice = (id) => VISITOR_DEVICE_IDS.includes(id);
export const visitorHasScenario = (id) => Object.hasOwn(visitorScenarios, id);
