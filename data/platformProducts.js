/** YSOP / YSOS 平台產品靜態結構（文案見 i18n platform.*） */
export const platformProducts = {
	ysop: {
		contactQuery: "YSOP",
		platformUrl: "https://ysop.yenshow.com",
		heroImage: "/YSOP/ysop_home.png",
		accent: "from-blue-600 to-cyan-500",
		accentSolid: "bg-blue-600",
		textAccent: "text-blue-600",
		moduleGroups: [
			{
				id: "access_control",
				navColor: "blue",
				image: "/YSOP/ysop_people.png",
				subFeatures: ["access_mgmt", "vehicle_mgmt", "elevator", "surveillance"]
			},
			{
				id: "utilities",
				navColor: "sky",
				image: "/YSOP/ysop_drainage.png",
				subFeatures: ["drainage", "air_circulation", "power", "lighting", "hvac"]
			},
			{
				id: "safety",
				navColor: "emerald",
				image: "/YSOP/ysop_fire.png",
				subFeatures: ["environment", "smoke_alarm", "fire", "emergency_rescue"]
			},
			{
				id: "operations",
				navColor: "amber",
				image: "/YSOP/ysop_multimedia.png",
				subFeatures: ["multimedia", "floor_plan", "alert_records"]
			}
		]
	},
	ysos: {
		contactQuery: "YSOS",
		platformUrl: "https://ysos.yenshow.com",
		heroImage: "/YSOS/ysos_home.png",
		accent: "from-emerald-600 to-green-500",
		accentSolid: "bg-emerald-600",
		textAccent: "text-emerald-600",
		moduleGroups: [
			{
				id: "people_counting",
				navColor: "blue",
				image: "/YSOS/ysos_people.png",
				subFeatures: ["entry_stats", "zone_locations", "access_records", "personnel_list", "export_reports"]
			},
			{
				id: "vehicle_mgmt",
				navColor: "sky",
				image: "/YSOS/ysos_vehicle.png",
				subFeatures: ["plate_recognition", "parking_mgmt", "traffic_stats", "vehicle_list", "vehicle_reports"]
			},
			{
				id: "environment",
				navColor: "emerald",
				image: "/YSOS/ysos_environment.png",
				subFeatures: ["env_metrics", "env_reports", "threshold_alerts"]
			},
			{
				id: "surveillance",
				navColor: "purple",
				image: "/YSOS/ysos_video.png",
				subFeatures: ["rtsp_stream", "multi_view"]
			}
		]
	}
};

export const platformSlugs = Object.keys(platformProducts);
