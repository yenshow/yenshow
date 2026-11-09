<template>
	<InteractivePageShell main-class="space-y-3 md:space-y-4" padding-class="py-3 sm:py-4 md:py-5">
		<InteractivePageHeader
			:title="t('interactive.intercom.title')"
			:lead="t('interactive.intercom.lead')"
			:back-label="t('interactive.nav.hub')"
		/>
		<ModuleStudio module-id="intercom" />
	</InteractivePageShell>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import InteractivePageShell from "~/components/interactive/InteractivePageShell.vue";
import InteractivePageHeader from "~/components/interactive/InteractivePageHeader.vue";
import ModuleStudio from "~/components/interactive/ModuleStudio.vue";

const { t } = useI18n();

usePageSeo({
	title: t("interactive.meta.intercom_title"),
	description: t("interactive.meta.intercom_description"),
	path: "/interactive/intercom"
});
</script>
