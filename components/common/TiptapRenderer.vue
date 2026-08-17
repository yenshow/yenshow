<template>
	<div @click="handleContentClick" @keydown="handleContentKeyDown">
		<editor-content v-if="editor" :editor="editor" class="tiptap-renderer-content" />
		<ImageLightbox v-model="isLightboxOpen" :src="lightboxSrc" :alt="lightboxAlt" />
	</div>
</template>

<script setup>
import { ref, watch, onUnmounted } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import ImageLightbox from "~/components/common/ImageLightbox.vue";

const props = defineProps({
	content: {
		type: Object,
		required: true,
		default: () => ({ type: "doc", content: [{ type: "paragraph" }] })
	}
});

const { t } = useI18n();
const isLightboxOpen = ref(false);
const lightboxSrc = ref("");
const lightboxAlt = ref("");

const getValidTiptapContent = (contentInput) => {
	if (contentInput && typeof contentInput === "object" && contentInput.type === "doc" && Array.isArray(contentInput.content)) {
		if (contentInput.content.length === 0) {
			return { ...contentInput, content: [{ type: "paragraph" }] };
		}
		return contentInput;
	}
	return { type: "doc", content: [{ type: "paragraph" }] };
};

const enhanceContentImages = (editorInstance) => {
	const editorEl = editorInstance?.view?.dom;
	if (!editorEl) return;
	editorEl.querySelectorAll("img").forEach((img) => {
		img.setAttribute("tabindex", "0");
		img.setAttribute("role", "button");
		if (!img.getAttribute("aria-label")) {
			img.setAttribute("aria-label", img.alt || t("image_lightbox.click_to_enlarge"));
		}
	});
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
		}),
		// --- Table Support ---
		Table,
		TableRow,
		TableHeader,
		TableCell
	],
	editable: false, // IMPORTANT: Set to read-only
	onCreate: ({ editor: createdEditor }) => enhanceContentImages(createdEditor),
	onUpdate: ({ editor: updatedEditor }) => enhanceContentImages(updatedEditor)
});

const handleOpenLightbox = (src, alt) => {
	lightboxSrc.value = src;
	lightboxAlt.value = alt || "";
	isLightboxOpen.value = true;
};

const handleContentClick = (event) => {
	const img = event.target.closest?.("img");
	if (!img?.src) return;
	event.preventDefault();
	handleOpenLightbox(img.src, img.alt || "");
};

const handleContentKeyDown = (event) => {
	if (event.key !== "Enter" && event.key !== " ") return;
	const img = event.target.closest?.("img");
	if (!img?.src) return;
	event.preventDefault();
	handleOpenLightbox(img.src, img.alt || "");
};

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
/* Styles are now handled globally by assets/css/tiptap-styles.css */
</style>
