<template>
	<section class="py-12 md:py-16 bg-white border-b border-slate-100">
		<div class="container px-4 max-w-5xl mx-auto">
			<div class="text-center mb-10 md:mb-12">
				<h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 mb-4">{{ overviewTitle }}</h2>
				<p class="text-base md:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">{{ overviewDescription }}</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<article v-for="(item, index) in highlights" :key="index" class="rounded-xl border border-slate-200 bg-slate-50/50 p-6 text-center">
					<span :class="['inline-flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-sm mb-4', accentSolid]" aria-hidden="true">
						{{ String(index + 1).padStart(2, "0") }}
					</span>
					<h3 :class="['text-lg font-semibold mb-2', accentText]">{{ item.title }}</h3>
					<p class="text-sm text-slate-600 leading-relaxed">{{ item.description }}</p>
				</article>
			</div>
		</div>
	</section>
</template>

<script setup>
defineProps({
	overviewTitle: { type: String, required: true },
	overviewDescription: { type: String, required: true },
	highlights: { type: Array, required: true },
	accentText: { type: String, default: "text-blue-600" },
	accentSolid: { type: String, default: "bg-blue-600" }
});
</script>
