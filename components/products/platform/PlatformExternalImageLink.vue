<template>
	<a
		:href="href"
		target="_blank"
		rel="noopener noreferrer"
		:aria-label="ariaLabel"
		class="group relative block w-full overflow-hidden rounded-2xl ring-1 ring-white/20 bg-slate-800/30 transition-shadow hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
	>
		<img
			:src="src"
			:alt="alt"
			:class="['w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]', imageClass]"
			:loading="loading"
		/>
		<span
			class="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-transparent px-4 py-3 text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
		>
			{{ linkLabel }}
			<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
			</svg>
		</span>
	</a>
</template>

<script setup>
defineProps({
	href: { type: String, required: true },
	src: { type: String, required: true },
	alt: { type: String, required: true },
	ariaLabel: { type: String, required: true },
	linkLabel: { type: String, required: true },
	imageClass: { type: String, default: "" },
	loading: { type: String, default: "lazy" }
});
</script>
