/** 互動中心模組清單：available 可進入完整互動；planned 可進 stub 介紹頁（不做假互動） */
export const interactiveModules = [
	{
		id: "access",
		status: "available",
		path: "/interactive/access",
		titleKey: "interactive.modules.access.title",
		descKey: "interactive.modules.access.desc",
		tagKey: "interactive.modules.tags.available"
	},
	{
		id: "cctv",
		status: "available",
		path: "/interactive/cctv",
		titleKey: "interactive.modules.cctv.title",
		descKey: "interactive.modules.cctv.desc",
		tagKey: "interactive.modules.tags.available"
	},
	{
		id: "intercom",
		status: "planned",
		path: "/interactive/intercom",
		titleKey: "interactive.modules.intercom.title",
		descKey: "interactive.modules.intercom.desc",
		tagKey: "interactive.modules.tags.planned"
	},
	{
		id: "parking",
		status: "planned",
		path: "/interactive/parking",
		titleKey: "interactive.modules.parking.title",
		descKey: "interactive.modules.parking.desc",
		tagKey: "interactive.modules.tags.planned"
	},
	{
		id: "visitor",
		status: "planned",
		path: "/interactive/visitor",
		titleKey: "interactive.modules.visitor.title",
		descKey: "interactive.modules.visitor.desc",
		tagKey: "interactive.modules.tags.planned"
	},
	{
		id: "platform",
		status: "planned",
		path: "/interactive/platform",
		titleKey: "interactive.modules.platform.title",
		descKey: "interactive.modules.platform.desc",
		tagKey: "interactive.modules.tags.planned"
	}
];
