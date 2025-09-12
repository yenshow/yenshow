import type { RouterConfig } from "@nuxt/schema";

export default <RouterConfig>{
	scrollBehavior(to, from, savedPosition) {
		// 優先使用儲存的滾動位置 (瀏覽器歷史操作)
		if (savedPosition) {
			return savedPosition;
		}

		// 語言切換時滾動到頂端
		if (from && to && from.path !== to.path && from.params?.locale !== to.params?.locale) {
			return { top: 0, behavior: "smooth" };
		}

		// 如果目標路由帶有 hash (錨點)
		if (to.hash) {
			return {
				el: to.hash,
				behavior: "smooth"
			};
		}

		// 預設滾動到頂端
		return { top: 0, behavior: "smooth" };
	}
};
