<template>
	<div>
		<section id="intro-section" ref="introSection" class="bg-secondary/90 my-[64px] sm:my-[128px] md:my-[256px] lg:my-[512px] py-[48px] md:py-[96px] opacity-0">
			<!-- YSCP 產品介紹 -->
			<article
				id="yscp-article"
				ref="yscpSection"
				class="relative container min-h-screen flex flex-col lg:flex-row justify-center items-center gap-[48px] yscp-section opacity-0"
			>
				<!-- 左側內容說明 -->
				<div ref="yscpText" class="flex flex-col gap-[24px] z-10 yscp-text">
					<h3 class="text-[24px] md:text-[36px] lg:text-[48px] product-title">YSCentral Professional</h3>
					<div class="title-decoration w-[80%] h-[3px] bg-gradient-to-r from-primary to-transparent"></div>

					<div class="feature-tag-container">
						<span class="feature-tag">整合性</span>
						<span class="feature-tag">安全性</span>
						<span class="feature-tag">高效能</span>
						<span class="feature-tag">易用性</span>
					</div>

					<h3 class="text-[12px] md:text-[16px] lg:text-[24px] opacity-80">
						一款整合式安全性軟體，<br />
						旨在透過一個「直覺」的平台來應對多種安全挑戰。
					</h3>

					<div class="relative benefit-section">
						<div class="benefit-decorative-line"></div>
						<h4 class="text-[16px] md:text-[24px] lg:text-[36px]">
							在保護人員和財產安全的同時，<br />
							讓日常營運更有效率，<br />
							幫助使用者做出更明智的決策。
						</h4>
					</div>
				</div>

				<!-- 右側功能圓圈 -->
				<div ref="featureCircles" class="grid grid-cols-2 relative feature-circles">
					<!-- 功能特點 1 -->
					<div
						ref="circleOne"
						class="aspect-square w-[150px] sm:w-[200px] md:w-[300px] ml-[-15px] sm:ml-[-25px] md:ml-0 YSCP-circle shadow-lg col-span-2 col-start-2 feature-circle"
					>
						<h4 class="text-[18px] sm:text-[24px] md:text-[36px] opacity-80">01</h4>
						<h4 class="text-[12px] sm:text-[16px] md:text-[24px]">中央管理平台</h4>
					</div>

					<!-- 功能特點 2 -->
					<div
						ref="circleTwo"
						class="aspect-square w-[150px] sm:w-[200px] md:w-[300px] mt-[-75px] sm:mt-[-100px] md:mt-[-150px] ml-[5px] md:ml-[75px] YSCP-circle shadow-lg col-span-2 col-start-1 feature-circle"
					>
						<h4 class="text-[18px] sm:text-[24px] md:text-[36px] opacity-80">02</h4>
						<h4 class="text-[12px] sm:text-[16px] md:text-[24px]">軟體與硬體整合</h4>
					</div>

					<!-- 功能特點 3 -->
					<div
						ref="circleThree"
						class="aspect-square w-[150px] sm:w-[200px] md:w-[300px] mt-[-95px] sm:mt-[-125px] md:mt-[-175px] ml-[-15px] sm:ml-[-25px] md:ml-[-25px] YSCP-circle shadow-lg col-span-2 col-start-2 feature-circle"
					>
						<h4 class="text-[18px] sm:text-[24px] md:text-[36px] opacity-80">03</h4>
						<h4 class="text-[12px] sm:text-[16px] md:text-[24px]">完整的解決方案</h4>
					</div>
				</div>
			</article>

			<!-- 服務特點區 -->
			<article class="relative min-h-screen flex flex-col justify-center items-center feature-section">
				<canvas ref="threeCanvas" class="absolute top-0 w-screen h-full z-0 pointer-events: none"></canvas>

				<!-- 主要內容容器 -->
				<div ref="featureContainer" class="flex flex-col lg:flex-row items-center justify-center z-10 gap-[12px] md:gap-[24px]">
					<!-- 左側：數據與監控 -->
					<div ref="dataMonitoringGroup" class="opacity-0 rotate-90 lg:rotate-0">
						<div class="flex gap-6 translate-x-[20%]">
							<Hexagon imageSrc="/YSCP/board-game.png" title="數位看板" />
							<Hexagon imageSrc="/YSCP/intelligent-analytics.png" title="智慧分析" />
						</div>
						<div class="flex gap-6 items-center">
							<Hexagon imageSrc="/YSCP/image.png" title="影像" />
							<div
								class="hexagon-title -rotate-90 lg:rotate-0 h-[146px] lg:h-[182px] xl:h-[220px] 2xl:h-[256px] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] xl:text-[28px] 2xl:text-[32px]"
							>
								數據與監控
							</div>
						</div>
						<div class="flex gap-6 translate-x-[20%]">
							<Hexagon imageSrc="/YSCP/route.png" title="路線管理" />
							<Hexagon imageSrc="/YSCP/attendance.png" title="考勤管理" />
						</div>
					</div>

					<!-- 中間：遠岫科技 -->
					<div ref="centerLogo" class="opacity-0 text-center">
						<div
							class="bg-gradient-to-b from-[#dd1c1c] to-[#212a37] bg-clip-text text-transparent font-bold text-[24px] sm:text-[28px] md:text-[36px] lg:text-[48px]"
						>
							遠岫科技
						</div>
						<div class="text-[16px] sm:text-[18px] md:text-[24px] lg:text-[28px] opacity-70">多元整合服務平台</div>
					</div>

					<!-- 右側：安全與管理 -->
					<div ref="securityManagementGroup" class="opacity-0 rotate-90 lg:rotate-0">
						<div class="flex gap-6 -translate-x-[20%]">
							<Hexagon imageSrc="/YSCP/vehicle.png" title="車輛" />
							<Hexagon imageSrc="/YSCP/visitor.png" title="訪客" />
						</div>
						<div class="flex items-center gap-6">
							<div
								class="hexagon-title -rotate-90 lg:rotate-0 h-[146px] lg:h-[182px] xl:h-[220px] 2xl:h-[256px] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] xl:text-[28px] 2xl:text-[32px]"
							>
								安全與管理
							</div>
							<Hexagon imageSrc="/YSCP/guarded-entrance.png" title="門禁" />
						</div>
						<div class="flex gap-6 -translate-x-[20%]">
							<Hexagon imageSrc="/YSCP/alarm.png" title="警報" />
							<Hexagon imageSrc="/YSCP/maintain.png" title="維護" />
						</div>
					</div>
				</div>
			</article>
		</section>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, inject } from "vue";
import Hexagon from "~/components/common/Hexagon.vue";
import * as THREE from "three";
import gsap from "gsap";

// DOM 引用
const introSection = ref(null);
const threeCanvas = ref(null);
const featureContainer = ref(null);
const dataMonitoringGroup = ref(null);
const securityManagementGroup = ref(null);
const centerLogo = ref(null);
const yscpSection = ref(null);
const yscpText = ref(null);
const featureCircles = ref(null);
const circleOne = ref(null);
const circleTwo = ref(null);
const circleThree = ref(null);

// Three.js 變數
let scene, camera, renderer;
let hexGrid;
let animationId;
let hexagons = [];
let hexMaterial = null;
let sharedGeometry = null;

// 注入滾動動畫控制器
const scrollAnimation = inject("scrollAnimation");
const { isMobile } = scrollAnimation;

// 用於存儲創建的波紋元素引用
let waveElements = [];

// Store timeline instances if they need to be killed specifically
let featureTl,
	yscpTextTl,
	circlesMasterTl,
	waveTls = []; // waveTls needs to be populated in createWaveAnimation

let hexGridAnimationTl = null; // <-- 為六角網格動畫時間軸聲明變量

// Debounce utility function
function debounce(func, delay) {
	let timeout;
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), delay);
	};
}

// 初始化 Three.js
const initThree = () => {
	if (isMobile.value) {
		return;
	}

	if (!threeCanvas.value) {
		return;
	}

	const width = threeCanvas.value.clientWidth;
	const height = threeCanvas.value.clientHeight;

	if (width === 0 || height === 0) {
		return; // 重要：如果尺寸為0，則不繼續執行，避免後續錯誤或無效狀態
	}

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(60, width / height, 1, 2000); // 調整 near/far 以適應更大的場景或避免裁剪
	camera.position.set(0, 6, 10); // 提高Y軸位置，更俯視
	camera.rotation.x = -0.5; // 增加向下傾斜角度

	renderer = new THREE.WebGLRenderer({ canvas: threeCanvas.value, alpha: true });
	renderer.setSize(width, height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

	// 調整移動設備上的六角形網格密度
	createHexagonGrid();
	animate();
};

// 重置六角形網格，用於反覆觸發動畫
const resetHexagons = () => {
	hexagons.forEach((hex) => {
		hex.mesh.scale.set(0, 0, 0);
	});
};

// 動畫循環 - 波浪效果
const animate = () => {
	animationId = requestAnimationFrame(animate);

	// 創建向外擴散的波浪效果
	if (hexagons.length > 0) {
		const time = Date.now() * 0.001; // 秒為單位

		// 為每個六角形應用獨立的波浪動畫
		hexagons.forEach((hexInfo) => {
			const hex = hexInfo.mesh;
			const distance = hexInfo.distance;

			// 波浪效果參數
			const waveSpeed = 0.8;
			const waveLength = 8;
			const waveHeight = 0.2;

			// 計算波動值
			const wave = Math.sin(time * waveSpeed - distance / waveLength) * waveHeight;
			hex.position.y = wave;

			// 當 animate() 執行時，isMobile.value 必定為 false，所以直接執行這些效果
			// 添加輕微的旋轉
			const rotationAmount = Math.sin(time * 0.5 + distance * 0.1) * 0.05;
			hex.rotation.z = rotationAmount;

			// 輕微的呼吸效果
			const breathingScale = 1 + Math.sin(time * 0.7 + distance * 0.2) * 0.05;

			// 應用到已經顯示的六角形的縮放
			if (hex.scale.x > 0.1) {
				hex.scale.set(breathingScale, breathingScale, breathingScale);
			}
		});
	}

	renderer.render(scene, camera);
};

// 處理窗口大小變化 (此函數專注於 Three.js 更新)
const onWindowResize = () => {
	if (!threeCanvas.value || !camera || !renderer) {
		return;
	}

	const width = threeCanvas.value.clientWidth;
	const height = threeCanvas.value.clientHeight;

	if (width === 0 || height === 0) {
		return;
	}

	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);

	// 重新創建六角形網格以適應新的螢幕尺寸
	createHexagonGrid(); // This replaces the 'hexagons' array and their meshes
	resetHexagons(); // This scales the new hexagons to 0

	// 重要：為新的六角形重新設置（或更新）GSAP 動畫
	if (hexGridAnimationTl) {
		hexGridAnimationTl.kill();
		hexGridAnimationTl = null;
	}

	if (hexagons.length > 0) {
		setupHexGridAnimation();
	}
};

// Create a stable debounced version of onWindowResize
const debouncedAndStableOnWindowResize = debounce(onWindowResize, 250);

// 設置 section 背景轉場動畫
const setupSectionBgAnimation = () => {
	scrollAnimation.createBasicAnimation({
		elements: introSection.value,
		trigger: "#intro-section",
		start: "top 70%",
		end: "bottom 20%",
		fromProps: {
			opacity: 0,
			y: 30
		},
		toProps: {
			opacity: 1,
			y: 0
		},
		duration: 1.8,
		ease: "power3.out",
		toggleActions: "play none none none"
	});
};

// 設置 Hexagon 行的滾動觸發動畫 - 結構優化
const setupHexagonRowAnimations = async () => {
	// 等待 DOM 更新
	await nextTick();

	const dataGroup = dataMonitoringGroup.value;
	const securityGroup = securityManagementGroup.value;
	const logo = centerLogo.value;
	const hexagons = document.querySelectorAll(".feature-section .hexagon");
	const hexagonContents = document.querySelectorAll(".feature-section .hexagon .hexagon-content");

	if (!dataGroup || !securityGroup || !logo || !hexagons.length || !hexagonContents.length) {
		return;
	}

	// 初始狀態設定
	gsap.set([dataGroup, securityGroup, logo], { opacity: 0, y: 50 });
	gsap.set(hexagons, { opacity: 0, scale: 0.8 });
	gsap.set(hexagonContents, { opacity: 0, y: 10 });

	featureTl = gsap.timeline({
		scrollTrigger: {
			trigger: ".feature-section",
			start: "top 70%",
			end: "bottom 20%",
			toggleActions: "play none none none"
		}
	});

	// 手機版：從上到下依序顯示
	if (isMobile.value) {
		featureTl
			.to(logo, { opacity: 1, y: 0, duration: 0.8 }, 0)
			.to(dataGroup, { opacity: 1, y: 0, duration: 0.8 }, 0.2)
			.to(securityGroup, { opacity: 1, y: 0, duration: 0.8 }, 0.4);
	}
	// 桌面版：從兩側向中間顯示
	else {
		featureTl
			.to(dataGroup, { opacity: 1, y: 0, duration: 1.0 }, 0)
			.to(securityGroup, { opacity: 1, y: 0, duration: 1.0 }, 0)
			.to(logo, { opacity: 1, y: 0, duration: 1.0 }, 0.3);
	}

	// Hexagon 圖標動畫
	featureTl.to(
		hexagons,
		{
			opacity: 1,
			scale: 1,
			duration: isMobile.value ? 0.4 : 0.6,
			stagger: isMobile.value ? 0.07 : 0.1,
			ease: "back.out(1.7)"
		},
		isMobile.value ? 0.5 : 0.5 // 在群組動畫開始後一段時間啟動
	);

	// Hexagon 內容動畫
	featureTl.to(
		hexagonContents,
		{
			opacity: 1,
			y: 0,
			duration: isMobile.value ? 0.3 : 0.5,
			stagger: isMobile.value ? 0.05 : 0.08,
			ease: "power2.out"
		},
		isMobile.value ? 0.7 : 0.8 // 在圖標動畫後再啟動
	);
};

// 創建波紋動畫 - 從容器中心發散 (優化版)
const createWaveAnimation = (container) => {
	// 確保容器存在
	if (!container || !document.body.contains(container)) {
		return;
	}

	// 移除現有的波紋元素
	const existingCircles = container.querySelectorAll(".wave-circle");
	existingCircles.forEach((circle) => circle.remove());

	// --- 1. 一次性讀取 ---
	const containerRect = container.getBoundingClientRect();
	const maxSize = containerRect.width * 1.2;
	const waveCount = 4;
	const totalDuration = 6;
	const visibleDuration = 4;

	const wavesToCreate = [];
	waveTls = []; // Clear previous wave timelines

	// --- 2. 準備所有元素 (但不寫入 DOM) ---
	for (let i = 0; i < waveCount; i++) {
		const wave = document.createElement("div");
		wave.classList.add("wave-circle");
		wave.style.position = "absolute";
		wave.style.top = "50%";
		wave.style.left = "50%";
		wave.style.transform = "translate(-50%, -50%)";
		wave.style.borderRadius = "50%";
		wave.style.border = "1.5px solid rgba(221, 28, 28, 0.6)";
		wave.style.width = "0px";
		wave.style.height = "0px";
		wave.style.opacity = "0";
		wave.style.zIndex = "1";
		wavesToCreate.push(wave);
	}

	// --- 3. 一次性寫入 DOM ---
	container.append(...wavesToCreate);

	// --- 4. 為已在 DOM 中的元素啟動動畫 ---
	wavesToCreate.forEach((wave, i) => {
		const linearDelay = i * (totalDuration / waveCount);

		const waveTl = gsap.timeline({
			repeat: -1,
			delay: linearDelay,
			repeatDelay: totalDuration - visibleDuration,
			onComplete: () => {
				// The timeline will be killed in onUnmounted, this is a fallback.
				if (wave && !document.body.contains(wave)) {
					waveTl.kill();
				}
			}
		});
		waveTls.push(waveTl); // Store the timeline instance

		waveTl
			.fromTo(
				wave,
				{ width: "0px", height: "0px", opacity: 0.8, borderWidth: "2px" },
				{
					width: `${maxSize}px`,
					height: `${maxSize}px`,
					opacity: 0,
					borderWidth: "0.5px",
					duration: visibleDuration,
					ease: "linear"
				}
			)
			.set(wave, { width: "0px", height: "0px", opacity: 0 });
	});

	// 返回創建的波紋元素，以便 onUnmounted 中可以清理
	return wavesToCreate;
};

// 設置 YSCP 部分的滾動觸發動畫
const setupYSCPAnimations = async () => {
	const animationDelay = isMobile.value ? 0.3 : 0.5;

	gsap.set(yscpSection.value, { opacity: 0, y: 40 });
	gsap.set(".product-title", { opacity: 0, scale: 0.9, textShadow: "0 0 0px rgba(221, 28, 28, 0)", color: "#770f0f" });
	gsap.set(".title-decoration", { scaleX: 0, opacity: 0 });
	gsap.set(".feature-tag", { y: 20, opacity: 0 });
	gsap.set("h3", { y: 20, opacity: 0 });
	gsap.set(".benefit-decorative-line", { height: 0 });
	gsap.set(".benefit-section h4", { y: 30, opacity: 0 });

	yscpTextTl = scrollAnimation.createTimelineAnimation({
		trigger: "#yscp-article",
		start: "top 70%",
		end: "bottom 20%",
		toggleActions: "play none none none"
	});

	// 1. 整個區塊淡入 (使用 to，因為 gsap.set 已設 from)
	yscpTextTl.to(yscpSection.value, { opacity: 1, y: 0, duration: isMobile.value ? 0.8 : 1.2, ease: "power2.out" }); // 使用 isMobile.value

	// 2. 標題與裝飾線條 (使用 to)
	yscpTextTl.to(
		".product-title",
		{
			opacity: 1,
			scale: 1,
			textShadow: "0 0 5px rgba(221, 28, 28, 0.3)",
			color: "#dd1c1c",
			duration: isMobile.value ? 0.8 : 1.2, // 使用 isMobile.value
			ease: "power3.out"
		},
		"-=0.9"
	);

	// 3. 標題裝飾線 (使用 to)
	yscpTextTl.to(".title-decoration", { scaleX: 1, opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.8");

	// 4. 特性標籤 (使用 to)
	yscpTextTl.to(".feature-tag", { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.5)" }, "-=0.5"); // 注意 ease 保持原樣

	// 5. 描述文字 (使用 to)
	yscpTextTl.to("h3", { y: 0, opacity: 0.8, duration: 0.8, ease: "power2.out" }, "-=0.3");

	// 6. 裝飾線 (使用 to)
	yscpTextTl.to(".benefit-decorative-line", { height: "80%", duration: 1.2, ease: "power2.inOut" }, "-=0.5");

	// 7. 主要描述文字 (使用 to)
	yscpTextTl.to(".benefit-section h4", { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, "-=0.8");

	const circlesArray = [circleOne.value, circleTwo.value, circleThree.value];
	gsap.set(circlesArray, { scale: 0.7, opacity: 0, y: 30 });

	circlesMasterTl = gsap.timeline({
		scrollTrigger: {
			trigger: ".feature-circles",
			start: "top 70%",
			end: "bottom 20%",
			toggleActions: "play none none none"
		},
		delay: animationDelay
	});

	// 使用 to，因為 gsap.set 已設 from
	circlesArray.forEach((circle, index) => {
		circlesMasterTl.to(
			circle,
			{ scale: 1, opacity: 1, y: 0, duration: isMobile.value ? 0.6 : 0.8, ease: "elastic.out(1, 0.75)" },
			index * (isMobile.value ? 0.2 : 0.3)
		); // 使用 isMobile.value
	});

	// 波紋動畫添加在最後
	circlesMasterTl.call(
		() => {
			if (featureCircles.value && document.body.contains(featureCircles.value)) {
				waveElements = createWaveAnimation(featureCircles.value);
			}
		},
		null,
		"+=0.2"
	);
};

// 設置網格動畫
const setupHexGridAnimation = () => {
	if (hexagons.length > 0) {
		hexagons.sort((a, b) => a.distance - b.distance);

		hexGridAnimationTl = gsap.timeline({
			scrollTrigger: {
				trigger: "#intro-section",
				start: "top 50%",
				end: "bottom 20%",
				toggleActions: "play none none none"
			}
		});

		// 為每個六角形添加動畫
		hexGridAnimationTl.to(
			hexagons.map((h) => h.mesh.scale),
			{
				x: 1,
				y: 1,
				z: 1,
				duration: 1.2,
				stagger: 0.008,
				ease: "power2.out"
			}
		);
	}
};

// 創建六角形網格背景 - 3D化，呈現在底部，作為鋪陳
const createHexagonGrid = () => {
	if (hexGrid) {
		scene.remove(hexGrid);
		hexagons = [];
	}
	if (sharedGeometry) {
		sharedGeometry.dispose();
		sharedGeometry = null;
	}
	if (hexMaterial) {
		hexMaterial.dispose();
		hexMaterial = null;
	}

	hexMaterial = new THREE.LineBasicMaterial({
		color: 0xdd1c1c,
		transparent: true,
		opacity: 0.3
	});

	hexGrid = new THREE.Group();
	// 設置初始位置
	hexGrid.position.y = -4;

	// 由於 createHexagonGrid 只會在非行動裝置時被 initThree 調用，
	// 我們可以直接使用桌面版的網格密度設定。
	const hexRadius = 1.5;
	const rows = 10; // 性能優化：減少行數
	const cols = 15; // 性能優化：減少列數
	const vertDist = hexRadius * Math.sqrt(3);
	const horizDist = hexRadius * 1.5;

	function createHexagonGeometry(radius = 1) {
		const shape = new THREE.Shape();
		for (let i = 0; i < 6; i++) {
			const angle = (Math.PI / 3) * i;
			const x = radius * Math.cos(angle);
			const y = radius * Math.sin(angle);
			if (i === 0) shape.moveTo(x, y);
			else shape.lineTo(x, y);
		}
		shape.closePath();

		const points = shape.getPoints();
		const geometry = new THREE.BufferGeometry().setFromPoints(points);
		return geometry;
	}

	sharedGeometry = createHexagonGeometry(hexRadius);

	const gridOffsetX = (-cols * horizDist) / 2 + horizDist / 2;
	const gridOffsetZ = (-rows * vertDist) / 2 + vertDist / 2;

	// 計算中心點位置 - 用於計算距離
	const centerX = 0;
	const centerZ = 0;

	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			const hex = new THREE.LineLoop(sharedGeometry, hexMaterial);

			let xPos = i * horizDist + gridOffsetX;
			let yPos = 0; // 使用hexGrid.position.y來控制整體網格的高度
			let zPos = j * vertDist + (i % 2) * (vertDist / 2) + gridOffsetZ;

			hex.position.set(xPos, yPos, zPos);
			hex.rotation.x = -Math.PI / 2;

			// 計算到中心的距離 - 用於波浪動畫
			const distanceToCenter = Math.sqrt(Math.pow(xPos - centerX, 2) + Math.pow(zPos - centerZ, 2));

			// 設置初始比例為0
			hex.scale.set(0, 0, 0);

			// 儲存距離和初始位置信息 - 用於動畫
			hexGrid.add(hex);
			hexagons.push({
				mesh: hex,
				distance: distanceToCenter,
				originalY: yPos,
				xPos: xPos,
				zPos: zPos
			});
		}
	}

	scene.add(hexGrid);
};

// 生命週期鉤子
onMounted(async () => {
	if (typeof window !== "undefined") {
		await nextTick();

		if (scrollAnimation && typeof scrollAnimation.initScrollPlugins === "function") {
			await scrollAnimation.initScrollPlugins();
		}

		if (!introSection.value) {
			return;
		}

		// 設置 section 背景轉場動畫
		setupSectionBgAnimation();

		// GSAP animations that should run on all devices
		setupHexagonRowAnimations();

		if (typeof setupYSCPAnimations === "function") {
			await setupYSCPAnimations();
		}

		// Three.js related setup - only for non-mobile devices
		if (!isMobile.value) {
			await nextTick();
			initThree();
			if (threeCanvas.value && threeCanvas.value.clientWidth > 0 && threeCanvas.value.clientHeight > 0 && hexagons.length > 0 && renderer) {
				setupHexGridAnimation();
			}
			window.addEventListener("resize", debouncedAndStableOnWindowResize);
		}
	}
});

onUnmounted(() => {
	if (animationId && !isMobile.value && renderer) {
		cancelAnimationFrame(animationId);
		animationId = null; // Clear the ID
	}

	// GSAP Timelines cleanup (always perform this)
	if (featureTl) featureTl.kill();
	if (yscpTextTl) yscpTextTl.kill();
	if (circlesMasterTl) circlesMasterTl.kill();
	waveTls.forEach((tl) => tl.kill());
	if (hexGridAnimationTl) {
		// This TL is Three.js specific, created only if !isMobile
		hexGridAnimationTl.kill();
	}

	// GSAP ScrollTrigger global cleanup (always perform this)
	if (
		scrollAnimation &&
		scrollAnimation.ScrollTrigger &&
		scrollAnimation.ScrollTrigger.value &&
		typeof scrollAnimation.ScrollTrigger.value.revert === "function"
	) {
		scrollAnimation.ScrollTrigger.value.revert();
	}

	// Cleanup wave DOM elements (always perform this as they are GSAP driven, not directly Three.js scene objects)
	waveElements.forEach((wave) => {
		if (wave && wave.parentNode) {
			wave.parentNode.removeChild(wave);
		}
	});
	waveElements = [];
	waveTls = [];

	// Three.js specific cleanup (only if it was initialized for non-mobile)
	if (!isMobile.value && renderer) {
		// Check renderer as a proxy for Three.js initialization
		window.removeEventListener("resize", debouncedAndStableOnWindowResize);

		if (renderer) {
			renderer.dispose();
			renderer = null;
		}
		if (sharedGeometry) {
			sharedGeometry.dispose();
			sharedGeometry = null;
		}
		if (hexMaterial) {
			hexMaterial.dispose();
			hexMaterial = null;
		}
		if (scene) {
			scene.traverse((object) => {
				if (object.geometry) {
					object.geometry.dispose();
				}
				if (object.material) {
					if (Array.isArray(object.material)) {
						object.material.forEach((material) => material.dispose());
					} else {
						object.material.dispose();
					}
				}
			});
			scene.clear();
			scene = null;
		}
		hexagons = []; // Clear the hexagons array for non-mobile
	}
});
</script>

<style scoped>
.hexagon-title {
	aspect-ratio: cos(30deg);
	clip-path: polygon(-50% 50%, 50% 100%, 150% 50%, 50% 0);
	background: linear-gradient(#dd1c1c, #770f0f);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: #f2f2f2;
	gap: 4px;
	transition: transform 0.3s ease;
}

.product-title {
	display: inline-block;
	font-weight: 700;
	background: linear-gradient(to right, #dd1c1c, #212a37);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
}

canvas {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 0;
	pointer-events: none;
}

.hexagon-row-1,
.hexagon-row-2,
.hexagon-row-3 {
	position: relative;
	z-index: 10;
}

.YSCP-circle {
	color: #212a37;
	font-weight: bold;
	background: radial-gradient(closest-side, #d9d9d9, #ffffff);
	border-radius: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;
	transition: transform 0.3s ease, box-shadow 0.3s ease;
	z-index: 3;
}

.feature-tag-container {
	display: flex;
	gap: 8px;
}

.feature-tag {
	background: linear-gradient(135deg, #dd1c1c 0%, #9e0e0e 100%);
	color: white;
	padding: 4px 10px;
	border-radius: 20px;
	font-size: 16px;
	font-weight: 600;
	box-shadow: 0 2px 4px rgba(221, 28, 28, 0.3);
}

.benefit-decorative-line {
	position: absolute;
	left: -20px;
	top: 15px;
	width: 5px;
	height: 80%;
	background: linear-gradient(to bottom, #dd1c1c, transparent);
}

.benefit-section {
	padding-left: 16px;
}

.feature-circles {
	position: relative;
	overflow: visible;
}

.wave-circle {
	pointer-events: none;
	box-shadow: 0 0 8px rgba(221, 28, 28, 0.4);
}

/* 添加較小螢幕的特定樣式 */
@media (max-width: 639px) {
	.feature-tag {
		font-size: 12px;
		padding: 3px 8px;
	}

	.benefit-decorative-line {
		left: -10px;
		width: 3px;
	}

	.YSCP-circle {
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
	}
}

@media (max-width: 768px) {
	.feature-section {
		padding: 0 12px;
	}

	.yscp-section {
		padding-top: 48px;
		padding-bottom: 48px;
	}
}

/* 添加平板樣式 */
@media (min-width: 768px) and (max-width: 1023px) {
	.yscp-section {
		padding-top: 64px;
		padding-bottom: 64px;
	}
}

/* 添加 transform-origin */
.title-decoration {
	transform-origin: left;
}
</style>
