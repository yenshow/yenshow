/** 互動中心模組清單（官網不顯示內部期次標籤） */
export const interactiveModules = [
	{
		id: "access",
		status: "available",
		featured: true,
		path: "/interactive/access",
		titleKey: "interactive.modules.access.title",
		descKey: "interactive.modules.access.desc",
		categoryKey: "interactive.modules.access.category"
	},
	{
		id: "cctv",
		status: "available",
		featured: true,
		path: "/interactive/cctv",
		titleKey: "interactive.modules.cctv.title",
		descKey: "interactive.modules.cctv.desc",
		categoryKey: "interactive.modules.cctv.category"
	},
	{
		id: "intercom",
		status: "available",
		featured: true,
		path: "/interactive/intercom",
		titleKey: "interactive.modules.intercom.title",
		descKey: "interactive.modules.intercom.desc",
		categoryKey: "interactive.modules.intercom.category"
	},
	{
		id: "parking",
		status: "available",
		featured: true,
		path: "/interactive/parking",
		titleKey: "interactive.modules.parking.title",
		descKey: "interactive.modules.parking.desc",
		categoryKey: "interactive.modules.parking.category"
	},
	{
		id: "visitor",
		status: "available",
		featured: true,
		path: "/interactive/visitor",
		titleKey: "interactive.modules.visitor.title",
		descKey: "interactive.modules.visitor.desc",
		categoryKey: "interactive.modules.visitor.category"
	},
	{
		id: "platform",
		status: "available",
		featured: true,
		path: "/interactive/platform",
		titleKey: "interactive.modules.platform.title",
		descKey: "interactive.modules.platform.desc",
		categoryKey: "interactive.modules.platform.category"
	}
];

export const featuredInteractiveModules = interactiveModules.filter((mod) => mod.featured);
export const moreInteractiveModules = interactiveModules.filter((mod) => !mod.featured);
