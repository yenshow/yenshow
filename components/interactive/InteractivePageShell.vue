<template>
	<div class="min-h-screen bg-gradient-to-b from-slate-100/80 via-white/50 to-transparent">
		<main class="container" :class="[paddingClass, mainClass]">
			<slot />
		</main>
	</div>
</template>

<script setup>
defineProps({
	mainClass: {
		type: String,
		default: "space-y-12"
	},
	paddingClass: {
		type: String,
		default: "py-10 md:py-14"
	}
});
</script>
