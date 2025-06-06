<template>
	<editor-content v-if="editor" :editor="editor" class="tiptap-renderer-content" />
</template>

<script setup>
import { ref, watch, onUnmounted } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";

const props = defineProps({
	content: {
		type: Object,
		required: true,
		default: () => ({ type: "doc", content: [{ type: "paragraph" }] })
	}
});

const getValidTiptapContent = (contentInput) => {
	if (contentInput && typeof contentInput === "object" && contentInput.type === "doc" && Array.isArray(contentInput.content)) {
		if (contentInput.content.length === 0) {
			return { ...contentInput, content: [{ type: "paragraph" }] };
		}
		return contentInput;
	}
	return { type: "doc", content: [{ type: "paragraph" }] };
};

const editor = useEditor({
	content: getValidTiptapContent(props.content),
	extensions: [
		StarterKit.configure({
			heading: { levels: [1, 2, 3, 4, 5, 6] },
			blockquote: {} // Enable blockquote if used
		}),
		TextStyle, // To render color styles
		Color, // To render color styles
		Link.configure({
			openOnClick: true, // Make links clickable
			autolink: true, // Automatically detect links
			linkOnPaste: false, // Not relevant for read-only
			HTMLAttributes: {
				target: "_blank",
				rel: "noopener noreferrer nofollow"
			}
		})
	],
	editable: false // IMPORTANT: Set to read-only
});

watch(
	() => props.content,
	(newContent) => {
		if (editor.value) {
			const validContent = getValidTiptapContent(newContent);
			if (JSON.stringify(editor.value.getJSON()) !== JSON.stringify(validContent)) {
				editor.value.commands.setContent(validContent, false); // Use false to avoid emitting update event
			}
		}
	},
	{ deep: true }
);

// Destroy the editor instance on unmount
onUnmounted(() => {
	if (editor.value) {
		editor.value.destroy();
	}
});
</script>

<style scoped>
.tiptap-renderer-content :deep(h2) {
	font-size: 16px;
	margin-top: 1.14em; /* Tailwind h2 default */
	margin-bottom: 0.57em; /* Tailwind h2 default */
}

.tiptap-renderer-content :deep(p) {
	font-size: 12px;
	margin-top: 1.25em; /* Tailwind p default */
	margin-bottom: 1.25em; /* Tailwind p default */
}

.tiptap-renderer-content :deep(blockquote) {
	font-size: 12px;
	margin-top: 1.25em; /* Tailwind p default */
	margin-bottom: 1.25em; /* Tailwind p default */
}

/* 中等螢幕 (md: ≥768px) */
@media (min-width: 768px) {
	.tiptap-renderer-content :deep(h2) {
		font-size: 21px;
	}
	.tiptap-renderer-content :deep(p) {
		font-size: 16px;
	}
}

/* 大型螢幕 (lg: ≥1024px) */
@media (min-width: 1024px) {
	.tiptap-renderer-content :deep(h2) {
		font-size: 24px;
	}
	.tiptap-renderer-content :deep(p) {
		font-size: 18px;
	}
}
</style>
