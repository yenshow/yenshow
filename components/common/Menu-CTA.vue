<template>
	<span
		class="text-[18px] sm:text-[21px] md:text-[24px] lg:text-[26px] xl:text-[28px] 2xl:text-[30px] text-white cursor-pointer opacity-70 hover:opacity-100"
		style="text-shadow: 0 0 10px rgba(0, 0, 0, 0.5)"
	>
		– {{ label }}
	</span>
</template>

<script setup lang="ts">
defineProps({
	label: {
		type: String,
		default: "品牌故事"
	}
});
</script>
