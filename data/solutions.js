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
		// videoUrl: "https://www.youtube.com/watch?v=fjF-h51JE9c",
		relevantSeries: [
			"67ed0511296210e234e0ddd7", // 可視對講
			"67ed0512296210e234e0de10", // 門禁管理
			"67ed0512296210e234e0de64", // 影像監控
			"67ed0512296210e234e0df00" // 其他應用 (相關配件)
		],
		meta: {
			title: " - 智慧宅系統整合",
			description: "遠岫科技提供全面的智慧宅系統整合方案，結合監視、門禁、對講、消防、電力與多種建築核心系統，實現真正的智慧化管理。"
		},
		features: [
			{
				id: "coreAccess",
				title: "核心通訊與門禁",
				color: "blue",
				description: "整合可視對講、人臉辨識門禁與手機 App，提供住戶與訪客無縫且安全的通行體驗，管理員也能透過電腦輕鬆控管。",
				points: ["智慧手機接聽對講、遠端開門", "人臉辨識或 QR Code 臨時碼快速通行", "管理中心電腦統一監看與授權"],
				buttons: [
					{ label: "可視對講", category: "可視對講機" },
					{ label: "門禁控制", category: "門禁控制" },
					{ label: "管理軟體", category: "網路設備及軟體" }
				]
			},
			{
				id: "surveillance",
				title: "全方位影像監控",
				color: "sky",
				description: "建立全面的影像監控網絡，涵蓋公共區域與停車場，並透過中央平台與手機進行即時監看與錄影回放。",
				points: ["停車場車牌辨識，管理車輛進出", "即時影像串流至手機與管理中心", "事件觸發警報並同步錄影"],
				buttons: [
					{ label: "監控攝影機", category: "IPC" },
					{ label: "車牌辨識", category: "車牌辨識管理系統", subCategory: "攝影機" },
					{ label: "NVR 儲存", category: "NVR" }
				]
			}
		]
	},
	"fire-alarm-system": {
		title: "火災預警系統",
		shortTitle: "火災預警",
		subtitle: "HeatPro VCA 3.0 - AI影像科技，防範災害於未然",
		heroImage: "/solutions/火災預警系統.webp",
		// videoUrl: "https://www.youtube.com/watch?v=N351H9Pz6r8",
		relevantSeries: ["67ed0512296210e234e0de64", "67ed0512296210e234e0deb2"],
		meta: {
			title: " - 火災預警系統",
			description: "採用先進的 HeatPro 與 VCA 3.0 技術，透過雙光譜與深度學習演算法，精準識別潛在火災風險，適用於各種安防場景。"
		},
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
		title: "會議預約系統",
		shortTitle: "會議預約",
		subtitle: "多通道與多終端線上線下會議預訂，提升會議體驗",
		heroImage: "/solutions/會議預約系統.webp",
		relevantSeries: ["67ed0512296210e234e0de64", "67ed0512296210e234e0df00"],
		meta: {
			title: " - 會議預約系統",
			description: "遠岫科技的智慧會議管理系統，整合視訊、網路與自動化控制，為政府與企業單位提供更便捷、高效的會議空間。"
		},
		features: [
			{
				id: "reservation",
				title: "多功能預約與管理",
				color: "blue",
				description: "支援多通道與多終端線上線下會議預訂，可設定各種會議類型，並提供資源狀態可視化顯示。",
				points: ["支援各類型會議設定", "資源狀態可視化顯示", "快速查找可用會議室"],
				buttons: [{ label: "管理軟體", category: "管理軟體" }]
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
		relevantSeries: ["67ed0512296210e234e0de10", "67ed0512296210e234e0de64", "67ed0512296210e234e0df00"],
		meta: {
			title: " - 停車管理系統",
			description: "遠岫科技提供基於車牌辨識的智慧停車管理系統，整合多元支付與雲端平台，實現無人化、高效率的停車場運營。"
		},
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
				points: ["在入口處查看各樓層剩餘車位", "查看各方向剩餘車位數量", "多元支付整合(悠遊卡、LINE Pay)", "營收報表分析與遠端管理"],
				buttons: [
					{ label: "管理軟體與周邊", category: "網路設備及軟體" },
					{ label: "網路與儲存", category: "NVR" }
				]
			}
		]
	}
};
