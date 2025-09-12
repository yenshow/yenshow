<template>
	<div>
		<!-- 頁面容器 -->
		<section class="relative min-h-screen py-[40px] md:py-[80px] overflow-hidden">
			<!-- 背景元素 -->
			<div class="bg-gradient-to-r from-[#ecfdf5] to-[#f0fdf4] absolute inset-0 z-0 opacity-70"></div>

			<div class="container relative z-10">
				<!-- 頁面標題 -->
				<div class="mb-[24px]">
					<h1 class="text-[36px] md:text-[64px] lg:text-[80px] text-center font-bold text-slate-800 animate-title">{{ t("contact.title") }}</h1>
				</div>

				<!-- 表單步驟指示器 -->
				<div class="flex justify-center mb-[48px] animate-steps">
					<div class="step-indicator-container">
						<!-- 步驟1 -->
						<div class="step-item" :class="{ 'step-item-active': step === 1, 'step-item-completed': step > 1 }" @click="step > 1 ? (step = 1) : null">
							<div class="step-circle" :class="{ 'step-circle-active': step === 1, 'step-circle-completed': step > 1 }">
								<span v-if="step === 1">1</span>
								<span v-else-if="step > 1" class="step-check">✓</span>
							</div>
							<div class="step-label" :class="{ 'step-label-active': step === 1 }">{{ t("contact.steps.step1_label") }}</div>
						</div>

						<!-- 連接線 -->
						<div class="step-connector" :class="{ 'step-connector-active': step > 1 }"></div>

						<!-- 步驟2 -->
						<div class="step-item" :class="{ 'step-item-active': step === 2, 'step-item-completed': step > 2 }" @click="step > 2 ? (step = 2) : null">
							<div class="step-circle" :class="{ 'step-circle-active': step === 2, 'step-circle-completed': step > 2 }">
								<span v-if="step <= 2">2</span>
								<span v-else class="step-check">✓</span>
							</div>
							<div class="step-label" :class="{ 'step-label-active': step === 2 }">{{ t("contact.steps.step2_label") }}</div>
						</div>

						<!-- 連接線 -->
						<div class="step-connector" :class="{ 'step-connector-active': step > 2 }"></div>

						<!-- 步驟3 -->
						<div class="step-item" :class="{ 'step-item-active': step === 3 }">
							<div class="step-circle" :class="{ 'step-circle-active': step === 3 }">
								<span>3</span>
							</div>
							<div class="step-label" :class="{ 'step-label-active': step === 3 }">{{ t("contact.steps.step3_label") }}</div>
						</div>
					</div>
				</div>

				<!-- 表單容器 -->
				<div class="max-w-[800px] mx-auto">
					<!-- 步驟1：需求說明 -->
					<div v-if="step === 1" class="form-container animate-form">
						<div class="form-card">
							<h2 class="form-title">{{ t("contact.form.section1_title") }}</h2>
							<div class="form-body">
								<!-- 需求類型 -->
								<div class="form-group">
									<label id="label-type">{{ t("contact.form.labels.type") }} <span class="text-emerald-500">*</span></label>
									<div class="grid grid-cols-2 md:grid-cols-4 gap-[12px] mt-[12px]" role="group" aria-labelledby="label-type">
										<div
											v-for="(option, index) in typeOptions"
											:key="index"
											class="option-box"
											:class="{ selected: form.type.includes(option) }"
											@click="toggleOption(option)"
										>
											{{ option }}
										</div>
									</div>
									<p v-if="errors.type" class="form-error">{{ errors.type }}</p>
								</div>

								<!-- 聯絡主旨 -->
								<div class="form-group">
									<label for="contact-subject">{{ t("contact.form.labels.subject") }} <span class="text-emerald-500">*</span></label>
									<div class="input-wrapper">
										<input
											id="contact-subject"
											v-model="form.subject"
											class="form-input"
											type="text"
											:placeholder="t('contact.form.placeholders.subject')"
											:class="{ 'has-error': errors.subject }"
											aria-required="true"
										/>
										<span class="input-line"></span>
									</div>
									<p v-if="errors.subject" class="form-error">{{ errors.subject }}</p>
								</div>

								<!-- 詳細說明 -->
								<div class="form-group">
									<label for="contact-details">{{ t("contact.form.labels.details") }} <span class="text-emerald-500">*</span></label>
									<div class="input-wrapper">
										<textarea
											id="contact-details"
											v-model="form.details"
											class="form-input form-textarea"
											rows="4"
											:placeholder="t('contact.form.placeholders.details')"
											:class="{ 'has-error': errors.details }"
											aria-required="true"
										></textarea>
										<span class="input-line"></span>
									</div>
									<p v-if="errors.details" class="form-error">{{ errors.details }}</p>
								</div>

								<!-- 文件上傳 -->
								<div class="form-group">
									<label for="contact-files"
										>{{ t("contact.form.labels.files") }} <span class="text-gray-400 text-sm">{{ t("contact.form.labels.files_hint") }}</span></label
									>
									<div class="mt-[12px]">
										<!-- 上傳區域 -->
										<div
											class="upload-area"
											@dragover.prevent="dragover = true"
											@dragleave.prevent="dragover = false"
											@drop.prevent="onDrop"
											:class="{ dragover: dragover }"
											@click="openFileDialog"
										>
											<input
												type="file"
												ref="fileInput"
												@change="onFileSelected"
												multiple
												class="hidden"
												accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
												id="contact-files-input"
											/>
											<div class="flex flex-col items-center justify-center h-full">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="48"
													height="48"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="1.5"
													class="text-emerald-500"
												>
													<path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5"></path>
													<polyline points="17 8 12 3 7 8"></polyline>
													<line x1="12" y1="3" x2="12" y2="15"></line>
												</svg>
												<p class="mt-2 text-sm text-emerald-500 cursor-pointer">{{ t("contact.form.file.choose") }}</p>
											</div>
										</div>

										<!-- 預覽上傳的檔案 -->
										<div v-if="form.files.length > 0" class="mt-4">
											<div v-for="(file, index) in form.files" :key="index" class="file-preview">
												<div class="flex items-center space-x-2">
													<!-- 文件類型圖標 -->
													<div class="file-icon">
														<svg
															v-if="isImageFile(file)"
															xmlns="http://www.w3.org/2000/svg"
															width="20"
															height="20"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															stroke-width="1.5"
														>
															<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
															<circle cx="8.5" cy="8.5" r="1.5"></circle>
															<polyline points="21 15 16 10 5 21"></polyline>
														</svg>
														<svg
															v-else
															xmlns="http://www.w3.org/2000/svg"
															width="20"
															height="20"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															stroke-width="1.5"
														>
															<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
															<polyline points="14 2 14 8 20 8"></polyline>
															<line x1="16" y1="13" x2="8" y2="13"></line>
															<line x1="16" y1="17" x2="8" y2="17"></line>
															<polyline points="10 9 9 9 8 9"></polyline>
														</svg>
													</div>

													<!-- 文件名和大小 -->
													<div class="flex-1 min-w-0">
														<p class="text-sm truncate">{{ file.name }}</p>
														<p class="text-xs text-gray-400">{{ formatFileSize(file.size) }}</p>
													</div>

													<!-- 刪除按鈕 -->
													<button @click="removeFile(index)" class="text-red-400 hover:text-red-500">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="18"
															height="18"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															stroke-width="1.5"
														>
															<path d="M3 6h18"></path>
															<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
															<line x1="10" y1="11" x2="10" y2="17"></line>
															<line x1="14" y1="11" x2="14" y2="17"></line>
														</svg>
													</button>
												</div>

												<!-- 圖片預覽 -->
												<div v-if="isImageFile(file)" class="image-preview mt-2">
													<img :src="getFilePreviewUrl(file)" :alt="t('contact.preview.image_alt')" class="rounded-md" />
												</div>
											</div>
										</div>
									</div>
									<p v-if="errors.files" class="form-error">{{ errors.files }}</p>
								</div>

								<!-- 步驟按鈕 -->
								<div class="mt-[32px] flex justify-end">
									<button @click="goToStep(2)" class="next-btn">{{ t("contact.steps.next") }}</button>
								</div>
							</div>
						</div>
					</div>

					<!-- 步驟2：聯絡資訊 -->
					<div v-if="step === 2" class="form-container animate-form">
						<div class="form-card">
							<h2 class="form-title">{{ t("contact.form.section2_title") }}</h2>
							<div class="form-body">
								<!-- 姓名 -->
								<div class="form-group">
									<label for="contact-name">{{ t("contact.form.labels.name") }} <span class="text-emerald-500">*</span></label>
									<div class="input-wrapper">
										<input
											id="contact-name"
											v-model="form.name"
											class="form-input"
											type="text"
											:placeholder="t('contact.form.placeholders.name')"
											:class="{ 'has-error': errors.name }"
											aria-required="true"
										/>
										<span class="input-line"></span>
									</div>
									<p v-if="errors.name" class="form-error">{{ errors.name }}</p>
								</div>

								<!-- 聯絡電話 -->
								<div class="form-group">
									<label for="contact-phone">{{ t("contact.form.labels.phone") }} <span class="text-emerald-500">*</span></label>
									<div class="input-wrapper">
										<input
											id="contact-phone"
											v-model="form.phone"
											class="form-input"
											type="tel"
											:placeholder="t('contact.form.placeholders.phone')"
											:class="{ 'has-error': errors.phone }"
											aria-required="true"
										/>
										<span class="input-line"></span>
									</div>
									<p v-if="errors.phone" class="form-error">{{ errors.phone }}</p>
								</div>

								<!-- 電子信箱 -->
								<div class="form-group">
									<label for="contact-email" class="text-sm sm:text-base">{{ t("contact.form.labels.email") }} <span class="text-emerald-500">*</span></label>
									<div class="input-wrapper mt-1 sm:mt-2">
										<input
											id="contact-email"
											v-model="form.email"
											class="form-input text-sm sm:text-base"
											type="email"
											:placeholder="t('contact.form.placeholders.email') + '@mail.com'"
											:class="{ 'has-error': errors.email }"
											aria-required="true"
										/>
										<span class="input-line"></span>
									</div>
									<p v-if="errors.email" class="form-error">{{ errors.email }}</p>
								</div>

								<!-- 公司 / 部門 -->
								<div class="form-group">
									<label for="contact-company" class="text-sm sm:text-base">{{ t("contact.form.labels.company") }}</label>
									<div class="input-wrapper mt-1 sm:mt-2">
										<input
											id="contact-company"
											v-model="form.company"
											class="form-input text-sm sm:text-base"
											type="text"
											:placeholder="t('contact.form.placeholders.company')"
										/>
										<span class="input-line"></span>
									</div>
								</div>

								<!-- 步驟按鈕 -->
								<div class="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
									<button @click="goToStep(1)" class="back-btn px-4 py-2 text-sm sm:px-5 sm:py-2.5 sm:text-base md:px-6 md:py-3 w-full sm:w-auto">
										{{ t("contact.steps.back") }}
									</button>
									<button
										@click="submitForm"
										class="submit-btn px-4 py-2 text-sm sm:px-5 sm:py-2.5 sm:text-base md:px-6 md:py-3 w-full sm:w-auto"
										:class="{ loading: isSubmitting }"
									>
										<span v-if="!isSubmitting">{{ t("contact.steps.submit") }}</span>
										<span v-else class="btn-loader"></span>
									</button>
								</div>
							</div>
						</div>
					</div>

					<!-- 步驟3：提交成功 -->
					<div v-if="step === 3" class="success-container animate-success px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">
						<div class="success-icon w-16 h-16 sm:w-20 sm:h-20">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
								<polyline points="22 4 12 14.01 9 11.01"></polyline>
							</svg>
						</div>
						<h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mt-4 sm:mt-6">{{ t("contact.success.title") }}</h2>
						<p class="text-sm sm:text-base md:text-lg text-slate-600 mt-2 sm:mt-3 text-center">
							{{ t("contact.success.description_line1") }}<br />
							{{ t("contact.success.description_line2") }}
						</p>
						<div class="mt-6 sm:mt-8 p-4 sm:p-6 rounded-[16px] bg-white bg-opacity-10 backdrop-blur-sm">
							<p class="flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-2 text-emerald-600 text-sm sm:text-base">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									class="w-4 h-4 sm:w-5 sm:h-5"
								>
									<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
									<polyline points="22,6 12,13 2,6"></polyline>
								</svg>
								{{ t("contact.success.email_label") }} <a href="mailto:jerry@yenshow.com">jerry@yenshow.com</a>
							</p>
							<p class="flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-2 text-emerald-600 mt-2 sm:mt-3 text-sm sm:text-base">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									class="w-4 h-4 sm:w-5 sm:h-5"
								>
									<path
										d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
									></path>
								</svg>
								{{ t("contact.success.phone_label") }} +886-2-222-333-55
							</p>
						</div>
						<button @click="goHome" class="home-btn mt-8 sm:mt-10 md:mt-12 px-5 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base">
							{{ t("contact.steps.go_home") }}
						</button>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useApi } from "~/composables/useApi";
import { useI18n } from "vue-i18n";

const router = useRouter();
const localePath = useLocalePath();
const { api, safeApiCall } = useApi();
const { t, tm, locale } = useI18n();
const step = ref(1);
const isSubmitting = ref(false);
const dragover = ref(false);
const fileInput = ref(null);

// 需求選項（隨語系切換）：用 tm() 取長度，用 t() 逐項取字串，避免回傳物件/AST
const typeOptions = computed(() => {
	const raw = tm("contact.type_options");
	const length = Array.isArray(raw) ? raw.length : 4;
	return Array.from({ length }, (_, i) => t(`contact.type_options[${i}]`));
});

const form = ref({
	name: "",
	phone: "",
	email: "",
	company: "",
	subject: "",
	type: [],
	details: "",
	files: []
});

const errors = ref({});

// 切換選項
const toggleOption = (option) => {
	if (form.value.type.includes(option)) {
		form.value.type = form.value.type.filter((item) => item !== option);
	} else {
		form.value.type.push(option);
	}
};

// 文件上傳功能
const openFileDialog = () => {
	fileInput.value.click();
};

const onFileSelected = (event) => {
	handleFiles(Array.from(event.target.files));
};

const onDrop = (event) => {
	dragover.value = false;
	handleFiles(Array.from(event.dataTransfer.files));
};

const handleFiles = (files) => {
	errors.value.files = "";

	// 檢查文件數量限制
	if (form.value.files.length + files.length > 3) {
		errors.value.files = t("contact.errors.max_files");
		return;
	}

	// 處理每個文件
	files.forEach((file) => {
		// 檢查文件大小限制 (5MB)
		if (file.size > 5 * 1024 * 1024) {
			errors.value.files = t("contact.errors.file_too_large");
			return;
		}

		// 檢查文件類型
		const allowedTypes = [
			"image/jpeg",
			"image/png",
			"image/gif",
			"application/pdf",
			"application/msword",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			"application/vnd.ms-excel",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		];
		if (!allowedTypes.includes(file.type)) {
			errors.value.files = t("contact.errors.unsupported_type");
			return;
		}

		// 添加到文件列表
		form.value.files.push(file);
	});
};

const removeFile = (index) => {
	form.value.files.splice(index, 1);
};

const isImageFile = (file) => {
	return file.type.startsWith("image/");
};

const getFilePreviewUrl = (file) => {
	return URL.createObjectURL(file);
};

const formatFileSize = (bytes) => {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// 步驟控制
const goToStep = (nextStep) => {
	// 從步驟1到步驟2需要驗證
	if (step.value === 1 && nextStep === 2) {
		if (!validateStep1()) return;
	}

	step.value = nextStep;
	// 滾動到頁面頂部
	window.scrollTo({ top: 0, behavior: "smooth" });
};

// 驗證步驟1
const validateStep1 = () => {
	const stepErrors = {};

	if (form.value.type.length === 0) stepErrors.type = t("contact.errors.type_required");
	if (!form.value.subject) stepErrors.subject = t("contact.errors.subject_required");
	if (!form.value.details) stepErrors.details = t("contact.errors.details_required");

	errors.value = stepErrors;
	return Object.keys(stepErrors).length === 0;
};

// 驗證步驟2
const validateStep2 = () => {
	const stepErrors = {};

	if (!form.value.name) stepErrors.name = t("contact.errors.name_required");
	if (!form.value.phone) stepErrors.phone = t("contact.errors.phone_required");
	if (!form.value.email || !form.value.email.includes("@")) stepErrors.email = t("contact.errors.email_required");

	errors.value = stepErrors;
	return Object.keys(stepErrors).length === 0;
};

// 表單驗證
const validateForm = () => {
	return validateStep2();
};

// 處理提交
const submitForm = async () => {
	if (!validateForm()) return;

	isSubmitting.value = true;
	errors.value = {}; // 清除舊錯誤

	// 創建 FormData 物件
	const formData = new FormData();

	// 添加文字欄位
	formData.append("name", form.value.name);
	formData.append("phone", form.value.phone);
	formData.append("email", form.value.email);
	formData.append("company", form.value.company || "");
	formData.append("subject", form.value.subject);
	form.value.type.forEach((typeOption) => {
		formData.append("type", typeOption);
	});
	formData.append("details", form.value.details);

	// 添加檔案
	form.value.files.forEach((file) => {
		formData.append("files", file);
	});

	try {
		const response = await safeApiCall(() =>
			api.post("/api/contact", formData, {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			})
		);

		if (response && response.data && response.data.success) {
			step.value = 3;
			window.scrollTo({ top: 0, behavior: "smooth" });
		} else {
			errors.value.submit = response?.data?.message || t("contact.errors.submit_failed");
		}
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			errors.value.submit = error.response.data.message;
		} else {
			errors.value.submit = t("contact.errors.unknown");
		}
	} finally {
		isSubmitting.value = false;
	}
};

// 返回首頁
const goHome = () => {
	router.push(localePath("/"));
};
</script>

<style scoped>
/* 步驟指示器 */
.step-indicator-container {
	display: flex;
	align-items: center;
	gap: 8px;
}

.step-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.step-item-active {
	transform: scale(1.05);
}

.step-circle {
	width: 52px;
	height: 52px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #ffffff;
	color: #475569;
	font-weight: 700;
	font-size: 18px;
	border: 2px solid #cbd5e1;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	position: relative;
	z-index: 2;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.step-circle-active {
	background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
	border-color: #10b981;
	color: #ffffff;
	box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
	transform: scale(1.1);
	font-weight: 700;
}

.step-circle-completed {
	background: #bbf7d0;
	border-color: #10b981;
	color: #047857;
	box-shadow: 0 3px 10px rgba(16, 185, 129, 0.2);
	font-weight: 700;
}

.step-check {
	color: #047857;
	font-size: 20px;
	font-weight: 800;
}

.step-label {
	margin-top: 8px;
	font-size: 16px;
	font-weight: 600;
	color: #475569;
	transition: all 0.3s ease;
	text-align: center;
	min-width: 80px;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.step-label-active {
	color: #059669;
	font-weight: 700;
	text-shadow: 0 1px 2px rgba(5, 150, 105, 0.2);
}

.step-connector {
	width: 60px;
	height: 3px;
	background: #cbd5e1;
	transition: all 0.3s ease;
	position: relative;
	border-radius: 2px;
}

.step-connector-active {
	background: linear-gradient(90deg, #34d399 0%, #10b981 100%);
	box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);
	height: 3px;
}

.step-connector::after {
	content: "";
	position: absolute;
	top: 50%;
	right: -3px;
	width: 6px;
	height: 6px;
	background: #e2e8f0;
	border-radius: 50%;
	transform: translateY(-50%);
	transition: all 0.3s ease;
}

.step-connector-active::after {
	background: #10b981;
	box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

/* 響應式設計 */
@media (max-width: 768px) {
	.step-indicator-container {
		gap: 6px;
	}

	.step-circle {
		width: 44px;
		height: 44px;
		font-size: 16px;
		font-weight: 700;
		border-width: 2px;
	}

	.step-connector {
		width: 50px;
		height: 3px;
	}

	.step-label {
		font-size: 13px;
		font-weight: 600;
		min-width: 70px;
		margin-top: 6px;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.step-check {
		font-size: 18px;
		font-weight: 800;
	}

	.step-label-active {
		font-weight: 700;
	}
}

/* 表單卡片樣式 */
.form-card {
	background: #ffffff;
	border-radius: 24px;
	border: 1px solid #e2e8f0;
	overflow: hidden;
	backdrop-filter: none;
	box-shadow: 0 10px 20px rgba(16, 185, 129, 0.06);
	transition: all 0.3s ease;
}

.form-title {
	padding: 20px 24px;
	background: #ffffff;
	color: #10b981;
	font-size: 24px;
	font-weight: 600;
	border-bottom: 1px solid #e2e8f0;
}

.form-body {
	padding: 24px;
}

.form-group {
	margin-bottom: 24px;
}

.form-group label {
	display: block;
	color: #0f172a;
	margin-bottom: 8px;
	font-size: 18px;
}

/* 輸入框樣式 */
.input-wrapper {
	position: relative;
}

.form-input {
	width: 100%;
	padding: 12px 16px;
	background: #ffffff;
	border: 1px solid #e2e8f0;
	border-radius: 8px;
	color: #0f172a;
	font-size: 16px;
	transition: all 0.2s ease;
}

.form-input:focus {
	background: #ffffff;
	outline: none;
	border-color: #34d399;
	box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.15);
}

.input-line {
	position: absolute;
	bottom: 0;
	left: 5%;
	width: 90%;
	height: 2px;
	background: #34d399;
	transform: scaleX(0);
	transition: transform 0.3s ease;
	transform-origin: center;
}

.form-input:focus + .input-line {
	transform: scaleX(1);
}

.form-textarea {
	resize: none;
	min-height: 120px;
}

.form-input::placeholder {
	color: rgba(100, 116, 139, 0.8);
}

.form-input.has-error {
	border: 1px solid rgba(239, 68, 68, 0.6);
	background: rgba(239, 68, 68, 0.06);
}

.form-error {
	color: #ef4444;
	font-size: 14px;
	margin-top: 6px;
}

/* 選項盒子 */
.option-box {
	padding: 12px;
	border-radius: 8px;
	background: #ffffff;
	color: #0f172a;
	text-align: center;
	cursor: pointer;
	transition: all 0.2s ease;
	border: 1px solid #e2e8f0;
}

.option-box:hover {
	background: #f8fafc;
}

.option-box.selected {
	background: #dcfce7;
	border-color: #34d399;
	box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.15);
}

/* 文件上傳區域 */
.upload-area {
	border: 2px dashed rgba(148, 163, 184, 0.5);
	border-radius: 8px;
	height: 200px;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	transition: all 0.3s ease;
	background: #ffffff;
}

.upload-area:hover {
	border-color: #34d399;
	background: rgba(52, 211, 153, 0.08);
}

.upload-area.dragover {
	border-color: #34d399;
	background: rgba(52, 211, 153, 0.12);
}

.file-preview {
	background: #ffffff;
	padding: 12px;
	border-radius: 8px;
	margin-bottom: 8px;
	border: 1px solid #e2e8f0;
}

.file-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	background: #dcfce7;
	border-radius: 4px;
	color: #059669;
}

.image-preview {
	max-height: 160px;
	overflow: hidden;
}

.image-preview img {
	width: 100%;
	height: auto;
	object-fit: cover;
}

/* 按鈕樣式 */
.next-btn,
.back-btn,
.submit-btn {
	padding: 10px 24px;
	border-radius: 50px;
	font-size: 16px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
}

.next-btn {
	color: #059669;
	border: 1px solid #34d399;
}

.next-btn:hover {
	background: #dcfce7;
}

.back-btn {
	background: #ffffff;
	color: #0f172a;
	border: 1px solid #e2e8f0;
}

.back-btn:hover {
	background: #f1f5f9;
	transform: translateY(-2px);
}

.submit-btn {
	padding: 12px 48px;
	background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
	color: white;
	border: none;
	box-shadow: 0 4px 15px rgba(16, 185, 129, 0.28);
}

.submit-btn:hover {
	box-shadow: 0 8px 25px rgba(16, 185, 129, 0.38);
}

.submit-btn:active {
	transform: translateY(1px);
}

.submit-btn.loading {
	background: #10b981;
}

.btn-loader {
	display: inline-block;
	width: 20px;
	height: 20px;
	border: 3px solid rgba(255, 255, 255, 0.3);
	border-radius: 50%;
	border-top-color: white;
	animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

/* 成功頁面樣式 */
.success-container {
	text-align: center;
	padding: 48px 24px;
	background: #ffffff;
	border-radius: 24px;
	border: 1px solid #e2e8f0;
	backdrop-filter: none;
	box-shadow: 0 10px 20px rgba(16, 185, 129, 0.06);
}

.success-icon {
	width: 80px;
	height: 80px;
	margin: 0 auto;
	background: #dcfce7;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #059669;
	box-shadow: 0 0 0 6px rgba(52, 211, 153, 0.12);
}

.success-icon svg {
	width: 40px;
	height: 40px;
	stroke-dasharray: 100;
	stroke-dashoffset: 100;
	animation: dash 1.5s ease-in-out forwards;
}

@keyframes dash {
	to {
		stroke-dashoffset: 0;
	}
}

.home-btn {
	padding: 12px 36px;
	background: #ffffff;
	color: #0f172a;
	border: 1px solid #e2e8f0;
	border-radius: 50px;
	font-size: 16px;
	cursor: pointer;
	transition: all 0.3s ease;
}

.home-btn:hover {
	background: #f1f5f9;
	transform: translateY(-2px);
}

/* 動畫效果 */
.animate-title {
	animation: fadeInUp 0.8s ease forwards;
}

.animate-steps {
	animation: fadeInUp 0.8s ease 0.2s forwards;
	opacity: 0;
}

.animate-form {
	animation: fadeInUp 0.8s ease 0.4s forwards;
	opacity: 0;
}

.animate-success {
	animation: fadeIn 0.8s ease forwards;
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(30px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}
</style>
