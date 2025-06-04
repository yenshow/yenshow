export default defineNuxtPlugin((nuxtApp) => {
	// 用於初始化用戶狀態
	async function initUserSession() {
		// 在客戶端環境中執行
		if (process.client) {
			try {
				const userStore = useUserStore();

				// 如果有 token 但沒有用戶資料，嘗試獲取資料
				if (userStore.isLogin && !userStore.account) {
					await userStore.profile();
				}
			} catch (error) {
				console.error("初始化用戶會話錯誤:", error);
			}
		}
	}

	// 初始化用戶會話
	initUserSession();
});
