<template>
	<section class="bg-white p-6 md:p-8 rounded-lg shadow">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<!-- Text content -->
			<div class="flex flex-col space-y-6" :class="{ 'lg:order-last': layoutOrder === 'reversed' }">
				<div class="relative pl-4">
					<div class="absolute left-0 top-0 h-full w-1" :class="dotClass"></div>
					<h2 class="text-2xl md:text-3xl font-bold text-primary">{{ featureData.title }}</h2>
				</div>
				<p class="text-primary/80 text-[16px] md:text-[18px] lg:text-[21px] leading-relaxed">{{ featureData.description }}</p>
				<!-- Feature Cards -->
				<div class="grid grid-cols-1 gap-4">
					<div v-for="(point, index) in featureData.points" :key="index" class="bg-gray-50 border border-gray-200 p-4 rounded-lg flex space-x-3">
						<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
						</svg>
						<p class="text-primary">{{ point }}</p>
					</div>
				</div>
				<div class="flex items-center gap-1 p-1 mt-auto rounded-xl bg-gray-100 border">
					<button
						v-for="button in featureData.buttons"
						:key="button.type"
						@click="$emit('select-product-type', { featureId: featureData.id, productType: button.type })"
						:class="getButtonClass(button.type)"
						class="flex-1 px-3 py-1.5 rounded-lg font-medium text-center"
					>
						{{ button.label }}
					</button>
				</div>
			</div>
			<!-- Product display -->
			<div class="bg-gray-100 p-6 rounded-lg relative">
				<transition name="product-fade" mode="out-in">
					<div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-4" key="loading">
						<div v-for="n in 2" :key="`skeleton-${n}`" class="animate-pulse space-y-4 rounded-lg border bg-white p-4 shadow-md">
							<div class="h-[256px] w-full rounded-md bg-gray-300"></div>
							<div class="space-y-4">
								<div class="h-4 w-3/4 rounded-md bg-gray-300"></div>
								<div class="h-4 w-1/2 rounded-md bg-gray-300"></div>
							</div>
						</div>
					</div>
					<div v-else :key="activeProductType">
						<ProductList :products="products" :loading="false" :max-items="4" />
					</div>
				</transition>
			</div>
		</div>
	</section>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";
import ProductList from "~/components/products/ProductList.vue";

const props = defineProps({
	featureData: {
		type: Object,
		required: true
	},
	layoutOrder: {
		type: String,
		default: "normal" // 'normal' or 'reversed'
	},
	isLoading: {
		type: Boolean,
		default: false
	},
	products: {
		type: Array,
		required: true
	},
	activeProductType: {
		type: String,
		required: true
	}
});

defineEmits(["select-product-type"]);

const colorClasses = {
	orange: "bg-orange-500",
	green: "bg-green-500",
	blue: "bg-blue-500",
	purple: "bg-purple-500"
};

const dotClass = computed(() => colorClasses[props.featureData.color] || "bg-gray-500");

const getButtonClass = (buttonType) => {
	const isActive = props.activeProductType === buttonType;
	return isActive ? "bg-primary text-white shadow-sm" : "text-gray-600 hover:bg-white/80";
};
</script>

<style scoped>
.product-fade-enter-active,
.product-fade-leave-active {
	transition: opacity 0.2s ease-in-out;
}

.product-fade-enter-from,
.product-fade-leave-to {
	opacity: 0;
}

button {
	transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}
</style>
