import type { RouterConfig } from "@nuxt/schema";

export default <RouterConfig>{
	routes: (_routes) => {
		const newRoutes = [..._routes]; // 建立一個可變的複本

		// 找到 solutions/[slug] 的動態路由
		const slugRouteIndex = newRoutes.findIndex((route) => route.path === "/solutions/:slug");

		// 如果找到了動態路由，就把靜態路由插在它前面
		if (slugRouteIndex !== -1) {
			newRoutes.splice(slugRouteIndex, 0, {
				name: "solutions-smart-home-integration",
				path: "/solutions/smart-home-integration",
				component: () => import("~/pages/solutions/smart-home-integration.vue")
			});
		}

		return newRoutes;
	},

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
