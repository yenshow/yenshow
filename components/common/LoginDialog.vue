<template>
	<div v-if="modelValue" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4" @click.self="closeDialog">
		<transition name="modal-fade">
			<div v-if="modelValue" class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
				<!-- 關閉按鈕 -->
				<button
					@click="closeDialog"
					class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-2 transition-colors duration-200"
					aria-label="關閉登入對話框"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>

				<!-- 標題區域 -->
				<div class="px-6 pt-8 pb-6 text-center border-b border-gray-100">
					<div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
					</div>
					<h2 class="text-2xl font-bold text-gray-900 mb-2">會員登入</h2>
					<p class="text-gray-600">請輸入您的帳號密碼以繼續</p>
				</div>
				<!-- 表單區域 -->
				<form @submit.prevent="handleLogin" class="p-6 space-y-5">
					<!-- 帳號輸入 -->
					<div class="space-y-2">
						<label for="dialog-account" class="block text-sm font-medium text-gray-700"> 帳號 </label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
							</div>
							<input
								type="text"
								id="dialog-account"
								v-model="account"
								required
								placeholder="請輸入您的帳號"
								class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
								:class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': error && !account }"
							/>
						</div>
					</div>

					<!-- 密碼輸入 -->
					<div class="space-y-2">
						<label for="dialog-password" class="block text-sm font-medium text-gray-700"> 密碼 </label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									/>
								</svg>
							</div>
							<input
								type="password"
								id="dialog-password"
								v-model="password"
								required
								placeholder="請輸入您的密碼"
								class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
								:class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': error && !password }"
							/>
						</div>
					</div>

					<!-- 錯誤訊息 -->
					<div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
						<div class="flex items-center">
							<svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
								/>
							</svg>
							<span class="text-sm text-red-700">{{ error }}</span>
						</div>
					</div>

					<!-- 登入按鈕 -->
					<button
						type="submit"
						:disabled="loading"
						class="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
					>
						<svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						{{ loading ? "登入中..." : "登入" }}
					</button>
				</form>

				<!-- 底部區域 -->
				<div class="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center">
					<p class="text-sm text-gray-600">
						沒有帳號或遇到問題？
						<button @click="navigateToContact" class="text-primary hover:text-primary/80 font-medium transition-colors duration-200">點此聯繫我們</button>
					</p>
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useUserStore } from "~/stores/userStore";
import { useRouter } from "vue-router";

const props = defineProps({
	modelValue: {
		type: Boolean,
		required: true
	}
});

const emit = defineEmits(["update:modelValue", "login-success"]);

const userStore = useUserStore();
const router = useRouter();
const localePath = useLocalePath();

// 表單狀態
const account = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

// 登入處理
const handleLogin = async () => {
	if (!account.value || !password.value) {
		error.value = "請輸入帳號和密碼";
		return;
	}

	loading.value = true;
	error.value = "";

	try {
		const response = await userStore.login({
			account: account.value,
			password: password.value
		});

		if (response.success) {
			emit("login-success"); // 發送成功事件
			closeDialog(); // 關閉對話框
			// 延遲跳轉可以在父元件中處理，或者如果希望在這裡處理，可以這樣：
			// setTimeout(() => {
			//   window.location.href = "/";
			// }, 500); // 短暫延遲讓使用者看到成功狀態
		} else {
			error.value = response.message || "登入失敗";
		}
	} catch (err) {
		error.value = err?.response?.data?.message || err?.message || "登入失敗，請稍後再試";
	} finally {
		loading.value = false;
	}
};

// 關閉對話框
const closeDialog = () => {
	emit("update:modelValue", false);
};

// 導航到聯絡頁面
const navigateToContact = () => {
	closeDialog(); // 關閉對話框
	router.push(localePath("/contact")); // 導航到聯絡頁面
};

// 當對話框關閉時重置表單狀態
watch(
	() => props.modelValue,
	(newValue) => {
		if (!newValue) {
			account.value = "";
			password.value = "";
			error.value = "";
			loading.value = false;
		}
	}
);
</script>

<style scoped>
/* 現代化對話框動畫 */
.modal-fade-enter-active,
.modal-fade-leave-active {
	transition: all 0.3s ease;
}

.modal-fade-enter-active > div,
.modal-fade-leave-active > div {
	transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
	opacity: 0;
}

.modal-fade-enter-from > div,
.modal-fade-leave-to > div {
	opacity: 0;
	transform: scale(0.95) translateY(-20px);
}

.modal-fade-enter-to,
.modal-fade-leave-from {
	opacity: 1;
}

.modal-fade-enter-to > div,
.modal-fade-leave-from > div {
	opacity: 1;
	transform: scale(1) translateY(0);
}

/* 輸入框聚焦時的動畫效果 */
input:focus {
	transform: translateY(-1px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 按鈕hover效果 */
button[type="submit"]:not(:disabled):hover {
	transform: translateY(-1px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

button[type="submit"]:not(:disabled):active {
	transform: translateY(0);
}

/* 圖標容器的脈衝動畫 */
@keyframes pulse-subtle {
	0%,
	100% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.02);
	}
}

.bg-primary\/10 {
	animation: pulse-subtle 2s ease-in-out infinite;
}

/* 錯誤訊息的滑入動畫 */
.bg-red-50 {
	animation: slideInDown 0.3s ease-out;
}

@keyframes slideInDown {
	from {
		opacity: 0;
		transform: translateY(-10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* 載入狀態的按鈕樣式 */
button[type="submit"]:disabled {
	transform: none;
	box-shadow: none;
}

/* 響應式優化 */
@media (max-width: 640px) {
	.modal-fade-enter-from > div,
	.modal-fade-leave-to > div {
		transform: scale(0.98) translateY(-10px);
	}
}
</style>
