<template>
	<section class="py-16 md:py-24 bg-white">
		<div class="container px-4">
			<div class="text-center max-w-3xl mx-auto mb-12 md:mb-16">
				<h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800">{{ title }}</h2>
				<p v-if="description" class="mt-4 text-base md:text-lg text-slate-600">{{ description }}</p>
			</div>

			<div class="space-y-16 md:space-y-24 max-w-6xl mx-auto">
				<article
					v-for="(module, index) in modules"
					:key="module.id"
					:id="`platform-module-${module.id}`"
					:class="[
						'flex flex-col gap-8 md:gap-12 items-center scroll-mt-24',
						index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
					]"
				>
					<div class="flex-1 w-full space-y-5 lg:flex-[0.65]">
						<span :class="['text-sm font-bold tracking-wider', accentText]">MODULE {{ module.number }}</span>
						<h3 class="text-2xl md:text-3xl font-bold text-slate-800">{{ module.title }}</h3>
						<p class="text-slate-600 leading-relaxed">{{ module.description }}</p>
						<ul class="space-y-3" role="list">
							<li
								v-for="feature in module.subFeatures"
								:key="feature.key"
								class="flex items-start gap-3 text-sm md:text-base text-slate-700"
							>
								<span :class="['w-2 h-2 rounded-full shrink-0 mt-2', accentSolid]" aria-hidden="true" />
								<span>{{ feature.label }}</span>
							</li>
						</ul>
					</div>

					<div class="w-full lg:flex-[1.35] lg:max-w-none">
						<PlatformScreenshot
							:src="module.image"
							:alt="module.title"
							image-class="min-h-[200px] sm:min-h-[260px] md:min-h-[320px]"
						/>
					</div>
				</article>
			</div>
		</div>
	</section>
</template>

<script setup>
import PlatformScreenshot from "~/components/products/platform/PlatformScreenshot.vue";

defineProps({
	title: { type: String, required: true },
	description: { type: String, default: "" },
	modules: { type: Array, required: true },
	accentText: { type: String, default: "text-blue-600" },
	accentSolid: { type: String, default: "bg-blue-600" }
});
</script>
