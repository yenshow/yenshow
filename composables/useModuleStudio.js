import { computed, inject, provide, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { getStudioSpec } from "~/data/interactive/studioSpecs.js";
import { modulePlanSummary } from "~/utils/interactive/model.js";

const STUDIO_KEYS = {
	intercom: Symbol("intercomStudio"),
	parking: Symbol("parkingStudio"),
	visitor: Symbol("visitorStudio"),
	platform: Symbol("platformStudio")
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

export const createModuleStudio = (moduleId) => {
	const spec = getStudioSpec(moduleId);
	if (!spec) {
		throw new Error(`Unknown studio module: ${moduleId}`);
	}

	const { t, tm, rt } = useI18n();
	const root = spec.i18nRoot;
	const mode = ref("learn");
	const selectedDevice = ref(spec.diagram.defaultNodeId);
	const scenarioId = ref(spec.scenarioIds[0]);
	const diagramCollapsed = ref(false);
	const focusField = ref(null);
	const bomOpen = ref(false);
	const routeAnimKey = ref(0);
	const plan = reactive({ ...spec.defaultPlan });

	const scenarioMeta = computed(
		() => spec.scenarios[scenarioId.value] || spec.scenarios[spec.scenarioIds[0]]
	);

	const scenario = computed(() => {
		const id = scenarioId.value;
		const meta = scenarioMeta.value;
		const base = `${root}.scenarios.${id}`;
		const outcomes = {};
		for (const key of meta.outcomeKeys || []) {
			outcomes[key] = t(`${base}.${key}`);
		}
		return {
			id,
			badge: meta.badge,
			status: meta.status,
			routes: meta.routes,
			title: t(`${base}.title`),
			desc: t(`${base}.desc`),
			steps: resolveMessageList(tm, rt, `${base}.steps`),
			outcomes
		};
	});

	const device = computed(() => {
		const id = spec.hasDevice(selectedDevice.value)
			? selectedDevice.value
			: spec.diagram.defaultNodeId;
		return {
			id,
			title: t(`${root}.nodes.${id}`),
			desc: t(`${root}.devices.${id}.desc`),
			note: t(`${root}.devices.${id}.note`)
		};
	});

	const scenarioList = computed(() =>
		spec.scenarioIds.map((id) => ({
			id,
			label: t(`${root}.scenarios.${id}.label`)
		}))
	);

	const bom = computed(() => {
		const result = spec.computeBom(plan);
		const extras = {};
		if (moduleId === "intercom") {
			extras.centerLabel = result.withCenter
				? t(`${root}.kpi_center_yes`)
				: t(`${root}.kpi_center_no`);
		}
		if (moduleId === "visitor") {
			extras.badgeLabel = result.issueBadge
				? t(`${root}.kpi_badge_yes`)
				: t(`${root}.kpi_badge_no`);
		}
		if (moduleId === "platform") {
			extras.multiSiteLabel = result.multiSite
				? t(`${root}.kpi_multisite_yes`)
				: t(`${root}.kpi_multisite_no`);
		}
		return { ...result, ...extras };
	});

	const nodeBadges = computed(() => {
		if (mode.value !== "plan") return null;
		return spec.badgeNodes(bom.value);
	});

	const highlightIds = computed(() => {
		if (mode.value === "scenario") return scenario.value?.routes || [];
		if (mode.value === "plan") {
			return spec.focusHighlight[focusField.value] || spec.planBaseHighlight;
		}
		return null;
	});

	const summaryText = computed(() => modulePlanSummary(root, bom.value, t));

	const handleMode = (next) => {
		mode.value = next;
		focusField.value = null;
	};

	const handleSelectDevice = (id) => {
		if (!spec.hasDevice(id)) return;
		selectedDevice.value = id;
		if (mode.value !== "learn") {
			mode.value = "learn";
			focusField.value = null;
		}
	};

	const handleScenario = (id) => {
		if (!spec.hasScenario(id)) return;
		scenarioId.value = id;
		routeAnimKey.value += 1;
	};

	const handleResetPlan = () => {
		Object.assign(plan, { ...spec.defaultPlan });
		focusField.value = null;
		bomOpen.value = false;
	};

	const normalizePlanFields = () => {
		Object.assign(plan, spec.computeBom(plan).plan);
		focusField.value = null;
	};

	return {
		moduleId,
		spec,
		i18nRoot: root,
		mode,
		selectedDevice,
		scenarioId,
		diagramCollapsed,
		focusField,
		bomOpen,
		plan,
		bom,
		scenario,
		device,
		scenarioList,
		nodeBadges,
		highlightIds,
		routeAnimKey,
		summaryText,
		handleMode,
		handleSelectDevice,
		handleScenario,
		handleResetPlan,
		normalizePlanFields,
		handleFocusField: (field) => {
			focusField.value = field;
		},
		handleBlurField: () => {
			focusField.value = null;
		}
	};
};

export const provideModuleStudio = (moduleId) => {
	const studio = createModuleStudio(moduleId);
	provide(STUDIO_KEYS[moduleId], studio);
	return studio;
};

export const useModuleStudio = (moduleId) => {
	const key = STUDIO_KEYS[moduleId];
	if (!key) {
		throw new Error(`Unknown studio module: ${moduleId}`);
	}
	const studio = inject(key, null);
	if (!studio) {
		throw new Error(`useModuleStudio('${moduleId}') requires provideModuleStudio() in a parent.`);
	}
	return studio;
};
