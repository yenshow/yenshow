<template>
	<NuxtLink
		:to="to"
		:class="[
			'absolute z-20 group',
			position === 'prev' ? 'left-0 top-0 platform-hero-prev' : 'right-0 bottom-0 platform-hero-next'
		]"
		:aria-label="label"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="280"
			height="150"
			fill="currentColor"
			viewBox="0 0 280 150"
			:class="[
				'w-[140px] h-auto sm:w-[180px] lg:w-[220px] text-white opacity-20 hover:opacity-40 transition-all duration-300 ease-in-out',
				position === 'prev' ? 'rotate-[-30deg]' : 'rotate-[150deg]'
			]"
			aria-hidden="true"
		>
			<path
				fill="currentColor"
				d="M150 16.18c0-7.433-7.823-12.268-14.472-8.944l-130 65A10 10 0 0 0 0 81.18v52.64c0 7.433 7.823 12.268 14.472 8.944L150 75V16.18Z"
			/>
			<path
				fill="currentColor"
				d="M130 16.18c0-7.433 7.823-12.268 14.472-8.944l130 65A10 10 0 0 1 280 81.18v52.64c0 7.433-7.823 12.268-14.472 8.944L130 75V16.18Z"
			/>
		</svg>
		<p
			:class="[
				'absolute rotate-[-30deg] text-sm sm:text-base lg:text-lg font-bold text-white',
				position === 'prev' ? 'top-[25%] left-[30%]' : 'bottom-[25%] right-[30%]'
			]"
		>
			{{ label }}
		</p>
	</NuxtLink>
</template>

<script setup>
defineProps({
	to: { type: String, required: true },
	label: { type: String, required: true },
	position: { type: String, required: true, validator: (value) => ["prev", "next"].includes(value) }
});
</script>
