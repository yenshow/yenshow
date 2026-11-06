<template>
	<component
		:is="linkTo ? NuxtLink : 'div'"
		v-bind="rootAttrs"
		class="hexagon -rotate-90 lg:rotate-0"
		:class="[sizeClass, { 'hexagon--link': Boolean(linkTo), 'hexagon--planned': Boolean(linkTo) && props.variant === 'planned' }]"
	>
		<nuxt-img
			v-if="imageSrc"
			:src="imageSrc"
			:alt="`${title} 圖示`"
			class="hexagon-content aspect-square w-[64px] md:w-[32px] lg:w-[40px] xl:w-[48px] 2xl:w-[56px]"
			format="webp"
			quality="85"
			loading="lazy"
			:placeholder="[50, 50, 75, 5]"
		/>
		<span class="hexagon-content max-w-[80%] text-center" :class="titleClass">{{ title }}</span>
	</component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NuxtLink } from "#components";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const localePath = useLocalePath();

const props = withDefaults(
	defineProps<{
		imageSrc?: string;
		title?: string;
		to?: string;
		ariaLabel?: string;
		size?: "sm" | "lg";
		variant?: "default" | "planned";
	}>(),
	{
		imageSrc: "",
		title: "",
		to: "",
		ariaLabel: "",
		size: "sm",
		variant: "default"
	}
);

const linkTo = computed(() => (props.to ? localePath(props.to) : ""));

const rootAttrs = computed(() => {
	if (!linkTo.value) return {};
	return {
		to: linkTo.value,
		"aria-label": props.ariaLabel || props.title
	};
});

const sizeClass = computed(() =>
	props.size === "lg"
		? "h-[146px] lg:h-[182px] xl:h-[220px] 2xl:h-[256px] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] xl:text-[28px] 2xl:text-[32px]"
		: "h-[121px] md:h-[144px] lg:h-[160px] xl:h-[192px] 2xl:h-[224px]"
);

const titleClass = computed(() => {
	if (props.size === "lg") return "";
	return locale.value === "zh"
		? "text-[12px] md:text-[16px] lg:text-[20px] xl:text-[24px] 2xl:text-[28px]"
		: "text-[11px] md:text-[14px] lg:text-[16px] xl:text-[20px] 2xl:text-[24px]";
});
</script>

<style scoped>
.hexagon {
	aspect-ratio: 0.8660254;
	clip-path: polygon(-50% 50%, 50% 100%, 150% 50%, 50% 0);
	background: linear-gradient(#dd1c1c, #770f0f);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: #f2f2f2;
	gap: 4px;
	position: relative;
	min-width: 0;
	overflow: hidden;
	text-decoration: none;
	transition: filter 0.2s ease;
}

.hexagon--link {
	cursor: pointer;
	z-index: 5;
	animation: hex-link-pulse 2.4s ease-in-out infinite;
}

.hexagon--planned {
	animation: hex-link-pulse 3.6s ease-in-out infinite;
	opacity: 0.88;
}

.hexagon--link:hover,
.hexagon--link:focus-visible {
	filter: brightness(1.18);
	outline: none;
	animation: none;
}

.hexagon--link:focus-visible {
	box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.75);
}

.hexagon-content {
	opacity: 0;
	transition: opacity 0.3s ease;
}

@keyframes hex-link-pulse {
	0%,
	100% {
		filter: brightness(1);
	}
	50% {
		filter: brightness(1.12);
	}
}
</style>
