import { computed, inject, provide, ref } from "vue";
import { useI18n } from "vue-i18n";
import {
	CCTV_DEVICE_IDS,
	CCTV_VIEW_IDS,
	cctvDevicePaths,
	cctvHasDevice,
	cctvHasView,
	cctvPathRoutes
} from "~/data/interactive/cctvContent.js";

export const CCTV_STUDIO_KEY = Symbol("cctvStudio");

const resolveMessageList = (tm, rt, path) => {
	const raw = tm(path);
	if (!Array.isArray(raw)) return [];
	return raw.map((item) => {
		if (typeof item === "string") return item;
		try {
			return rt(item);
		} catch {
			return String(item ?? "");
		}
	});
};

export const createCctvStudio = () => {
	const { t, tm, rt } = useI18n();
	const mode = ref("inspect");
	const viewId = ref("all");
	const selectedDevice = ref(null);
	const diagramCollapsed = ref(false);

	const pathIds = computed(() =>
		viewId.value === "all" ? null : cctvPathRoutes[viewId.value] || null
	);

	const device = computed(() => {
		const id = selectedDevice.value;
		if (!id || !cctvHasDevice(id)) return null;
		const base = `interactive.cctv.devices.${id}`;
		return {
			id,
			title: t(`${base}.title`),
			desc: t(`${base}.desc`),
			note: t(`${base}.note`),
			points: resolveMessageList(tm, rt, `${base}.points`)
		};
	});

	const view = computed(() => {
		const id = CCTV_VIEW_IDS.includes(viewId.value) ? viewId.value : "all";
		const base = `interactive.cctv.views.${id}`;
		return {
			id,
			type: t(`${base}.type`),
			title: t(`${base}.title`),
			desc: t(`${base}.desc`),
			note: t(`${base}.note`),
			points: resolveMessageList(tm, rt, `${base}.points`)
		};
	});

	const inspector = computed(() => device.value || view.value);

	const handleMode = (next) => {
		mode.value = next;
	};

	const handleView = (id) => {
		if (!cctvHasView(id)) return;
		viewId.value = id;
		selectedDevice.value = null;
	};

	const handleSelectDevice = (id) => {
		if (!cctvHasDevice(id)) return;
		selectedDevice.value = id;
		if (mode.value !== "inspect") mode.value = "inspect";
	};

	const deviceOnPath = (id) => {
		if (viewId.value === "all") return true;
		return (cctvDevicePaths[id] || []).includes(viewId.value);
	};

	return {
		mode,
		viewId,
		selectedDevice,
		diagramCollapsed,
		pathIds,
		device,
		view,
		inspector,
		deviceIds: CCTV_DEVICE_IDS,
		handleMode,
		handleView,
		handleSelectDevice,
		deviceOnPath
	};
};

export const provideCctvStudio = () => {
	const studio = createCctvStudio();
	provide(CCTV_STUDIO_KEY, studio);
	return studio;
};

export const useCctvStudio = () => {
	const studio = inject(CCTV_STUDIO_KEY, null);
	if (!studio) {
		throw new Error("useCctvStudio() requires provideCctvStudio() in a parent.");
	}
	return studio;
};
