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

export const accessScenarios = Object.freeze({
	valid: {
		badge: "ACCESS GRANTED",
		status: "grant",
		routes: ["face", "controller", "lock", "sensor", "platform", "power"]
	},
	unknown: {
		badge: "ACCESS DENIED",
		status: "deny",
		routes: ["face", "controller", "sensor", "platform"]
	},
	door: {
		badge: "DOOR NOT PERMITTED",
		status: "deny",
		routes: ["face", "controller", "sensor", "platform"]
	},
	time: {
		badge: "TIME RESTRICTION",
		status: "deny",
		routes: ["face", "controller", "sensor", "platform"]
	},
	offline: {
		badge: "LOCAL AUTHORIZATION",
		status: "warning",
		routes: ["face", "controller", "lock", "sensor", "power"]
	},
	fire: {
		badge: "EMERGENCY PATH",
		status: "warning",
		routes: ["fire", "lock", "power", "sensor", "exit"]
	}
});

export const ACCESS_SCENARIO_IDS = Object.freeze(Object.keys(accessScenarios));

export const accessHasDevice = (id) => ACCESS_DEVICE_IDS.includes(id);
export const accessHasScenario = (id) => Object.hasOwn(accessScenarios, id);
