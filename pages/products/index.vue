<template>
	<div>
		<!-- Section 1: Vision & Core Strengths -->
		<section class="text-white py-16 md:py-24 flex flex-col justify-center items-center text-center px-4 sm:px-6 space-y-[24px] md:space-y-[48px]">
			<div ref="visionTitleRef" class="opacity-0 space-y-[24px] md:space-y-[48px]">
				<h1 class="text-[28px] sm:text-[36px] md:text-[48px] lg:text-[60px] xl:text-[72px] font-bold">智能科技，重塑體驗</h1>
				<p
					class="text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px] text-sky-200 max-w-4xl"
					style="text-shadow: 0 0 10px rgba(0, 0, 0, 0.8)"
				>
					遠岫科技融合尖端技術與人性化設計，致力於為您的生活與工作空間，注入前所未有的便捷、安全與高效，提升全方位智能體驗。
				</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl">
				<div
					v-for="(strength, index) in coreStrengths"
					:key="index"
					:ref="(el) => (coreStrengthRefs[index] = el)"
					class="bg-sky-700/40 backdrop-blur-sm p-4 rounded-lg shadow-lg opacity-0 flex flex-col items-center"
				>
					<div class="flex justify-center">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" :d="strength.icon" />
						</svg>
					</div>
					<h3 class="text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] font-semibold mb-4 text-sky-300">{{ strength.title }}</h3>
					<p class="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] text-secondary">{{ strength.description }}</p>
				</div>
			</div>

			<div ref="galleryIntroTextRef" class="opacity-0">
				<p class="text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] text-white max-w-3xl" style="text-shadow: 0 0 10px rgba(0, 0, 0, 0.8)">
					準備好探索遠岫科技如何將這些核心價值融入每一款產品解決方案了嗎？讓我們一同啟程，體驗智能科技如何為您打造更卓越的未來。
				</p>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-10 w-10 text-secondary mx-auto mt-8 animate-bounce"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
				</svg>
			</div>
		</section>

		<!-- Section 2: Product Gallery -->
		<div class="product-gallery-container" ref="galleryContainerToPinRef">
			<header class="text-center pt-4 md:pt-8 space-y-[12px] md:space-y-[24px]">
				<h1 class="text-[24px] sm:text-[32px] md:text-[36px] lg:text-[40px] xl:text-[48px] font-bold">產品解決方案</h1>
			</header>

			<div class="gallery-scroll-container" ref="scrollContainerRef">
				<!-- Desktop: Horizontal Scroll Sections -->
				<template v-if="!isMobileMode">
					<section v-for="(solution, index) in solutions" :key="solution.id" class="solution-section" :ref="(el) => (solutionElements[index] = el)">
						<div class="solution-content">
							<div class="image-container relative group">
								<NuxtImg
									:src="solution.image"
									:alt="solution.title"
									format="webp"
									quality="80"
									loading="lazy"
									fetchpriority="low"
									class="solution-image cursor-pointer transition-transform duration-300 ease-in-out"
									tabindex="0"
									role="button"
									:aria-label="`查看 ${solution.title} 詳情`"
									@click="openDetailsModal(solution, $event.target)"
									@keydown.enter="openDetailsModal(solution, $event.target)"
									@keydown.space.prevent="openDetailsModal(solution, $event.target)"
								/>
								<button
									@click="openDetailsModal(solution, $event.target)"
									class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-sky-600/80 hover:bg-sky-500/90 text-white px-4 py-2 rounded-lg text-[21px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out shadow-lg backdrop-blur-sm"
									aria-label="查看方案詳情"
								>
									查看詳情
								</button>
							</div>
						</div>
					</section>
				</template>
				<!-- Mobile: Single Active Section with Transition -->
				<template v-else-if="isMobileMode && currentSolution">
					<transition name="solution-mobile-fade" mode="out-in">
						<section :key="currentSolution.id" class="solution-section is-mobile-active-section">
							<div class="solution-content-mobile">
								<div class="image-container mb-4">
									<NuxtImg
										:src="currentSolution.image"
										:alt="currentSolution.title"
										format="webp"
										quality="80"
										loading="lazy"
										fetchpriority="low"
										class="solution-image cursor-pointer"
										@click="openDetailsModal(currentSolution, $event.target)"
										tabindex="0"
										role="button"
										:aria-label="`查看 ${currentSolution.title} 詳情`"
									/>
								</div>
							</div>
						</section>
					</transition>
				</template>
			</div>

			<div class="gallery-navigation-sides" ref="galleryNavSidesRef">
				<nav class="gallery-navigation-left text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px]" ref="galleryNavLeftRef">
					<button
						v-for="(solution, index) in solutions.filter((_, i) => i < Math.ceil(solutions.length / 2))"
						:key="`nav-left-${solution.id}`"
						@click="navigateToSection(solutions.findIndex((s) => s.id === solution.id))"
						:class="{ active: currentSectionIndex === solutions.findIndex((s) => s.id === solution.id) }"
					>
						{{ solution.shortTitle || solution.title }}
					</button>
				</nav>
				<nav class="gallery-navigation-right text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px]" ref="galleryNavRightRef">
					<button
						v-for="(solution, index) in solutions.filter((_, i) => i >= Math.ceil(solutions.length / 2))"
						:key="`nav-right-${solution.id}`"
						@click="navigateToSection(solutions.findIndex((s) => s.id === solution.id))"
						:class="{ active: currentSectionIndex === solutions.findIndex((s) => s.id === solution.id) }"
					>
						{{ solution.shortTitle || solution.title }}
					</button>
				</nav>
			</div>
		</div>

		<!-- Modified Details Modal (Formerly Lightbox) -->
		<div
			v-if="isDetailsModalOpen && currentSolutionForDetailsModal"
			class="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
			role="dialog"
			aria-modal="true"
			:aria-labelledby="detailsModalTitleId"
			@click.self="closeDetailsModal"
			@keydown.esc.prevent="closeDetailsModal"
		>
			<div class="details-modal-content bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full flex flex-col max-h-[90vh]">
				<!-- Close Button -->
				<button
					ref="closeDetailsModalButtonRef"
					@click="closeDetailsModal"
					class="absolute top-6 right-6 text-white hover:text-sky-300 rounded-full p-1 z-[51] bg-slate-700/50 hover:bg-slate-600/70 transition-colors"
					aria-label="關閉詳情"
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 md:w-7 md:h-7">
						<title>關閉圖示</title>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>

				<!-- Details Content -->
				<div class="p-8 flex flex-col text-white overflow-y-auto custom-scrollbar-lightbox">
					<h2 :id="detailsModalTitleId" class="text-xl sm:text-2xl md:text-3xl font-bold text-sky-300 mb-3 md:mb-4">
						{{ currentSolutionForDetailsModal.title }}
					</h2>

					<div class="mb-4 md:mb-6">
						<h3 class="text-lg sm:text-xl font-semibold text-sky-400 mb-1.5 md:mb-2">方案說明</h3>
						<p class="text-sm sm:text-base text-gray-300 leading-relaxed">{{ currentSolutionForDetailsModal.description || "暫無詳細說明。" }}</p>
					</div>

					<div v-if="currentSolutionForDetailsModal.relatedProducts && currentSolutionForDetailsModal.relatedProducts.length > 0" class="mb-4 md:mb-6">
						<h3 class="text-lg sm:text-xl font-semibold text-sky-400 mb-2 md:mb-3">相關產品系列</h3>
						<div class="space-y-3">
							<div
								v-for="(product, pIndex) in currentSolutionForDetailsModal.relatedProducts"
								:key="pIndex"
								class="bg-sky-700/40 hover:bg-sky-700/70 p-3 rounded-md shadow-sm transition-colors duration-200 border border-sky-600/50"
							>
								<p class="text-sm sm:text-base font-semibold text-sky-200 mb-0.5">{{ product.series }}</p>
								<p class="text-xs sm:text-sm text-gray-300 mb-1.5 leading-snug">{{ product.description }}</p>
								<NuxtLink :to="product.link" class="text-xs sm:text-sm text-sky-300 hover:text-sky-100 hover:underline rounded-sm inline-flex items-center">
									查看系列產品
									<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
										<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
									</svg>
								</NuxtLink>
							</div>
						</div>
					</div>

					<div class="mt-auto pt-4">
						<ButtonCTA label="產品諮詢" to="/contact" color="white" class="md:w-auto" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from "vue";
import { useScrollAnimation } from "@/composables/useScrollAnimation";
import { useHead } from "#app";
import ButtonCTA from "@/components/common/Button-CTA.vue";

// Set page title and meta description
useHead({
	title: " - 智慧方案",
	meta: [
		{
			name: "description",
			content: "探索遠岫科技全方位的智能解決方案，從可視對講、門禁管理到影像監控與安全防護，我們致力於為您的生活與工作空間提供創新技術與卓越品質。"
		}
	]
});

const { initScrollPlugins, ScrollTrigger, gsap, cleanupScrollTriggers } = useScrollAnimation();

const visionTitleRef = ref(null);
const coreStrengthRefs = ref([]);
const galleryIntroTextRef = ref(null);

const coreStrengths = ref([
	{
		icon: "M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9",
		title: "卓越品質與創新",
		description: "以最高標準打造每款產品，融合前沿技術，確保卓越性能，引領行業發展。"
	},
	{
		icon: "M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6zM6 6.75A.75.75 0 005.25 7.5v9c0 .414.336.75.75.75H15a.75.75 0 00.75-.75V15a.75.75 0 00-.75-.75H7.5a.75.75 0 01-.75-.75V7.5A.75.75 0 006 6.75z",
		title: "全方位整合方案",
		description: "提供從前端感知到後端管理的一站式服務，實現各系統無縫整合與高效協同。"
	},
	{
		icon: "M3.75 12h16.5m-16.5 0V6.75A2.25 2.25 0 016 4.5h12A2.25 2.25 0 0120.25 6.75V12m-16.5 0v5.25A2.25 2.25 0 006 19.5h12a2.25 2.25 0 002.25-2.25V12M3.75 12H20.25M12 4.5V19.5",
		title: "多樣化場景賦能",
		description: "深入理解行業獨特需求，產品廣泛應用於各類場景，提升智能化水平與運營效率。"
	}
]);

const solutions = ref([
	{
		id: "smart-property",
		title: "物業管理系統智慧生活",
		shortTitle: "物業管理",
		image: "/solutions/物業管理系統智慧生活.png",
		description:
			"遠岫科技的「物業管理系統智慧生活」方案，整合先進社區管理工具與住戶服務APP。透過雲端平台與智能化中央控制，實現對社區門禁、訪客、包裹管理、公共設施預約、線上繳費、社區公告及報修服務的一站式管理，結合智能居家概念，提升物業運營效率，為住戶帶來便捷、安全的現代居住體驗。",
		relatedProducts: [
			{ series: "可視對講系統", description: "高清影像與語音通話，提升住戶與訪客溝通效率。", link: "/Products/video-intercom" },
			{ series: "門禁管理系統", description: "包含人臉、卡片、QR Code等多重驗證，保障社區出入安全。", link: "/Products/access-control" },
			{ series: "影像監控系統", description: "實時監控社區動態，提升應急處理能力。", link: "/Products/surveillance-monitoring" },
			{ series: "停車管理方案", description: "整合車牌辨識，優化社區停車管理。", link: "/Products/access-control" },
			{ series: "訪客管理整合", description: "提供便捷的訪客預約與通行管理。", link: "/Products/access-control" }
		]
	},
	{
		id: "video-intercom",
		title: "可視對講系統",
		shortTitle: "可視對講",
		image: "/solutions/可視對講系統.png",
		description:
			"遠岫科技提供高品質IP架構的可視對講解決方案，包含室內機、門口機及管理中心機，支援APP遠端通話與開鎖。系統結合清晰影音傳輸、多種開門方式，並可整合電梯控制與智慧居家系統，為公寓大樓、別墅及辦公場所實現便捷訪客管理與安全出入控制。",
		relatedProducts: [
			{ series: "可視對講機系列", description: "多樣化室內機與門口機，滿足不同場域需求。", link: "/Products/video-intercom" },
			{ series: "管理中心主機", description: "集中管理社區內所有對講設備，強化物業運營效率。", link: "/Products/video-intercom" },
			{ series: "門禁控制整合", description: "可連動門禁系統，提升整體出入安全。", link: "/Products/access-control" }
		]
	},
	{
		id: "fire-alarm",
		title: "火災預警系統",
		shortTitle: "火災預警",
		image: "/solutions/火災預警系統.png",
		description:
			"遠岫科技的火災預警系統，整合消防受信總機、無線感測器（偵煙、偵溫、瓦斯偵測）及緊急按鈕。透過雲端平台與APP連動，即時推播警報至用戶與相關單位。適用於住宅、工廠、商辦及醫療機構等場所，為生命財產安全提供早期預警與多重保障。",
		relatedProducts: [
			{ series: "火災報警設備", description: "包含各類偵煙、偵溫感測器與報警主機。", link: "/Products/security-solutions" },
			{ series: "無線警報配件", description: "易於安裝的無線感測器，擴展防護範圍。", link: "/Products/security-solutions" },
			{ series: "系統整合方案", description: "可與中央監控或樓宇自動化系統整合。", link: "/Products/security-solutions" }
		]
	},
	{
		id: "central-monitoring",
		title: "中央監控",
		shortTitle: "中央監控",
		image: "/solutions/中央監控.png",
		description:
			"遠岫科技中央監控系統提供全面的影像監控解決方案，整合IPC網路攝影機與NVR錄影主機，支援AI影像分析與雲端儲存。透過CMS中央管理軟體及APP，實現多點遠端管理、即時觀看及電子地圖整合，適用於住宅、商業及工業場所，提升安全防護與運營效率。",
		relatedProducts: [
			{ series: "網路攝影機 (IPC)", description: "多款高清、AI智能攝影機，滿足各種監控需求。", link: "/Products/surveillance-monitoring" },
			{ series: "網路錄影主機 (NVR)", description: "穩定可靠的影像儲存與管理。", link: "/Products/surveillance-monitoring" },
			{ series: "影像管理軟體 (CMS/VMS)", description: "強大的中央管理平台，支援多站點監控。", link: "/Products/surveillance-monitoring" }
		]
	},
	{
		id: "facial-recognition",
		title: "人臉門禁控制(社區)",
		shortTitle: "人臉門禁",
		image: "/solutions/人臉門禁控制(社區).png",
		description:
			"遠岫科技的人臉辨識門禁控制系統，專為社區、辦公大樓及校園設計。結合高精準度人臉辨識技術，提供快速無接觸通行體驗。系統支援APP通知、可選體溫檢測模組、考勤管理及訪客登記功能，有效提升出入口安全與管理效率。",
		relatedProducts: [
			{ series: "人臉辨識門禁機", description: "多功能一體機，支援人臉、卡片、密碼等多重驗證。", link: "/Products/access-control" },
			{ series: "通關機整合", description: "可搭配各類型通關機，管理人流動線。", link: "/Products/access-control" },
			{ series: "訪客管理模組", description: "整合訪客預約與自助報到，提升訪客體驗。", link: "/Products/access-control" }
		]
	},
	{
		id: "meeting-booking",
		title: "會議預約系統",
		shortTitle: "會議預約",
		image: "/solutions/會議預約系統.png",
		description:
			"遠岫科技的會議預約管理系統，提供便捷的會議室預約、設備管理及使用狀態顯示。支援Outlook行事曆整合，並透過Web、APP及會議室門口顯示面板等多平台操作。系統提供數據分析功能，優化會議資源利用，提升辦公效率。",
		relatedProducts: [
			{ series: "會議室顯示面板", description: "清晰顯示會議狀態與預約資訊。", link: "/Products/devices-accessories" },
			{ series: "系統整合服務", description: "可與現有辦公系統如Outlook整合。", link: "/Products/devices-accessories" }
		]
	},
	{
		id: "wireless-security",
		title: "無線保全系統",
		shortTitle: "無線保全",
		image: "/solutions/無線保全系統.png",
		description:
			"遠岫科技的無線保全系統，專為住家及商鋪設計，提供DIY快速安裝的便利性。系統包含無線警報主機及多種無線感測器（如門磁、紅外PIR、煙霧感測器），支援APP遠端布防/撤防及警報推播，即時守護您的財產安全。",
		relatedProducts: [
			{ series: "無線警報主機", description: "系統核心，支援多種無線感測器接入。", link: "/Products/security-solutions" },
			{ series: "各類無線感測器", description: "門窗磁簧、移動偵測、煙霧感測等，全面防護。", link: "/Products/security-solutions" },
			{ series: "APP遠端控制", description: "隨時隨地掌握家中安全狀況。", link: "/Products/security-solutions" }
		]
	},
	{
		id: "smart-construction",
		title: "智慧工地管理",
		shortTitle: "智慧工地",
		image: "/solutions/智慧工地管理.png",
		description:
			"遠岫科技的智慧工地管理方案，整合人員、車輛、環境、安全及設備管理。透過人臉辨識考勤、車牌辨識、AI影像分析（如電子圍籬、安全裝備偵測）、環境感測器（噪音、粉塵、溫濕度）等技術，實現工地數位化、智能化管理，提升施工安全與效率。",
		relatedProducts: [
			{ series: "工地門禁考勤", description: "人臉辨識閘機，精準管理人事出勤。", link: "/Products/access-control" },
			{ series: "AI影像監控", description: "攝影機結合AI分析，即時預警工地風險。", link: "/Products/surveillance-monitoring" },
			{ series: "車輛管理系統", description: "車牌辨識進出管制與停車管理。", link: "/Products/access-control" },
			{ series: "環境監測設備", description: "各類感測器，實時監控工地環境指標。", link: "/Products/security-solutions" }
		]
	},
	{
		id: "visitor-management",
		title: "訪客管理系統",
		shortTitle: "訪客管理",
		image: "/solutions/訪客管理系統.png",
		description:
			"遠岫科技的訪客管理系統，為企業、廠區及社區提供高效安全的訪客接待流程。支援線上預約登記、現場自助報到、人證比對及門禁系統連動。系統可發送APP通知給受訪者，並提供詳細的訪客數據報表，提升管理效率與專業形象。",
		relatedProducts: [
			{ series: "訪客管理終端機", description: "自助報到與身份驗證設備。", link: "/Products/access-control" },
			{ series: "門禁整合方案", description: "與現有門禁系統無縫對接，控制訪客權限。", link: "/Products/access-control" },
			{ series: "軟體管理平台", description: "全面的訪客記錄與數據分析。", link: "/Products/access-control" }
		]
	},
	{
		id: "parking-management",
		title: "停車管理系統",
		shortTitle: "停車管理",
		image: "/solutions/停車管理系統.png",
		description:
			"遠岫科技的停車管理系統，透過車牌辨識技術實現車輛快速進出。系統整合自動計費、車位在席偵測與引導、線上支付及APP車位查詢功能。搭配柵欄機、繳費機等硬體設備，為停車場提供智能化、無人化的高效管理方案。",
		relatedProducts: [
			{ series: "車牌辨識系統", description: "高清辨識攝影機與管理軟體。", link: "/Products/access-control" },
			{ series: "柵欄機與道閘", description: "控制車輛進出的關鍵設備。", link: "/Products/devices-accessories" },
			{ series: "自動繳費機", description: "支援多種支付方式的自助繳費終端。", link: "/Products/devices-accessories" }
		]
	},
	{
		id: "long-term-care",
		title: "長期照護",
		shortTitle: "長照關懷",
		image: "/solutions/長照.png",
		description:
			"遠岫科技的智慧長照解決方案，專為居家及機構照護設計。整合生理監測設備、跌倒偵測、緊急呼叫按鈕、GPS定位追蹤、智慧藥盒提醒及遠程視訊關懷等功能。透過智能化科技，提升長者生活品質與安全，減輕照護者負擔。",
		relatedProducts: [
			{ series: "緊急呼叫系統", description: "一鍵求助按鈕與即時通報。", link: "/Products/security-solutions" },
			{ series: "影像關懷攝影機", description: "遠端查看長者狀況，支援雙向語音。", link: "/Products/surveillance-monitoring" },
			{ series: "穿戴式感測裝置", description: "偵測跌倒、活動量等生理數據。", link: "/Products/devices-accessories" },
			{ series: "環境安全感測", description: "如煙霧、瓦斯偵測，保障居家安全。", link: "/Products/security-solutions" }
		]
	},
	{
		id: "ai-smart-factory",
		title: "AI智慧工廠強化安全與工作流程",
		shortTitle: "智慧工廠",
		image: "/solutions/AI智慧工廠強化安全與工作流程.png",
		description:
			"遠岫科技的AI智慧工廠解決方案，透過AI影像辨識技術強化安全與工作流程。應用包含人員行為規範（如安全帽佩戴偵測）、煙火偵測、電子圍籬、設備狀態監控及產線自動化監控。結合門禁管制與環境監測系統，實現數據可視化管理，提升工廠運營效率與安全水平。",
		relatedProducts: [
			{ series: "AI影像分析攝影機", description: "內建智能演算法，實現多種工業場景辨識。", link: "/Products/surveillance-monitoring" },
			{ series: "工業級門禁系統", description: "嚴格管制人員與車輛進出特定區域。", link: "/Products/access-control" },
			{ series: "環境與安全感測器", description: "監測工廠內溫度、濕度、有害氣體等。", link: "/Products/security-solutions" },
			{ series: "中央管理平台", description: "整合各系統數據，提供決策支援。", link: "/Products/surveillance-monitoring" }
		]
	}
]);

const galleryContainerToPinRef = ref(null);
const scrollContainerRef = ref(null);
const solutionElements = ref([]);
const currentSectionIndex = ref(0);
const galleryNavSidesRef = ref(null);
const galleryNavLeftRef = ref(null);
const galleryNavRightRef = ref(null);

// --- Details Modal State and Functions (Formerly Lightbox) ---
const isDetailsModalOpen = ref(false); // Renamed from isLightboxOpen
const currentSolutionForDetailsModal = ref(null); // Renamed from currentSolutionForLightbox
// lightboxImageSrc and lightboxAltText are no longer needed for the details modal state
const closeDetailsModalButtonRef = ref(null); // Renamed from closeModalButtonRef
let triggerElementForDetailsModal = null; // Renamed from triggerElementForLightbox

const detailsModalTitleId = computed(() => `details-modal-title-${Date.now()}`); // Renamed from lightboxTitleId

const openDetailsModal = (solution, eventTarget) => {
	// Renamed from openLightbox
	currentSolutionForDetailsModal.value = solution;
	isDetailsModalOpen.value = true;
	document.body.style.overflow = "hidden";
	triggerElementForDetailsModal = eventTarget || document.activeElement;
	nextTick(() => {
		if (closeDetailsModalButtonRef.value) {
			closeDetailsModalButtonRef.value.focus();
		}
	});
};

const closeDetailsModal = () => {
	// Renamed from closeLightbox
	isDetailsModalOpen.value = false;
	document.body.style.overflow = "";
	if (triggerElementForDetailsModal && typeof triggerElementForDetailsModal.focus === "function") {
		triggerElementForDetailsModal.focus();
	}
	triggerElementForDetailsModal = null;
	currentSolutionForDetailsModal.value = null;
};

// --- Mode Detection ---
const isMobileMode = ref(false);
const currentSolution = computed(() => {
	if (solutions.value.length > 0 && currentSectionIndex.value >= 0 && currentSectionIndex.value < solutions.value.length) {
		return solutions.value[currentSectionIndex.value];
	}
	// 返回 null 或一個默認的 solution 對象，以避免模板在初始時出錯
	return solutions.value.length > 0 ? solutions.value[0] : null;
});

onMounted(async () => {
	await initScrollPlugins();
	await nextTick(); // 確保 DOM 元素已渲染，特別是 v-if/v-else 的內容

	const checkMobileMode = () => {
		const oldMode = isMobileMode.value;
		isMobileMode.value = window.innerWidth <= 768;
		if (oldMode !== isMobileMode.value) {
			// 模式切換時，可能需要重新運行或清理 ScrollTriggers
			ScrollTrigger.value.refresh();
			// 如果從桌面切換到移動，殺掉桌面版的 ST
			if (isMobileMode.value) {
				const desktopST = ScrollTrigger.value.getById("horizontalGalleryScroll");
				if (desktopST) desktopST.kill();
			}
		}
	};
	checkMobileMode();
	window.addEventListener("resize", checkMobileMode);

	// --- Section 1: Vision & Strengths Animation (保持不變) ---
	if (visionTitleRef.value) {
		gsap.from(visionTitleRef.value.children, {
			autoAlpha: 0,
			y: 50,
			duration: 0.8,
			stagger: 0.2,
			ease: "power3.out",
			delay: 0.3
		});
		gsap.to(visionTitleRef.value, { autoAlpha: 1, duration: 0.01, delay: 0.3 });
	}
	coreStrengthRefs.value.forEach((el) => {
		if (el) {
			gsap.from(el, {
				y: 50,
				scale: 0.9
			});
			gsap.to(el, {
				autoAlpha: 1,
				y: 0,
				scale: 1,
				duration: 0.7,
				ease: "power2.out",
				scrollTrigger: {
					trigger: el,
					start: "top 85%",
					toggleActions: "play none none none"
				}
			});
		}
	});
	if (galleryIntroTextRef.value) {
		gsap.from(galleryIntroTextRef.value.children, {
			autoAlpha: 0,
			y: 40,
			duration: 0.7,
			ease: "power2.out",
			stagger: 0.15,
			scrollTrigger: {
				trigger: galleryIntroTextRef.value,
				start: "top 90%",
				toggleActions: "play none none none"
			}
		});
		gsap.to(galleryIntroTextRef.value, {
			autoAlpha: 1,
			duration: 0.01,
			scrollTrigger: {
				trigger: galleryIntroTextRef.value,
				start: "top 90%",
				toggleActions: "play none none none"
			}
		});
	}

	// --- Section 2: Gallery Scroll Animation ---
	ScrollTrigger.value.matchMedia({
		// --- Desktop and larger screens ---
		"(min-width: 769px)": function () {
			// 確保在桌面模式下 isMobileMode 為 false
			if (isMobileMode.value) return;

			if (!galleryContainerToPinRef.value || !scrollContainerRef.value) {
				return;
			}
			// 確保 solutionElements 在 nextTick 後被正確填充
			nextTick(() => {
				// 新增：嚴格檢查 scrollContainerRef 的寬度
				if (!scrollContainerRef.value || scrollContainerRef.value.offsetWidth <= 0) {
					console.error("Product Gallery: scrollContainerRef has no valid width. Aborting desktop horizontal scroll setup.", scrollContainerRef.value);
					return;
				}

				const sections = solutionElements.value.filter((el) => el);
				// 新增：檢查是否有 sections
				if (sections.length === 0) {
					console.warn("Product Gallery: No sections found for horizontal scroll.");
					return;
				}

				const mainAnimation = gsap.to(sections, {
					xPercent: -100 * (sections.length - 1),
					ease: "none",
					scrollTrigger: {
						id: "horizontalGalleryScroll",
						trigger: galleryContainerToPinRef.value,
						pin: galleryContainerToPinRef.value,
						scrub: 1,
						start: "top top",
						end: () => `+=${scrollContainerRef.value.offsetWidth * (sections.length - 1) - 1}`,
						snap:
							sections.length > 1
								? {
										snapTo: 1 / (sections.length - 1),
										duration: { min: 0.2, max: 0.8 },
										delay: 0.1,
										ease: "power1.inOut",
										inertia: false
								  }
								: false,
						onUpdate: (self) => {
							const progress = Math.round(self.progress * (sections.length - 1));
							if (currentSectionIndex.value !== progress) {
								currentSectionIndex.value = progress;
							}
						},
						invalidateOnRefresh: true
					}
				});

				const mainSTInstance = mainAnimation.scrollTrigger;

				if (!mainAnimation) {
					console.error("主要的橫向滾動動畫 (mainAnimation) 未成功創建。");
					return;
				}
				if (!mainSTInstance) {
					console.error("無法創建或檢索主要的 ScrollTrigger: horizontalGalleryScroll (mainSTInstance is null/undefined)");
					return;
				}

				sections.forEach((section) => {
					const image = section.querySelector(".solution-image");
					if (image) {
						const imageTl = gsap.timeline({
							scrollTrigger: {
								trigger: section,
								containerAnimation: mainAnimation,
								start: "left right", // Animation starts when the section enters the viewport from the right
								end: "right left", // Animation ends when the section exits the viewport to the left
								scrub: true,
								invalidateOnRefresh: true
							}
						});

						imageTl
							.fromTo(image, { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 4, ease: "power1.in" })
							.to(image, { duration: 2 }) // Stays at full opacity and scale in the center
							.to(image, { autoAlpha: 0, scale: 0.85, duration: 4, ease: "power1.out" });
					}
				});
			});

			if (galleryNavSidesRef.value && galleryNavLeftRef.value && galleryNavRightRef.value) {
				gsap.to(galleryNavSidesRef.value, {
					autoAlpha: 1,
					duration: 0.01,
					scrollTrigger: {
						trigger: galleryContainerToPinRef.value,
						start: "top 50%",
						toggleActions: "play none none none"
					}
				});
				gsap.from(galleryNavLeftRef.value, {
					xPercent: -100,
					autoAlpha: 0,
					duration: 0.8,
					ease: "power3.out",
					scrollTrigger: {
						trigger: galleryContainerToPinRef.value,
						start: "top 50%",
						toggleActions: "play none none none"
					}
				});
				gsap.from(galleryNavRightRef.value, {
					xPercent: 100,
					autoAlpha: 0,
					duration: 0.8,
					ease: "power3.out",
					scrollTrigger: {
						trigger: galleryContainerToPinRef.value,
						start: "top 50%",
						toggleActions: "play none none none"
					}
				});
			}
		},

		// --- Mobile screens ---
		"(max-width: 768px)": function () {
			// 確保在手機模式下 isMobileMode 為 true
			if (!isMobileMode.value) return;

			const desktopST = ScrollTrigger.value.getById("horizontalGalleryScroll");
			if (desktopST) {
				desktopST.kill();
			}

			// 手機版底部導航按鈕的入場動畫
			if (galleryNavSidesRef.value) {
				gsap.fromTo(
					galleryNavSidesRef.value,
					{ autoAlpha: 0, y: 30 },
					{
						autoAlpha: 1,
						y: 0,
						duration: 0.5,
						ease: "power2.out",
						scrollTrigger: {
							trigger: galleryNavSidesRef.value,
							start: "top 95%",
							scroller: window,
							toggleActions: "play none none none"
						}
					}
				);
			}
		}
	});
});

const navigateToSection = (index) => {
	currentSectionIndex.value = index;

	if (!isMobileMode.value) {
		// --- 桌面版的邏輯 ---
		if (!ScrollTrigger.value || !gsap || !galleryContainerToPinRef.value || !solutions.value || solutions.value.length <= 1) return;

		const stInstance = ScrollTrigger.value.getById("horizontalGalleryScroll");
		if (stInstance) {
			// 確保 solutions.value.length > 1 以避免除以零
			const progress = solutions.value.length > 1 ? index / (solutions.value.length - 1) : 0;
			const targetScrollY = stInstance.start + progress * (stInstance.end - stInstance.start);
			gsap.to(window, {
				scrollTo: {
					y: targetScrollY,
					autoKill: true
				},
				duration: 1,
				ease: "power2.inOut"
			});
		}
	}
};

onUnmounted(() => {
	window.removeEventListener("resize", () => {});
	cleanupScrollTriggers();
	if (isDetailsModalOpen.value) {
		document.body.style.overflow = "";
	}
});
</script>

<style scoped>
.product-gallery-container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	min-height: 100vh;
	overflow: hidden;
	color: #f0f0f0;
}

.gallery-scroll-container {
	display: flex;
	width: 100%;
	overflow: hidden;
	position: relative;
}

.solution-section {
	width: 100vw;
	height: 100%;
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 40px;
	box-sizing: border-box;
	position: relative;
	overflow: hidden;
}

.solution-content {
	display: flex;
	align-items: center;
	justify-content: space-around;
	width: 100%;
	max-width: 1920px;
	gap: 40px;
}

.image-container {
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	max-width: 50%;
}

.solution-image {
	max-width: 100%;
	max-height: 70vh;
	object-fit: contain;
	border-radius: 10px;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.gallery-navigation-sides {
	position: fixed;
	top: 50%;
	left: 0;
	right: 0;
	transform: translateY(-50%);
	display: flex;
	justify-content: space-between;
	padding: 0 30px;
	z-index: 10;
	pointer-events: none;
	opacity: 0; /* Initial opacity for GSAP animation */
}

.gallery-navigation-left,
.gallery-navigation-right {
	display: flex;
	flex-direction: column;
	gap: 10px;
	pointer-events: auto;
	position: relative;
}

.gallery-navigation-left::before,
.gallery-navigation-right::before {
	content: "";
	position: absolute;
	top: 50%;
	width: 200px;
	height: 120%;
	background: radial-gradient(ellipse at center, rgba(70, 130, 180, 0.12), transparent 70%);
	border-radius: 50%;
	z-index: -1;
	opacity: 0.6;
}

.gallery-navigation-left::before {
	left: 50%;
	transform: translate(-55%, -50%) rotate(-10deg);
}

.gallery-navigation-right::before {
	right: 50%;
	transform: translate(55%, -50%) rotate(10deg);
}

.gallery-navigation-left button,
.gallery-navigation-right button {
	--pop-out-x: 0px;
	--pop-out-scale: 1;
	--hover-scale: 1;
	background-color: rgba(25, 35, 45, 0.65);
	color: #d0d0d0;
	border: 1px solid rgba(100, 116, 139, 0.4);
	padding: 10px 15px;
	border-radius: 8px;
	cursor: pointer;
	transition: background-color 0.3s, color 0.3s, border-color 0.3s, transform 0.3s ease-out, box-shadow 0.3s ease-out;
	font-size: 0.9em;
	text-align: center;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
	min-width: 120px;
}

.gallery-navigation-left button:hover,
.gallery-navigation-right button:hover {
	--hover-scale: 1.08;
	background-color: rgba(45, 55, 70, 0.75);
	color: #ffffff;
	border-color: rgba(120, 136, 159, 0.5);
}

.gallery-navigation-left button.active,
.gallery-navigation-right button.active {
	--pop-out-x: 18px;
	--pop-out-scale: 1.1;
	background-color: #007aff;
	color: #ffffff;
	border-color: #0056b3;
	font-weight: bold;
	box-shadow: 0 0 15px rgba(0, 123, 255, 0.6), 0 0 8px rgba(0, 123, 255, 0.4);
	z-index: 2;
}

.gallery-navigation-left button:nth-child(1) {
	transform: rotate(-12deg) translateX(calc(-18px + var(--pop-out-x))) translateY(-35px) scale(calc(var(--pop-out-scale) * var(--hover-scale)));
}
.gallery-navigation-left button:nth-child(2) {
	transform: rotate(-8deg) translateX(calc(-12px + var(--pop-out-x))) translateY(-15px) scale(calc(var(--pop-out-scale) * var(--hover-scale)));
}
.gallery-navigation-left button:nth-child(3) {
	transform: rotate(-3deg) translateX(calc(-5px + var(--pop-out-x))) translateY(0px) scale(calc(var(--pop-out-scale) * var(--hover-scale)));
}
.gallery-navigation-left button:nth-child(4) {
	transform: rotate(3deg) translateX(calc(-5px + var(--pop-out-x))) translateY(15px) scale(calc(var(--pop-out-scale) * var(--hover-scale)));
}
.gallery-navigation-left button:nth-child(5) {
	transform: rotate(8deg) translateX(calc(-12px + var(--pop-out-x))) translateY(30px) scale(calc(var(--pop-out-scale) * var(--hover-scale)));
}
.gallery-navigation-left button:nth-child(6) {
	transform: rotate(12deg) translateX(calc(-18px + var(--pop-out-x))) translateY(45px) scale(calc(var(--pop-out-scale) * var(--hover-scale)));
}

.gallery-navigation-right button:nth-child(1) {
	transform: rotate(12deg) translateX(calc(18px - var(--pop-out-x))) translateY(-35px) scale(calc(var(--pop-out-scale) * var(--hover-scale)));
}
.gallery-navigation-right button:nth-child(2) {
	transform: rotate(8deg) translateX(calc(12px - var(--pop-out-x))) translateY(-15px) scale(calc(var(--pop-out-scale) * var(--hover-scale)));
}
.gallery-navigation-right button:nth-child(3) {
	transform: rotate(3deg) translateX(calc(5px - var(--pop-out-x))) translateY(0px) scale(calc(var(--pop-out-scale) * var(--hover-scale)));
}
.gallery-navigation-right button:nth-child(4) {
	transform: rotate(-3deg) translateX(calc(5px - var(--pop-out-x))) translateY(15px) scale(calc(var(--pop-out-scale) * var(--hover-scale)));
}
.gallery-navigation-right button:nth-child(5) {
	transform: rotate(-8deg) translateX(calc(12px - var(--pop-out-x))) translateY(30px) scale(calc(var(--pop-out-scale) * var(--hover-scale)));
}
.gallery-navigation-right button:nth-child(6) {
	transform: rotate(-12deg) translateX(calc(18px - var(--pop-out-x))) translateY(45px) scale(calc(var(--pop-out-scale) * var(--hover-scale)));
}

@media (max-width: 768px) {
	.gallery-scroll-container {
		/* 手機版：容器不再橫向滾動，而是作為單個 solution-section 的展示區 */
		overflow: hidden; /* 確保內容不溢出，因為內部 section 可能有動畫 */
		position: relative; /* 如果內部 section 使用絕對定位做動畫，則需要 */
		/* 高度可以由內部 .solution-section is-mobile-active-section 決定，或者給定一個固定比例 */
		min-height: 50vh; /* 示例：至少有一定高度，具體值需根據內容調整 */
		display: flex; /* 讓內部的 transition 和 section 居中等 */
		align-items: center;
		justify-content: center;
	}

	.solution-section.is-mobile-active-section {
		/* 手機版活動的 section 樣式 */
		width: 100%; /* 佔滿 gallery-scroll-container */
		height: auto; /* 高度自適應內容 */
		position: relative; /* 或者 static，取決於 transition 實現方式 */
		flex-shrink: 1;
	}

	.solution-section {
		padding: 20px;
		width: 100vw; /* 雖然在手機上只顯示一個，但保持與桌面結構一致性可能有助於某些計算 */
		max-height: none; /* 移除桌面版可能有的 max-height 限制*/
	}

	.image-container {
		max-width: 90%;
		height: auto; /* 手機版高度自適應 */
	}

	.solution-image {
		max-height: 40vh; /* 調整手機版圖片最大高度，避免過大 */
		cursor: default; /* 手機上圖片通常不顯示特殊鼠標指針，除非點擊有放大以外的交互 */
	}
	.solution-image.cursor-pointer {
		cursor: pointer;
	}

	.gallery-navigation-sides {
		position: static; /* 維持原手機版佈局 */
		transform: none;
		flex-direction: row;
		padding: 12px;
		background-color: rgba(0, 0, 0, 0.3);
		overflow-x: hidden; /* 應該是 visible 或 auto 如果按鈕很多需要滑動 */
		overflow-y: visible;
		justify-content: center;
		width: 100%;
		bottom: 0;
		left: 0;
		right: 0;
		top: auto;
		gap: 12px;
		flex-wrap: wrap;
		pointer-events: auto;
		/* opacity: 1; GSAP 會控制 */
	}

	.gallery-navigation-left::before,
	.gallery-navigation-right::before {
		display: none;
	}

	.gallery-navigation-left,
	.gallery-navigation-right {
		flex-direction: row; /* 確保按鈕橫向排列 */
		gap: 8px;
		display: contents; /* 維持原樣，讓按鈕直接成為父級 flex item */
		transform: none !important;
	}

	.gallery-navigation-left button,
	.gallery-navigation-right button {
		transform: none !important; /* 移除桌面版的形變 */
		padding: 8px 16px;
		margin: 0;
		white-space: nowrap;
		background-color: rgba(25, 35, 45, 0.65);
		color: #d0d0d0;
		border: 1px solid rgba(100, 116, 139, 0.4);
		border-radius: 8px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
		flex-grow: 0; /* Revert from 1, let content define width */
		flex-basis: auto; /* Revert from calc */
		min-width: calc(30% - 8px); /* 最小寬度，避免過窄 */
		text-align: center;
		transition: background-color 0.3s, color 0.3s, border-color 0.3s, box-shadow 0.3s;
	}

	.gallery-navigation-left button:hover,
	.gallery-navigation-right button:hover {
		background-color: rgba(45, 55, 70, 0.75);
		color: #ffffff;
		border-color: rgba(120, 136, 159, 0.5);
		transform: none !important;
	}

	.gallery-navigation-left button.active,
	.gallery-navigation-right button.active {
		background-color: #007aff;
		color: #ffffff;
		border-color: #0056b3;
		font-weight: bold;
		box-shadow: 0 0 15px rgba(0, 123, 255, 0.6), 0 0 8px rgba(0, 123, 255, 0.4);
		z-index: 2;
	}
}

/* Vue Transition for mobile solution change */
.solution-mobile-fade-enter-active,
.solution-mobile-fade-leave-active {
	transition: opacity 0.3s ease-in-out;
}
.solution-mobile-fade-enter-from,
.solution-mobile-fade-leave-to {
	opacity: 0;
}

.solution-content-mobile {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
}
/* Styles for the new "View Details" button on mobile */
.view-details-btn-mobile {
	/* Styles are already applied inline in the template. */
	/* Base styles can be added here if Tailwind classes are not sufficient. */
	margin-top: 1rem; /* Add some space above the button */
}

.custom-scrollbar-lightbox::-webkit-scrollbar {
	width: 8px;
}
.custom-scrollbar-lightbox::-webkit-scrollbar-track {
	background: rgba(255, 255, 255, 0.1);
	border-radius: 10px;
}
.custom-scrollbar-lightbox::-webkit-scrollbar-thumb {
	background: rgba(100, 116, 139, 0.7); /* slate-500 with opacity */
	border-radius: 10px;
}
.custom-scrollbar-lightbox::-webkit-scrollbar-thumb:hover {
	background: rgba(100, 116, 139, 1); /* slate-500 */
}
.custom-scrollbar-lightbox {
	scrollbar-width: thin;
	scrollbar-color: rgba(100, 116, 139, 0.7) rgba(255, 255, 255, 0.1);
}
</style>
