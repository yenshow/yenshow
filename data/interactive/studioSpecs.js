/** Registry for upgraded interactive studios (intercom / parking / visitor / platform). */

import {
	DEFAULT_INTERCOM_PLAN,
	INTERCOM_DEVICE_IDS,
	INTERCOM_FOCUS_HIGHLIGHT,
	INTERCOM_PLAN_BASE_HIGHLIGHT,
	INTERCOM_SCENARIO_IDS,
	intercomDiagram,
	intercomDeviceProducts,
	intercomHasDevice,
	intercomHasScenario,
	intercomScenarios
} from "~/data/interactive/intercomContent.js";
import {
	DEFAULT_PARKING_PLAN,
	PARKING_DEVICE_IDS,
	PARKING_FOCUS_HIGHLIGHT,
	PARKING_PLAN_BASE_HIGHLIGHT,
	PARKING_SCENARIO_IDS,
	parkingDiagram,
	parkingDeviceProducts,
	parkingHasDevice,
	parkingHasScenario,
	parkingScenarios
} from "~/data/interactive/parkingContent.js";
import {
	DEFAULT_PLATFORM_PLAN,
	PLATFORM_DEVICE_IDS,
	PLATFORM_FOCUS_HIGHLIGHT,
	PLATFORM_PLAN_BASE_HIGHLIGHT,
	PLATFORM_SCENARIO_IDS,
	platformDiagram,
	platformHasDevice,
	platformHasScenario,
	platformScenarios
} from "~/data/interactive/platformContent.js";
import {
	DEFAULT_VISITOR_PLAN,
	VISITOR_DEVICE_IDS,
	VISITOR_FOCUS_HIGHLIGHT,
	VISITOR_PLAN_BASE_HIGHLIGHT,
	VISITOR_SCENARIO_IDS,
	visitorDiagram,
	visitorDeviceProducts,
	visitorHasDevice,
	visitorHasScenario,
	visitorScenarios
} from "~/data/interactive/visitorContent.js";
import { intercomBOM, parkingBOM, platformBOM, visitorBOM } from "~/utils/interactive/model.js";

export const STUDIO_MODULE_IDS = Object.freeze(["intercom", "parking", "visitor", "platform"]);

const specs = Object.freeze({
	intercom: {
		id: "intercom",
		i18nRoot: "interactive.intercom",
		diagram: intercomDiagram,
		deviceProducts: intercomDeviceProducts,
		deviceIds: INTERCOM_DEVICE_IDS,
		scenarioIds: INTERCOM_SCENARIO_IDS,
		scenarios: intercomScenarios,
		defaultPlan: DEFAULT_INTERCOM_PLAN,
		planBaseHighlight: INTERCOM_PLAN_BASE_HIGHLIGHT,
		focusHighlight: INTERCOM_FOCUS_HIGHLIGHT,
		hasDevice: intercomHasDevice,
		hasScenario: intercomHasScenario,
		computeBom: intercomBOM,
		disabledPlanNodes: (bom) => bom.withCenter ? [] : ["center"],
		badgeNodes: (bom) => ({
			outdoor: String(bom.outdoors),
			indoor: String(bom.indoors),
			...(bom.withCenter ? { center: "1" } : {})
		}),
		kpiKeys: [
			{ labelKey: "kpi_outdoors", valueKey: "outdoors" },
			{ labelKey: "kpi_indoors", valueKey: "indoors" },
			{ labelKey: "kpi_center", valueKey: "centerLabel" }
		]
	},
	parking: {
		id: "parking",
		i18nRoot: "interactive.parking",
		diagram: parkingDiagram,
		deviceProducts: parkingDeviceProducts,
		deviceIds: PARKING_DEVICE_IDS,
		scenarioIds: PARKING_SCENARIO_IDS,
		scenarios: parkingScenarios,
		defaultPlan: DEFAULT_PARKING_PLAN,
		planBaseHighlight: PARKING_PLAN_BASE_HIGHLIGHT,
		focusHighlight: PARKING_FOCUS_HIGHLIGHT,
		hasDevice: parkingHasDevice,
		hasScenario: parkingHasScenario,
		computeBom: parkingBOM,
		badgeNodes: (bom) => ({
			camera: String(bom.cameras),
			barrier: String(bom.barriers),
			sensor: String(bom.barriers)
		}),
		kpiKeys: [
			{ labelKey: "kpi_cameras", valueKey: "cameras" },
			{ labelKey: "kpi_barriers", valueKey: "barriers" },
			{ labelKey: "kpi_allowlist", valueKey: "allowlistPeople" }
		]
	},
	visitor: {
		id: "visitor",
		i18nRoot: "interactive.visitor",
		diagram: visitorDiagram,
		deviceProducts: visitorDeviceProducts,
		deviceIds: VISITOR_DEVICE_IDS,
		scenarioIds: VISITOR_SCENARIO_IDS,
		scenarios: visitorScenarios,
		defaultPlan: DEFAULT_VISITOR_PLAN,
		planBaseHighlight: VISITOR_PLAN_BASE_HIGHLIGHT,
		focusHighlight: VISITOR_FOCUS_HIGHLIGHT,
		hasDevice: visitorHasDevice,
		hasScenario: visitorHasScenario,
		computeBom: visitorBOM,
		disabledPlanNodes: (bom) => bom.issueBadge ? [] : ["badge"],
		badgeNodes: (bom) => ({
			verify: String(bom.checkpoints)
		}),
		kpiKeys: [
			{ labelKey: "kpi_daily", valueKey: "dailyVisitors" },
			{ labelKey: "kpi_checkpoints", valueKey: "checkpoints" },
			{ labelKey: "kpi_badge", valueKey: "badgeLabel" }
		]
	},
	platform: {
		id: "platform",
		i18nRoot: "interactive.platform",
		diagram: platformDiagram,
		deviceProducts: { events: "YSOP" },
		deviceIds: PLATFORM_DEVICE_IDS,
		scenarioIds: PLATFORM_SCENARIO_IDS,
		scenarios: platformScenarios,
		defaultPlan: DEFAULT_PLATFORM_PLAN,
		planBaseHighlight: PLATFORM_PLAN_BASE_HIGHLIGHT,
		focusHighlight: PLATFORM_FOCUS_HIGHLIGHT,
		hasDevice: platformHasDevice,
		hasScenario: platformHasScenario,
		computeBom: platformBOM,
		disabledPlanNodes: (bom) => bom.multiSite ? [] : ["multi"],
		badgeNodes: (bom) => ({
			ops: String(bom.operators),
			...(bom.multiSite ? { multi: String(bom.sites) } : {})
		}),
		kpiKeys: [
			{ labelKey: "kpi_sites", valueKey: "sites" },
			{ labelKey: "kpi_linked", valueKey: "linkedSystems" },
			{ labelKey: "kpi_operators", valueKey: "operators" }
		]
	}
});

export const studioHasModule = (id) => STUDIO_MODULE_IDS.includes(id);

export const getStudioSpec = (id) => {
	if (!studioHasModule(id)) return null;
	return specs[id];
};

export const getStudioDiagram = (id) => getStudioSpec(id)?.diagram || null;
