import { computed, ref } from "vue";

/** Soft node-tap invite until the user clicks a diagram box once. */
export const useInteractiveCoach = () => {
	const hasTappedNode = ref(false);
	const inviteNodes = computed(() => !hasTappedNode.value);
	const markNodeTap = () => {
		hasTappedNode.value = true;
	};
	return { inviteNodes, markNodeTap };
};
