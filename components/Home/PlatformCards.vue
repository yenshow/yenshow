<template>
	<article
		id="platforms-article"
		ref="sectionRef"
		class="relative container py-16 md:py-24 opacity-0"
		aria-labelledby="platforms-heading"
	>
		<PlatformEntrySection variant="light" heading-tag="h3" heading-id="platforms-heading" />
	</article>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import PlatformEntrySection from "~/components/products/platform/PlatformEntrySection.vue";

const sectionRef = ref(null);

onMounted(async () => {
	const scrollAnimation = inject("scrollAnimation", null);
	if (!scrollAnimation?.gsap || !sectionRef.value) return;

	if (typeof scrollAnimation.initScrollPlugins === "function") {
		await scrollAnimation.initScrollPlugins();
	}

	scrollAnimation.gsap.fromTo(
		sectionRef.value,
		{ opacity: 0, y: 40 },
		{
			opacity: 1,
			y: 0,
			duration: 0.9,
			ease: "power2.out",
			scrollTrigger: {
				trigger: sectionRef.value,
				start: "top 80%",
				toggleActions: "play none none none"
			}
		}
	);
});
</script>
