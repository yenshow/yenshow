<template>
	<PlannedModulePage :module-id="moduleId" />
</template>

<script setup>
import PlannedModulePage from "~/components/interactive/PlannedModulePage.vue";
import { plannedHasModule } from "~/data/interactive/plannedContent.js";

const route = useRoute();
const moduleId = computed(() => String(route.params.module || ""));

watch(
	moduleId,
	(id) => {
		if (!plannedHasModule(id)) {
			throw createError({ statusCode: 404, statusMessage: "Module not found" });
		}
	},
	{ immediate: true }
);
</script>
