<template>
	<NuxtImg
		preload
		format="webp"
		src="/heroPic.jpg"
		alt="Hero background image"
		class="parallax-bg-img"
		sizes="1000"
		:modifiers="{ breakpoint: 768, src: '/heroPic-sm.png' }"
	/>
	<!-- Main -->
	<main>
		<slot />
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
					class="contact-card flex flex-col items-center gap-[12px] sm:gap-[16px] max-w-[300px] sm:max-w-[354px] p-[16px] sm:p-[24px] text-center text-primary bg-white/80 rounded-[30px] sm:rounded-[50px] shadow-lg transition-all duration-300"
				>
					<h3 class="text-[18px] sm:text-[21px] md:text-[28px] lg:text-[36px] text-primary/80">聯絡我們</h3>
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
			<div class="w-full flex flex-row justify-center md:justify-evenly gap-[24px] max-w-[1024px]">
				<div v-for="(section, index) in linkCTA" :key="index" class="flex flex-col gap-[12px] md:gap-[16px] lg:gap-[24px]">
					<h3
						class="text-[18px] sm:text-[21px] md:text-[28px] lg:text-[36px] xl:text-[40px] 2xl:text-[44px] font-medium text-white relative overflow-hidden group"
						style="text-shadow: 0 0 10px rgba(0, 0, 0, 0.5)"
					>
						{{ section.title }}
					</h3>

					<!-- 導航連結 -->
					<router-link
						v-for="(item, idx) in section.links"
						:key="idx"
						:to="item.to"
						class="transition-all duration-300 hover:translate-x-2 hover:text-white relative overflow-hidden group"
					>
						<MenuCTA :label="$t(item.label)" />
						<span class="absolute bottom-0 left-0 w-0 h-[1px] bg-white opacity-50 transition-all duration-500 group-hover:w-full"></span>
					</router-link>

					<!-- 版權資訊 -->
					<div v-if="section.copyright" class="text-[10px] sm:text-[12px] lg:text-[16px] pt-[4px] opacity-80" style="text-shadow: 0 0 10px rgba(0, 0, 0, 0.5)">
						Copyright © 遠岫科技有限公司
						<div class="h-[1px] w-0 bg-white mt-1 transition-all duration-500 hover:w-full"></div>
					</div>

					<!-- 語言切換器 -->
					<div v-if="section.extra" class="flex items-center gap-[6px] md:gap-[12px]">
						<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 512 512">
							<path
								fill="#ffffff"
								d="M352 256c0 22.2-1.2 43.6-3.3 64l-185.3 0c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64l185.3 0c2.2 20.4 3.3 41.8 3.3 64zm28.8-64l123.1 0c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64l-123.1 0c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32l-116.7 0c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0l-176.6 0c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0L18.6 160C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192l123.1 0c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64L8.1 320C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6l176.6 0c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352l116.7 0zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6l116.7 0z"
							/>
						</svg>
						<LanguageSwitcher />
					</div>
				</div>
			</div>
		</div>
	</footer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ButtonCTA from "../components/common/Button-CTA.vue";
import MenuCTA from "../components/common/Menu-CTA.vue";
import LanguageSwitcher from "../components/common/LanguageSwitcher.vue";

// 頁尾導航連結配置
const linkCTA = ref([
	{
		title: "關於遠岫",
		links: [
			{ label: "About us", to: "/" },
			{ label: "Products", to: "/Products" },
			{ label: "Success Stories", to: "/Success-Stories" },
			{ label: "News", to: "/News" },
			{ label: "Faqs", to: "/Faqs" }
		],
		copyright: true
	},
	{
		title: "產品中心",
		links: [
			{ label: "Video Intercom", to: "/Products/Video-Intercom" },
			{ label: "Access Control", to: "/Products/Access-Control" },
			{ label: "Surveillance & Monitoring", to: "/Products/Surveillance-Monitoring" },
			{ label: "Security Solutions", to: "/Products/Security-Solutions" },
			{ label: "Devices & Accessories", to: "/Products/Devices-Accessories" }
		],
		extra: true
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
