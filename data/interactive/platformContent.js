/** Structural YSOP platform studio data; copy lives in i18n. */

export const PLATFORM_DEVICE_IDS = Object.freeze([
	"access_in",
	"video_in",
	"visitor_in",
	"events",
	"ops",
	"multi"
]);

export const platformDiagram = Object.freeze({
	laneIds: ["ingest", "events", "ops", "sites"],
	defaultNodeId: "events",
	legendKinds: ["signal", "manage"],
	nodes: [
		{ id: "access_in", tag: "ACCESS", lane: 0, y: 64, family: "field" },
		{ id: "video_in", tag: "VIDEO", lane: 0, y: 196, family: "field" },
		{ id: "visitor_in", tag: "VISITOR", lane: 0, y: 328, family: "field" },
		{ id: "events", tag: "EVENT", lane: 1, y: 168, family: "control" },
		{ id: "ops", tag: "OPS", lane: 2, y: 168, family: "platform" },
		{ id: "multi", tag: "SITE", lane: 3, y: 168, family: "platform" }
	],
	wires: [
		{ id: "access-events", from: "access_in", to: "events", kind: "signal" },
		{ id: "video-events", from: "video_in", to: "events", kind: "signal" },
		{ id: "visitor-events", from: "visitor_in", to: "events", kind: "signal" },
		{ id: "events-ops", from: "events", to: "ops", kind: "manage" },
		{ id: "ops-multi", from: "ops", to: "multi", kind: "manage" }
	]
});

export const platformScenarios = Object.freeze({
	correlate: {
		badge: "EVENT CORRELATE",
		status: "grant",
		routes: ["access_in", "video_in", "events", "ops"],
		outcomeKeys: ["signal", "ops", "note"]
	},
	visitor: {
		badge: "VISITOR INGEST",
		status: "grant",
		routes: ["visitor_in", "events", "ops"],
		outcomeKeys: ["signal", "ops", "note"]
	},
	multisite: {
		badge: "MULTI-SITE VIEW",
		status: "grant",
		routes: ["ops", "multi"],
		outcomeKeys: ["signal", "ops", "note"]
	},
	gap: {
		badge: "INTEGRATION GAP",
		status: "deny",
		routes: ["access_in", "events", "ops"],
		outcomeKeys: ["signal", "ops", "note"]
	}
});

export const PLATFORM_SCENARIO_IDS = Object.freeze(Object.keys(platformScenarios));

export const DEFAULT_PLATFORM_PLAN = Object.freeze({
	sites: 2,
	linkedSystems: 3,
	operators: 4,
	multiSite: true
});

export const PLATFORM_PLAN_BASE_HIGHLIGHT = Object.freeze([
	"access_in",
	"video_in",
	"visitor_in",
	"events",
	"ops"
]);

export const PLATFORM_FOCUS_HIGHLIGHT = Object.freeze({
	sites: ["multi", "ops"],
	linkedSystems: ["access_in", "video_in", "visitor_in", "events"],
	operators: ["ops"],
	multiSite: ["multi", "ops"]
});

export const platformHasDevice = (id) => PLATFORM_DEVICE_IDS.includes(id);
export const platformHasScenario = (id) => Object.hasOwn(platformScenarios, id);
