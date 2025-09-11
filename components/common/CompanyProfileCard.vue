<template>
	<section class="bg-white p-6 rounded-lg shadow-lg border border-slate-200 h-full">
		<div class="flex flex-col items-center text-center">
			<NuxtImg src="/logo/yenshow-icon.svg" :alt="t('news.company_card.logo_alt')" class="w-20 h-20 rounded-full mb-2 border-2 border-slate-200 p-1 bg-white" />
			<h3 class="text-xl font-bold theme-text mb-2">{{ t("news.company_card.title") }}</h3>
			<p class="text-sm lg:text-base text-gray-700 mb-4 whitespace-pre-line">{{ t("news.company_card.cta") }}</p>
			<div class="border-t border-gray-200 pt-4">
				<div class="grid grid-cols-1 xl:grid-cols-2 gap-3 text-left w-full break-words">
					<div class="flex items-center gap-1">
						<span class="font-semibold">{{ t("news.company_card.hotline_label") }}</span>
						<a href="tel:02-222-333-55" class="hover:text-blue-600 hover:underline">02-222-333-55</a>
					</div>
					<div class="flex items-center gap-1">
						<span class="font-semibold">{{ t("news.company_card.email_label") }}</span>
						<a href="mailto:jerry@yenshow.com" class="hover:text-blue-600 hover:underline">jerry@yenshow.com</a>
					</div>
					<div class="flex items-center col-span-1 xl:col-span-2 gap-1">
						<span class="font-semibold">{{ t("news.company_card.form_label") }}</span>
						<NuxtLink :to="localePath('/contact')" class="hover:text-blue-600 hover:underline break-all">{{
							t("news.company_card.contact_url_text")
						}}</NuxtLink>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const localePath = useLocalePath();
</script>
