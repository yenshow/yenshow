<template>
	<div>
		<div :class="['text-center', variant === 'dark' ? 'mb-8 md:mb-10' : 'mb-10 md:mb-14']">
			<component
				:is="headingTag"
				:id="headingId"
				:class="['font-bold', variant === 'dark' ? 'text-2xl md:text-3xl text-white' : 'text-[24px] md:text-[36px] lg:text-[48px] text-slate-800']"
			>
				{{ $t("home.intro.platforms.heading") }}
			</component>
			<p :class="['mt-2 md:mt-3 text-lg md:text-2xl mx-auto', variant === 'dark' ? 'text-sky-200/90' : 'text-slate-600']">
				{{ $t("home.intro.platforms.subheading") }}
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
			<PlatformEntryCard
				v-for="card in platforms"
				:key="card.slug"
				:to="localePath(`/products/${card.slug}`)"
				:title="card.title"
				:description="card.description"
				:cta="card.cta"
				:image="card.image"
				:accent="card.accent"
				:link-class="card.linkClass"
				:variant="variant"
			/>
		</div>
	</div>
</template>

<script setup>
import PlatformEntryCard from "~/components/products/platform/PlatformEntryCard.vue";

defineProps({
	variant: { type: String, default: "light" },
	headingTag: { type: String, default: "h2" },
	headingId: { type: String, default: undefined }
});

const localePath = useLocalePath();
const platforms = usePlatformList();
</script>
