<template>
	<div class="min-h-screen" :class="surfaceClass">
		<main class="container" :class="[paddingClass, mainClass]">
			<slot />
		</main>
	</div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
	mainClass: {
		type: String,
		default: "space-y-12"
	},
	paddingClass: {
		type: String,
		default: "py-10 md:py-14"
	},
	/** default：淡白霧（工作室頁可讀性）；clear：透出站點背景（hub） */
	surface: {
		type: String,
		default: "default"
	}
});

const surfaceClass = computed(() =>
	props.surface === "clear" ? "bg-transparent" : "bg-gradient-to-b from-slate-100/80 via-white/50 to-transparent"
);
</script>
