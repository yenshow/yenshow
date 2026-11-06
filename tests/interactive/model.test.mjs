import test from "node:test";
import assert from "node:assert/strict";
import {
	normalizePlan,
	accessBOM,
	cameraStorage,
	accessDecision,
	examplePermission,
	planSummary,
	validateLead
} from "../../utils/interactive/model.js";

test("8-door baseline counts only assumption-based items", () => {
	const x = accessBOM({ doors: 8, people: 300, direction: "entry" });
	assert.equal(x.readers, 8);
	assert.equal(x.rows.find((r) => r.id === "lock").qty, 8);
	assert.equal(x.rows.find((r) => r.id === "sensor").qty, 8);
	assert.equal(x.rows.find((r) => r.id === "controller").qty, null);
	assert.equal(x.rows.find((r) => r.id === "network").qty, null);
	assert.equal(x.rows.find((r) => r.id === "platform").qty, 1);
});

test("bidirectional doubles terminal count, NOT controllers", () => {
	const x = accessBOM({ doors: 8, direction: "both", design: "separate" });
	assert.equal(x.readers, 16);
	assert.equal(x.rows.find((r) => r.id === "controller").qty, null);
});

test("plan normalization guards wild or bad inputs", () => {
	assert.equal(normalizePlan({ doors: 999, people: "nan" }).doors, 60);
	assert.equal(normalizePlan({ doors: -10, people: "nan" }).people, 300);
});

test("camera capacity calculation: 16 cameras * 4 Mbps * 30 days", () => {
	const s = cameraStorage({ cameras: 16, bitrateMbps: 4, days: 30 });
	assert.ok(Math.abs(s.rawTB - 20.736) < 1e-8);
	assert.ok(Math.abs(s.planningTB - 24.8832) < 1e-8);
	assert.equal(s.aggregateMbps, 64);
});

test("access permission denies unknown, no door, time restrictions", () => {
	assert.equal(accessDecision({ known: false }).status, "deny");
	assert.equal(accessDecision({ doorPermission: false }).status, "deny");
	assert.equal(accessDecision({ timePermission: false }).status, "deny");
	assert.equal(accessDecision({ offline: "no-cache" }).status, "deny");
	assert.equal(accessDecision({ offline: "local-cache" }).status, "grant");
	assert.equal(accessDecision({ fire: true }).status, "emergency");
});

test("example permissions are explicitly illustrative", () => {
	assert.equal(examplePermission({ role: "it", door: "D06" }).allow, true);
	assert.equal(examplePermission({ role: "employee", door: "D06" }).allow, false);
	assert.equal(examplePermission({ role: "employee", door: "D06" }).reasonKey, "no_door");
	assert.equal(examplePermission({ role: "management", door: "D01", period: "offhours" }).allow, false);
	assert.equal(examplePermission({ role: "management", door: "D01", period: "offhours" }).reasonKey, "offhours");
});

test("plan summary avoids invented vendor price, includes 8/300", () => {
	const catalog = {
		"interactive.access.summary.title": "遠岫科技｜門禁解決方案初步需求摘要（非正式報價）",
		"interactive.access.summary.divider": "===",
		"interactive.access.summary.line_scale": "場域：{sites} 個｜需求門數：{doors} 道｜預估使用者：{people} 人",
		"interactive.access.summary.line_mode": "通行模式：{direction}｜控制方式：{design}",
		"interactive.access.summary.core": "核心功能",
		"interactive.access.summary.section_bom": "【設備】",
		"interactive.access.summary.pending": "待勘查／選型",
		"interactive.access.summary.readers_note": "讀取端 {readers}",
		"interactive.access.summary.todo": "待確認",
		"interactive.access.summary.cost": "費用",
		"interactive.access.summary.disclaimer": "非正式",
		"interactive.access.summary.direction_entry": "單側辨識",
		"interactive.access.summary.direction_both": "雙側辨識",
		"interactive.access.summary.design_separate": "獨立控制器",
		"interactive.access.summary.design_integrated": "一體式（待驗證）",
		"interactive.access.bom_items.unit_device": "台",
		"interactive.access.bom_items.unit_set": "組",
		"interactive.access.bom_items.unit_suite": "套",
		"interactive.access.bom_items.unit_lot": "式"
	};
	const t = (key, params = {}) => {
		if (key.startsWith("interactive.access.bom_items.") && key.endsWith(".name")) {
			return key.split(".")[3];
		}
		if (key.includes(".basis") || key.includes("basis_")) return "basis";
		let text = catalog[key] || key;
		return String(text).replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? ""));
	};
	const s = planSummary({ doors: 8, people: 300 }, t);
	assert.match(s, /300 人/);
	assert.match(s, /8 道/);
	assert.match(s, /非正式報價/);
});

test("lead requires name, contact route and explicit consent", () => {
	const ok = {
		company: "遠岫科技",
		contact: "測試聯絡人",
		email: "dev@example.com",
		phone: "",
		note: "需求",
		consent: true
	};
	assert.deepEqual(validateLead(ok), {});
	assert.ok(validateLead({ ...ok, consent: false }).consent);
	assert.ok(validateLead({ ...ok, email: "bad" }).email);
});
