<template>
	<!-- Filter Buttons -->
	<div class="flex flex-wrap bg-slate-100 p-0.5 sm:p-1 rounded-lg sm:rounded-xl z-30" role="group" :aria-label="props.name || '篩選選項'">
		<button
			v-for="option in processedOptions"
			:key="option.value"
			@click="setFilter(option.value)"
			:class="[
				'text-xs sm:text-sm md:text-base px-2 py-1 sm:px-3 sm:py-1.5 md:px-3.5 md:py-3 lg:px-4 lg:py-3.5 xl:px-5 xl:py-4 rounded-md sm:rounded-lg',
				selectedOption === option.value ? 'bg-white shadow-md text-primary font-semibold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
			]"
			:aria-pressed="selectedOption === option.value ? 'true' : 'false'"
		>
			{{ option.label }}
		</button>
	</div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useLanguageStore } from "~/stores/core/languageStore";

// Define `props`
const props = defineProps({
	name: {
		type: String,
		default: null
	},
	options: {
		type: Array,
		required: true
	},
	modelValue: {
		type: String,
		default: "ALL"
	},
	filterKey: {
		type: String,
		default: ""
	},
	// Support for localized option objects
	isLocalizedOptions: {
		type: Boolean,
		default: false
	}
});

// Define `emit`
const emit = defineEmits(["update:modelValue"]);

// Currently selected filter option
const selectedOption = ref(props.modelValue);

// Watch for external modelValue changes
watch(
	() => props.modelValue,
	(newValue) => {
		selectedOption.value = newValue || "ALL";
	}
);

// Process options for display, handling localization
const languageStore = useLanguageStore();
const processedOptions = computed(() => {
	// Add 'ALL' option consistently at the beginning
	const allOption = { value: "ALL", label: "ALL" };
	let sourceOptions = [];

	// If options are simple strings
	if (!props.isLocalizedOptions) {
		sourceOptions = props.options.map((option) => ({
			value: option,
			label: option
		}));
	}
	// If options are objects (with localization info)
	else {
		sourceOptions = props.options.map((option) => {
			if (typeof option === "string") {
				return { value: option, label: option };
			}
			// Handle potential object structure variations
			const value = option.value || option._id;
			const label = languageStore.getLocalizedField(option, "name") || option.label || value;
			return {
				value: value,
				label: label
			};
		});
	}

	// Ensure 'ALL' is not duplicated if already present in source options
	const hasAllOption = sourceOptions.some((opt) => opt.value === "ALL");
	return hasAllOption ? sourceOptions : [allOption, ...sourceOptions];
});

// Update selection and notify parent component when a button is clicked
const setFilter = (value) => {
	selectedOption.value = value;
	emit("update:modelValue", value);
};
</script>
