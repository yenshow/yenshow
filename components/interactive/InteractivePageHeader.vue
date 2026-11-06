<template>
	<header class="max-w-4xl space-y-1 md:space-y-1.5">
		<NuxtLink
			:to="localePath(backTo)"
			class="inline-flex text-sm font-medium text-emerald-700 no-underline hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
		>
			← {{ backLabel }}
		</NuxtLink>
		<span
			v-if="badge"
			class="inline-block rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700"
		>
			{{ badge }}
		</span>
		<h1 class="text-2xl font-bold text-primary md:text-3xl xl:text-4xl">{{ title }}</h1>
		<p v-if="lead" class="text-sm text-slate-600 md:text-base">{{ lead }}</p>
	</header>
</template>

<script setup>
defineProps({
	title: { type: String, required: true },
	lead: { type: String, default: "" },
	badge: { type: String, default: "" },
	backTo: { type: String, default: "/interactive" },
	backLabel: { type: String, required: true }
});

const localePath = useLocalePath();
</script>
