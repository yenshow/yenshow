<template>
	<InteractivePageShell main-class="space-y-12 py-10 md:space-y-16 md:py-16">
		<header class="max-w-3xl">
			<p class="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">{{ t("interactive.hub.eyebrow") }}</p>
			<h1 class="mt-3 text-3xl font-bold text-primary md:text-5xl">{{ t("interactive.hub.title") }}</h1>
			<p class="mt-4 text-base leading-relaxed text-slate-700 md:text-lg">{{ t("interactive.hub.lead") }}</p>
			<p class="mt-3 text-sm font-medium text-slate-500 md:text-base">{{ t("interactive.hub.modules_hint") }}</p>
		</header>

		<section id="modules" aria-labelledby="modules-title">
			<h2 id="modules-title" class="text-2xl font-bold text-primary md:text-3xl">{{ t("interactive.hub.modules_title") }}</h2>
			<p class="mt-2 max-w-3xl text-slate-700">{{ t("interactive.hub.modules_desc") }}</p>
			<div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				<NuxtLink
					v-for="mod in interactiveModules"
					:key="mod.id"
					:to="localePath(mod.path)"
					class="flex h-full flex-col rounded-2xl p-5 no-underline shadow-sm transition"
					:class="
						mod.status === 'available'
							? 'border border-slate-200 bg-white/95 hover:border-emerald-400'
							: 'border border-dashed border-slate-300 bg-slate-50 hover:border-slate-400'
					"
					:aria-label="mod.status === 'planned' ? `${t(mod.titleKey)} — ${t('interactive.modules.planned_label')}` : undefined"
				>
					<span
						class="inline-block w-fit rounded-full px-2 py-1 text-xs font-medium"
						:class="mod.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'"
					>
						{{ t(mod.tagKey) }}
					</span>
					<h3 class="mt-3 text-xl font-semibold text-primary">{{ t(mod.titleKey) }}</h3>
					<p class="mt-2 flex-1 text-sm text-slate-600">{{ t(mod.descKey) }}</p>
					<span
						class="mt-4 inline-block text-sm font-medium"
						:class="mod.status === 'available' ? 'text-emerald-700' : 'text-slate-500'"
					>
						{{ t(mod.status === "available" ? "interactive.modules.enter" : "interactive.modules.view_planned") }} →
					</span>
				</NuxtLink>
			</div>
		</section>

		<section class="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950" role="note">
			<strong>{{ t("interactive.hub.notice_label") }}</strong>{{ t("interactive.hub.notice") }}
		</section>
	</InteractivePageShell>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import InteractivePageShell from "~/components/interactive/InteractivePageShell.vue";
import { interactiveModules } from "~/data/interactive/modules.js";

const { t } = useI18n();
const localePath = useLocalePath();

usePageSeo({
	title: t("interactive.meta.hub_title"),
	description: t("interactive.meta.hub_description"),
	path: "/interactive"
});
</script>
