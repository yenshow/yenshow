/** Structural visitor studio data; copy lives in i18n. */

export const VISITOR_DEVICE_IDS = Object.freeze([
	"book",
	"verify",
	"reception",
	"badge",
	"temp_access",
	"exit"
]);

export const visitorDiagram = Object.freeze({
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
});

export const visitorScenarios = Object.freeze({
	booked: {
		badge: "BOOKED CHECK-IN",
		status: "grant",
		routes: ["book", "verify", "badge", "temp_access", "exit"],
		outcomeKeys: ["checkin", "credential", "note"]
	},
	walkin: {
		badge: "WALK-IN DESK",
		status: "grant",
		routes: ["reception", "badge", "temp_access"],
		outcomeKeys: ["checkin", "credential", "note"]
	},
	checkout: {
		badge: "EXIT CLOSE",
		status: "grant",
		routes: ["badge", "temp_access", "exit"],
		outcomeKeys: ["checkin", "credential", "note"]
	},
	overstay: {
		badge: "OVERSTAY ALERT",
		status: "warning",
		routes: ["temp_access", "exit"],
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
