<template>
	<section class="bg-white p-6 rounded-lg shadow-lg border border-slate-200" aria-labelledby="faq-conversion-heading">
		<h2 id="faq-conversion-heading" class="text-xl font-semibold text-slate-800 mb-4">
			{{ t("faqs.conversion.heading") }}
		</h2>

		<div v-if="relatedSolutions.length" class="mb-6">
			<h3 class="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">{{ t("faqs.conversion.solutions") }}</h3>
			<ul class="space-y-2">
				<li v-for="item in relatedSolutions" :key="item.slug">
					<NuxtLink
						:to="localePath(item.path)"
						class="text-primary font-medium hover:underline"
						@click="handleSolutionClick(item)"
					>
						{{ item.title }}
					</NuxtLink>
				</li>
			</ul>
		</div>

		<div v-if="relatedProductPaths.length" class="mb-6">
			<h3 class="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">{{ t("faqs.conversion.products") }}</h3>
			<ul class="flex flex-wrap gap-3">
				<li v-for="path in relatedProductPaths" :key="path">
					<NuxtLink
						:to="localePath(path)"
						class="inline-block px-4 py-2 rounded-full border border-primary/30 text-primary text-sm font-medium hover:bg-primary/5"
						@click="handleProductClick(path)"
					>
						{{ productLabel(path) }}
					</NuxtLink>
				</li>
			</ul>
		</div>

		<div class="pt-2">
			<ButtonCTA
				:to="ctaTo"
				:label="primaryCta.label"
				:external="primaryCta.type === 'external'"
				@click="handlePrimaryCta"
			/>
		</div>
	</section>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import ButtonCTA from "~/components/common/Button-CTA.vue";

const props = defineProps({
	relatedSolutions: { type: Array, default: () => [] },
	relatedProductPaths: { type: Array, default: () => [] },
	primaryCta: { type: Object, required: true }
});

const { t, locale } = useI18n();
const localePath = useLocalePath();
const { trackFaqCtaClick } = useAnalytics();

const PRODUCT_LABELS = {
	"/products": { zh: "產品總覽", en: "All Products" },
	"/products/access-control": { zh: "門禁管理", en: "Access Control" },
	"/products/surveillance-monitoring": { zh: "影像監控", en: "Surveillance" },
	"/products/video-intercom": { zh: "可視對講", en: "Video Intercom" },
	"/products/security-solutions": { zh: "安全防護", en: "Security Solutions" },
	"/products/devices-accessories": { zh: "設備配件", en: "Devices & Accessories" }
};

const productLabel = (path) => {
	const labels = PRODUCT_LABELS[path];
	if (!labels) return path.replace("/products/", "").replace(/-/g, " ");
	return locale.value === "en" ? labels.en : labels.zh;
};

const ctaTo = computed(() => {
	if (props.primaryCta.type === "external") {
		return props.primaryCta.href;
	}
	if (props.primaryCta.href?.startsWith("/")) {
		return localePath(props.primaryCta.href);
	}
	return localePath("/contact");
});

const handleSolutionClick = (item) => {
	trackFaqCtaClick({
		cta_type: "solution",
		destination: item.path,
		item_slug: item.slug
	});
};

const handleProductClick = (path) => {
	trackFaqCtaClick({
		cta_type: "product_series",
		destination: path
	});
};

const handlePrimaryCta = () => {
	trackFaqCtaClick({
		cta_type: props.primaryCta.type || "contact",
		destination: props.primaryCta.href || "/contact"
	});
};
</script>
