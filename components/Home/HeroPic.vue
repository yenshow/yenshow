<template>
	<div>
		<section class="relative min-h-screen overflow-hidden flex flex-col justify-center items-center gap-[24px] md:gap-[48px]">
			<!-- Three.js 背景 -->
			<canvas ref="threeCanvas" class="absolute top-0 left-0 w-full h-full z-0"></canvas>

			<!-- Logo 進場動畫 - 移動設備隱藏，平板和桌面顯示 -->
			<div ref="logoContainer" class="flex justify-center items-center opacity-0 z-10 mt-[24px] md:mt-[0px]">
				<img
					ref="logo"
					src="/logo/yenshow.svg"
					fetchpriority="high"
					class="w-[200px] sm:w-[250px] md:w-[300px] lg:w-[500px] xl:w-[550px] 2xl:w-[600px]"
					alt="遠岫科技"
					width="500"
					height="200"
				/>
			</div>

			<!-- 主標語 -->
			<div
				ref="heroText"
				class="text-center opacity-0 transform translate-y-10 z-20 px-4 text-secondary"
				style="text-shadow: #015c31 0 0 1em, #a8e6a3 0 0 0.2em"
			>
				<h1
					class="text-[28px] sm:text-[36px] md:text-[48px] lg:text-[64px] xl:text-[72px] 2xl:text-[80px] font-bold tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em] lg:tracking-[0.25em] xl:tracking-[0.3em] 2xl:tracking-[0.35em]"
				>
					遠岫科技
					<span
						class="block text-[21px] sm:text-[24px] md:text-[36px] lg:text-[48px] xl:text-[54px] 2xl:text-[60px] tracking-[0.08em] sm:tracking-[0.12em] md:tracking-[0.15em] lg:tracking-[0.2em] xl:tracking-[0.25em] 2xl:tracking-[0.3em]"
						>讓安心無所不在</span
					>
				</h1>
			</div>

			<!-- 互動導航區塊 -->
			<div ref="navContainer" class="flex flex-col lg:flex-row justify-center gap-[12px] md:gap-[24px] items-center w-full max-w-6xl opacity-0 z-10 px-4">
				<button
					type="button"
					v-for="(block, index) in blocks"
					:key="block.id"
					class="nav-block relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75 rounded-xl"
					@mouseenter="activateBlock(index)"
					@mouseleave="resetBlocks"
					@click="navigateToSection(block.id)"
					:aria-label="`導航至 ${block.title} 區塊`"
				>
					<!-- 區塊背景 -->
					<div
						class="cloud-container w-[280px] h-[200px] sm:h-[230px] md:w-[300px] md:h-[280px] lg:w-[320px] lg:h-[320px] xl:w-[340px] xl:h-[340px] transition-all duration-500 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:shadow-2xl"
					>
						<div class="absolute inset-0 rounded-[inherit] overflow-hidden">
							<div class="block-pattern" :class="`pattern-${index + 1}`"></div>
						</div>

						<div class="absolute inset-0 flex flex-col justify-center items-center text-white p-4 sm:p-6 z-10">
							<div class="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] font-bold opacity-60 mb-1 sm:mb-2">0{{ block.number }}</div>
							<h2 class="text-[22px] sm:text-[24px] md:text-[28px] lg:text-[30px] xl:text-[32px] font-bold mb-2 sm:mb-4">{{ block.title }}</h2>
							<p class="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] text-center opacity-80">{{ block.description }}</p>
						</div>
					</div>
				</button>
			</div>
		</section>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject } from "vue";

// 導航資料
const blocks = ref([
	{ number: 1, title: "品牌故事", description: "探索遠岫科技的起源與願景，了解我們的品牌精神", id: "story" },
	{ number: 2, title: "產品中心", description: "發現我們的創新產品與技術，幫助企業實現數位革新", id: "products" },
	{ number: 3, title: "合作案例", description: "查看我們與客戶共同創建的成功案例與解決方案", id: "cases" },
	{ number: 4, title: "最新消息", description: "獲取遠岫科技的最新動態、活動與行業資訊", id: "news" }
]);

const activeIndex = ref(null);
const activateBlock = (index) => (activeIndex.value = index);
const resetBlocks = () => (activeIndex.value = null);

// DOM
const threeCanvas = ref(null);
const logoContainer = ref(null);
const logo = ref(null);
const heroText = ref(null);
const navContainer = ref(null);

// Three.js and gsap will be loaded dynamically
let THREE;
let gsap;

// Three.js vars
let scene, camera, renderer;
let networkGroup; // 存放粒子和線條的群組
let animationId;

// 注入滾動動畫控制器
const scrollAnimation = inject("scrollAnimation");
const { isMobile } = scrollAnimation;

// Hero animation - 使用 timeline 統一控制
const setupEntranceAnimation = () => {
	const tl = gsap.timeline({
		delay: 1 // 減少延遲時間
	});

	tl.to(logoContainer.value, { opacity: 1, duration: 1, ease: "power2.out" })
		.to(heroText.value, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.5")
		.to(navContainer.value, { opacity: 1, duration: 1, ease: "power2.out" }, "-=0.3")
		.fromTo(
			".nav-block",
			{ y: 20, opacity: 0 },
			{
				y: 0,
				opacity: 1,
				stagger: 0.2,
				duration: 0.8,
				ease: "back.out(1.7)"
			},
			"-=0.8"
		);
};

// Three.js init
const initThree = () => {
	scene = new THREE.Scene();
	const width = window.innerWidth;
	const height = window.innerHeight;

	camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
	camera.position.z = getCameraDistance(); // 根據螢幕尺寸調整相機位置

	renderer = new THREE.WebGLRenderer({ canvas: threeCanvas.value, alpha: true });
	renderer.setSize(width, height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 限制最大像素比，優化移動裝置效能

	// 創建網絡球
	createNetworkSphere();

	// 執行淡入動畫
	fadeInNetworkSphere();

	// 啟動動畫
	animate();

	// 相機動畫效果
	animateCamera();
};

// 根據螢幕尺寸獲取相機距離
const getCameraDistance = () => {
	if (isMobile.value) return 20; // 使用 isMobile.value
	const width = window.innerWidth; // 保留寬度判斷平板和桌面
	if (width < 768) return 18; // md
	if (width < 1024) return 16; // lg
	return 15; // xl 及以上
};

const createNetworkSphere = () => {
	// 創建一個群組來容納粒子和線條
	networkGroup = new THREE.Group();
	scene.add(networkGroup);

	// 根據裝置調整粒子數量
	let particleCount;

	if (isMobile.value) particleCount = 600; // sm and potentially md based on breakpoint
	else {
		// 根據桌面和平板區分
		const width = window.innerWidth;
		if (width < 1024) particleCount = 1200; // lg
		else particleCount = 1500; // xl 及以上
	}

	const particles = new THREE.BufferGeometry();
	const positions = new Float32Array(particleCount * 3);
	const colors = new Float32Array(particleCount * 3);

	// 創建連接線的材質
	const lineMaterial = new THREE.LineBasicMaterial({
		color: 0x00d4ff,
		transparent: true,
		opacity: 0
	});

	// 生成球體上的粒子位置
	const radius = 10;
	for (let i = 0; i < particleCount; i++) {
		// 使用球坐標系統來均勻分布點
		const theta = Math.random() * Math.PI * 2;
		const phi = Math.acos(2 * Math.random() - 1);

		const x = radius * Math.sin(phi) * Math.cos(theta);
		const y = radius * Math.sin(phi) * Math.sin(theta);
		const z = radius * Math.cos(phi);

		positions[i * 3] = x;
		positions[i * 3 + 1] = y;
		positions[i * 3 + 2] = z;

		// 根據位置設定顏色
		colors[i * 3] = 0.2 + Math.random() * 0.8; // R
		colors[i * 3 + 1] = 0.8 + Math.random() * 0.2; // G
		colors[i * 3 + 2] = 0.8 + Math.random() * 0.2; // B
	}

	// 設置粒子幾何體
	particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
	particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));

	// 粒子材質 - 根據裝置調整大小
	const particleSize = isMobile.value ? 0.18 : 0.1; // 簡化為移動或非移動
	const particleMaterial = new THREE.PointsMaterial({
		size: particleSize,
		vertexColors: true,
		transparent: true,
		opacity: 0 // 初始透明度設為 0
	});

	// 創建粒子系統
	const networkSphere = new THREE.Points(particles, particleMaterial);
	networkGroup.add(networkSphere); // 將粒子系統加入群組

	// 生成連線 - 根據螢幕尺寸調整連線數量
	const lineGeometry = new THREE.BufferGeometry();
	const linePositions = [];

	// 為每個粒子尋找最近的幾個粒子並連線
	const connectionsPerParticle = isMobile.value ? 2 : 4; // 簡化為移動或非移動
	for (let i = 0; i < particleCount; i++) {
		const x1 = positions[i * 3];
		const y1 = positions[i * 3 + 1];
		const z1 = positions[i * 3 + 2];

		// 根據裝置類型調整連線數量
		const connectionsCount = connectionsPerParticle + Math.floor(Math.random() * (isMobile.value ? 1 : 2));

		for (let j = 0; j < connectionsCount; j++) {
			// 隨機選擇另一個粒子
			const particleIndex = Math.floor(Math.random() * particleCount);
			const x2 = positions[particleIndex * 3];
			const y2 = positions[particleIndex * 3 + 1];
			const z2 = positions[particleIndex * 3 + 2];

			// 計算兩點距離
			const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));

			// 只連接一定距離內的粒子
			if (distance > 1 && distance < 3.5) {
				linePositions.push(x1, y1, z1);
				linePositions.push(x2, y2, z2);
			}
		}
	}
	lineGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linePositions), 3));

	const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
	networkGroup.add(lines); // 將線條加入群組
};

// 淡入網絡球和連線的動畫
const fadeInNetworkSphere = () => {
	if (!networkGroup || networkGroup.children.length < 2) return;

	const points = networkGroup.children[0];
	const lines = networkGroup.children[1];

	// 使用 GSAP 實現平滑的淡入效果
	gsap.to(points.material, {
		opacity: 0.8,
		duration: 2,
		ease: "power2.inOut"
	});

	gsap.to(lines.material, {
		opacity: 0.2, // 根據需要調整最終透明度
		duration: 2,
		ease: "power2.inOut"
	});
};

const animate = () => {
	animationId = requestAnimationFrame(animate);

	// 旋轉整個群組
	if (networkGroup) {
		networkGroup.rotation.x += 0.0005;
		networkGroup.rotation.y += 0.001;
	}

	renderer.render(scene, camera);
};

// 相機動畫
const animateCamera = () => {
	gsap.to(camera.position, {
		z: getCameraDistance() - 2, // 稍微拉近
		duration: 60,
		yoyo: true,
		repeat: -1,
		ease: "sine.inOut"
	});
};

const handleResize = () => {
	if (!camera || !renderer) return;

	const width = window.innerWidth;
	const height = window.innerHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize(width, height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

// Scroll to - 使用 composable 的方法
const navigateToSection = (id) => {
	// 1. 立即開始滾動動畫
	scrollAnimation.scrollToSection(id, 0);

	// 2. 同時，讓導航區塊淡出
	gsap.to(".nav-block", {
		opacity: 0,
		stagger: 0.1,
		duration: 1,
		ease: "power2.inOut"
	});

	// 3. 在點擊/滾動開始 1 秒後，讓導航區塊淡入 (根據您上次的 delay: 1 調整)
	gsap.to(".nav-block", {
		opacity: 1,
		stagger: 0.1,
		duration: 1,
		delay: 1.6,
		ease: "power2.out"
	});
};

onMounted(async () => {
	// 首先載入 GSAP，因為無論網路快慢，部分 UI 互動可能都需要它
	const gsapModule = await import("gsap");
	gsap = gsapModule.default;

	// 檢查網路連線狀態
	const connection = typeof navigator !== "undefined" ? navigator.connection || navigator.mozConnection || navigator.webkitConnection : null;
	const isSlowNetwork = connection && (connection.saveData === true || ["slow-2g", "2g"].includes(connection.effectiveType));

	if (isSlowNetwork) {
		// eslint-disable-next-line no-console
		console.log("偵測到慢速網路，停止 Three.js 動畫。");
		// 網路不佳，隱藏 canvas 並直接顯示內容，不做進場動畫
		if (threeCanvas.value) {
			threeCanvas.value.style.display = "none";
		}
		gsap.set(logoContainer.value, { opacity: 1 });
		gsap.set(heroText.value, { opacity: 1, y: 0 });
		gsap.set(navContainer.value, { opacity: 1 });
		gsap.set(".nav-block", { y: 0, opacity: 1 });
	} else {
		// 網路良好，載入並執行 Three.js 動畫
		try {
			const threeModule = await import("three");
			THREE = threeModule;

			// 延遲執行耗資源的動畫，讓 LCP 圖片先渲染
			setTimeout(() => {
				if (threeCanvas.value) {
					initThree();
				}
				setupEntranceAnimation();
			}, 100);

			window.addEventListener("resize", handleResize);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error("無法載入 Three.js:", error);
			// 如果 Three.js 加載失敗，也確保內容可見
			if (threeCanvas.value) {
				threeCanvas.value.style.display = "none";
			}
			setupEntranceAnimation(); // 僅執行 GSAP 進場動畫
		}
	}
});

onUnmounted(() => {
	if (animationId) {
		cancelAnimationFrame(animationId);
	}
	// 只有在 Three.js 初始化後才需要移除監聽器
	if (THREE) {
		window.removeEventListener("resize", handleResize);
	}
});
</script>

<style scoped>
.cloud-container {
	border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
	animation: float 8s ease-in-out infinite;
	box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
	position: relative;
}

.nav-block:hover .cloud-container {
	animation-play-state: paused;
}

.block-pattern {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	border-radius: inherit; /* 繼承父層的圓角 */
	background-size: cover;
	background-position: center;
	transition: opacity 0.5s ease-in-out;
	opacity: 0.4;
}
.nav-block:hover .block-pattern {
	opacity: 0.6;
}

.pattern-1 {
	background: radial-gradient(circle at 30% 50%, #4facfe 0%, #00f2fe 100%);
}
.pattern-2 {
	background: linear-gradient(45deg, #fa709a 0%, #fee140 100%);
}
.pattern-3 {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.pattern-4 {
	background: linear-gradient(to right, #6a85b6, #bac8e0);
}

@keyframes float {
	0% {
		border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
		transform: translate(0, 0);
	}
	50% {
		border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
		transform: translate(0, 10px);
	}
	100% {
		border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
		transform: translate(0, 0);
	}
}
</style>
