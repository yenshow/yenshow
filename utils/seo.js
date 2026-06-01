/**
 * 從 Tiptap doc 或 HTML 擷取純文字（供 meta / JSON-LD）
 */
export const stripRichTextToPlain = (content, maxLength = 500) => {
	if (!content) return "";
	let text = "";

	if (typeof content === "string") {
		text = content.replace(/<[^>]+>/g, " ");
	} else if (typeof content === "object" && content.type === "doc" && Array.isArray(content.content)) {
		const walk = (nodes) => {
			for (const node of nodes) {
				if (node.type === "text" && node.text) {
					text += node.text;
				}
				if (node.content) {
					walk(node.content);
					text += " ";
				}
			}
		};
		walk(content.content);
	} else if (typeof content === "object") {
		text = content.TW || content.EN || "";
		if (typeof text === "object") {
			text = stripRichTextToPlain(text, maxLength);
		}
	}

	text = text.replace(/\s+/g, " ").trim();
	if (maxLength && text.length > maxLength) {
		return text.substring(0, maxLength - 3) + "...";
	}
	return text;
};

export const buildOrganizationJsonLd = (siteUrl) => ({
	"@context": "https://schema.org",
	"@type": "Organization",
	name: "遠岫科技有限公司",
	alternateName: "Yenshow Technology",
	url: siteUrl,
	logo: `${siteUrl}/logo/yenshow.svg`
});

export const buildWebSiteJsonLd = (siteUrl) => ({
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: "遠岫科技",
	url: siteUrl,
	publisher: {
		"@type": "Organization",
		name: "遠岫科技有限公司"
	}
});

export const buildFaqPageJsonLd = ({ question, answer, url }) => ({
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: [
		{
			"@type": "Question",
			name: question,
			acceptedAnswer: {
				"@type": "Answer",
				text: answer
			}
		}
	],
	...(url ? { url } : {})
});

export const buildArticleJsonLd = ({ headline, description, image, datePublished, url }) => ({
	"@context": "https://schema.org",
	"@type": "Article",
	headline,
	description,
	...(image ? { image } : {}),
	...(datePublished ? { datePublished } : {}),
	...(url ? { mainEntityOfPage: url } : {})
});

export const buildProductJsonLd = ({ name, description, image, url }) => ({
	"@context": "https://schema.org",
	"@type": "Product",
	name,
	description,
	...(image ? { image } : {}),
	...(url ? { url } : {})
});

export const buildBreadcrumbJsonLd = (items) => ({
	"@context": "https://schema.org",
	"@type": "BreadcrumbList",
	itemListElement: items.map((item, index) => ({
		"@type": "ListItem",
		position: index + 1,
		name: item.name,
		item: item.item
	}))
});
