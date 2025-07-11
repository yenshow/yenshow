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
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";

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
		}),
		// --- Table Support ---
		Table,
		TableRow,
		TableHeader,
		TableCell
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
	margin-top: 1em;
	margin-bottom: 1em;
}

.tiptap-renderer-content :deep(blockquote) {
	margin: 1.25em 0;
	padding: 0.5rem 1rem;
	border-left: 4px solid #cbd5e1; /* slate-300 */
	background-color: #f8fafc; /* slate-50 */
	font-size: 12px;
	font-style: italic;
	color: #475569; /* slate-600 */
}

/* --- Lists (UL/OL) Styles --- */
.tiptap-renderer-content :deep(ul),
.tiptap-renderer-content :deep(ol) {
	margin: 1em 0;
	padding-left: 1.75rem; /* Indentation */
	font-size: 12px;
}
.tiptap-renderer-content :deep(ul) {
	list-style-type: disc;
}
.tiptap-renderer-content :deep(ol) {
	list-style-type: decimal;
}
.tiptap-renderer-content :deep(li) {
	padding-left: 0.5rem;
	margin-bottom: 0.5em;
}

/* --- Horizontal Rule Style --- */
.tiptap-renderer-content :deep(hr) {
	border: 0;
	height: 1px;
	background-color: #e2e8f0; /* slate-200 */
	margin: 2em 0;
}

/* --- Table Styles --- */
.tiptap-renderer-content :deep(table) {
	width: 100%;
	border-collapse: collapse;
	table-layout: fixed; /* Enforce consistent column widths */
	margin: 1.5em 0;
	overflow: hidden;
	border-radius: 0.5rem; /* 8px */
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	border: 1px solid #e2e8f0; /* slate-200 */
}

.tiptap-renderer-content :deep(th),
.tiptap-renderer-content :deep(td) {
	padding: 0.5rem 0.75rem; /* 8px 12px */
	text-align: left;
	vertical-align: top;
	border-bottom: 1px solid #e2e8f0; /* slate-200, Horizontal lines for rows */
	font-size: 11px; /* Smaller than base paragraph font */
	word-wrap: break-word; /* Prevent long words from overflowing */
}

.tiptap-renderer-content :deep(th) {
	font-weight: 600;
	background-color: #f8fafc; /* slate-50 */
	/* Make header separator stronger */
	border-bottom-width: 2px;
}

.tiptap-renderer-content :deep(tbody tr:last-child td) {
	border-bottom: none;
}

/* Define column widths for a consistent layout across tables */
.tiptap-renderer-content :deep(th:nth-child(1)),
.tiptap-renderer-content :deep(td:nth-child(1)) {
	width: 25%;
}
.tiptap-renderer-content :deep(th:nth-child(2)),
.tiptap-renderer-content :deep(td:nth-child(2)) {
	width: 45%;
}
.tiptap-renderer-content :deep(th:nth-child(3)),
.tiptap-renderer-content :deep(td:nth-child(3)) {
	width: 30%;
}
/* --- End Table Styles --- */

/* 中等螢幕 (md: ≥768px) */
@media (min-width: 768px) {
	.tiptap-renderer-content :deep(h2) {
		font-size: 21px;
	}
	.tiptap-renderer-content :deep(p) {
		font-size: 16px;
	}
	.tiptap-renderer-content :deep(blockquote) {
		font-size: 16px;
	}
	.tiptap-renderer-content :deep(ul),
	.tiptap-renderer-content :deep(ol) {
		font-size: 16px;
	}
	.tiptap-renderer-content :deep(th),
	.tiptap-renderer-content :deep(td) {
		padding: 0.75rem 1rem; /* 12px 16px */
		font-size: 14px; /* md table font size */
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
	.tiptap-renderer-content :deep(blockquote) {
		font-size: 18px;
	}
	.tiptap-renderer-content :deep(ul),
	.tiptap-renderer-content :deep(ol) {
		font-size: 18px;
	}
	.tiptap-renderer-content :deep(th),
	.tiptap-renderer-content :deep(td) {
		font-size: 16px; /* lg table font size */
	}
}
</style>
