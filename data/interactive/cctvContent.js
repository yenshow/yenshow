/** Structural CCTV-studio data only; user-facing copy lives in i18n. */

export const CCTV_DEVICE_IDS = Object.freeze(["ipc", "poe", "core", "nvr", "vms", "client"]);

export const CCTV_VIEW_IDS = Object.freeze(["all", "record", "live", "remote"]);

/** device id -> path ids where the node stays highlighted */
export const cctvDevicePaths = Object.freeze({
	ipc: ["all", "record", "live", "remote"],
	poe: ["all", "record", "live"],
	core: ["all", "record", "live", "remote"],
	nvr: ["all", "record", "live"],
	vms: ["all", "live", "remote"],
	client: ["all", "live", "remote"]
});

/** path id -> node ids on that route (for wire / card highlight) */
export const cctvPathRoutes = Object.freeze({
	all: ["ipc", "poe", "core", "nvr", "vms", "client"],
	record: ["ipc", "poe", "core", "nvr"],
	live: ["ipc", "poe", "core", "nvr", "vms", "client"],
	remote: ["core", "vms", "client"]
});

export const cctvHasDevice = (id) => CCTV_DEVICE_IDS.includes(id);
export const cctvHasView = (id) => CCTV_VIEW_IDS.includes(id);
