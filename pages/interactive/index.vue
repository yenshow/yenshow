<template>
	<InteractivePageShell surface="clear" main-class="space-y-[24px] py-10 md:space-y-[48px] md:py-16" padding-class="py-12 md:py-20">
		<header class="mx-auto max-w-5xl text-center">
			<h1 class="text-[28px] font-bold leading-tight text-white sm:text-[36px] md:text-[48px] lg:text-[60px]" style="text-shadow: 0 0 12px rgba(0, 0, 0, 0.65)">
				{{ t("interactive.hub.title") }}
			</h1>
			<p
				class="mx-auto mt-4 max-w-3xl text-[16px] leading-relaxed text-sky-100 sm:text-[18px] md:text-[21px] lg:text-[24px]"
				style="text-shadow: 0 0 10px rgba(0, 0, 0, 0.8)"
			>
				{{ t("interactive.hub.lead") }}
			</p>
		</header>

		<section :aria-label="t('interactive.hub.modules_label')" class="mx-auto max-w-5xl">
			<div class="grid gap-6 sm:grid-cols-2 md:gap-8">
				<NuxtLink
					v-for="mod in featuredModules"
					:key="mod.id"
					:to="localePath(mod.path)"
					class="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 no-underline shadow-lg transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 md:p-6"
					:aria-label="`${t(mod.titleKey)} — ${t('interactive.modules.enter')}`"
				>
					<p class="text-xs font-semibold tracking-wide text-emerald-700 md:text-sm">{{ t(mod.categoryKey) }}</p>
					<h3 class="mt-2 text-[16px] font-semibold text-slate-900 sm:text-[18px] md:text-[21px] lg:text-[24px]">
						{{ t(mod.titleKey) }}
					</h3>
					<p class="mt-3 flex-1 text-[12px] leading-relaxed text-slate-600 sm:text-[14px] md:text-[16px] lg:text-[18px]">
						{{ t(mod.descKey) }}
					</p>
					<span class="mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-emerald-700 transition group-hover:gap-3 md:text-[16px]">
						{{ t("interactive.modules.enter") }}
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H7" />
						</svg>
					</span>
				</NuxtLink>
			</div>
		</section>

		<section v-if="moreModules.length" aria-labelledby="more-modules-title" class="mx-auto max-w-5xl">
			<div class="mb-6 text-center md:mb-8">
				<h2
					id="more-modules-title"
					class="inline-flex rounded-full bg-white px-5 py-2 text-[16px] font-bold tracking-wide text-slate-800 shadow-md sm:text-[18px] md:px-6 md:py-2.5 md:text-[21px]"
				>
					{{ t("interactive.hub.more_eyebrow") }}
				</h2>
			</div>
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
				<NuxtLink
					v-for="mod in moreModules"
					:key="mod.id"
					:to="localePath(mod.path)"
					class="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 no-underline shadow-lg transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
					:aria-label="`${t(mod.titleKey)} — ${t('interactive.modules.enter')}`"
				>
					<p class="text-xs font-semibold tracking-wide text-emerald-700">{{ t(mod.categoryKey) }}</p>
					<h3 class="mt-2 text-[16px] font-semibold text-slate-900 sm:text-[18px] md:text-[21px]">
						{{ t(mod.titleKey) }}
					</h3>
					<p class="mt-2 flex-1 text-[12px] leading-relaxed text-slate-600 sm:text-[14px] md:text-[16px]">
						{{ t(mod.descKey) }}
					</p>
					<span class="mt-4 text-[14px] font-medium text-emerald-700 group-hover:underline md:text-[16px]"> {{ t("interactive.modules.enter") }} → </span>
				</NuxtLink>
			</div>
		</section>

		<aside class="mx-auto max-w-3xl rounded-2xl border-2 border-amber-300 bg-amber-50 px-5 py-4 shadow-lg md:px-6 md:py-5" role="note">
			<p class="text-[14px] leading-relaxed text-amber-950 sm:text-[16px] md:text-[18px]">
				<span class="font-bold text-amber-900">{{ t("interactive.hub.notice_label") }}</span>
				{{ t("interactive.hub.notice") }}
			</p>
		</aside>
	</InteractivePageShell>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import InteractivePageShell from "~/components/interactive/InteractivePageShell.vue";
import { featuredInteractiveModules, moreInteractiveModules } from "~/data/interactive/modules.js";

const { t } = useI18n();
const localePath = useLocalePath();

const featuredModules = featuredInteractiveModules;
const moreModules = moreInteractiveModules;

usePageSeo({
	title: t("interactive.meta.hub_title"),
	description: t("interactive.meta.hub_description"),
	path: "/interactive"
});
</script>
