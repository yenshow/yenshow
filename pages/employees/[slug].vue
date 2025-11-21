<template>
	<div class="min-h-screen flex items-center justify-center">
		<div v-if="!employee" class="w-[150px] h-[50px] bg-white rounded-full flex items-center justify-center">
			<p style="color: black !important">{{ t("employees.error.not_found") }}</p>
		</div>
		<div v-else class="relative flex flex-col items-center lg:flex-row px-4 py-8 lg:px-12 lg:py-12 bg-card lg:rounded-2xl gap-8 lg:gap-12 overflow-hidden">
			<DotLottieVue
				:src="lottieSrc"
				autoplay
				loop
				class="absolute -top-[200px] -right-[90px] lg:-left-[90px] z-0 opacity-50"
				style="width: 600px; height: 600px"
				background="transparent"
			/>

			<header class="relative flex flex-row lg:flex-col justify-center items-center gap-4 pt-8 pb-4 lg:pt-12 lg:pb-8 z-10">
				<!-- employee information -->
				<div class="flex flex-col items-center lg:flex-row gap-4 lg:gap-8">
					<!-- headshot -->
					<div class="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-white flex items-center justify-center overflow-hidden">
						<NuxtImg
							v-if="employee.headshot"
							:src="employee.headshot"
							:alt="currentLocale === 'zh' ? employee.name : employee.nameEn || employee.name"
							class="w-full h-full object-cover"
						/>
					</div>
					<!-- name and position -->
					<div class="text-center text-nowrap">
						<h1 class="text-[28px] lg:text-[36px] tracking-[4px] lg:tracking-[6px] ps-[4px] lg:ps-[6px]" style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5)">
							{{ currentLocale === "zh" ? employee.name : employee.nameEn || employee.name }}
						</h1>
						<p class="text-[16px] lg:text-[20px] tracking-[2px] lg:tracking-[3px] ps-[2px] lg:ps-[3px]">
							{{ currentLocale === "zh" ? employee.position : employee.positionEn || employee.position }}
						</p>
					</div>
				</div>
				<!-- contact buttons -->
				<div class="space-y-8 lg:space-y-4">
					<NuxtImg src="/logo/yenshow-logo.webp" :alt="t('news.company_card.logo_alt')" class="w-[225px] lg:w-[280px] mx-auto lg:hidden" />
					<div class="grid grid-cols-2 gap-2 lg:gap-3 text-[16px] lg:text-[20px] font-semibold">
						<button
							type="button"
							@click="saveContact"
							class="py-3 lg:py-4 w-auto lg:w-[150px] rounded-full bg-button tracking-[2px] lg:tracking-[3px] ps-[2px] lg:ps-[3px] hover:opacity-90 transition-opacity"
							style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5)"
						>
							{{ t("employees.buttons.save_contact") }}
						</button>
						<button
							type="button"
							@click="contactOnline"
							class="py-3 lg:py-4 w-auto lg:w-[150px] rounded-full bg-button tracking-[4px] lg:tracking-[6px] ps-[4px] lg:ps-[6px] hover:opacity-90 transition-opacity"
							style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5)"
						>
							{{ t("employees.buttons.contact_online") }}
						</button>
					</div>
				</div>
			</header>

			<div class="relative flex flex-col lg:flex-row bg-white/20 rounded-xl px-8 py-6 gap-8 z-10">
				<!-- company information -->
				<section class="space-y-8 lg:space-y-16">
					<h2 class="text-[20px] lg:text-[24px] tracking-[2px] lg:tracking-[3px] ps-[2px] lg:ps-[3px] border-b border-slate-200 pb-px w-fit">
						{{ t("employees.company_info.title") }}
					</h2>
					<div class="flex items-center gap-8">
						<div>
							<NuxtImg src="/logo/yenshow-icon.svg" :alt="t('news.company_card.logo_alt')" class="w-[120px] lg:w-[150px] mx-auto" />
						</div>
						<div class="flex flex-col justify-center gap-2 lg:gap-3 text-sm lg:text-base text-nowrap font-light tracking-widest">
							<div>
								<p class="text-[18px] lg:text-[22px] font-medium tracking-[2px] lg:tracking-[3px]">
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
				<div class="h-[1px] bg-black/20 lg:hidden"></div>
				<!-- contact information -->
				<section class="space-y-8">
					<h2 class="text-[20px] lg:text-[24px] tracking-[2px] lg:tracking-[3px] ps-[2px] lg:ps-[3px] border-b border-slate-200 pb-px w-fit">
						{{ t("employees.contact_info.title") }}
					</h2>
					<ul class="flex flex-col gap-3 lg:gap-4">
						<li v-if="employee.mobile" class="flex justify-between items-center border-b border-dotted border-slate-200 pb-2 lg:pb-3 text-sm lg:text-base">
							<span class="w-20 lg:w-40 flex-shrink-0 opacity-80">{{ t("employees.contact.mobile") }}</span>
							<a :href="`tel:${employee.mobile.replace(/-/g, '')}`" class="font-medium hover:underline">{{ employee.mobile }}</a>
						</li>
						<li v-if="employee.phone" class="flex justify-between items-center border-b border-dotted border-slate-200 pb-2 lg:pb-3 text-sm lg:text-base">
							<span class="w-20 lg:w-40 flex-shrink-0 opacity-80">{{ t("employees.contact.tel") }}</span>
							<a :href="`tel:${employee.phone.replace(/-/g, '')}`" class="font-medium hover:underline">
								{{ employee.phone }}<span v-if="employee.phoneExt"> #{{ employee.phoneExt }}</span>
							</a>
						</li>
						<li v-if="employee.email" class="flex justify-between items-center border-b border-dotted border-slate-200 pb-2 lg:pb-3 text-sm lg:text-base">
							<span class="w-20 lg:w-40 flex-shrink-0 opacity-80">{{ t("employees.contact.email") }}</span>
							<a :href="`mailto:${employee.email}`" class="font-medium hover:underline truncate">{{ employee.email }}</a>
						</li>
						<li v-if="employee.facebook" class="flex justify-between items-center border-b border-dotted border-slate-200 pb-2 lg:pb-3 text-sm lg:text-base">
							<span class="w-20 lg:w-40 flex-shrink-0 opacity-80">{{ t("employees.contact.facebook") }}</span>
							<a :href="`https://www.facebook.com/${employee.facebook.replace('@', '')}`" target="_blank" rel="noopener" class="font-medium hover:underline">
								{{ employee.facebook }}
							</a>
						</li>
						<li v-if="employee.line" class="flex justify-between items-center text-sm lg:text-base">
							<span class="w-20 lg:w-40 flex-shrink-0 opacity-80">{{ t("employees.contact.line") }}</span>
							<a :href="`${employee.line}`" target="_blank" rel="noopener" class="font-medium hover:underline">
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

// 建立完整的 vCard 格式
const createVCard = (emp) => {
	const lines = ["BEGIN:VCARD", "VERSION:3.0"];

	const name = currentLocale.value === "zh" ? emp.name : emp.nameEn || emp.name;
	const position = currentLocale.value === "zh" ? emp.position : emp.positionEn || emp.position;
	const company = currentLocale.value === "zh" ? emp.company : emp.companyEn || emp.company;
	const address = currentLocale.value === "zh" ? emp.address : emp.addressEn || emp.address;

	if (name) {
		lines.push(`FN:${name}`);
		lines.push(`N:${name};;;;`);
	}

	if (position) {
		lines.push(`TITLE:${position}`);
	}

	if (company) {
		lines.push(`ORG:${company}`);
	}

	if (address) {
		lines.push(`ADR;TYPE=WORK:;;${address};;;;`);
	}

	if (emp.mobile) {
		const mobileClean = emp.mobile.replace(/-/g, "");
		lines.push(`TEL;TYPE=CELL:${mobileClean}`);
	}

	if (emp.phone) {
		const phoneClean = emp.phone.replace(/-/g, "");
		const phoneNumber = emp.phoneExt ? `${phoneClean};EXT=${emp.phoneExt}` : phoneClean;
		lines.push(`TEL;TYPE=WORK,VOICE:${phoneNumber}`);
	}

	if (emp.email) {
		lines.push(`EMAIL;TYPE=WORK:${emp.email}`);
	}

	if (emp.line) {
		lines.push(`URL;TYPE=LINE:${emp.line}`);
	}

	if (emp.facebook) {
		const fbUrl = emp.facebook.startsWith("http") ? emp.facebook : `https://www.facebook.com/${emp.facebook.replace("@", "")}`;
		lines.push(`URL;TYPE=Facebook:${fbUrl}`);
	}

	lines.push("END:VCARD");

	return lines.join("\r\n");
};

// 儲存聯絡人 - 下載 vCard 檔案
const saveContact = () => {
	if (!employee.value) return;

	const vCard = createVCard(employee.value);
	const blob = new Blob([vCard], { type: "text/vcard;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	const fileName = `${employee.value.slug || "contact"}.vcf`;

	link.href = url;
	link.download = fileName;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
};

// 線上聯繫 - 開啟 Line 好友連結
const contactOnline = () => {
	if (!employee.value || !employee.value.line) return;

	window.open(employee.value.line, "_blank", "noopener,noreferrer");
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
