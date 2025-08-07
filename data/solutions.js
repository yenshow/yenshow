export const solutions = {
	"ai-smart-factory": {
		title: "AI 智慧工廠",
		shortTitle: "智慧工廠",
		subtitle: "強化安全與工作流程",
		heroImage: "/solutions/AI智慧工廠強化安全與工作流程.webp",
		// videoUrl: "https://www.youtube.com/watch?v=5Sf-NH_14Oo",
		relevantSeries: [
			"67ed0512296210e234e0de64", // 影像監控
			"67ed0512296210e234e0de10", // 門禁管理
			"67ed0512296210e234e0deb2" // 安全防護
		],
		meta: {
			title: " - AI 智慧工廠解決方案",
			description: "探索遠岫科技的 AI 智慧工廠解決方案，整合智慧監控、流程管控與人員安全，打造全面的智慧製造環境。"
		},
		features: [
			{
				id: "surveillance",
				title: "智慧監控",
				color: "orange",
				description: "結合 AI 影像分析，即時監控工廠內人員行為與設備狀況，提前預防潛在風險，確保生產環境安全。",
				points: ["24小時全天候監控，無人值守自動化管理", "AI 人員行為分析，即時偵測異常狀況", "高解析度影像記錄，完整保存重要證據"],
				buttons: [
					{ label: "IPC 攝影機", category: "IPC" },
					{ label: "NVR 錄影機", category: "NVR" }
				]
			},
			{
				id: "access-control",
				title: "門禁管制",
				color: "blue",
				description: "整合人臉辨識、門禁控制與車牌辨識系統，全方位管理人流與車流進出，確保只有授權人員及車輛能夠進入指定區域。",
				points: ["人臉辨識門禁，確保只有授權人員進入", "通關機閘門，有效管制進出流量", "車牌辨識系統，自動化管理廠區車輛"],
				buttons: [
					{ label: "門禁控制", category: "門禁控制" },
					{ label: "通關機", category: "通關機" },
					{ label: "車牌辨識", category: "車牌辨識管理系統", subCategory: "攝影機" }
				]
			},
			{
				id: "safety",
				title: "人員安全",
				color: "green",
				description: "整合無線警報、火災預警與金屬探測門，建構多層次防護網，保障工廠人員與重要資產安全，防範未然。",
				points: ["無線警報系統，即時應對入侵事件", "AI 火災預警，防範災害於未然", "金屬探測門，防止違禁品攜入"],
				buttons: [
					{ label: "無線警報", category: "無線警報", subCategory: "主機 & 中繼器" },
					{ label: "火災警報", category: "火災警報" },
					{ label: "金屬探測門", category: "金屬檢測門" }
				]
			}
		]
	},
	"community-security": {
		title: "社區大樓安防解決方案",
		shortTitle: "社區安防",
		subtitle: "整合多重防護，打造智慧安全社區",
		heroImage: "/solutions/人臉門禁控制.webp", // 請將對應的圖片放到 public/solutions/
		videoUrl: "https://www.youtube.com/watch?v=5Sf-NH_14Oo",
		relevantSeries: [
			"67ed0512296210e234e0de10", // 門禁管理 (車牌辨識, 人臉辨識)
			"67ed0511296210e234e0ddd7", // 可視對講
			"67ed0512296210e234e0de64", // 影像監控 (半球攝影機, 戶外監控)
			"67ed0512296210e234e0deb2", // 安全防護 (警報攝影機)
			"67ed0512296210e234e0df00" // 其他應用 (相關配件)
		],
		meta: {
			title: " - 社區大樓安防解決方案",
			description: "遠岫科技為社區大樓提供整合式的安防解決方案，從車輛管理、門禁控制到影像監控，全面提升居住安全與管理效率。"
		},
		features: [
			{
				id: "vehicle-access",
				title: "車輛出入口",
				description: "安全、高效的車輛停車驗證管理",
				color: "blue",
				points: ["自動化車牌辨識，快速進出", "即時影像記錄，確保安全", "整合繳費系統，方便管理"],
				buttons: [
					{ label: "攝影機", category: "車牌辨識管理系統", subCategory: "攝影機" },
					{ label: "LED 顯示", category: "車牌辨識管理系統", subCategory: "LED 顯示" }
				]
			},
			{
				id: "lobby-access",
				title: "大廳門禁",
				description: "免接觸住戶進出、無紙化訪客管理",
				color: "sky",
				points: ["人臉辨識，無感通行", "手機 App 遠端開門", "QR Code 訪客邀請，安全便利"],
				buttons: [
					{ label: "人臉辨識", category: "門禁控制" },
					{ label: "可視對講", category: "可視對講機" }
				]
			},
			{
				id: "public-space",
				title: "室內公共空間",
				description: "全天候高解析度影像保護，聚焦人員／車輛事件",
				color: "emerald",
				points: ["全景攝影機，無死角監控", "AI 事件偵測，自動標記", "高畫質錄影，保留證據"],
				buttons: [{ label: "室內監控", category: "IPC" }]
			},
			{
				id: "perimeter",
				title: "周界防護",
				description: "敏感入侵偵測搭配高清影像驗證",
				color: "amber",
				points: ["智慧偵測，減少誤報", "聲光警報，嚇阻入侵者", "即時手機推播，掌握狀況"],
				buttons: [
					{ label: "攝影機", category: "無線警報", subCategory: "主機 & 中繼器" },
					{ label: "警報裝置", category: "無線警報", subCategory: "警報裝置" }
				]
			},
			{
				id: "control-center",
				title: "管理中心",
				description: "統一管理・輕量級平台",
				color: "indigo",
				points: ["電視牆統一監看", "單一平台操作所有設備", "事件集中管理，快速反應"],
				buttons: [
					{ label: "網路設備及軟體", category: "網路設備及軟體" },
					{ label: "儲存設備", category: "NVR" }
				]
			}
		]
	},
	"smart-home-integration": {
		title: "智慧宅系統整合",
		shortTitle: "智慧住宅",
		subtitle: "打造安全、便利、高效的現代智慧建築管理核心",
		heroImage: "/solutions/智慧宅系統整合.webp",
		meta: {
			title: " - 智慧宅系統整合",
			description: "遠岫科技提供全面的智慧宅系統整合方案，結合監視、門禁、對講、消防、電力與多種建築核心系統，實現真正的智慧化管理。"
		},
		features: [
			{
				id: "electricity",
				title: "電力系統",
				color: "amber",
				description: "對建築內的電力使用進行即時監測與分析，確保電力供應穩定，並提供各區域詳細的用電數據，以實現節能管理與負載平衡。",
				image: "/solutions/electricity.webp",
				points: ["即時電壓、電流、功率監測", "各迴路用電數據統計", "需量控制與警報設定"]
			},
			{
				id: "air-conditioning",
				title: "空調系統",
				color: "sky",
				description: "集中控制與監測建築內所有空調設備，包括溫度、濕度、開關狀態等，提供舒適的室內環境，同時優化能源效率。",
				image: "/solutions/air.webp",
				points: ["遠端溫度與模式設定", "排程控制，自動化運行", "設備狀態與異常警報"]
			},
			{
				id: "fire-safety",
				title: "消防系統",
				color: "orange",
				description: "整合火災受信總機的訊號，提供即時的火警警報、偵煙器狀態與消防設備連動，確保在火災發生時能迅速反應，保障生命財產安全。",
				image: "/solutions/fire.webp",
				points: ["火警分區圖示化顯示", "偵煙器與手動報知機狀態監控", "與廣播、排煙、門禁系統連動"]
			},
			{
				id: "surveillance",
				title: "影像監視系統",
				color: "blue",
				description: "建構全方位的影像監控網絡，涵蓋公共區域、出入口及重要地點，提供即時影像監看、錄影回放與事件管理功能。",
				image: "/solutions/camera.webp",
				points: ["高解析度即時影像串流", "事件觸發錄影與告警", "整合 AI 影像分析，如人流偵測"]
			},
			{
				id: "lighting",
				title: "照明系統",
				color: "indigo",
				description: "對公共區域的照明進行智慧化控制，可依據時間排程、現場環境亮度或人員活動狀態自動調節燈光，達到節能與便利的雙重目標。",
				image: "/solutions/lighten.webp",
				points: ["分區、分群的燈光控制", "時間排程與感應器連動", "燈具狀態回報與故障偵測"]
			},
			{
				id: "sanitation",
				title: "衛生排水系統",
				color: "green",
				description: "監控建築的給排水系統，包括水位、泵浦運行狀態與污水處理狀況，確保系統正常運作，預防淹水或設備故障。",
				image: "/solutions/hygiene.webp",
				points: ["水箱液位高低警報", "泵浦運行時數與電流監測", "漏水偵測與警報"]
			},
			{
				id: "environmental-quality",
				title: "環境品質系統",
				color: "emerald",
				description: "監測室內外的空氣品質，包括二氧化碳(CO2)濃度、PM2.5、溫度和濕度等，並可連動空調與換氣設備，維持健康舒適的室內環境。",
				image: "/solutions/environment.webp",
				points: ["即時監測 CO2、PM2.5、溫濕度", "空氣品質超標自動警示", "連動空調與新風系統，改善室內空氣"]
			}
		]
	},
	"fire-alarm-system": {
		title: "火災預警系統",
		shortTitle: "火災預警",
		subtitle: "HeatPro VCA - AI影像科技，防範災害於未然",
		heroImage: "/solutions/火災預警系統.webp",
		relevantSeries: ["67ed0512296210e234e0de64", "67ed0512296210e234e0deb2"],
		meta: {
			title: " - 火災預警系統",
			description: "採用先進的 HeatPro 與 VCA 3.0 技術，透過雙光譜與深度學習演算法，精準識別潛在火災風險，適用於各種安防場景。"
		},
		introduction: [
			{
				id: "thermal-camera",
				title: "熱成像攝影機",
				icon: "/solutions/IPC.webp",
				description: "採用遠岫科技最新的熱感應技術，能精準偵測異常高溫區域。"
			},
			{
				id: "yscentral",
				title: "YSCentral Professional",
				icon: "/solutions/yscp.webp",
				description: "核心管理平台，處理警報信號並執行智能聯動指令。"
			},
			{
				id: "ip-speaker",
				title: "網路廣播喇叭 (IP Speaker)",
				icon: "/solutions/IP-Speaker.webp",
				description: "高品質網路廣播設備，確保警報訊息清晰傳達。"
			}
		],
		workflow: [
			{
				id: 1,
				title: "熱感應偵測",
				description: "攝影機偵測到異常高溫區域，自動辨識潛在火警風險。"
			},
			{
				id: 2,
				title: "信號傳輸",
				description: "攝影機 I/O 輸出端口即時發送警報信號至 YSCP 系統。"
			},
			{
				id: 3,
				title: "系統分析",
				description: "YSCP 解析警報信號並觸發預設的 IP 廣播聯動機制。"
			},
			{
				id: 4,
				title: "警報廣播",
				description: "網路廣播喇叭在火警現場及中控室同步播放警報警響或語音指示。"
			}
		],
		advantages: [
			{
				id: "automation",
				title: "自動化警報系統",
				description: "無需人工干預，系統能在火災初期自動發送警報，爭取黃金逃生時間。"
			},
			{
				id: "remote-management",
				title: "遠端管理與監控",
				description: "透過 YSCP 平台，管理人員可隨時遠端監控系統狀態並調整設定。"
			},
			{
				id: "two-way",
				title: "雙向通訊功能",
				description: "網路廣播喇叭支援 SIP 協議，可實現現場與控制中心的雙向語音溝通。"
			},
			{
				id: "environment",
				title: "環境適應性強",
				description: "設備具備 IP67 防護等級，能在高溫、潮濕等惡劣環境下穩定運作。"
			}
		],
		features: [
			{
				id: "aiDetection",
				title: "AI 智慧偵測",
				color: "orange",
				description: "採用先進的 HeatPro 與 VCA 3.0 技術，透過雙光譜與深度學習演算法，精準識別潛在火災風險。",
				points: ["雙頻譜分析", "自我學習校準", "聯合事件警報"],
				buttons: [
					{ label: "熱成像攝影機", category: "火災警報" },
					{ label: "網路錄影機", category: "NVR" }
				]
			}
		]
	},
	"aiot-property-management": {
		title: "智慧社區AIOT物業管理",
		shortTitle: "AIOT物管",
		subtitle: "Smart Living 以簡馭繁 生活多樂",
		heroImage: "/solutions/物業管理系統智慧生活.webp",
		// videoUrl: "https://www.youtube.com/watch?v=DXeD23SJhb0",
		relevantSeries: ["67ed0511296210e234e0ddd7", "67ed0512296210e234e0de10", "67ed0512296210e234e0de64"],
		meta: {
			title: " - 智慧社區AIOT物業管理解決方案",
			description: "遠岫科技提供智慧社區AIOT物業管理服務架構與解決方案，整合智慧科技、便利生活與高校管理，打造 Smart Living 新體驗。"
		},
		features: [
			{
				id: "smartTech",
				title: "智慧科技",
				color: "blue",
				description: "整合雷達對講、智能宅配與節能充電等先進技術，為社區打造安全、便捷的科技基礎設施。",
				points: ["雷達對講", "智能宅配箱", "公共節能充電"],
				buttons: [
					{ label: "對講系統", category: "可視對講機" },
					{ label: "門禁與周邊", category: "門禁控制" }
				]
			},
			{
				id: "collaboration",
				title: "多方協作架構",
				color: "indigo",
				description: "整合起造人、建商、營造公司、建築師至使用者，串聯機電、弱電與各項工程，提供一站式解決方案。",
				points: ["系統整合 (SI)", "中央監控 (BA)", "停車管理 (PA)"],
				buttons: [
					{ label: "中央監控", category: "NVR" },
					{ label: "停車管理", category: "車牌辨識管理系統" }
				]
			}
		]
	},
	"video-intercom-system": {
		title: "可視對講系統",
		shortTitle: "可視對講",
		subtitle: "結合門禁與視訊對講，實現真正的安全與便利",
		heroImage: "/solutions/可視對講系統.webp",
		videoUrl: "https://www.youtube.com/watch?v=-qq-HGAefiw",
		relevantSeries: ["67ed0511296210e234e0ddd7", "67ed0512296210e234e0de10"],
		meta: {
			title: " - 可視對講系統解決方案",
			description: "探索遠岫科技全面的可視對講與門禁控制產品，從人臉辨識到IP網路系列，提供真正安全、便利的通行解決方案。"
		},
		features: [
			{
				id: "accessControl",
				title: "門禁控制產品",
				color: "purple",
				description: "在正確的時間提供正確的通行權限。",
				points: ["人臉辨識門禁機", "感應卡機或門禁卡機", "門禁控制器"],
				buttons: [
					{ label: "門禁設備", category: "門禁控制" },
					{ label: "通關機", category: "通關機" }
				]
			},
			{
				id: "videoIntercom",
				title: "視訊對講產品",
				color: "sky",
				description: "真正的安全，真正的便利。",
				points: ["二線系列", "四線系列 (類比)", "八線系列 (類比)"],
				buttons: [
					{ label: "大門口機", category: "可視對講機", subCategory: "大門口機" },
					{ label: "室內機", category: "可視對講機", subCategory: "室內機" }
				]
			}
		]
	},
	"construction-site-solution": {
		title: "工地整合解決方案",
		shortTitle: "智慧工地",
		subtitle: "提升現場安全與智慧管理",
		heroImage: "/solutions/智慧工地管理.webp",
		videoUrl: "https://www.youtube.com/watch?v=o3vXtwa6HTk",
		relevantSeries: ["67ed0512296210e234e0de64", "67ed0512296210e234e0deb2", "67ed0512296210e234e0df00"],
		meta: {
			title: " - 智慧工地管理",
			description: "遠岫科技的工地整合解決方案，透過先進的影像監控與管理設備，提升工地現場的安全防護與智慧化管理效率。"
		},
		features: [
			{
				id: "siteMonitoring",
				title: "全方位影像監控",
				color: "orange",
				description: "整合多種專業攝影機，從固定視角到穿戴式裝置，全方位覆蓋工地現場，確保人員安全與作業記錄。",
				points: ["多元攝影機選擇，滿足全景、特寫等各種視角需求", "太陽能攝影機，克服無電區域的佈線挑戰", "180度廣角監控，提供無死角的工地視野"],
				buttons: [
					{ label: "解析度", category: "IPC", subCategory: "解析度" },
					{ label: "特殊場景", category: "IPC", subCategory: "特殊場景" }
				]
			},
			{
				id: "peripheralsAndPlatform",
				title: "智慧周邊與管理平台",
				color: "blue",
				description: "透過IP廣播、無線網路與中央管理平台，打造高效的工地溝通與管理協作環境。",
				points: ["IP 喇叭實現遠端廣播與嚇阻功能", "無線網橋提供穩定可靠的工地網路覆蓋", "YS Central 平台集中管理所有影像與事件"],
				buttons: [
					{ label: "管理平台與軟體", category: "網路設備及軟體" },
					{ label: "周邊設備", category: "周邊設備", subCategory: "IP Speaker" }
				]
			}
		]
	},
	"visitor-management-system": {
		title: "訪客管理系統",
		shortTitle: "訪客管理",
		subtitle: "專業系統旨在提供更優質的訪客體驗，保障人員與財產安全",
		heroImage: "/solutions/訪客管理系統.webp",
		videoUrl: "https://www.youtube.com/watch?v=mjO0PYVt39U",
		relevantSeries: ["67ed0512296210e234e0de10", "67ed0512296210e234e0de64", "67ed0512296210e234e0df00"],
		meta: {
			title: " - 訪客管理系統",
			description: "探索遠岫科技專業的訪客管理系統，結合預先登記、快速報到與多重安全策略，打造一個安全且高效的訪客流程。"
		},
		features: [
			{
				id: "visitorProcess",
				title: "訪客體驗與管理",
				color: "blue",
				description: "專業系統優化訪客流程、告別傳統低效率的管理方式，大幅提升訪客體驗與管理效率。",
				points: ["先進預登記", "輕鬆憑證出示", "快速報到"],
				buttons: [{ label: "訪客機", category: "訪客管理系統" }]
			}
		]
	},
	"meeting-reservation-system": {
		title: "智慧型視訊會議系統",
		shortTitle: "智慧會議",
		subtitle: "統一平台 × 系統互聯 × 節能管理",
		heroImage: "/solutions/會議預約系統.webp",
		meta: {
			title: " - 智慧型視訊會議系統",
			description: "結合視訊、網路與自動化控制，打造高效、低碳的智慧會議空間。"
		},
		introduction: [
			{ id: "area-discussion", title: "區域討論", icon: "/solutions/icons/area-discussion.svg", description: "靈活分組討論，支援多方協作與即時分享。" },
			{ id: "guest-reception", title: "來賓接待", icon: "/solutions/icons/guest-reception.svg", description: "為重要來賓提供專業且高效的接待體驗。" },
			{ id: "remote-meeting", title: "遠端會議", icon: "/solutions/icons/remote-meeting.svg", description: "打破距離限制，隨時隨地與全球團隊連線。" },
			{ id: "training", title: "培訓", icon: "/solutions/icons/training.svg", description: "高度互動的培訓空間，提升學習成效。" },
			{ id: "auditorium", title: "演講廳", icon: "/solutions/icons/auditorium.svg", description: "大規模演講與發布會的最佳場所。" }
		],
		challenges: [
			{
				id: "unified-platform",
				title: "統一管理",
				color: "purple",
				description: "在會議室內有效管理多個子系統的挑戰",
				image: "/solutions/management.webp",
				points: ["顯示、記錄、音響等設備分散", "管理流程複雜，效率低下"]
			},
			{
				id: "system-interconnect",
				title: "系統互聯",
				color: "blue",
				description: "會議管理系統與 OA、安防系統整合不足",
				image: "/solutions/security.webp",
				points: ["資料孤島，無法共享", "缺乏自動化流程"]
			},
			{
				id: "energy-consumption",
				title: "節能管理",
				color: "orange",
				description: "會議室內高耗能系統的節能挑戰",
				image: "/solutions/lighten.webp",
				points: ["空調、照明長時間運作", "缺乏智慧節能管理"]
			}
		],
		advantages: [
			{ id: "efficiency", title: "提升效率", description: "預訂與準備流程簡化，縮短會議籌備時間。" },
			{ id: "experience", title: "升級體驗", description: "視訊與協作工具整合，提升會議互動性。" },
			{ id: "management", title: "優化管理", description: "集中平台監控所有會議室使用狀態，提供決策依據。" }
		],
		painPoints: [
			{
				id: "efficiency",
				advantage: "提升效率",
				image: "/solutions/meeting01.png",
				title: "難以組織會議",
				description: "預訂會議室困難、繁瑣的會議前準備工作，以及耗時的會議後安排。"
			},
			{
				id: "experience",
				advantage: "升級體驗",
				image: "/solutions/meeting02.png",
				title: "會議中難以協作",
				description: "獨立系統問題、複雜的設備控制，以及視聽錄製的挑戰。"
			},
			{
				id: "management",
				advantage: "優化管理",
				image: "/solutions/meeting03.png",
				title: "難以管理所有會議",
				description: "缺乏管理者對整個會議空間使用情況的可見性，導致缺乏決策依據。"
			}
		]
	},
	"wireless-security-system": {
		title: "無線保全系統",
		shortTitle: "無線保全",
		subtitle: "與安卓室內機智能聯動，內建YS-Connect一站式管理",
		heroImage: "/solutions/無線保全系統.webp",
		videoUrl: "https://www.youtube.com/watch?v=fjF-h51JE9c",
		relevantSeries: ["67ed0512296210e234e0deb2", "67ed0512296210e234e0de64", "67ed0511296210e234e0ddd7", "67ed0512296210e234e0de10"],
		meta: {
			title: " - 無線保全系統",
			description: "遠岫科技無線保全系統，整合網路攝影機、門禁、手機APP與多種感測器，透過YS-Connect實現一站式智能管理。"
		},
		features: [
			{
				id: "core",
				title: "智能聯動核心",
				color: "sky",
				description: "以 YS-Connect 為核心，整合網路攝影機、入侵警報、門禁控制與安卓可視對講室內機，實現全方位智能聯動。",
				points: ["入侵警報觸發", "門禁開關控制", "手機APP遠端操作"],
				buttons: [
					{ label: "警報主機", category: "無線警報", subCategory: "主機 & 中繼器" },
					{ label: "可視對講室內機", category: "可視對講機", subCategory: "室內機" }
				]
			},
			{
				id: "access-control",
				title: "門禁控制",
				color: "blue",
				description: "整合門禁控制與手機APP，實現遠端開門與權限管理，確保只有授權人員能夠進入。",
				points: ["手機APP遠端開門", "多種開門方式 (卡片、密碼)", "事件紀錄查詢"],
				buttons: [
					{ label: "人臉識別機", category: "門禁控制", subCategory: "人臉識別機" },
					{ label: "刷卡機", category: "門禁控制", subCategory: "刷卡機" }
				]
			},
			{
				id: "surveillance",
				title: "網路攝影機",
				color: "orange",
				description: "搭配高畫質網路攝影機，隨時透過室內機或手機觀看即時影像，掌握家中狀況。",
				points: ["高畫質即時影像", "支援夜視功能", "移動偵測錄影"],
				buttons: [
					{ label: "解析度", category: "IPC", subCategory: "解析度" },
					{ label: "特殊場景", category: "IPC", subCategory: "特殊場景" }
				]
			}
		]
	},
	"long-term-care": {
		title: "長期照護解決方案",
		shortTitle: "長照機構",
		subtitle: "從校園安防到長者生活服務，遠岫科技提供完整的解決方案。",
		heroImage: "/solutions/長照.webp",
		videoUrl: "https://www.youtube.com/watch?v=DXeD23SJhb0",
		relevantSeries: [
			"67ed0512296210e234e0de64",
			"67ed0512296210e234e0deb2",
			"67ed0512296210e234e0de10",
			"67ed0512296210e234e0df00",
			"67ed0511296210e234e0ddd7"
		],
		meta: {
			title: " - 長照機構解決方案",
			description: "遠岫科技提供整合影像監控、跌倒偵測與緊急呼叫的長照機構解決方案，全方位守護住民安全，提升照護品質。"
		},
		features: [
			{
				id: "receptionAndGate",
				title: "大廳、接待區與大門管理",
				color: "blue",
				description: "整合訪客登記、門禁與車輛管理，從入口即建立第一道安全防線，同時確保授權人員與車輛進出順暢。",
				points: ["訪客登記與身份確認", "通關機與柵欄機有效管理人流", "車牌辨識自動化管理車輛進出"],
				buttons: [
					{ label: "訪客管理", category: "訪客管理系統" },
					{ label: "通關機", category: "通關機" },
					{ label: "車牌辨識", category: "車牌辨識管理系統", subCategory: "攝影機" }
				]
			},
			{
				id: "residentCare",
				title: "住民房間照護",
				color: "red",
				description: "在住民房間內部署智慧感測與呼叫系統，第一時間掌握住民的異常狀態，提供即時的照護與協助。",
				points: ["跌倒與離床偵測，主動發現異常", "緊急呼叫按鈕，方便住民隨時求助", "整合警報控制器，即時通知護理人員"],
				buttons: [
					{ label: "智慧感測", category: "無線警報", subCategory: "警報裝置" },
					{ label: "緊急呼叫", category: "無線警報", subCategory: "主機 & 中繼器" },
					{ label: "資訊顯示", category: "可視對講機", subCategory: "室內機" }
				]
			}
		]
	},
	"parking-management-system": {
		title: "停車管理系統",
		shortTitle: "停車管理",
		subtitle: "高效、安全、智慧化的現代停車解決方案",
		heroImage: "/solutions/停車管理系統.webp",
		videoUrl: "https://www.youtube.com/watch?v=N351H9Pz6r8",
		hideHeroFeatures: true,
		relevantSeries: ["67ed0512296210e234e0de10", "67ed0512296210e234e0de64", "67ed0512296210e234e0df00"],
		meta: {
			title: " - 停車管理系統",
			description: "遠岫科技提供基於車牌辨識的智慧停車管理系統，整合多元支付與雲端平台，實現無人化、高效率的停車場運營。"
		},
		challenges: [
			{
				id: "efficiency",
				title: "效率",
				color: "orange",
				description: "如何縮短尖峰等待時間？",
				image: "/solutions/efficiency.webp",
				points: ["如何加快日常作業，如身份驗證與收費？", "根據方向與空位指示快速找到停車位"]
			},
			{
				id: "security",
				title: "安全性",
				color: "blue",
				description: "如何防止未授權車輛進入？",
				image: "/solutions/security.webp",
				points: ["如何及時反應突發事件？", "如何快速調閱監控錄影？"]
			},
			{
				id: "user-experience",
				title: "使用體驗",
				color: "green",
				description: "如何快速找到空位？",
				image: "/solutions/user-experience.webp",
				points: ["如何幫助司機回想車停在哪裡？", "如何更好處理付款方式與停車體驗？"]
			},
			{
				id: "management",
				title: "管理",
				color: "purple",
				description: "如何掌握整體營運狀況？",
				image: "/solutions/management.webp",
				points: ["如何有效率設備、停車規則與車輛紀錄？", "各項營運狀態的日誌與報表"]
			}
		],
		solutions: [
			{
				id: "seamless-access-solution",
				title: "無感通行核心",
				points: ["高辨識率，不受天候影響", "支援多國車牌格式，可定義不同車輛通行規則", "快速通關，無需停車取票"]
			},
			{
				id: "smart-guidance-solution",
				title: "智慧導引與平台管理",
				points: ["在入口處查看各樓層剩餘車位", "查看各方向剩餘車位數量", "營收報表分析與遠端管理"]
			}
		],
		features: [
			{
				id: "seamlessAccess",
				title: "無感通行核心",
				color: "blue",
				description: "流暢且安全通行，您的可靠守衛。採用高準確率的 AI 車牌辨識技術，實現免接觸、不停車的車輛認證，大幅減少尖峰時段壅塞。",
				points: ["高辨識率，不受天候影響", "支援多國車牌格式，可定義不同車輛通行規則", "快速通關，無需停車取票"],
				buttons: [
					{ label: "攝影機", category: "車牌辨識管理系統", subCategory: "攝影機" },
					{ label: "柵欄機", category: "車牌辨識管理系統", subCategory: "柵欄機" }
				]
			},
			{
				id: "smartGuidanceAndManagement",
				title: "智慧導引與平台管理",
				color: "green",
				description: "直覺式引導，您的停車助理。從入口到車位，提供全面的資訊顯示與引導，並整合多元支付與雲端管理後台。",
				points: ["在入口處查看各樓層剩餘車位", "查看各方向剩餘車位數量", "營收報表分析與遠端管理"],
				buttons: [
					{ label: "管理軟體與周邊", category: "網路設備及軟體" },
					{ label: "網路與儲存", category: "NVR" }
				]
			}
		]
	}
};
