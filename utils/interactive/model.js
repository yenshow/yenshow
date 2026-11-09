/**
 * YenShow Interactive Security Center - pure domain logic (ported from handoff model.mjs).
 * Reference planning calculations ONLY. No vendor capacities, prices or real access control.
 */
export const DEFAULT_ACCESS_PLAN = Object.freeze({
	doors: 8,
	people: 300,
	sites: 1,
	direction: "entry",
	design: "separate",
	context: "factory"
});

export const positiveInteger = (value, min, max, fallback) => {
	const n = Number(value);
	return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : fallback;
};

/** Planning-only assumption for separate controllers; not a vendor capacity promise. */
export const PLANNING_DOORS_PER_CONTROLLER = 4;

/** Provisional controller count for BOM / diagram badges. */
export const estimateControllers = (doors, design = "separate") => {
	if (design === "integrated") return null;
	const n = positiveInteger(doors, 1, 60, DEFAULT_ACCESS_PLAN.doors);
	return Math.ceil(n / PLANNING_DOORS_PER_CONTROLLER);
};

export const normalizePlan = (input = {}) => ({
	doors: positiveInteger(input.doors, 1, 60, 8),
	people: positiveInteger(input.people, 10, 3000, 300),
	sites: positiveInteger(input.sites, 1, 10, 1),
	direction: input.direction === "both" ? "both" : "entry",
	design: input.design === "integrated" ? "integrated" : "separate",
	context: ["factory", "office", "other"].includes(input.context) ? input.context : "factory"
});

/** Counts are provisional; copy is resolved via i18n keys in the UI. */
export const accessBOM = (input = {}) => {
	const p = normalizePlan(input);
	const readers = p.doors * (p.direction === "both" ? 2 : 1);
	const controllers = estimateControllers(p.doors, p.design);
	const rows = [
		{
			id: "reader",
			qty: readers,
			unitKey: "unit_device",
			basisKey: p.direction === "both" ? "basis_both" : "basis_entry",
			basisParams: { doors: p.doors },
			noteKey: "note"
		},
		{
			id: "controller",
			qty: controllers,
			unitKey: "unit_device",
			basisKey: p.design === "separate" ? "basis_separate" : "basis_integrated",
			basisParams:
				p.design === "separate"
					? { doors: p.doors, per: PLANNING_DOORS_PER_CONTROLLER, qty: controllers }
					: {},
			noteKey: p.design === "separate" ? "note_separate" : "note_integrated"
		},
		{
			id: "lock",
			qty: p.doors,
			unitKey: "unit_set",
			basisKey: "basis",
			basisParams: {},
			noteKey: "note"
		},
		{
			id: "sensor",
			qty: p.doors,
			unitKey: "unit_set",
			basisKey: "basis",
			basisParams: {},
			noteKey: "note"
		},
		{
			id: "exit",
			qty: null,
			unitKey: "unit_set",
			basisKey: "basis",
			basisParams: {},
			noteKey: "note"
		},
		{
			id: "psu",
			qty: null,
			unitKey: "unit_set",
			basisKey: "basis",
			basisParams: {},
			noteKey: "note"
		},
		{
			id: "network",
			qty: null,
			unitKey: "unit_device",
			basisKey: "basis",
			basisParams: {},
			noteKey: "note"
		},
		{
			id: "platform",
			qty: 1,
			unitKey: "unit_suite",
			basisKey: "basis",
			basisParams: { sites: p.sites, people: p.people, doors: p.doors },
			noteKey: "note"
		},
		{
			id: "wiring",
			qty: null,
			unitKey: "unit_lot",
			basisKey: "basis",
			basisParams: {},
			noteKey: "note"
		}
	];
	return {
		plan: p,
		readers,
		controllers,
		rows,
		preliminaryCount: { readers, locks: p.doors, sensors: p.doors, controllers },
		unknowns: rows.filter((r) => r.qty === null).length
	};
};

export const normalizeIntercomPlan = (input = {}) => ({
	outdoors: positiveInteger(input.outdoors, 1, 40, 2),
	indoors: positiveInteger(input.indoors, 1, 200, 8),
	withCenter: input.withCenter !== false
});

export const intercomBOM = (input = {}) => {
	const p = normalizeIntercomPlan(input);
	const rows = [
		{
			id: "outdoor",
			qty: p.outdoors,
			unitKey: "unit_device",
			basisKey: "basis",
			basisParams: { qty: p.outdoors },
			noteKey: "note"
		},
		{
			id: "indoor",
			qty: p.indoors,
			unitKey: "unit_device",
			basisKey: "basis",
			basisParams: { qty: p.indoors },
			noteKey: "note"
		},
		{
			id: "center",
			qty: p.withCenter ? 1 : 0,
			unitKey: "unit_device",
			basisKey: p.withCenter ? "basis_yes" : "basis_no",
			basisParams: {},
			noteKey: "note"
		},
		{
			id: "unlock",
			qty: p.outdoors,
			unitKey: "unit_set",
			basisKey: "basis",
			basisParams: { qty: p.outdoors },
			noteKey: "note"
		},
		{
			id: "network",
			qty: null,
			unitKey: "unit_lot",
			basisKey: "basis",
			basisParams: {},
			noteKey: "note"
		}
	];
	return {
		plan: p,
		outdoors: p.outdoors,
		indoors: p.indoors,
		withCenter: p.withCenter,
		rows,
		unknowns: rows.filter((r) => r.qty === null).length
	};
};

export const normalizeParkingPlan = (input = {}) => ({
	lanes: positiveInteger(input.lanes, 1, 20, 2),
	direction: input.direction === "both" ? "both" : "entry",
	allowlistPeople: positiveInteger(input.allowlistPeople, 10, 5000, 200)
});

export const parkingBOM = (input = {}) => {
	const p = normalizeParkingPlan(input);
	const cameras = p.lanes * (p.direction === "both" ? 2 : 1);
	const rows = [
		{
			id: "camera",
			qty: cameras,
			unitKey: "unit_device",
			basisKey: p.direction === "both" ? "basis_both" : "basis_entry",
			basisParams: { lanes: p.lanes },
			noteKey: "note"
		},
		{
			id: "recognize",
			qty: 1,
			unitKey: "unit_suite",
			basisKey: "basis",
			basisParams: { lanes: p.lanes },
			noteKey: "note"
		},
		{
			id: "controller",
			qty: p.lanes,
			unitKey: "unit_device",
			basisKey: "basis",
			basisParams: { lanes: p.lanes },
			noteKey: "note"
		},
		{
			id: "barrier",
			qty: p.lanes,
			unitKey: "unit_set",
			basisKey: "basis",
			basisParams: { lanes: p.lanes },
			noteKey: "note"
		},
		{
			id: "sensor",
			qty: p.lanes,
			unitKey: "unit_set",
			basisKey: "basis",
			basisParams: { lanes: p.lanes },
			noteKey: "note"
		},
		{
			id: "allowlist",
			qty: 1,
			unitKey: "unit_suite",
			basisKey: "basis",
			basisParams: { people: p.allowlistPeople },
			noteKey: "note"
		}
	];
	return {
		plan: p,
		cameras,
		barriers: p.lanes,
		allowlistPeople: p.allowlistPeople,
		rows,
		unknowns: rows.filter((r) => r.qty === null).length
	};
};

export const normalizeVisitorPlan = (input = {}) => ({
	dailyVisitors: positiveInteger(input.dailyVisitors, 5, 2000, 40),
	checkpoints: positiveInteger(input.checkpoints, 1, 10, 1),
	issueBadge: input.issueBadge !== false
});

export const visitorBOM = (input = {}) => {
	const p = normalizeVisitorPlan(input);
	const rows = [
		{
			id: "book",
			qty: 1,
			unitKey: "unit_suite",
			basisKey: "basis",
			basisParams: { daily: p.dailyVisitors },
			noteKey: "note"
		},
		{
			id: "verify",
			qty: p.checkpoints,
			unitKey: "unit_set",
			basisKey: "basis",
			basisParams: { qty: p.checkpoints },
			noteKey: "note"
		},
		{
			id: "reception",
			qty: Math.max(1, p.checkpoints),
			unitKey: "unit_set",
			basisKey: "basis",
			basisParams: { qty: Math.max(1, p.checkpoints) },
			noteKey: "note"
		},
		{
			id: "badge",
			qty: p.issueBadge ? null : 0,
			unitKey: "unit_lot",
			basisKey: p.issueBadge ? "basis_yes" : "basis_no",
			basisParams: { daily: p.dailyVisitors },
			noteKey: "note"
		},
		{
			id: "temp_access",
			qty: 1,
			unitKey: "unit_suite",
			basisKey: "basis",
			basisParams: {},
			noteKey: "note"
		}
	];
	return {
		plan: p,
		dailyVisitors: p.dailyVisitors,
		checkpoints: p.checkpoints,
		issueBadge: p.issueBadge,
		rows,
		unknowns: rows.filter((r) => r.qty === null).length
	};
};

export const normalizePlatformPlan = (input = {}) => ({
	sites: positiveInteger(input.sites, 1, 20, 2),
	linkedSystems: positiveInteger(input.linkedSystems, 1, 5, 3),
	operators: positiveInteger(input.operators, 1, 50, 4),
	multiSite: input.multiSite !== false
});

export const platformBOM = (input = {}) => {
	const p = normalizePlatformPlan(input);
	const rows = [
		{
			id: "core",
			qty: 1,
			unitKey: "unit_suite",
			basisKey: "basis",
			basisParams: { sites: p.sites, operators: p.operators },
			noteKey: "note"
		},
		{
			id: "ingest",
			qty: p.linkedSystems,
			unitKey: "unit_set",
			basisKey: "basis",
			basisParams: { qty: p.linkedSystems },
			noteKey: "note"
		},
		{
			id: "events",
			qty: 1,
			unitKey: "unit_suite",
			basisKey: "basis",
			basisParams: {},
			noteKey: "note"
		},
		{
			id: "ops",
			qty: p.operators,
			unitKey: "unit_seat",
			basisKey: "basis",
			basisParams: { qty: p.operators },
			noteKey: "note"
		},
		{
			id: "multi",
			qty: p.multiSite ? p.sites : 0,
			unitKey: "unit_site",
			basisKey: p.multiSite ? "basis_yes" : "basis_no",
			basisParams: { sites: p.sites },
			noteKey: "note"
		},
		{
			id: "license",
			qty: null,
			unitKey: "unit_lot",
			basisKey: "basis",
			basisParams: {},
			noteKey: "note"
		}
	];
	return {
		plan: p,
		sites: p.sites,
		linkedSystems: p.linkedSystems,
		operators: p.operators,
		multiSite: p.multiSite,
		rows,
		unknowns: rows.filter((r) => r.qty === null).length
	};
};

/** Generic module summary builder; `i18nRoot` e.g. interactive.intercom */
export const modulePlanSummary = (i18nRoot, bom, t) => {
	if (typeof t !== "function") {
		throw new Error("modulePlanSummary requires an i18n translator.");
	}
	const scale = { ...bom.plan };
	if (Object.hasOwn(scale, "withCenter")) {
		scale.centerText = scale.withCenter ? t(`${i18nRoot}.kpi_center_yes`) : t(`${i18nRoot}.kpi_center_no`);
	}
	if (Object.hasOwn(scale, "direction")) {
		scale.directionText =
			scale.direction === "both" ? t(`${i18nRoot}.direction_both`) : t(`${i18nRoot}.direction_entry`);
	}
	if (Object.hasOwn(scale, "issueBadge")) {
		scale.badgeText = scale.issueBadge ? t(`${i18nRoot}.kpi_badge_yes`) : t(`${i18nRoot}.kpi_badge_no`);
	}
	if (Object.hasOwn(scale, "multiSite")) {
		scale.multiSiteText = scale.multiSite
			? t(`${i18nRoot}.kpi_multisite_yes`)
			: t(`${i18nRoot}.kpi_multisite_no`);
	}
	const bomLines = bom.rows.map((row) => {
		const name = t(`${i18nRoot}.bom_items.${row.id}.name`);
		const unit = t(`${i18nRoot}.bom_items.${row.unitKey}`);
		const basis = t(`${i18nRoot}.bom_items.${row.id}.${row.basisKey}`, row.basisParams);
		const qty = row.qty === null ? t(`${i18nRoot}.summary.pending`) : `${row.qty} ${unit}`;
		return `- ${name}：${qty}（${basis}）`;
	});
	return [
		t(`${i18nRoot}.summary.title`),
		t(`${i18nRoot}.summary.divider`),
		t(`${i18nRoot}.summary.line_scale`, scale),
		t(`${i18nRoot}.summary.core`),
		"",
		t(`${i18nRoot}.summary.section_bom`),
		...bomLines,
		"",
		t(`${i18nRoot}.summary.todo`),
		t(`${i18nRoot}.summary.disclaimer`)
	].join("\n");
};

export const DEFAULT_CCTV_STORAGE = Object.freeze({
	cameras: 16,
	bitrateMbps: 4,
	days: 30,
	hoursPerDay: 24,
	reserveRatio: 0.2
});

export const normalizeCctvStorage = (input = {}) => {
	const bitrateRaw = Number(input.bitrateMbps);
	const hoursRaw = Number(input.hoursPerDay);
	return {
		cameras: positiveInteger(input.cameras, 1, 128, DEFAULT_CCTV_STORAGE.cameras),
		bitrateMbps: Number.isFinite(bitrateRaw)
			? Math.min(20, Math.max(0.5, Math.round(bitrateRaw * 2) / 2))
			: DEFAULT_CCTV_STORAGE.bitrateMbps,
		days: positiveInteger(input.days, 1, 365, DEFAULT_CCTV_STORAGE.days),
		hoursPerDay: Number.isFinite(hoursRaw)
			? Math.min(24, Math.max(1, Math.round(hoursRaw)))
			: DEFAULT_CCTV_STORAGE.hoursPerDay
	};
};

export const cameraStorage = ({
	cameras = DEFAULT_CCTV_STORAGE.cameras,
	bitrateMbps = DEFAULT_CCTV_STORAGE.bitrateMbps,
	days = DEFAULT_CCTV_STORAGE.days,
	hoursPerDay = DEFAULT_CCTV_STORAGE.hoursPerDay,
	reserveRatio = DEFAULT_CCTV_STORAGE.reserveRatio
} = {}) => {
	const normalized = normalizeCctvStorage({ cameras, bitrateMbps, days, hoursPerDay });
	const reserve = Math.min(1, Math.max(0, Number(reserveRatio) || DEFAULT_CCTV_STORAGE.reserveRatio));
	const rawTB =
		(((normalized.cameras * normalized.bitrateMbps * 1e6) / 8) *
			3600 *
			normalized.hoursPerDay *
			normalized.days) /
		1e12;
	return {
		count: normalized.cameras,
		bitrate: normalized.bitrateMbps,
		retention: normalized.days,
		hours: normalized.hoursPerDay,
		rawTB,
		planningTB: rawTB * (1 + reserve),
		aggregateMbps: Number((normalized.cameras * normalized.bitrateMbps).toFixed(2)),
		reserve,
		form: normalized
	};
};

export const accessDecision = ({
	known = true,
	doorPermission = true,
	timePermission = true,
	offline = "online",
	fire = false
} = {}) => {
	if (fire) {
		return {
			status: "emergency",
			label: "依逃生設計進入安全狀態",
			reason: "消防聯動的動作由核定的安全迴路與法規要求決定，不應依賴人臉驗證。"
		};
	}
	if (!known) return { status: "deny", label: "拒絕通行", reason: "未辨識為有效的已註冊身分。" };
	if (!doorPermission) return { status: "deny", label: "拒絕通行", reason: "這個身分沒有指定門區的通行權限。" };
	if (!timePermission) return { status: "deny", label: "拒絕通行", reason: "身分與門區有效，但不在授權時段內。" };
	if (offline === "no-cache") {
		return {
			status: "deny",
			label: "無法核准通行",
			reason: "網路中斷且沒有可使用的本地授權資料，不能假定會放行。"
		};
	}
	if (offline === "local-cache") {
		return {
			status: "grant",
			label: "本地核准（示範）",
			reason: "僅在設備支援且已儲存有效本地授權資料時，才可能離線核准。"
		};
	}
	return {
		status: "grant",
		label: "允許通行（模擬）",
		reason: "已完成身分、門區與時段三項授權條件判斷。"
	};
};

/** Build localized summary text; `t` is vue-i18n translator. */
export const planSummary = (input = {}, t) => {
	const { plan, rows, readers } = accessBOM(input);
	if (typeof t !== "function") {
		throw new Error("planSummary(input, t) requires an i18n translator.");
	}
	const direction =
		plan.direction === "both"
			? t("interactive.access.summary.direction_both")
			: t("interactive.access.summary.direction_entry");
	const design =
		plan.design === "separate"
			? t("interactive.access.summary.design_separate")
			: t("interactive.access.summary.design_integrated");
	const bomLines = rows.map((row) => {
		const name = t(`interactive.access.bom_items.${row.id}.name`);
		const unit = t(`interactive.access.bom_items.${row.unitKey}`);
		const basis = t(`interactive.access.bom_items.${row.id}.${row.basisKey}`, row.basisParams);
		const qty =
			row.qty === null ? t("interactive.access.summary.pending") : `${row.qty} ${unit}`;
		return `- ${name}：${qty}（${basis}）`;
	});
	return [
		t("interactive.access.summary.title"),
		t("interactive.access.summary.divider"),
		t("interactive.access.summary.line_scale", plan),
		t("interactive.access.summary.line_mode", { direction, design }),
		t("interactive.access.summary.core"),
		"",
		t("interactive.access.summary.section_bom"),
		...bomLines,
		"",
		t("interactive.access.summary.readers_note", { readers }),
		t("interactive.access.summary.todo"),
		t("interactive.access.summary.cost"),
		t("interactive.access.summary.disclaimer")
	].join("\n");
};

export const validateLead = (d) => {
	const errors = {};
	const company = (d.company || "").trim();
	const contact = (d.contact || "").trim();
	const email = (d.email || "").trim();
	const phone = (d.phone || "").trim();
	if (company.length < 2 || company.length > 100) errors.company = "請輸入 2–100 字的公司名稱";
	if (contact.length < 2 || contact.length > 60) errors.contact = "請輸入 2–60 字的聯絡人姓名";
	if (!email && !phone) errors.email = "請至少提供 Email 或電話";
	if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Email 格式不正確";
	if (phone && !/^[+()\d\s-]{7,30}$/.test(phone)) errors.phone = "電話格式不正確";
	if ((d.note || "").length > 1000) errors.note = "需求說明不可超過 1000 字";
	if (d.consent !== true) errors.consent = "請先閱讀並同意個人資料告知事項";
	return errors;
};
