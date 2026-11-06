<template>
	<div :class="rowClass">
		<Hexagon
			v-for="item in items"
			:key="item.titleKey"
			:image-src="item.imageSrc"
			:title="$t(item.titleKey)"
			:to="item.to"
			:aria-label="item.ariaKey ? $t(item.ariaKey) : undefined"
			:variant="item.variant"
			:size="item.size || 'sm'"
		/>
	</div>
</template>

<script setup>
import Hexagon from "~/components/common/Hexagon.vue";

defineProps({
	items: {
		type: Array,
		required: true
	},
	rowClass: {
		type: String,
		default: ""
	}
});
</script>
