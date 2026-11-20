<template>
	<header class="max-w-4xl space-y-1 md:space-y-1.5">
		<NuxtLink
			:to="localePath(backTo)"
			class="inline-flex text-sm font-medium text-emerald-700 no-underline hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
		>
			{{ backLabel }}
		</NuxtLink>
		<h1 class="text-2xl font-bold text-primary md:text-3xl xl:text-4xl">{{ title }}</h1>
		<p v-if="lead" class="text-sm text-slate-600 md:text-base">{{ lead }}</p>
	</header>
</template>

<script setup>
import { INTERACTIVE_HUB_PATH } from "~/data/interactive/modules.js";

defineProps({
	title: { type: String, required: true },
	lead: { type: String, default: "" },
	backTo: { type: String, default: INTERACTIVE_HUB_PATH },
	backLabel: { type: String, required: true }
});

const localePath = useLocalePath();
</script>
