<template>
	<div class="hexagon h-[121px] md:h-[144px] lg:h-[160px] xl:h-[192px] 2xl:h-[224px] -rotate-90 lg:rotate-0">
		<nuxt-img
			:src="imageSrc"
			:alt="`${title} 圖示`"
			class="hexagon-content aspect-square w-[32px] md:w-[40px] lg:w-[48px] xl:w-[56px] 2xl:w-[64px]"
			width="64"
			height="64"
			format="webp"
			loading="lazy"
			sizes="(max-width: 768px) 32px, (max-width: 1024px) 40px, (max-width: 1280px) 48px, (max-width: 1536px) 56px, 64px"
		/>
		<span class="hexagon-content text-[12px] md:text-[16px] lg:text-[20px] xl:text-[24px] 2xl:text-[28px]">{{ title }}</span>
	</div>
</template>

<script setup lang="ts">
defineProps({
	imageSrc: {
		type: String,
		default: "/YSCP/board-game.jpg"
	},
	title: {
		type: String,
		default: "數位看板"
	}
});
</script>

<style scoped>
.hexagon {
	aspect-ratio: cos(30deg);
	clip-path: polygon(-50% 50%, 50% 100%, 150% 50%, 50% 0);
	background: linear-gradient(#dd1c1c, #770f0f);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: #f2f2f2;
	gap: 4px;
	position: relative;
}

.hexagon-content {
	opacity: 0;
	transition: opacity 0.3s ease;
}
</style>
