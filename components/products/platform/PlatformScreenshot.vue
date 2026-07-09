<template>
	<div class="overflow-hidden rounded-2xl shadow-lg ring-1 ring-slate-200 bg-slate-50">
		<img
			:src="src"
			:alt="alt"
			:class="['w-full h-auto object-contain bg-slate-50', imageClass]"
			:loading="loading"
		/>
	</div>
</template>

<script setup>
defineProps({
	src: { type: String, required: true },
	alt: { type: String, required: true },
	imageClass: { type: String, default: "" },
	loading: { type: String, default: "lazy" }
});
</script>
