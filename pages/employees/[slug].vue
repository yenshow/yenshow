<template>
	<div class="min-h-screen flex items-center justify-center">
		<div v-if="!employee" class="text-center text-slate-500">
			<p>{{ t("employees.error.not_found") }}</p>
		</div>
		<div v-else class="relative px-4 py-8 bg-card space-y-8 overflow-hidden">
			<DotLottieVue
				:src="lottieSrc"
				autoplay
				loop
				class="absolute -top-[200px] -right-[90px] z-0 opacity-50"
				style="width: 600px; height: 600px"
				background="transparent"
			/>
			<header class="relative flex justify-center items-center gap-4 pt-8 pb-4 z-10">
				<!-- employee information -->
				<div class="space-y-4">
					<!-- headshot -->
					<div class="w-32 h-32 rounded-full bg-white flex items-center justify-center"></div>
					<!-- name and position -->
					<div class="text-center">
						<h1 class="text-[28px] tracking-[4px] ps-[4px]" style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5)">
							{{ currentLocale === "zh" ? employee.name : employee.nameEn || employee.name }}
						</h1>
						<p class="text-[16px] tracking-[2px] ps-[2px] text-nowrap">
							{{ currentLocale === "zh" ? employee.position : employee.positionEn || employee.position }}
						</p>
					</div>
				</div>
				<!-- contact buttons -->
				<div class="space-y-8">
					<NuxtImg src="/logo/yenshow-logo.webp" :alt="t('news.company_card.logo_alt')" class="w-[225px] mx-auto" />
					<div class="grid grid-cols-2 gap-2 text-[16px] font-semibold">
						<button type="button" class="py-3 rounded-full bg-button tracking-[2px] ps-[2px]" style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5)">
							{{ t("employees.buttons.save_contact") }}
						</button>
						<button type="button" class="py-3 rounded-full bg-button tracking-[4px] ps-[4px]" style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5)">
							{{ t("employees.buttons.contact_online") }}
						</button>
					</div>
				</div>
			</header>
			<div class="relative bg-white/20 rounded-xl px-8 py-6 space-y-8 z-10">
				<!-- company information -->
				<section class="space-y-8">
					<h2 class="text-[20px] tracking-[2px] ps-[2px] border-b border-slate-200 pb-px w-fit">
						{{ t("employees.company_info.title") }}
					</h2>
					<div class="flex items-center gap-8">
						<div class="space-y-4">
							<NuxtImg src="/logo/yenshow-icon.svg" :alt="t('news.company_card.logo_alt')" class="w-[120px] mx-auto" />
						</div>
						<div class="flex flex-col justify-center gap-2 text-sm text-nowrap font-light tracking-widest">
							<div>
								<p class="text-[18px] font-medium tracking-[2px]">
									{{ currentLocale === "zh" ? employee.company : employee.companyEn || employee.company }}
								</p>
							</div>
							<div v-if="employee.address || employee.addressEn" class="flex flex-col items-start">
								<span>
									{{ currentLocale === "zh" ? employee.address : employee.addressEn || employee.address }}
								</span>
							</div>
							<div class="flex mt-4">
								<span>{{ t("employees.contact.contact_phone") }}：</span>
								<span>02-2223-3355</span>
							</div>
							<div class="flex">
								<span>{{ t("employees.contact.tax_id") }}：</span>
								<span>{{ employee.taxId }}</span>
							</div>
						</div>
					</div>
				</section>
				<div class="h-[1px] bg-black/20"></div>
				<!-- contact information -->
				<section class="space-y-8">
					<h2 class="text-[20px] tracking-[2px] ps-[2px] border-b border-slate-200 pb-px w-fit">
						{{ t("employees.contact_info.title") }}
					</h2>
					<ul class="flex flex-col gap-3">
						<li v-if="employee.mobile" class="flex justify-between items-center border-b border-dotted border-slate-200 pb-2 text-sm">
							<span class="w-20 flex-shrink-0 opacity-80">{{ t("employees.contact.mobile") }}</span>
							<a :href="`tel:${employee.mobile.replace(/-/g, '')}`" class="font-medium hover:underline">{{ employee.mobile }}</a>
						</li>
						<li v-if="employee.phone" class="flex justify-between items-center border-b border-dotted border-slate-200 pb-2 text-sm">
							<span class="w-20 flex-shrink-0 opacity-80">{{ t("employees.contact.tel") }}</span>
							<a :href="`tel:${employee.phone.replace(/-/g, '')}`" class="font-medium hover:underline">
								{{ employee.phone }}<span v-if="employee.phoneExt"> #{{ employee.phoneExt }}</span>
							</a>
						</li>
						<li v-if="employee.email" class="flex justify-between items-center border-b border-dotted border-slate-200 pb-2 text-sm">
							<span class="w-20 flex-shrink-0 opacity-80">{{ t("employees.contact.email") }}</span>
							<a :href="`mailto:${employee.email}`" class="font-medium hover:underline truncate">{{ employee.email }}</a>
						</li>
						<li v-if="employee.facebook" class="flex justify-between items-center border-b border-dotted border-slate-200 pb-2 text-sm">
							<span class="w-20 flex-shrink-0 opacity-80">{{ t("employees.contact.facebook") }}</span>
							<a :href="`https://www.facebook.com/${employee.facebook.replace('@', '')}`" target="_blank" rel="noopener" class="font-medium hover:underline">
								{{ employee.facebook }}
							</a>
						</li>
						<li v-if="employee.line" class="flex justify-between items-center text-sm">
							<span class="w-20 flex-shrink-0 opacity-80">{{ t("employees.contact.line") }}</span>
							<a :href="`https://line.me/ti/p/${employee.line.replace('@', '')}`" target="_blank" rel="noopener" class="font-medium hover:underline">
								{{ employee.line }}
							</a>
						</li>
					</ul>
				</section>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { getEmployeeBySlug } from "~/data/employees";
import { DotLottieVue } from "@lottiefiles/dotlottie-vue";

const { t } = useI18n();
const route = useRoute();
const slug = route.params.slug;
const employee = ref(getEmployeeBySlug(slug));
const lottieSrc = "/NFC.lottie";

// 語言切換功能
const { switchLanguage: switchLang, currentLocale } = useLanguageSwitcher();

const switchLanguage = async (lang) => {
	await switchLang(lang, {
		timeout: 5000,
		minLoadingTime: 200,
		showLoading: false
	});
};
</script>
<style scoped>
.bg-card {
	background: linear-gradient(135deg, #00503c 0%, #1a929f 15%, #00503c 80%);
}
.bg-button {
	background: linear-gradient(to right, #93d8c2, #00b1ca, #00ffff);
}
</style>

<style scoped>
* {
	color: #fff;
}
</style>
