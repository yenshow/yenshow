/** Structural intercom studio data; copy lives in i18n. */

export const INTERCOM_DEVICE_IDS = Object.freeze([
	"outdoor",
	"indoor",
	"center",
	"unlock",
	"access_link",
	"video_link"
]);

export const intercomDiagram = Object.freeze({
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
});

export const intercomScenarios = Object.freeze({
	resident: {
		badge: "RESIDENT UNLOCK",
		status: "grant",
		routes: ["outdoor", "indoor", "unlock"],
		outcomeKeys: ["answer", "unlock", "note"]
	},
	center: {
		badge: "CENTER DISPATCH",
		status: "grant",
		routes: ["outdoor", "center", "unlock", "video_link"],
		outcomeKeys: ["answer", "unlock", "note"]
	},
	missed: {
		badge: "NO ANSWER",
		status: "deny",
		routes: ["outdoor", "indoor", "center"],
		outcomeKeys: ["answer", "unlock", "note"]
	},
	access_link: {
		badge: "ACCESS LINK TBD",
		status: "warning",
		routes: ["outdoor", "indoor", "unlock", "access_link"],
		outcomeKeys: ["answer", "unlock", "note"]
	}
});

export const INTERCOM_SCENARIO_IDS = Object.freeze(Object.keys(intercomScenarios));

export const DEFAULT_INTERCOM_PLAN = Object.freeze({
	outdoors: 2,
	indoors: 8,
	withCenter: true
});

export const INTERCOM_PLAN_BASE_HIGHLIGHT = Object.freeze(["outdoor", "indoor", "unlock", "center"]);
export const INTERCOM_FOCUS_HIGHLIGHT = Object.freeze({
	outdoors: ["outdoor"],
	indoors: ["indoor"],
	withCenter: ["center"]
});

export const intercomHasDevice = (id) => INTERCOM_DEVICE_IDS.includes(id);
export const intercomHasScenario = (id) => Object.hasOwn(intercomScenarios, id);
