<template>
	<a :href="to" class="button" :class="buttonClass">
		<span>{{ label }}</span>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-9 md:w-9" viewBox="0 0 512 512">
			<path
				fill="currentColor"
				d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM241 377c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l87-87-87-87c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L345 239c9.4 9.4 9.4 24.6 0 33.9L241 377z"
			/>
		</svg>
	</a>
</template>

<script setup lang="ts">
const props = defineProps({
	label: {
		type: String,
		default: "View More"
	},
	color: {
		type: String,
		validator: (value: string) => ["black", "white"].includes(value),
		default: "black"
	},
	to: {
		type: String,
		default: "#" // 預設為空連結
	}
});

// 計算樣式
const buttonClass = computed(() => ({
	"button-black": props.color === "black",
	"button-white": props.color === "white"
}));
</script>

<style scoped>
.button {
	/* Mobile first styles */
	min-width: 92px;
	padding: 6px 12px;
	border-radius: 25px; /* Consistent border-radius */
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
	cursor: pointer;
	background: transparent;
	position: relative;
	overflow: hidden;
	transition: color 0.3s ease-in-out;
}

/* md and larger screens */
@media (min-width: 768px) {
	.button {
		min-width: 168px;
		padding: 12px 24px;
		gap: 12px;
	}
}

/* 黑色主題 */
.button-black {
	/* Mobile first */
	box-shadow: inset 0 0 0 2px #212a37;
	color: #212a37;
}
@media (min-width: 768px) {
	.button-black {
		box-shadow: inset 0 0 0 3px #212a37;
	}
}

.button-black::before {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: #212a37;
	transform: scaleX(0);
	transform-origin: left;
	transition: transform 0.3s ease-in-out;
}

.button-black:hover::before {
	transform: scaleX(1);
}

.button-black:hover span,
.button-black:hover svg {
	color: #ffffff;
}

/* 白色主題 */
.button-white {
	/* Mobile first */
	box-shadow: inset 0 0 0 2px #ffffff;
	color: #ffffff;
}
@media (min-width: 768px) {
	.button-white {
		box-shadow: inset 0 0 0 3px #ffffff;
	}
}

.button-white::before {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: #ffffff;
	transform: scaleX(0);
	transform-origin: left;
	transition: transform 0.3s ease-in-out;
}

.button-white:hover::before {
	transform: scaleX(1);
}

.button-white:hover span,
.button-white:hover svg {
	color: #212a37;
}

/* 文字與 SVG 樣式 */
.button span {
	/* Mobile first */
	font-size: 12px;
	line-height: 16px;
	transition: color 0.3s ease-in-out;
	z-index: 1;
}
.button svg {
	/* SVG base size handled by class attribute in template */
	transition: color 0.3s ease-in-out;
	z-index: 1;
}

@media (min-width: 768px) {
	.button span {
		font-size: 24px;
		line-height: 32px;
	}
}
</style>
