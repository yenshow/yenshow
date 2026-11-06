<template>
	<InteractivePageShell main-class="space-y-3 md:space-y-4" padding-class="py-3 sm:py-4 md:py-5">
		<InteractivePageHeader
			:title="t('interactive.cctv.title')"
			:lead="t('interactive.cctv.lead')"
			:back-label="t('interactive.nav.hub')"
		/>
		<CctvStudio />
	</InteractivePageShell>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import InteractivePageShell from "~/components/interactive/InteractivePageShell.vue";
import InteractivePageHeader from "~/components/interactive/InteractivePageHeader.vue";
import CctvStudio from "~/components/interactive/CctvStudio.vue";

const { t } = useI18n();

usePageSeo({
	title: t("interactive.meta.cctv_title"),
	description: t("interactive.meta.cctv_description"),
	path: "/interactive/cctv"
});
</script>
