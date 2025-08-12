import { useUserStore } from "~/stores/userStore";

// 驗證用戶是否已登入的中間件
export default defineNuxtRouteMiddleware((to, from) => {
	// 只在客戶端執行檢查，避免 SSR 問題
	if (process.client) {
		const userStore = useUserStore();
		const localePath = useLocalePath();

		// 檢查是否已登入
		if (!userStore.isLogin) {
			// 儲存想要訪問的頁面，用於登入後重定向
			const redirectPath = to.fullPath;

			// 轉至登入頁面
			return navigateTo({
				path: "/login",
				query: { redirect: redirectPath }
			});
		}

		// 如果路由需要管理員權限
		if (to.meta.requiresAdmin && !userStore.isAdmin) {
			// 無權限，返回首頁
			return navigateTo(localePath("/"));
		}
	}
});
