<template>
	<InteractivePageShell main-class="space-y-3 md:space-y-4" padding-class="py-3 sm:py-4 md:py-5">
		<InteractivePageHeader
			:title="t('interactive.access.title')"
			:lead="t('interactive.access.lead')"
			:back-label="t('interactive.nav.hub')"
		/>
		<AccessStudio />
	</InteractivePageShell>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import InteractivePageShell from "~/components/interactive/InteractivePageShell.vue";
import InteractivePageHeader from "~/components/interactive/InteractivePageHeader.vue";
import AccessStudio from "~/components/interactive/AccessStudio.vue";

const { t } = useI18n();

usePageSeo({
	title: t("interactive.meta.access_title"),
	description: t("interactive.meta.access_description"),
	path: "/interactive/access"
});
</script>
