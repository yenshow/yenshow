import { defineStore } from "pinia";
import { useApi } from "~/composables/useApi";

export const useUserStore = defineStore(
	"user",
	() => {
		const { api, apiAuth } = useApi();

		// ===== 用戶自身狀態 =====
		const token = ref("");
		const account = ref("");
		const loading = ref(false);
		const error = ref("");

		const isLogin = computed(() => {
			return token.value.length > 0;
		});

		// ===== 用戶認證功能 =====
		const login = async (values) => {
			loading.value = true;
			try {
				const { data } = await api.post("/api/users/login", values);

				if (!data || !data.success) {
					throw new Error(data?.message || "登入失敗");
				}

				// 使用更嚴格的提取邏輯
				if (data.token) {
					// 直接取得 token
					token.value = data.token;
				} else if (data.result?.token) {
					// token 在 result 中
					token.value = data.result.token;
				} else {
					throw new Error("回應中找不到有效的 token");
				}

				// 同樣處理用戶資料
				if (data.user) {
					account.value = data.user.account || "";
				} else if (data.result?.user) {
					account.value = data.result.user.account || "";
				}

				return { success: true, message: data.message || "登入成功" };
			} catch (error) {
				error.value = error.message || "登入失敗";
				return { success: false, message: error.message || "登入失敗" };
			} finally {
				loading.value = false;
			}
		};

		const profile = async () => {
			if (!isLogin.value) return;

			loading.value = true;
			try {
				const { data } = await apiAuth.get("/api/users/profile");

				if (!data || !data.success) {
					throw new Error(data?.message || "獲取個人資料失敗");
				}

				// 用戶資料可能在不同位置，優先檢查 result
				const userData = data.result || data;

				// 安全提取，設置預設值
				account.value = userData.account || "";

				return true;
			} catch (error) {
				error.value = error.message || "獲取個人資料失敗";

				// 清除用戶資料
				token.value = "";
				account.value = "";

				throw error;
			} finally {
				loading.value = false;
			}
		};

		const logout = async () => {
			try {
				if (isLogin.value) {
					await apiAuth.delete("/api/users/logout");
				}
			} catch (error) {
				console.error("登出錯誤:", error);
			} finally {
				// 無論如何都清除本地狀態
				token.value = "";
				account.value = "";
			}
		};

		return {
			// 狀態
			token,
			account,
			isLogin,
			loading,
			error,

			// 用戶認證功能
			login,
			profile,
			logout
		};
	},
	{
		persist: {
			key: "user",
			paths: ["token"]
		}
	}
);
