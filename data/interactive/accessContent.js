/** Structural access-studio data only; user-facing copy lives in i18n. */

export const ACCESS_DEVICE_IDS = Object.freeze([
	"face",
	"controller",
	"lock",
	"platform",
	"power",
	"exit",
	"sensor",
	"fire"
]);

export const accessDeviceProducts = Object.freeze({
	face: { model: "YS AC-07", productCode: "YS-AC-07" },
	controller: { model: "YS-K2704X", productCode: "YS-K2708X" },
	platform: { model: "YSOP", productCode: "YSOP" }
});

export const accessScenarios = Object.freeze({
	valid: {
		badge: "ACCESS GRANTED",
		status: "grant",
		nodes: ["face", "controller", "lock", "sensor"],
		wires: ["credential", "lock-output", "door-contact"]
	},
	unknown: {
		badge: "ACCESS DENIED",
		status: "deny",
		nodes: ["face"],
		wires: []
	},
	door: {
		badge: "DOOR NOT PERMITTED",
		status: "deny",
		nodes: ["face", "controller"],
		wires: ["credential"]
	},
	time: {
		badge: "TIME RESTRICTION",
		status: "deny",
		nodes: ["face", "controller"],
		wires: ["credential"]
	},
	offline: {
		badge: "LOCAL AUTHORIZATION",
		status: "warning",
		nodes: ["face", "controller", "lock", "sensor"],
		wires: ["credential", "lock-output", "door-contact"]
	},
	fire: {
		badge: "EMERGENCY PATH",
		status: "warning",
		nodes: ["fire", "lock"],
		wires: ["fire-linkage"]
	}
});

export const ACCESS_SCENARIO_IDS = Object.freeze(Object.keys(accessScenarios));

export const accessHasDevice = (id) => ACCESS_DEVICE_IDS.includes(id);
export const accessHasScenario = (id) => Object.hasOwn(accessScenarios, id);
