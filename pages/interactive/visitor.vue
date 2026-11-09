<template>
	<InteractivePageShell main-class="space-y-3 md:space-y-4" padding-class="py-3 sm:py-4 md:py-5">
		<InteractivePageHeader
			:title="t('interactive.visitor.title')"
			:lead="t('interactive.visitor.lead')"
			:back-label="t('interactive.nav.hub')"
		/>
		<ModuleStudio module-id="visitor" />
	</InteractivePageShell>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import InteractivePageShell from "~/components/interactive/InteractivePageShell.vue";
import InteractivePageHeader from "~/components/interactive/InteractivePageHeader.vue";
import ModuleStudio from "~/components/interactive/ModuleStudio.vue";

const { t } = useI18n();

usePageSeo({
	title: t("interactive.meta.visitor_title"),
	description: t("interactive.meta.visitor_description"),
	path: "/interactive/visitor"
});
</script>
