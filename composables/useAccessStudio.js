import { computed, inject, provide, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import {
	ACCESS_DEVICE_IDS,
	ACCESS_SCENARIO_IDS,
	accessHasDevice,
	accessHasScenario,
	accessScenarios
} from "~/data/interactive/accessContent.js";
import { accessBOM, DEFAULT_ACCESS_PLAN } from "~/utils/interactive/model.js";

export const ACCESS_STUDIO_KEY = Symbol("accessStudio");

const PLAN_BASE_HIGHLIGHT = ["face", "controller", "lock", "platform", "power"];
const FOCUS_HIGHLIGHT = {
	doors: ["face", "lock"],
	direction: ["face", "lock"],
	design: ["controller"],
	people: ["platform"],
	sites: ["platform"],
	context: ["platform", "exit"]
};

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

export const createAccessStudio = () => {
	const { t, tm, rt } = useI18n();
	const mode = ref("learn");
	const selectedDevice = ref("face");
	const scenarioId = ref("valid");
	const diagramCollapsed = ref(false);
	const focusField = ref(null);
	const moreOpen = ref(false);
	const bomOpen = ref(false);
	const roleOpen = ref(false);
	const routeAnimKey = ref(0);
	const plan = reactive({ ...DEFAULT_ACCESS_PLAN });

	const scenarioMeta = computed(() => accessScenarios[scenarioId.value] || accessScenarios.valid);

	const scenario = computed(() => {
		const id = scenarioId.value;
		const meta = scenarioMeta.value;
		const base = `interactive.access.scenarios.${id}`;
		return {
			id,
			badge: meta.badge,
			status: meta.status,
			routes: meta.routes,
			title: t(`${base}.title`),
			desc: t(`${base}.desc`),
			steps: resolveMessageList(tm, rt, `${base}.steps`),
			controller: t(`${base}.controller`),
			lock: t(`${base}.lock`),
			platform: t(`${base}.platform`)
		};
	});

	const device = computed(() => {
		const id = ACCESS_DEVICE_IDS.includes(selectedDevice.value) ? selectedDevice.value : "face";
		const base = `interactive.access.devices.${id}`;
		return {
			id,
			title: t(`${base}.title`),
			desc: t(`${base}.desc`),
			note: t(`${base}.note`)
		};
	});

	const scenarioList = computed(() =>
		ACCESS_SCENARIO_IDS.map((id) => ({
			id,
			label: t(`interactive.access.scenarios.${id}.label`)
		}))
	);

	const bom = computed(() => accessBOM(plan));

	const nodeBadges = computed(() => {
		if (mode.value !== "plan") return null;
		const result = bom.value;
		return {
			face: String(result.readers),
			lock: String(result.plan.doors),
			controller: result.plan.design === "integrated" ? "—" : "?"
		};
	});

	const highlightIds = computed(() => {
		if (mode.value === "scenario") return scenario.value?.routes || [];
		if (mode.value === "plan") return FOCUS_HIGHLIGHT[focusField.value] || PLAN_BASE_HIGHLIGHT;
		return null;
	});

	const handleMode = (next) => {
		mode.value = next;
		focusField.value = null;
	};

	const handleSelectDevice = (id) => {
		if (!accessHasDevice(id)) return;
		selectedDevice.value = id;
		if (mode.value !== "learn") {
			mode.value = "learn";
			focusField.value = null;
		}
	};

	const handleScenario = (id) => {
		if (!accessHasScenario(id)) return;
		scenarioId.value = id;
		routeAnimKey.value += 1;
	};

	const handleResetPlan = () => {
		Object.assign(plan, { ...DEFAULT_ACCESS_PLAN });
		focusField.value = null;
		moreOpen.value = false;
		bomOpen.value = false;
		roleOpen.value = false;
	};

	return {
		mode,
		selectedDevice,
		scenarioId,
		diagramCollapsed,
		focusField,
		moreOpen,
		bomOpen,
		roleOpen,
		plan,
		bom,
		scenario,
		device,
		scenarioList,
		nodeBadges,
		highlightIds,
		routeAnimKey,
		handleMode,
		handleSelectDevice,
		handleScenario,
		handleResetPlan,
		handleFocusField: (field) => {
			focusField.value = field;
		},
		handleBlurField: () => {
			focusField.value = null;
		}
	};
};

export const provideAccessStudio = () => {
	const studio = createAccessStudio();
	provide(ACCESS_STUDIO_KEY, studio);
	return studio;
};

export const useAccessStudio = () => {
	const studio = inject(ACCESS_STUDIO_KEY, null);
	if (!studio) {
		throw new Error("useAccessStudio() requires provideAccessStudio() in a parent.");
	}
	return studio;
};
