/** Structural CCTV-studio data only; user-facing copy lives in i18n. */

export const CCTV_DEVICE_IDS = Object.freeze(["ipc", "poe", "core", "nvr", "vms", "client"]);

export const CCTV_VIEW_IDS = Object.freeze(["all", "record", "live", "remote"]);

export const cctvDeviceProducts = Object.freeze({
	ipc: "YS-2CD3141G2E-LIU",
	poe: "YS-3T0310HP-E_HS",
	nvr: "YS-7604NI-K1/4K",
	vms: "YSOP"
});

/** path id -> node ids on that route (for wire / card highlight) */
export const cctvPathRoutes = Object.freeze({
	all: ["ipc", "poe", "core", "nvr", "vms", "client"],
	record: ["ipc", "poe", "core", "nvr"],
	live: ["ipc", "poe", "core", "vms", "client"],
	remote: ["ipc", "poe", "core", "vms", "client"]
});

export const cctvHasDevice = (id) => CCTV_DEVICE_IDS.includes(id);
export const cctvHasView = (id) => CCTV_VIEW_IDS.includes(id);
