<template>
	<section class="relative overflow-hidden bg-gradient-to-br from-blue-900/95 via-teal-800/90 to-emerald-900/95 text-white">
		<div class="container relative z-10 py-12 md:py-16 lg:py-24">
			<div class="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12 items-center">
				<div class="relative space-y-6 text-center lg:text-left lg:col-span-2 py-8 lg:py-16">
					<PlatformSwitchLink
						:to="localePath(`/products/${prevPlatform.slug}`)"
						:label="prevPlatform.shortTitle"
						position="prev"
					/>

					<h1 class="platform-hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight drop-shadow-lg">
						{{ title }}
					</h1>
					<p class="platform-hero-subtitle text-lg md:text-xl text-white/90 max-w-xl mx-auto lg:mx-0">{{ subtitle }}</p>

					<div class="platform-hero-nav my-6 flex flex-wrap items-center justify-center lg:justify-start gap-3">
						<a
							v-for="section in navSections"
							:key="section.id"
							:href="`#${section.id}`"
							:class="getNavTagClass(section.color)"
							@click.prevent="scrollToSection(section.id)"
						>
							{{ section.title }}
						</a>
					</div>

					<PlatformSwitchLink
						:to="localePath(`/products/${nextPlatform.slug}`)"
						:label="nextPlatform.shortTitle"
						position="next"
					/>
				</div>

				<div class="relative flex items-center justify-center lg:col-span-3 platform-hero-image">
					<PlatformExternalImageLink
						class="w-full"
						:href="platformUrl"
						:src="heroImage"
						:alt="title"
						:aria-label="externalLink.ariaLabel"
						:link-label="externalLink.label"
						image-class="min-h-[220px] sm:min-h-[280px] md:min-h-[340px] lg:min-h-[420px]"
						loading="eager"
					/>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import PlatformExternalImageLink from "~/components/products/platform/PlatformExternalImageLink.vue";
import PlatformSwitchLink from "~/components/products/platform/PlatformSwitchLink.vue";

defineProps({
	title: { type: String, required: true },
	subtitle: { type: String, required: true },
	heroImage: { type: String, required: true },
	platformUrl: { type: String, required: true },
	externalLink: { type: Object, required: true },
	navSections: { type: Array, required: true },
	prevPlatform: { type: Object, required: true },
	nextPlatform: { type: Object, required: true },
	scrollToSection: { type: Function, required: true },
	getNavTagClass: { type: Function, required: true }
});

const localePath = useLocalePath();
</script>
