<template>
	<NuxtLink
		:to="to"
		:class="[
			'group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1',
			variant === 'dark'
				? 'rounded-xl bg-sky-800/30 border border-sky-600/30 hover:border-sky-400/50 hover:bg-sky-800/50 hover:shadow-xl'
				: 'rounded-2xl border border-slate-200 bg-white shadow-md hover:shadow-xl'
		]"
		:aria-label="cta"
	>
		<div :class="['h-2 w-full bg-gradient-to-r shrink-0', accent]" aria-hidden="true" />

		<div
			:class="[
				'relative w-full overflow-hidden shrink-0',
				variant === 'dark' ? 'bg-slate-900/40 border-b border-sky-600/20' : 'bg-slate-50 border-b border-slate-100'
			]"
		>
			<img
				:src="image"
				:alt="title"
				class="w-full h-56 sm:h-64 md:h-72 object-contain object-center p-3 md:p-4 transition-transform duration-300 group-hover:scale-[1.02]"
				loading="lazy"
			/>
		</div>

		<div :class="['flex flex-col flex-1', variant === 'dark' ? 'p-5' : 'p-6 md:p-8']">
			<h4
				:class="[
					'font-bold mb-2 md:mb-3 leading-snug',
					variant === 'dark' ? 'text-lg text-white' : 'text-2xl md:text-3xl text-slate-800'
				]"
			>
				{{ title }}
			</h4>
			<p
				:class="[
					'text-sm md:text-base leading-relaxed flex-1',
					variant === 'dark' ? 'text-sky-100/80' : 'text-slate-600'
				]"
			>
				{{ description }}
			</p>
			<span
				:class="[
					'inline-flex items-center gap-2 font-medium text-sm md:text-base mt-4 md:mt-6 group-hover:gap-3 transition-all',
					variant === 'dark' ? 'text-sky-300 group-hover:text-white' : linkClass
				]"
			>
				{{ cta }}
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H7" />
				</svg>
			</span>
		</div>
	</NuxtLink>
</template>

<script setup>
defineProps({
	to: { type: String, required: true },
	title: { type: String, required: true },
	description: { type: String, required: true },
	cta: { type: String, required: true },
	image: { type: String, required: true },
	accent: { type: String, required: true },
	linkClass: { type: String, default: "text-blue-600" },
	variant: { type: String, default: "light" }
});
</script>
