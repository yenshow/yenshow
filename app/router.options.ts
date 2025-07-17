import type { RouterConfig } from "@nuxt/schema";

export default <RouterConfig>{
	scrollBehavior(to, from, savedPosition) {
		// 優先使用儲存的滾動位置 (瀏覽器歷史操作)
		if (savedPosition) {
			return savedPosition;
		}

		// 如果目標路由帶有 hash (錨點)
		if (to.hash) {
			return {
				el: to.hash,
				behavior: "smooth"
			};
		}

		// 對於所有其他新的路由導航，都滾動到頁面頂部
		return { top: 0, behavior: "instant" };
	}
};
