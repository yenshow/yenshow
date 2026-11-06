/** 首頁 Intro hex：to 有值可點；variant planned = 二期 stub */
export const dataMonitoringTop = [
	{ imageSrc: "/YSCP/board-game.webp", titleKey: "home.intro.services.data_monitoring.digital_signage" },
	{ imageSrc: "/YSCP/intelligent-analytics.webp", titleKey: "home.intro.services.data_monitoring.intelligent_analysis" }
];

export const dataMonitoringMid = [
	{
		imageSrc: "/YSCP/image.webp",
		titleKey: "home.intro.services.data_monitoring.cctv",
		to: "/interactive/cctv",
		ariaKey: "home.intro.services.data_monitoring.interactive_aria"
	},
	{
		size: "lg",
		titleKey: "home.intro.services.data_monitoring.title",
		to: "/interactive",
		ariaKey: "home.intro.services.data_monitoring.hub_aria"
	}
];

export const dataMonitoringBottom = [
	{
		imageSrc: "/YSCP/platform.webp",
		titleKey: "home.intro.services.data_monitoring.platform",
		to: "/interactive/platform",
		ariaKey: "home.intro.services.data_monitoring.platform_aria",
		variant: "planned"
	},
	{ imageSrc: "/YSCP/attendance.webp", titleKey: "home.intro.services.data_monitoring.attendance_management" }
];

export const securityManagementTop = [
	{
		imageSrc: "/YSCP/vehicle.webp",
		titleKey: "home.intro.services.security_management.parking",
		to: "/interactive/parking",
		ariaKey: "home.intro.services.security_management.parking_aria",
		variant: "planned"
	},
	{
		imageSrc: "/YSCP/visitor.webp",
		titleKey: "home.intro.services.security_management.visitors",
		to: "/interactive/visitor",
		ariaKey: "home.intro.services.security_management.visitor_aria",
		variant: "planned"
	}
];

export const securityManagementMid = [
	{
		size: "lg",
		titleKey: "home.intro.services.security_management.title",
		to: "/interactive",
		ariaKey: "home.intro.services.security_management.hub_aria"
	},
	{
		imageSrc: "/YSCP/guarded-entrance.webp",
		titleKey: "home.intro.services.security_management.access_control",
		to: "/interactive/access",
		ariaKey: "home.intro.services.security_management.interactive_aria"
	}
];

export const securityManagementBottom = [
	{
		imageSrc: "/YSCP/intercom.webp",
		titleKey: "home.intro.services.security_management.intercom",
		to: "/interactive/intercom",
		ariaKey: "home.intro.services.security_management.intercom_aria",
		variant: "planned"
	},
	{ imageSrc: "/YSCP/alarm.webp", titleKey: "home.intro.services.security_management.alarm" }
];
