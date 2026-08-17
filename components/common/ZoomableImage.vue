<template>
	<button
		type="button"
		class="relative block w-full cursor-zoom-in overflow-hidden border-0 bg-transparent p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
		:class="wrapperClass"
		:aria-label="enlargeLabel"
		@click="handleOpen"
		@keydown.enter="handleOpen"
		@keydown.space.prevent="handleOpen"
	>
		<NuxtImg
			:src="src"
			:alt="alt"
			:class="imageClass"
			class="transition-transform duration-300 group-hover:scale-105"
			:format="format"
			:quality="quality"
			:loading="loading"
			:placeholder="placeholder"
			v-bind="fetchpriority ? { fetchpriority } : {}"
		/>
		<div v-if="showHint" class="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2">
			<div class="flex items-center space-x-1 rounded-full bg-black/75 px-3 py-1 text-sm text-white">
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
					/>
				</svg>
				<span>{{ hintText }}</span>
			</div>
		</div>
	</button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
	src: { type: String, required: true },
	alt: { type: String, default: "" },
	imageClass: { type: String, default: "w-full h-auto object-contain" },
	wrapperClass: { type: String, default: "group" },
	showHint: { type: Boolean, default: false },
	format: { type: String, default: "webp" },
	quality: { type: [Number, String], default: 90 },
	loading: { type: String, default: "lazy" },
	placeholder: { type: [Array, Boolean], default: () => [50, 50, 75, 5] },
	fetchpriority: { type: String, default: undefined }
});

const emit = defineEmits(["open"]);
const { t } = useI18n();

const hintText = computed(() => t("image_lightbox.click_to_enlarge"));
const enlargeLabel = computed(() => `${props.alt ? `${props.alt} - ` : ""}${t("image_lightbox.click_to_enlarge")}`);

const handleOpen = (event) => {
	emit("open", {
		src: props.src,
		alt: props.alt,
		target: event.currentTarget
	});
};
</script>
