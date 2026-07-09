import { platformProducts, platformSlugs } from "~/data/platformProducts";
import { useScrollAnimation } from "~/composables/useScrollAnimation";
import { getNavTagClass } from "~/utils/getNavTagClass";

const listI18nItems = (tm, baseKey, mapItem) => {
	const raw = tm(baseKey);
	if (!Array.isArray(raw)) return [];
	return raw.map((_, index) => mapItem(index));
};

export const usePlatformProduct = (slug) => {
	const { t, tm } = useI18n();
	const product = platformProducts[slug];

	if (!product) {
		return { product: null };
	}

	const i18nKey = `platform.${slug}`;
	const { initScrollPlugins, createElementEntrance, gsap, isMobile } = useScrollAnimation();

	const meta = computed(() => ({
		title: t(`${i18nKey}.meta.title`),
		description: t(`${i18nKey}.meta.description`)
	}));

	const hero = computed(() => ({
		title: t(`${i18nKey}.title`),
		subtitle: t(`${i18nKey}.subtitle`)
	}));

	const overview = computed(() => ({
		title: t(`${i18nKey}.overview.title`),
		description: t(`${i18nKey}.overview.description`)
	}));

	const overviewHighlights = computed(() =>
		listI18nItems(tm, `${i18nKey}.overview_highlights`, (index) => ({
			title: t(`${i18nKey}.overview_highlights.${index}.title`),
			description: t(`${i18nKey}.overview_highlights.${index}.description`)
		}))
	);

	const moduleGroups = computed(() =>
		product.moduleGroups.map((group, index) => ({
			id: group.id,
			number: String(index + 1).padStart(2, "0"),
			title: t(`${i18nKey}.modules.${group.id}.title`),
			description: t(`${i18nKey}.modules.${group.id}.description`),
			image: group.image,
			navColor: group.navColor,
			subFeatures: group.subFeatures.map((key) => ({
				key,
				label: t(`${i18nKey}.sub_features.${key}`)
			}))
		}))
	);

	const navSections = computed(() =>
		moduleGroups.value.map((module) => ({
			id: `platform-module-${module.id}`,
			title: module.title,
			color: module.navColor || "blue"
		}))
	);

	const currentIndex = platformSlugs.indexOf(slug);

	const getPlatformByOffset = (offset) => {
		const targetIndex = (currentIndex + offset + platformSlugs.length) % platformSlugs.length;
		const targetSlug = platformSlugs[targetIndex];
		return {
			slug: targetSlug,
			shortTitle: t(`platform.${targetSlug}.shortTitle`)
		};
	};

	const prevPlatform = getPlatformByOffset(-1);
	const nextPlatform = getPlatformByOffset(1);

	const advantages = computed(() => ({
		title: t(`${i18nKey}.advantages.title`),
		rows: listI18nItems(tm, `${i18nKey}.advantages.comparison`, (index) => ({
			traditional: t(`${i18nKey}.advantages.comparison.${index}.traditional`),
			ours: t(`${i18nKey}.advantages.comparison.${index}.ours`)
		}))
	}));

	const externalLink = computed(() => ({
		label: t("platform.external_link_label"),
		ariaLabel: t("platform.external_link_aria", { name: t(`${i18nKey}.title`) })
	}));

	const jsonLd = computed(() => ({
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: t(`${i18nKey}.title`),
		applicationCategory: "BusinessApplication",
		operatingSystem: "Web",
		description: t(`${i18nKey}.meta.description`),
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "TWD",
			description: t(`${i18nKey}.meta.description`)
		}
	}));

	const scrollToSection = (sectionId) => {
		const element = document.getElementById(sectionId);
		if (element && gsap) {
			gsap.to(window, {
				duration: 1,
				ease: "power2.inOut",
				scrollTo: {
					y: element,
					offsetY: isMobile.value ? 80 : 100
				}
			});
			return;
		}

		if (element) {
			element.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	const animateHeroSection = () => {
		if (!gsap) return;
		const tl = gsap.timeline({ defaults: { duration: 0.9, ease: "power2.out" } });
		tl.from(".platform-hero-title", { opacity: 0, y: 20, delay: 0.2 })
			.from(".platform-hero-subtitle", { opacity: 0, y: 30 }, "-=0.7")
			.from(".platform-hero-nav", { opacity: 0, y: 20, stagger: 0.1 }, "-=0.6")
			.from(".platform-hero-image", { opacity: 0, scale: 0.9, duration: 1.2 }, "-=0.8")
			.from(".platform-hero-prev", { opacity: 0, x: -50 }, "-=1")
			.from(".platform-hero-next", { opacity: 0, x: 50 }, "-=1");
	};

	const setupScrollAnimations = () => {
		if (!createElementEntrance) return;
		const sections = document.querySelectorAll(".platform-section");
		if (!sections.length) return;

		sections.forEach((section) => {
			createElementEntrance({
				elements: section,
				trigger: section,
				fromY: isMobile.value ? 40 : 80,
				duration: 1,
				delay: 0,
				start: "top 85%",
				toggleActions: "play none none none"
			});
		});
	};

	onMounted(async () => {
		await initScrollPlugins();
		nextTick(() => {
			animateHeroSection();
			setupScrollAnimations();
		});
	});

	return {
		product,
		meta,
		hero,
		overview,
		overviewHighlights,
		moduleGroups,
		navSections,
		prevPlatform,
		nextPlatform,
		advantages,
		externalLink,
		jsonLd,
		scrollToSection,
		getNavTagClass
	};
};
