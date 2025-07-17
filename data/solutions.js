export const solutions = {
	"ai-smart-factory": {
		title: "AI 智慧工廠",
		shortTitle: "智慧工廠",
		subtitle: "強化安全與工作流程",
		heroImage: "/solutions/AI智慧工廠強化安全與工作流程.webp",
		relevantSeries: [
			"67ed0512296210e234e0de64", // 影像監控
			"67ed0512296210e234e0de10", // 門禁管理
			"67ed0512296210e234e0deb2", // 安全防護
			"67ed0512296210e234e0df00" // 其他應用
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
				description: "結合 AI 影像分析，即時監控工廠內人員行為、設備狀況與安全合規性，提前預防潛在風險。",
				points: ["24小時全天候監控，無人值守自動化管理", "AI 人員行為分析，即時偵測異常狀況", "高解析度影像記錄，完整保存重要證據"],
				buttons: [
					{ label: "攝影機", type: "camera" },
					{ label: "PoE", type: "poe" },
					{ label: "測溫設備", type: "temperature" }
				]
			},
			{
				id: "process",
				title: "流程監控",
				color: "green",
				description: "透過智能化流程追蹤，優化生產線效率，確保每個環節都能達到最佳的工作流程。",
				points: ["生產線即時監控，掌握每個製程環節", "自動化數據收集，提升管理決策品質", "異常警報系統，快速回應突發狀況"],
				buttons: [
					{ label: "儲存設備", type: "storage" },
					{ label: "顯示螢幕", type: "display" },
					{ label: "網路設備", type: "network" }
				]
			},
			{
				id: "safety",
				title: "人員安全",
				color: "blue",
				description: "整合人臉辨識、門禁控制與安全防護設備，全方位保障工廠人員的工作安全。",
				points: ["人臉辨識門禁，確保只有授權人員進入", "安全防護設備檢測，降低工安意外風險", "緊急應變系統，快速處理突發狀況"],
				buttons: [
					{ label: "門禁系統", type: "access" },
					{ label: "通關機", type: "gate" },
					{ label: "安全檢測", type: "security" }
				]
			},
			{
				id: "other",
				title: "其他應用",
				color: "purple",
				description: "包含預防性維護、餐廳付款系統等多元化應用，可根據工廠特殊需求客製化整合。",
				points: ["車牌辨識系統，管理車輛進出", "智能讀取器，提升作業效率", "自動化付款系統，便利員工生活"],
				buttons: [
					{ label: "車牌辨識", type: "vehicle" },
					{ label: "智能讀取器", type: "reader" },
					{ label: "支付系統", type: "payment" }
				]
			}
		],
		productMapping: {
			surveillance: {
				camera: ["IPC", "攝影機", "監控"],
				poe: ["PoE", "供電", "交換器"],
				temperature: ["測溫", "溫度", "熱像"]
			},
			process: {
				storage: ["NVR", "儲存", "錄影"],
				display: ["LED", "顯示", "螢幕"],
				network: ["網路", "交換器", "路由"]
			},
			safety: {
				access: ["門禁", "人臉", "指紋"],
				gate: ["通關機", "閘門", "驗證"],
				security: ["金屬檢測", "安檢", "防護"]
			},
			other: {
				vehicle: ["車牌", "停車", "辨識"],
				reader: ["讀取器", "感應", "RFID"],
				payment: ["支付", "付款", "收費"]
			}
		}
	},
	"community-security": {
		title: "社區大樓安防解決方案",
		shortTitle: "社區安防",
		subtitle: "整合多重防護，打造智慧安全社區",
		heroImage: "/solutions/人臉門禁控制.webp", // 請將對應的圖片放到 public/solutions/
		relevantSeries: [
			"67ed0512296210e234e0de10", // 門禁管理 (車牌辨識, 人臉辨識)
			"67ed0511296210e234e0ddd7", // 可視對講
			"67ed0512296210e234e0de64", // 影像監控 (半球攝影機, 戶外監控)
			"67ed0512296210e234e0deb2" // 安全防護 (警報攝影機)
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
					{ label: "車牌辨識", type: "lpr" },
					{ label: "停車管理", type: "parking" }
				]
			},
			{
				id: "lobby-access",
				title: "大廳門禁",
				description: "免接觸住戶進出、無紙化訪客管理",
				color: "sky",
				points: ["人臉辨識，無感通行", "手機 App 遠端開門", "QR Code 訪客邀請，安全便利"],
				buttons: [
					{ label: "人臉辨識", type: "face" },
					{ label: "可視對講", type: "intercom" }
				]
			},
			{
				id: "public-space",
				title: "室內公共空間",
				description: "全天候高解析度影像保護，聚焦人員／車輛事件",
				color: "emerald",
				points: ["全景攝影機，無死角監控", "AI 事件偵測，自動標記", "高畫質錄影，保留證據"],
				buttons: [
					{ label: "半球攝影機", type: "dome" },
					{ label: "室內監控", type: "indoor" }
				]
			},
			{
				id: "perimeter",
				title: "周界防護",
				description: "敏感入侵偵測搭配高清影像驗證",
				color: "amber",
				points: ["智慧偵測，減少誤報", "聲光警報，嚇阻入侵者", "即時手機推播，掌握狀況"],
				buttons: [
					{ label: "警報攝影機", type: "alarm_cam" },
					{ label: "戶外監控", type: "outdoor" }
				]
			},
			{
				id: "control-center",
				title: "管理中心",
				description: "統一管理・輕量級平台",
				color: "indigo",
				points: ["電視牆統一監看", "單一平台操作所有設備", "事件集中管理，快速反應"],
				buttons: [
					{ label: "電視牆", type: "tv_wall" },
					{ label: "儲存設備", type: "storage" }
				]
			}
		],
		productMapping: {
			"vehicle-access": {
				lpr: ["車牌", "LPR"],
				parking: ["停車"]
			},
			"lobby-access": {
				face: ["人臉", "門禁"],
				intercom: ["對講", "VDP"]
			},
			"public-space": {
				dome: ["半球", "dome"],
				indoor: ["室內", "攝影機"]
			},
			perimeter: {
				alarm_cam: ["警報", "槍型"],
				outdoor: ["戶外", "防水"]
			},
			"control-center": {
				tv_wall: ["電視牆", "解碼器", "顯示"],
				storage: ["NVR", "儲存", "錄影"]
			}
		}
	},
	"smart-home-integration": {
		title: "智慧宅系統整合",
		shortTitle: "智慧住宅",
		subtitle: "打造安全、便利、高效的現代智慧建築管理核心",
		heroImage: "/solutions/智慧宅系統整合.webp",
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
				id: "centralControl",
				title: "中央監控與門禁",
				color: "blue",
				description: "整合門禁、對講、監視與LINE通報，提供管理員與住戶最即時的資訊與便利的操作。",
				points: ["網頁伺服器/APP實現遠端監控", "訪客QRCode臨時密碼/WEB網頁開門", "智慧手機接聽、開門、監看"],
				buttons: [
					{ label: "可視對講", type: "intercom" },
					{ label: "門禁主機", type: "accessControl" },
					{ label: "網路交換器", type: "hub" }
				]
			},
			{
				id: "multiSystem",
				title: "多元系統整合",
				color: "green",
				description: "串接消防、電力、空調、電梯等建築核心系統，實現統一管理與自動化事件處理。",
				points: ["消防、電力、空調訊號即時監看", "電梯樓層整合與叫車服務", "停車場車牌辨識與柵欄控制"],
				buttons: [
					{ label: "相關配件", type: "accessories" },
					{ label: "攝影機", type: "camera" }
				]
			}
		],
		productMapping: {
			centralControl: {
				intercom: ["對講", "室內機", "VDP"],
				accessControl: ["門禁", "控制器", "主機"],
				hub: ["交換器", "hub", "PoE"]
			},
			multiSystem: {
				accessories: ["電力", "消防", "空調", "電梯"],
				camera: ["攝影機", "車牌"]
			}
		}
	},
	"fire-alarm-system": {
		title: "火災預警系統",
		shortTitle: "火災預警",
		subtitle: "HeatPro VCA 3.0 - AI影像科技，防範災害於未然",
		heroImage: "/solutions/火災預警系統.webp",
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
				points: ["熱煙模型精準分析", "雙光譜影像融合分析", "自我學習演算法持續校準", "支援聯合事件觸發警報"],
				buttons: [
					{ label: "熱成像攝影機", type: "thermalCamera" },
					{ label: "網路錄影機", type: "nvr" }
				]
			},
			{
				id: "multiApp",
				title: "多場景應用",
				color: "purple",
				description: "不僅限於火災預警，更能應用於周界防護、入侵偵測等多種安防場景。",
				points: ["重點區域溫度異常監控", "人員/車輛入侵偵測", "自動觸發聲光警報與連動"],
				buttons: [
					{ label: "防爆攝影機", type: "explosionProof" },
					{ label: "警報設備", type: "alarm" }
				]
			}
		],
		productMapping: {
			aiDetection: {
				thermalCamera: ["熱", "測溫", "溫度", "HeatPro"],
				nvr: ["錄影機", "NVR", "儲存"]
			},
			multiApp: {
				explosionProof: ["防爆"],
				alarm: ["警報", "喇叭", "聲光"]
			}
		}
	},
	"aiot-property-management": {
		title: "智慧社區AIOT物業管理",
		shortTitle: "AIOT物管",
		subtitle: "Smart Living 以簡馭繁 生活多樂",
		heroImage: "/solutions/物業管理系統智慧生活.webp",
		relevantSeries: ["67ed0511296210e234e0ddd7", "67ed0512296210e234e0de10", "67ed0512296210e234e0de64"],
		meta: {
			title: " - 智慧社區AIOT物業管理解決方案",
			description: "遠岫科技提供智慧社區AIOT物業管理服務架構與解決方案，整合智慧科技、便利生活與高校管理，打造 Smart Living 新體驗。"
		},
		features: [
			{
				id: "smartServices",
				title: "智慧社區 服務介紹",
				color: "green",
				description: "放心住好！我們早一步做到。從智慧對講、智能宅配到公設預約，提供全方位的社區服務。",
				points: ["智慧對講", "智能宅配箱", "公共節能充電", "公設預約", "互聯抄表", "住戶服務"],
				buttons: [
					{ label: "對講系統", type: "intercom" },
					{ label: "門禁系統", type: "access" }
				]
			},
			{
				id: "collaboration",
				title: "多方協作架構",
				color: "blue",
				description: "整合起造人、建商、營造公司、建築師至使用者，串聯機電、弱電與各項工程，提供一站式解決方案。",
				points: ["系統整合 (SI)", "中央監控 (BA)", "門禁+影像 (SA)", "停車管理 (PA)", "綜合佈線 (CA)", "對講+環控 (HA)"],
				buttons: [
					{ label: "中央監控", type: "centralControl" },
					{ label: "停車管理", type: "parking" }
				]
			}
		],
		productMapping: {
			smartServices: {
				intercom: ["對講", "室內機", "VDP"],
				access: ["門禁", "宅配"]
			},
			collaboration: {
				centralControl: ["監控", "NVR"],
				parking: ["停車", "車牌"]
			}
		}
	},
	"video-intercom-system": {
		title: "可視對講系統",
		shortTitle: "可視對講",
		subtitle: "在正確的時間提供正確的通行權限，實現真正的安全與便利",
		heroImage: "/solutions/可視對講系統.webp",
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
				points: ["人臉辨識門禁機", "指紋辨識門禁機", "感應卡機或門禁卡機", "門禁控制器", "讀卡機", "旋轉閘門或三輥閘", "電子鎖或門鎖"],
				buttons: [
					{ label: "人臉/指紋", type: "biometric" },
					{ label: "卡機/讀卡", type: "cardReader" },
					{ label: "閘門/鎖", type: "gateLock" }
				]
			},
			{
				id: "videoIntercom",
				title: "視訊對講產品",
				color: "sky",
				description: "真正的安全、真正的便利。",
				points: ["二線系列", "四線系列 (類比)", "八線系列 (類比)", "IP網路系列"],
				buttons: [
					{ label: "IP 網路系列", type: "ipSeries" },
					{ label: "類比系列", type: "analog" }
				]
			}
		],
		productMapping: {
			accessControl: {
				biometric: ["人臉", "指紋"],
				cardReader: ["卡機", "讀卡", "控制器"],
				gateLock: ["閘門", "電子鎖"]
			},
			videoIntercom: {
				ipSeries: ["IP", "網路"],
				analog: ["二線", "四線", "八線", "類比"]
			}
		}
	},
	"construction-site-solution": {
		title: "工地整合解決方案",
		shortTitle: "智慧工地",
		subtitle: "提升現場安全與智慧管理",
		heroImage: "/solutions/智慧工地管理.webp",
		relevantSeries: ["67ed0512296210e234e0de64"],
		meta: {
			title: " - 智慧工地管理",
			description: "遠岫科技的工地整合解決方案，透過先進的影像監控與管理設備，提升工地現場的安全防護與智慧化管理效率。"
		},
		features: [
			{
				id: "siteMonitoring",
				title: "全方位工地監控",
				color: "orange",
				description: "整合多種專業攝影機與監控設備，從周界防護到內部管理，全方位覆蓋工地現場，確保人員與財產安全。",
				points: [
					"槍型/球型攝影機，應對各種環境",
					"太陽能網路攝影機，解決無電區域佈線難題",
					"Wi-Fi 安全攝影機，提供彈性安裝選擇",
					"中央管理平台，統一監看與管理"
				],
				buttons: [
					{ label: "監控攝影機", type: "camera" },
					{ label: "太陽能攝影機", type: "solar" },
					{ label: "Wi-Fi 攝影機", type: "wifi" },
					{ label: "中央管理", type: "central" }
				]
			}
		],
		productMapping: {
			siteMonitoring: {
				camera: ["槍型", "球型", "攝影機"],
				solar: ["太陽能"],
				wifi: ["Wi-Fi"],
				central: ["Central", "平台"]
			}
		}
	},
	"visitor-management-system": {
		title: "訪客管理系統",
		shortTitle: "訪客管理",
		subtitle: "專業系統旨在提供更優質的訪客體驗，保障人員與財產安全",
		heroImage: "/solutions/訪客管理系統.webp",
		relevantSeries: ["67ed0512296210e234e0de10", "67ed0512296210e234e0de64", "67ed0512296210e234e0df00"],
		meta: {
			title: " - 訪客管理系統",
			description: "探索遠岫科技專業的訪客管理系統，結合預先登記、快速報到與多重安全策略，打造一個安全且高效的訪客流程。"
		},
		features: [
			{
				id: "visitorProcess",
				title: "核心功能：打造順暢訪客體驗",
				color: "blue",
				description: "專業系統優化訪客流程、告別傳統低效率的管理方式，大幅提升訪客體驗與管理效率。",
				points: ["先進預登記", "不間斷通行", "輕鬆憑證出示", "快速報到"],
				buttons: [
					{ label: "訪客機", type: "kiosk" },
					{ label: "QR/OCR 配件", type: "reader" }
				]
			},
			{
				id: "securityPolicy",
				title: "高規格安全控管",
				color: "purple",
				description: "系統提供多重安全策略，確保人員與財產雙重保障。",
				points: ["防止私自攜帶物品進出", "即時訪客提醒機制", "訪客需在規定時間內離場"],
				buttons: [
					{ label: "門禁閘門", type: "gate" },
					{ label: "影像監控", type: "surveillance" }
				]
			}
		],
		productMapping: {
			visitorProcess: {
				kiosk: ["訪客機"],
				reader: ["QR", "OCR", "讀取", "列印"]
			},
			securityPolicy: {
				gate: ["閘門", "通關機"],
				surveillance: ["攝影機", "IPC", "監控"]
			}
		}
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
				points: ["支援各類型會議設定", "設定各種會議類型", "資源狀態可視化顯示", "快速查找可用會議室", "衝突預約即時提醒"],
				buttons: [
					{ label: "會議平板", type: "panel" },
					{ label: "管理軟體", type: "software" }
				]
			},
			{
				id: "environment",
				title: "智慧化會議環境",
				color: "green",
				description: "將傳統會議室升級為數位化與智能化的工作環境，旨在提升會議效率、改善會議體驗並降低會議成本。",
				points: ["與視訊系統整合", "網路化集中控制", "自動化環境設定"],
				buttons: [
					{ label: "網路攝影機", type: "camera" },
					{ label: "顯示設備", type: "display" }
				]
			}
		],
		productMapping: {
			reservation: {
				panel: ["平板", "會議", "預約"],
				software: ["軟體", "管理"]
			},
			environment: {
				camera: ["攝影機", "IPC"],
				display: ["螢幕", "顯示"]
			}
		}
	},
	"wireless-security-system": {
		title: "無線保全系統",
		shortTitle: "無線保全",
		subtitle: "與安卓室內機智能聯動，內建YS-Connect一站式管理",
		heroImage: "/solutions/無線保全系統.webp",
		relevantSeries: ["67ed0512296210e234e0deb2", "67ed0512296210e234e0de64", "67ed0511296210e234e0ddd7"],
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
				points: ["網路攝影機即時影像", "入侵警報觸發", "門禁開關控制", "安卓可視對講室內機", "手機APP遠端操作"],
				buttons: [
					{ label: "室內機/主機", type: "panel" },
					{ label: "攝影機", type: "camera" }
				]
			},
			{
				id: "sensors",
				title: "多元感測與防禦",
				color: "red",
				description: "透過多種無線輸入與輸出裝置，建構完整的防禦網絡，內建電池可確保在室內機/手機上 24x7 即時取景。",
				points: ["多種輸入裝置 (門磁、煙感等)", "多種輸出裝置 (警報器、閃燈等)", "偽防裝置，防止惡意破壞", "內建電池，斷電也能運作"],
				buttons: [
					{ label: "感測器", type: "sensors" },
					{ label: "警報器", type: "alarms" }
				]
			}
		],
		productMapping: {
			core: {
				panel: ["室內機", "主機", "Android", "安卓"],
				camera: ["攝影機", "IPC"]
			},
			sensors: {
				sensors: ["輸入", "感測", "門磁", "紅外"],
				alarms: ["輸出", "警報", "聲光"]
			}
		}
	},
	"long-term-care": {
		title: "長照機構解決方案",
		shortTitle: "長照機構",
		subtitle: "整合影像監控與即時警報，打造全方位安全照護環境",
		heroImage: "/solutions/長照.webp",
		relevantSeries: ["67ed0512296210e234e0de64", "67ed0512296210e234e0deb2", "67ed0512296210e234e0de10"],
		meta: {
			title: " - 長照機構解決方案",
			description: "遠岫科技提供整合影像監控、跌倒偵測與緊急呼叫的長照機構解決方案，全方位守護住民安全，提升照護品質。"
		},
		features: [
			{
				id: "lifeSafety",
				title: "生命安全與即時警報",
				color: "red",
				description: "結合影像監控與多元感測器，實現主動式安全防護，在緊急時刻保障住民安全。",
				points: [
					"24小時影像監控，隨時掌握公共區域動態",
					"跌倒偵測攝影機，即時發現異常並發出警報",
					"無線緊急按鈕，方便住民隨時求助",
					"煙霧與氣體偵測，預防火災等意外"
				],
				buttons: [
					{ label: "監控攝影機", type: "camera" },
					{ label: "緊急按鈕", type: "emergencyButton" },
					{ label: "環境感測器", type: "sensor" }
				]
			},
			{
				id: "healthManagement",
				title: "健康管理與出入監控",
				color: "blue",
				description: "透過智慧化設備輔助健康監測與人員管理，提升照護效率與住民生活品質。",
				points: ["生理數據監測，掌握住民健康狀況", "人臉辨識門禁，管理人員與訪客進出", "電子圍籬，防止住民走失", "遠端影像關懷，家屬可隨時探視"],
				buttons: [
					{ label: "門禁系統", type: "accessControl" },
					{ label: "無線警報", type: "wirelessAlarm" }
				]
			}
		],
		productMapping: {
			lifeSafety: {
				camera: ["攝影機", "IPC", "跌倒"],
				emergencyButton: ["緊急按鈕", "無線"],
				sensor: ["煙霧", "瓦斯", "感測"]
			},
			healthManagement: {
				accessControl: ["門禁", "人臉"],
				wirelessAlarm: ["無線", "警報", "主機"]
			}
		}
	},
	"parking-management-system": {
		title: "停車管理系統",
		shortTitle: "停車管理",
		subtitle: "高效、安全、智慧化的現代停車解決方案",
		heroImage: "/solutions/停車管理系統.webp",
		relevantSeries: ["67ed0512296210e234e0de10", "67ed0512296210e234e0de64"],
		meta: {
			title: " - 停車管理系統",
			description: "遠岫科技提供基於車牌辨識的智慧停車管理系統，整合多元支付與雲端平台，實現無人化、高效率的停車場運營。"
		},
		features: [
			{
				id: "licensePlateRecognition",
				title: "車牌辨識核心",
				color: "blue",
				description: "採用高準確率的 AI 車牌辨識技術，實現快速、無感的車輛進出體驗。",
				points: ["高辨識率，不受天候影響", "支援多國車牌格式", "快速通關，無需停車取票"],
				buttons: [
					{ label: "車牌辨識攝影機", type: "lprCamera" },
					{ label: "智慧柵欄機", type: "barrierGate" }
				]
			},
			{
				id: "managementPlatform",
				title: "雲端管理平台",
				color: "green",
				description: "提供全面的雲端管理後台，讓管理者隨時隨地掌握停車場運營狀況。",
				points: ["即時監控剩餘車位", "多元支付整合(悠遊卡、LINE Pay)", "營收報表分析與管理", "遠端控制柵欄與設備"],
				buttons: [
					{ label: "管理軟體", type: "software" },
					{ label: "網路與儲存", type: "network" }
				]
			}
		],
		productMapping: {
			licensePlateRecognition: {
				lprCamera: ["車牌辨識", "LPR", "攝影機"],
				barrierGate: ["柵欄機", "道閘"]
			},
			managementPlatform: {
				software: ["軟體", "平台", "管理"],
				network: ["交換器", "NVR", "儲存"]
			}
		}
	}
};
