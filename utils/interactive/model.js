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
			qty: null,
			unitKey: "unit_device",
			basisKey: p.design === "separate" ? "basis_separate" : "basis_integrated",
			basisParams: {},
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
		rows,
		preliminaryCount: { readers, locks: p.doors, sensors: p.doors },
		unknowns: rows.filter((r) => r.qty === null).length
	};
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

export const EXAMPLE_DOOR_IDS = Object.freeze(["D01", "D02", "D03", "D04", "D05", "D06", "D07", "D08"]);

const POLICY = Object.freeze({
	employee: new Set(["D01", "D02", "D03", "D07"]),
	management: new Set(["D01", "D02", "D03", "D04", "D05", "D07", "D08"]),
	it: new Set(["D01", "D02", "D03", "D04", "D06", "D07"]),
	logistics: new Set(["D01", "D05", "D08"])
});

export const examplePermission = ({ role = "employee", door = "D01", period = "workday" } = {}) => {
	if (!EXAMPLE_DOOR_IDS.includes(door)) return { allow: false, reasonKey: "unknown_door" };
	if (!Object.hasOwn(POLICY, role)) return { allow: false, reasonKey: "unknown_role" };
	if (!POLICY[role].has(door)) return { allow: false, reasonKey: "no_door" };
	if (period !== "workday") return { allow: false, reasonKey: "offhours" };
	return { allow: true, reasonKey: "ok" };
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
