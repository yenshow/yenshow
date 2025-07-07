import type { RouterConfig } from "@nuxt/schema";

export default <RouterConfig>{
	scrollBehavior(to, from, savedPosition) {
		// 如果有儲存的滾動位置 (通常是瀏覽器歷史操作，例如點擊上一頁/下一頁)
		if (savedPosition) {
			return savedPosition;
		}

		// 如果目標路由帶有 hash (錨點)
		if (to.hash) {
			return {
				el: to.hash,
				behavior: "smooth" // 平滑滾動到錨點, 可改為 'instant'
			};
		}

		// 如果是從 products 頁面離開 (假設路由名稱是 'products' 或路徑是 '/products')
		// 您需要根據您路由的實際命名來調整 from.name === 'products' 或 from.path === '/products'
		if (from.path === "/products" && !savedPosition) {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve({ top: 0, behavior: "instant" });
				}, 500); // 給予一個稍長的延遲，例如 100ms，觀察效果
			});
		} else {
			// 對於所有其他新的路由導航，都滾動到頁面頂部
			return { top: 0, behavior: "instant" }; // 確保立即到頂部
		}
	}
};
