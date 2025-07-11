<template>
	<NuxtImg
		preload
		format="webp"
		quality="80"
		src="/heroPic.png"
		alt="Hero background image"
		class="parallax-bg-img"
		:modifiers="{ breakpoint: 768, src: '/heroPic-sm.png' }"
	/>
	<!-- Main -->
	<main>
		<slot></slot>
	</main>

	<!-- Footer -->
	<footer class="bg-primary/25 backdrop-filter backdrop-blur-sm">
		<div class="container h-screen relative flex flex-col md:flex-row justify-center items-center gap-[24px] text-white py-[24px] sm:py-[48px]">
			<!-- 公司資訊區塊 -->
			<div class="flex items-center flex-col gap-[24px]">
				<!-- 公司標誌 -->
				<div
					class="w-[250px] h-[125px] md:w-[300px] md:h-[150px] lg:w-[400px] lg:h-[200px] xl:w-[450px] xl:h-[225px] 2xl:w-[500px] 2xl:h-[250px] transition-transform duration-300"
				>
					<NuxtImg
						src="/logo/yenshow-logo.png"
						alt="yenshow-logo"
						class="w-full h-full object-contain"
						format="webp"
						loading="lazy"
						width="500"
						height="250"
						sizes="250px md:300px lg:400px xl:450px 2xl:500px"
					/>
				</div>

				<!-- 社群媒體連結 -->
				<div class="flex justify-center items-center gap-[24px] lg:gap-[48px]">
					<!-- Line -->
					<a
						href="https://page.line.me/084yzfsc"
						aria-label="Line"
						class="w-[48px] h-[42px] md:w-[64px] md:h-[56px] transition-all duration-300 hover:scale-110"
						target="_blank"
					>
						<svg xmlns="http://www.w3.org/2000/svg" height="100%" width="100%" viewBox="0 0 512 512" class="transition-all duration-300">
							<path
								fill="#ffffff"
								d="M311 196.8v81.3c0 2.1-1.6 3.7-3.7 3.7h-13c-1.3 0-2.4-.7-3-1.5l-37.3-50.3v48.2c0 2.1-1.6 3.7-3.7 3.7h-13c-2.1 0-3.7-1.6-3.7-3.7V196.9c0-2.1 1.6-3.7 3.7-3.7h12.9c1.1 0 2.4 .6 3 1.6l37.3 50.3V196.9c0-2.1 1.6-3.7 3.7-3.7h13c2.1-.1 3.8 1.6 3.8 3.5zm-93.7-3.7h-13c-2.1 0-3.7 1.6-3.7 3.7v81.3c0 2.1 1.6 3.7 3.7 3.7h13c2.1 0 3.7-1.6 3.7-3.7V196.8c0-1.9-1.6-3.7-3.7-3.7zm-31.4 68.1H150.3V196.8c0-2.1-1.6-3.7-3.7-3.7h-13c-2.1 0-3.7 1.6-3.7 3.7v81.3c0 1 .3 1.8 1 2.5c.7 .6 1.5 1 2.5 1h52.2c2.1 0 3.7-1.6 3.7-3.7v-13c0-1.9-1.6-3.7-3.5-3.7zm193.7-68.1H327.3c-1.9 0-3.7 1.6-3.7 3.7v81.3c0 1.9 1.6 3.7 3.7 3.7h52.2c2.1 0 3.7-1.6 3.7-3.7V265c0-2.1-1.6-3.7-3.7-3.7H344V247.7h35.5c2.1 0 3.7-1.6 3.7-3.7V230.9c0-2.1-1.6-3.7-3.7-3.7H344V213.5h35.5c2.1 0 3.7-1.6 3.7-3.7v-13c-.1-1.9-1.7-3.7-3.7-3.7zM512 93.4V419.4c-.1 51.2-42.1 92.7-93.4 92.6H92.6C41.4 511.9-.1 469.8 0 418.6V92.6C.1 41.4 42.2-.1 93.4 0H419.4c51.2 .1 92.7 42.1 92.6 93.4zM441.6 233.5c0-83.4-83.7-151.3-186.4-151.3s-186.4 67.9-186.4 151.3c0 74.7 66.3 137.4 155.9 149.3c21.8 4.7 19.3 12.7 14.4 42.1c-.8 4.7-3.8 18.4 16.1 10.1s107.3-63.2 146.5-108.2c27-29.7 39.9-59.8 39.9-93.1z"
							/>
						</svg>
					</a>
					<!-- Facebook -->
					<a
						href="https://www.facebook.com/YENSHOW2020"
						aria-label="Facebook"
						class="w-[48px] h-[48px] md:w-[64px] md:h-[64px] transition-all duration-300 hover:scale-110"
						target="_blank"
					>
						<svg xmlns="http://www.w3.org/2000/svg" height="100%" width="100%" viewBox="0 0 448 512" class="transition-all duration-300">
							<path
								fill="#ffffff"
								d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64h98.2V334.2H109.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H255V480H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"
							/>
						</svg>
					</a>
					<!-- Youtube (was Email before) -->
					<a
						href="https://www.youtube.com/@yenshow706"
						aria-label="Youtube"
						class="w-[48px] h-[48px] md:w-[64px] md:h-[64px] transition-all duration-300 hover:scale-110"
						target="_blank"
					>
						<svg xmlns="http://www.w3.org/2000/svg" height="100%" width="100%" viewBox="0 0 576 512" class="transition-all duration-300">
							<path
								fill="#ffffff"
								d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6C16 147.8 16 256 16 256s0 108.2 10.3 131.9c6.3 23.7 24.8 42.3 48.3 48.6C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.9 48.3-48.6C560 364.2 560 256 560 256s0-108.2-10.3-131.9zM232 347.8V164.2L384 256 232 347.8z"
							/>
						</svg>
					</a>
				</div>

				<!-- 聯絡資訊卡片 -->
				<div
					class="contact-card flex flex-col items-center gap-[12px] sm:gap-[16px] max-w-[300px] sm:max-w-[354px] p-[16px] sm:p-[24px] text-center text-primary bg-white/90 rounded-[30px] sm:rounded-[50px] shadow-lg transition-all duration-300"
				>
					<h4 class="text-[18px] sm:text-[21px] md:text-[28px] lg:text-[36px] text-primary">聯絡我們</h4>
					<p class="text-[12px] sm:text-[14px] lg:text-[16px]">
						{{ $t("contact us") }}
					</p>
					<p class="text-[12px] sm:text-[14px] lg:text-[16px] text-left">
						{{ $t("tel") }} <br />
						{{ $t("address") }}
					</p>
					<Button-CTA :label="$t('cooperation')" to="/contact"></Button-CTA>
				</div>
			</div>

			<!-- 連結區塊 -->
			<div class="w-full flex flex-row justify-center md:justify-evenly gap-[48px] max-w-[1024px]">
				<div v-for="(section, index) in linkCTA" :key="index" class="flex flex-col gap-[12px] md:gap-[16px] lg:gap-[24px]">
					<h4
						class="text-[18px] sm:text-[21px] md:text-[28px] lg:text-[36px] xl:text-[40px] 2xl:text-[44px] font-medium text-white relative overflow-hidden group"
						style="text-shadow: 0 0 10px rgba(0, 0, 0, 0.9)"
					>
						{{ section.title }}
					</h4>

					<!-- 導航連結 -->
					<router-link
						v-for="(item, idx) in section.links"
						:key="idx"
						:to="item.to"
						class="transition-all duration-300 hover:translate-x-2 text-white/80 hover:text-white relative overflow-hidden group"
					>
						<span
							class="text-[18px] sm:text-[21px] md:text-[24px] lg:text-[26px] xl:text-[28px] 2xl:text-[30px] cursor-pointer"
							style="text-shadow: 0 0 10px rgba(0, 0, 0, 0.5)"
						>
							– {{ $t(item.label) }}
						</span>
						<span class="absolute bottom-0 left-0 w-0 h-[2px] bg-white opacity-50 transition-all duration-500 group-hover:w-full"></span>
					</router-link>
				</div>
			</div>
			<!-- 版權資訊 -->
			<div class="text-[10px] sm:text-[12px] lg:text-[16px] opacity-80 md:absolute md:bottom-[15%]" style="text-shadow: 0 0 10px rgba(0, 0, 0, 0.9)">
				Copyright © 遠岫科技有限公司
			</div>
		</div>
	</footer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ButtonCTA from "../components/common/Button-CTA.vue";

// 頁尾導航連結配置
const linkCTA = ref([
	{
		title: "關於遠岫",
		links: [
			{ label: "About us", to: "/" },
			{ label: "Products", to: "/products" },
			{ label: "Success Stories", to: "/success-stories" },
			{ label: "News", to: "/news" },
			{ label: "Faqs", to: "/faqs" }
		]
	},
	{
		title: "產品中心",
		links: [
			{ label: "Video Intercom", to: "/products/video-intercom" },
			{ label: "Access Control", to: "/products/access-control" },
			{ label: "Surveillance & Monitoring", to: "/products/surveillance-monitoring" },
			{ label: "Security Solutions", to: "/products/security-solutions" },
			{ label: "Devices & Accessories", to: "/products/devices-accessories" }
		]
	}
]);
</script>

<style scoped>
/* 預設使用大圖 */
.parallax-bg-img {
	z-index: -1;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	object-fit: cover;
	transition: all 0.5s ease-in-out;
}
</style>
