<template>
	<ClientOnly>
		<Teleport to="body">
			<div
				v-if="modelValue && src"
				class="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
				role="dialog"
				aria-modal="true"
				:aria-labelledby="titleId"
				@click.self="handleClose"
			>
				<h2 :id="titleId" class="sr-only">{{ previewTitle }}</h2>
				<button
					ref="closeButtonRef"
					type="button"
					class="absolute top-2 right-2 rounded-full bg-white/80 p-2 text-gray-500 transition-all duration-200 hover:bg-white hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
					:aria-label="closeLabel"
					@click="handleClose"
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" aria-hidden="true">
						<title>{{ closeLabel }}</title>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
					</svg>
				</button>
				<img :src="src" :alt="alt || previewTitle" class="max-h-[90vh] max-w-[95vw] object-contain" />
			</div>
		</Teleport>
	</ClientOnly>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps({
	modelValue: { type: Boolean, default: false },
	src: { type: String, default: "" },
	alt: { type: String, default: "" }
});

const emit = defineEmits(["update:modelValue"]);
const { t } = useI18n();

const closeButtonRef = ref(null);
const titleId = useId();
let triggerElement = null;
let previousOverflow = "";

const previewTitle = computed(() => t("image_lightbox.preview_title"));
const closeLabel = computed(() => t("image_lightbox.close_preview"));

const handleClose = () => {
	emit("update:modelValue", false);
};

const handleKeyDown = (event) => {
	if (event.key === "Escape") {
		handleClose();
	}
};

watch(
	() => props.modelValue,
	async (isOpen) => {
		if (!import.meta.client) return;

		if (isOpen) {
			triggerElement = document.activeElement;
			previousOverflow = document.body.style.overflow;
			document.body.style.overflow = "hidden";
			window.addEventListener("keydown", handleKeyDown);
			await nextTick();
			closeButtonRef.value?.focus();
			return;
		}

		window.removeEventListener("keydown", handleKeyDown);
		document.body.style.overflow = previousOverflow;
		if (triggerElement && typeof triggerElement.focus === "function") {
			triggerElement.focus();
		}
		triggerElement = null;
	}
);

onBeforeUnmount(() => {
	if (!import.meta.client) return;
	window.removeEventListener("keydown", handleKeyDown);
	if (props.modelValue) {
		document.body.style.overflow = previousOverflow;
	}
});
</script>
