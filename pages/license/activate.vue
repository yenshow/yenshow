<template>
	<div class="min-h-screen flex items-center justify-center px-4 py-16">
		<div class="w-full max-w-xl bg-white rounded-lg p-8">
			<!-- 標題 -->
			<div class="text-center mb-10">
				<h1 class="text-3xl font-bold text-primary mb-2">{{ t("title") }}</h1>
				<p class="text-gray-500">{{ t("subtitle") }}</p>
			</div>

			<!-- 模式切換：啟用 / 更新 -->
			<div class="flex rounded-lg overflow-hidden mb-8 border border-gray-200">
				<button
					@click="mode = 'activate'"
					:class="[
						'flex-1 py-3 px-4 text-sm font-medium transition-colors',
						mode === 'activate' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
					]"
					tabindex="0"
					:aria-label="t('modeActivate')"
				>
					{{ t("modeActivate") }}
				</button>
				<button
					@click="mode = 'refresh'"
					:class="[
						'flex-1 py-3 px-4 text-sm font-medium transition-colors',
						mode === 'refresh' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
					]"
					tabindex="0"
					:aria-label="t('modeRefresh')"
				>
					{{ t("modeRefresh") }}
				</button>
			</div>

			<!-- 離線啟用 -->
			<div v-if="mode === 'activate'" class="space-y-6">
				<!-- 步驟 1：上傳請求檔 -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div class="flex items-center gap-3 mb-4">
						<span class="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-bold">1</span>
						<h3 class="font-medium text-gray-800">{{ t("step1Title") }}</h3>
					</div>
					<p class="text-sm text-gray-500 mb-4">{{ t("step1Desc") }}</p>

					<label
						class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-gray-50 transition"
						tabindex="0"
						aria-label="上傳請求檔"
						@keydown.enter="$refs.fileInput.click()"
					>
						<div class="text-center">
							<svg class="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
							</svg>
							<p class="text-sm text-gray-500">
								{{ requestFile ? requestFile.name : t("uploadHint") }}
							</p>
						</div>
						<input ref="fileInput" type="file" accept=".json" class="hidden" @change="handleFileUpload" />
					</label>

					<div v-if="requestFileData" class="mt-4 p-3 bg-gray-50 rounded-lg text-sm font-mono space-y-1">
						<p><span class="text-gray-500">SN:</span> {{ requestFileData.serialNumber }}</p>
						<p><span class="text-gray-500">Device:</span> {{ requestFileData.deviceFingerprint }}</p>
					</div>
				</div>

				<!-- 步驟 2：送出並下載回應檔 -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div class="flex items-center gap-3 mb-4">
						<span class="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-bold">2</span>
						<h3 class="font-medium text-gray-800">{{ t("step2Title") }}</h3>
					</div>
					<p class="text-sm text-gray-500 mb-4">{{ t("step2Desc") }}</p>

					<button
						@click="handleOfflineActivate"
						:disabled="!requestFileData || loading"
						class="w-full py-3 rounded-lg font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
						tabindex="0"
						aria-label="產生回應檔"
					>
						<span v-if="loading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
						{{ loading ? t("processing") : t("generateResponse") }}
					</button>

					<ResultDisplay :result="result" />
				</div>

				<!-- 步驟 3：匯入回應檔 -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div class="flex items-center gap-3 mb-4">
						<span class="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-bold">3</span>
						<h3 class="font-medium text-gray-800">{{ t("step3Title") }}</h3>
					</div>
					<p class="text-sm text-gray-500">{{ t("step3Desc") }}</p>
				</div>
			</div>

			<!-- 更新授權（追加 Feature 後重新產生回應檔） -->
			<div v-if="mode === 'refresh'" class="space-y-6">
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div class="flex items-center gap-3 mb-4">
						<svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
						<h3 class="font-medium text-gray-800">{{ t("refreshTitle") }}</h3>
					</div>
					<p class="text-sm text-gray-500 mb-6">{{ t("refreshDesc") }}</p>

					<div class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Serial Number</label>
							<input
								v-model="refreshSN"
								type="text"
								:placeholder="t('snPlaceholder')"
								class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition font-mono"
								@keydown.enter="handleOfflineRefresh"
							/>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">{{ t("deviceFpLabel") }} <span class="text-gray-400 text-xs">({{ t("optional") }})</span></label>
							<input
								v-model="refreshDeviceFp"
								type="text"
								:placeholder="t('deviceFpPlaceholder')"
								class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition font-mono"
							/>
						</div>

						<button
							@click="handleOfflineRefresh"
							:disabled="!refreshSN.trim() || loading"
							class="w-full py-3 rounded-lg font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
							tabindex="0"
							:aria-label="t('refreshBtn')"
						>
							<span v-if="loading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
							{{ loading ? t("processing") : t("refreshBtn") }}
						</button>

						<ResultDisplay :result="result" />
					</div>
				</div>

				<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
					<p class="font-medium mb-1">{{ t("refreshNote") }}</p>
					<p>{{ t("refreshNoteDetail") }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, h, defineComponent } from "vue";

const { public: publicConfig } = useRuntimeConfig();
const apiBaseUrl = publicConfig.apiBaseUrl;

const { locale } = useI18n();

const FEATURE_LABELS = {
	people_counting: { zh: "人流計數", en: "People Counting" },
	lighting: { zh: "燈控管理", en: "Lighting" },
	environment: { zh: "環境監測", en: "Environment" },
	surveillance: { zh: "影像監控", en: "Surveillance" },
	vehicle_access: { zh: "車輛門禁", en: "Vehicle Access" }
};

const getLang = () => (locale.value?.startsWith("en") ? "en" : "zh");

const getFeatureLabel = (featureValue) => {
	const label = FEATURE_LABELS[featureValue];
	return label ? label[getLang()] : featureValue;
};

// 結果顯示子元件
const ResultDisplay = defineComponent({
	props: { result: Object },
	setup(props) {
		return () => {
			if (!props.result) return null;
			const cls = props.result.success
				? "bg-green-50 border border-green-200 text-green-800"
				: "bg-red-50 border border-red-200 text-red-800";

			const children = [
				h("p", { class: "font-medium mb-1" }, props.result.title),
				h("p", {}, props.result.message),
			];

			if (props.result.features?.length) {
				children.push(
					h("div", { class: "mt-3 flex flex-wrap gap-1.5" }, [
						h("span", { class: "text-xs font-medium mr-1" }, (getLang() === "zh" ? "授權模組" : "Modules") + ":"),
						...props.result.features.map((f) =>
							h("span", { class: "px-2 py-0.5 rounded text-xs bg-green-100 text-green-700", key: f }, getFeatureLabel(f))
						),
					])
				);
			}

			return h("div", { class: `rounded-lg p-4 text-sm mt-4 ${cls}` }, children);
		};
	},
});

const t = (key) => {
	const translations = {
		zh: {
			title: "BA 系統離線授權",
			subtitle: "處理離線設備的授權啟用與更新",
			modeActivate: "啟用授權",
			modeRefresh: "更新授權",
			snPlaceholder: "請輸入 Serial Number（例：SN-20260318-1234）",
			processing: "處理中...",
			step1Title: "上傳請求檔",
			step1Desc: "將離線設備產生的請求檔（.json）上傳至此處。",
			step2Title: "產生回應檔",
			step2Desc: "系統將驗證請求並產生帶簽名的回應檔，請下載後帶回離線設備匯入。",
			step3Title: "匯入回應檔",
			step3Desc: "將下載的回應檔帶回離線設備匯入，即可完成啟用。",
			uploadHint: "點擊或拖曳上傳請求檔（.json）",
			generateResponse: "產生並下載回應檔",
			errorTitle: "操作失敗",
			offlineSuccessTitle: "回應檔已產生",
			offlineSuccessMessage: "回應檔已自動下載，請將檔案帶回離線設備匯入。",
			fileError: "無法讀取請求檔，請確認格式是否正確",
			fileMissingSN: "請求檔缺少 serialNumber",
			fileMissingFP: "請求檔缺少 deviceFingerprint",
			refreshTitle: "更新離線授權",
			refreshDesc: "當後台調整了授權模組（追加/移除 Feature）後，使用此功能產生新的回應檔，帶回離線設備匯入以更新授權。",
			refreshBtn: "產生更新回應檔",
			refreshSuccessTitle: "更新回應檔已產生",
			refreshSuccessMessage: "新的回應檔已自動下載，請帶回離線設備匯入以更新授權模組。",
			refreshNote: "使用須知",
			refreshNoteDetail: "此功能僅適用於已啟用的授權。若授權尚未啟用，請先使用「啟用授權」流程。",
			deviceFpLabel: "設備指紋",
			deviceFpPlaceholder: "如需驗證設備，請輸入設備指紋",
			optional: "選填",
		},
		en: {
			title: "BA System Offline License",
			subtitle: "Activate or update offline device licenses",
			modeActivate: "Activate",
			modeRefresh: "Update",
			snPlaceholder: "Enter Serial Number (e.g. SN-20260318-1234)",
			processing: "Processing...",
			step1Title: "Upload Request File",
			step1Desc: "Upload the request file (.json) generated by the offline device.",
			step2Title: "Generate Response File",
			step2Desc: "The system will verify and generate a signed response file for download.",
			step3Title: "Import Response File",
			step3Desc: "Import the downloaded response file back to the offline device to complete activation.",
			uploadHint: "Click or drag to upload request file (.json)",
			generateResponse: "Generate & Download Response",
			errorTitle: "Operation Failed",
			offlineSuccessTitle: "Response File Generated",
			offlineSuccessMessage: "The response file has been downloaded. Please import it on the offline device.",
			fileError: "Cannot read request file. Please check the format.",
			fileMissingSN: "Request file is missing serialNumber",
			fileMissingFP: "Request file is missing deviceFingerprint",
			refreshTitle: "Update Offline License",
			refreshDesc: "After modifying licensed modules in the admin panel, use this to generate a new response file with updated features for the offline device.",
			refreshBtn: "Generate Updated Response",
			refreshSuccessTitle: "Updated Response File Generated",
			refreshSuccessMessage: "The updated response file has been downloaded. Please import it on the offline device.",
			refreshNote: "Note",
			refreshNoteDetail: "This feature only works for already-activated licenses. If the license hasn't been activated yet, use the 'Activate' flow first.",
			deviceFpLabel: "Device Fingerprint",
			deviceFpPlaceholder: "Enter device fingerprint for verification",
			optional: "optional",
		}
	};
	const lang = getLang();
	return translations[lang]?.[key] || key;
};

const mode = ref("activate");
const loading = ref(false);
const result = ref(null);

// 啟用模式
const requestFile = ref(null);
const requestFileData = ref(null);

// 更新模式
const refreshSN = ref("");
const refreshDeviceFp = ref("");

// 切換模式時清除狀態
watch(mode, () => {
	result.value = null;
});

const handleFileUpload = (event) => {
	const file = event.target.files?.[0];
	if (!file) return;

	requestFile.value = file;
	requestFileData.value = null;
	result.value = null;

	const reader = new FileReader();
	reader.onload = (e) => {
		try {
			const data = JSON.parse(e.target.result);
			if (!data.serialNumber) {
				result.value = { success: false, title: t("errorTitle"), message: t("fileMissingSN") };
				return;
			}
			if (!data.deviceFingerprint) {
				result.value = { success: false, title: t("errorTitle"), message: t("fileMissingFP") };
				return;
			}
			requestFileData.value = data;
		} catch {
			result.value = { success: false, title: t("errorTitle"), message: t("fileError") };
		}
	};
	reader.readAsText(file);
};

const downloadResponseFile = (responseData, prefix = "license-response") => {
	const blob = new Blob([JSON.stringify(responseData, null, 2)], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `${prefix}-${responseData.serialNumber}.json`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
};

const handleOfflineActivate = async () => {
	if (!requestFileData.value || loading.value) return;

	loading.value = true;
	result.value = null;

	try {
		const res = await $fetch(`${apiBaseUrl}/api/license/offline-activate`, {
			method: "POST",
			body: requestFileData.value
		});

		const responseData = res?.result;
		if (!responseData) {
			result.value = { success: false, title: t("errorTitle"), message: res?.message || "伺服器回應異常" };
			return;
		}

		downloadResponseFile(responseData);

		result.value = {
			success: true,
			title: t("offlineSuccessTitle"),
			message: t("offlineSuccessMessage"),
			features: responseData.features || []
		};
	} catch (err) {
		const errData = err?.data || err?.response?._data || {};
		result.value = {
			success: false,
			title: t("errorTitle"),
			message: errData.message || err.message || "離線啟用失敗"
		};
	} finally {
		loading.value = false;
	}
};

const handleOfflineRefresh = async () => {
	if (!refreshSN.value.trim() || loading.value) return;

	loading.value = true;
	result.value = null;

	try {
		const body = { serialNumber: refreshSN.value.trim() };
		if (refreshDeviceFp.value.trim()) {
			body.deviceFingerprint = refreshDeviceFp.value.trim();
		}

		const res = await $fetch(`${apiBaseUrl}/api/license/offline-refresh`, {
			method: "POST",
			body
		});

		const responseData = res?.result;
		if (!responseData) {
			result.value = { success: false, title: t("errorTitle"), message: res?.message || "伺服器回應異常" };
			return;
		}

		downloadResponseFile(responseData, "license-update");

		result.value = {
			success: true,
			title: t("refreshSuccessTitle"),
			message: t("refreshSuccessMessage"),
			features: responseData.features || []
		};
	} catch (err) {
		const errData = err?.data || err?.response?._data || {};
		result.value = {
			success: false,
			title: t("errorTitle"),
			message: errData.message || err.message || "更新回應檔產生失敗"
		};
	} finally {
		loading.value = false;
	}
};
</script>
