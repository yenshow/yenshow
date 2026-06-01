<template>
	<div class="min-h-screen flex items-center justify-center px-4 py-16">
		<div class="w-full max-w-xl bg-white rounded-lg p-8">
			<div class="text-center mb-8">
				<h1 class="text-3xl font-bold text-primary mb-2">{{ t("licenseActivate.title") }}</h1>
			</div>

			<div class="space-y-6">
				<!-- 步驟 1：上傳 BA 請求檔 -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<StepHeader :step="1" :title="t('licenseActivate.step1Title')" />

					<label
						class="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-gray-50 transition mb-6"
						tabindex="0"
						role="button"
						:aria-label="t('licenseActivate.uploadHint')"
						@keydown.enter.prevent="fileInputRef?.click()"
						@keydown.space.prevent="fileInputRef?.click()"
					>
						<div class="text-center px-2">
							<svg class="mx-auto h-7 w-7 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
								/>
							</svg>
							<p class="text-sm text-gray-500">{{ requestFile ? requestFile.name : t("licenseActivate.uploadHint") }}</p>
						</div>
						<input ref="fileInputRef" type="file" accept=".txt,.json,text/plain,application/json" class="hidden" @change="handleFileUpload" />
					</label>
				</div>

				<!-- 步驟 2：產生回應檔 -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<StepHeader :step="2" :title="t('licenseActivate.step2Title')" />
					<p class="text-sm text-gray-500 mb-4">{{ t("licenseActivate.step2Desc") }}</p>
					<ActionButton :loading="loading" :disabled="!requestBody" :label="t('licenseActivate.submit')" @click="handleSubmit" />
					<ResultDisplay :result="result" />
				</div>

				<!-- 步驟 3 -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<StepHeader :step="3" :title="t('licenseActivate.step3Title')" />
					<p class="text-sm text-gray-500">{{ t("licenseActivate.step3Desc") }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, h, defineComponent } from "vue";

const { public: publicConfig } = useRuntimeConfig();
const apiBaseUrl = publicConfig.apiBaseUrl;
const { t, locale } = useI18n();

usePageSeo({
	title: ` - ${t("licenseActivate.title")}`,
	description: t("licenseActivate.title"),
	path: "/license/activate",
	noindex: true
});

/** 與 BA-system / 授權平台 feature keys 對齊 */
const FEATURE_LABELS = {
	people_counting: { zh: "人流統計", en: "People Counting" },
	lighting: { zh: "照明系統", en: "Lighting" },
	drainage: { zh: "排水系統", en: "Drainage" },
	fire: { zh: "消防系統", en: "Fire" },
	emergency_rescue: { zh: "緊急求救", en: "Emergency Rescue" },
	environment: { zh: "環境品質", en: "Environment" },
	surveillance: { zh: "影像監控", en: "Surveillance" },
	vehicle_access: { zh: "車輛進出", en: "Vehicle Access" }
};

const getLang = () => (locale.value?.startsWith("en") ? "en" : "zh");
const getFeatureLabel = (v) => FEATURE_LABELS[v]?.[getLang()] || v;

const StepHeader = defineComponent({
	props: { step: Number, title: String },
	setup(props) {
		return () =>
			h("div", { class: "flex items-center gap-3 mb-3" }, [
				h("span", { class: "flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-bold" }, String(props.step)),
				h("h3", { class: "font-medium text-gray-800" }, props.title)
			]);
	}
});

const ActionButton = defineComponent({
	props: { loading: Boolean, disabled: Boolean, label: String },
	emits: ["click"],
	setup(props, { emit }) {
		return () =>
			h(
				"button",
				{
					type: "button",
					onClick: () => emit("click"),
					disabled: props.disabled || props.loading,
					class:
						"w-full py-3 rounded-lg font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2",
					tabindex: 0
				},
				[
					props.loading &&
						h("span", {
							class: "animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"
						}),
					props.loading ? t("licenseActivate.processing") : props.label
				]
			);
	}
});

const ResultDisplay = defineComponent({
	props: { result: Object },
	setup(props) {
		return () => {
			if (!props.result) return null;
			const ok = props.result.success;
			const cls = ok ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-800";
			const children = [h("p", { class: "font-medium mb-1" }, props.result.title), h("p", {}, props.result.message)];
			if (ok) {
				if (props.result.isExtension) {
					children.push(h("p", { class: "mt-2 text-base text-green-700/90" }, t("licenseActivate.extensionNote")));
				}
				if (props.result.features?.length) {
					children.push(
						h("div", { class: "mt-3 flex flex-wrap gap-1.5 items-center" }, [
							h("span", { class: "text-base font-medium mr-1" }, `${t("licenseActivate.featuresLabel")}:`),
							...props.result.features.map((f) => h("span", { class: "px-2 py-0.5 rounded text-base bg-green-100 text-green-700", key: f }, getFeatureLabel(f)))
						])
					);
				}
			}
			return h("div", { class: `rounded-lg p-4 text-sm mt-4 ${cls}` }, children);
		};
	}
});

const parseMessages = () => ({
	fileError: t("licenseActivate.fileError"),
	fileMissingLK: t("licenseActivate.fileMissingLK"),
	fileMissingFP: t("licenseActivate.fileMissingFP"),
	fileInvalidBase64: t("licenseActivate.fileInvalidBase64")
});

const toLicenseBody = (lk, fp, msg) => {
	if (lk == null || String(lk).trim() === "") throw new Error(msg.fileMissingLK);
	if (fp == null || String(fp).trim() === "") throw new Error(msg.fileMissingFP);
	return { licenseKey: String(lk).trim(), deviceFingerprint: String(fp).trim() };
};

const parseOfflineRequestText = (rawText, msg) => {
	const trimmed = rawText.trim();
	if (!trimmed) throw new Error(msg.fileError);

	let decoded;
	try {
		decoded = atob(trimmed.replace(/\s/g, ""));
	} catch {
		throw new Error(msg.fileInvalidBase64);
	}

	let parsed;
	try {
		parsed = JSON.parse(decoded);
	} catch {
		throw new Error(msg.fileInvalidBase64);
	}

	if (typeof parsed === "string") {
		try {
			parsed = JSON.parse(parsed);
		} catch {
			throw new Error(msg.fileInvalidBase64);
		}
	}

	if (Array.isArray(parsed)) {
		return toLicenseBody(parsed[0], parsed[1], msg);
	}
	if (parsed && typeof parsed === "object") {
		return toLicenseBody(parsed.licenseKey, parsed.deviceFingerprint, msg);
	}
	throw new Error(msg.fileError);
};

const fileInputRef = ref(null);
const loading = ref(false);
const result = ref(null);
const requestFile = ref(null);
const parsedFromFile = ref(null);

const requestBody = computed(() => parsedFromFile.value);

const handleFileUpload = (event) => {
	const file = event.target.files?.[0];
	if (!file) return;
	requestFile.value = file;
	parsedFromFile.value = null;
	result.value = null;
	const msg = parseMessages();
	const reader = new FileReader();
	reader.onload = (e) => {
		try {
			parsedFromFile.value = parseOfflineRequestText(String(e.target.result), msg);
		} catch (err) {
			result.value = {
				success: false,
				title: t("licenseActivate.errorTitle"),
				message: err.message || msg.fileError
			};
		}
	};
	reader.readAsText(file);
};

const downloadJson = (data, prefix) => {
	const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	const lkShort = (data.licenseKey || "unknown").replace(/-/g, "").slice(0, 8);
	a.download = `${prefix}-${lkShort}.json`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
};

const errorFromFetch = (err) => {
	const errData = err?.data || err?.response?._data || {};
	return {
		success: false,
		title: t("licenseActivate.errorTitle"),
		message: errData.message || err.message || t("licenseActivate.networkError")
	};
};

const handleSubmit = async () => {
	const body = requestBody.value;
	if (!body || loading.value) return;

	loading.value = true;
	result.value = null;
	try {
		const res = await $fetch(`${apiBaseUrl}/api/license/offline-activate`, {
			method: "POST",
			body
		});
		const data = res?.result;
		if (!data) {
			result.value = {
				success: false,
				title: t("licenseActivate.errorTitle"),
				message: res?.message || t("licenseActivate.serverError")
			};
			return;
		}
		downloadJson(data, "license-response");
		result.value = {
			success: true,
			title: t("licenseActivate.successTitle"),
			message: t("licenseActivate.successMessage"),
			features: data.features || [],
			isExtension: Boolean(data.isExtension)
		};
	} catch (err) {
		result.value = errorFromFetch(err);
	} finally {
		loading.value = false;
	}
};
</script>
