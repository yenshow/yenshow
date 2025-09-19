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
		return { top: 0 };
	}
};
