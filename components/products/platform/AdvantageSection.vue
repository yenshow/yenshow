<template>
	<section class="py-16 md:py-24 bg-white">
		<div class="container px-4">
			<h2 class="text-2xl md:text-3xl font-bold text-slate-800 text-center mb-10">{{ title }}</h2>

			<div class="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
				<div class="grid grid-cols-2 bg-slate-100 text-sm font-semibold text-slate-700">
					<div class="px-4 py-3 border-b border-r border-slate-200">{{ traditionalLabel }}</div>
					<div :class="['px-4 py-3 border-b border-slate-200', accentText]">{{ oursLabel }}</div>
				</div>
				<div v-for="(row, index) in rows" :key="index" class="grid grid-cols-2 text-sm md:text-base">
					<div class="px-4 py-4 border-b border-r border-slate-100 text-slate-600 bg-slate-50/50">{{ row.traditional }}</div>
					<div class="px-4 py-4 border-b border-slate-100 text-slate-800 font-medium">{{ row.ours }}</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
defineProps({
	title: { type: String, required: true },
	rows: { type: Array, required: true },
	traditionalLabel: { type: String, required: true },
	oursLabel: { type: String, required: true },
	accentText: { type: String, default: "text-blue-600" }
});
</script>
