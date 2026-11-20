<template>
	<div class="interactive-hub">
		<div class="hub-content">
			<header class="hub-hero">
				<img
					class="hero-image"
					src="/interactive-scenes/lobby.webp"
					alt=""
					width="1440"
					height="810"
					fetchpriority="high"
				/>
				<div class="hero-copy">
					<p class="hero-brand">{{ t("interactive.hub.brand") }}</p>
					<h1>
						{{ t("interactive.hub.title") }}
						<span>{{ t("interactive.hub.title_accent") }}</span>
					</h1>
					<p class="hero-lead">{{ t("interactive.hub.lead") }}</p>
					<div class="hero-actions">
						<NuxtLink class="hero-primary" :to="localePath(accessPath)">
							{{ t("interactive.hub.primary_action") }}
						</NuxtLink>
						<a class="hero-secondary" href="#interactive-modules">{{ t("interactive.hub.browse_action") }}</a>
					</div>
				</div>
			</header>

			<section id="interactive-modules" aria-labelledby="interactive-modules-title">
				<h2 id="interactive-modules-title" class="gallery-title">{{ t("interactive.hub.modules_label") }}</h2>
				<ul class="module-grid" role="list">
					<li v-for="(mod, index) in interactiveModules" :key="mod.id">
						<NuxtLink :to="localePath(mod.path)" class="module-card">
							<div class="module-image">
								<img
									:src="`/interactive-scenes/${mod.id}.webp`"
									alt=""
									width="508"
									height="508"
									:loading="index < 3 ? 'eager' : 'lazy'"
									decoding="async"
								/>
							</div>
							<div class="module-copy">
								<h3>{{ t(mod.titleKey) }}</h3>
								<p>{{ t(mod.descKey) }}</p>
								<span class="module-action">{{ t(`interactive.modules.${mod.id}.action`) }}</span>
							</div>
						</NuxtLink>
					</li>
				</ul>
			</section>

			<p class="hub-note" role="note">{{ t("interactive.hub.notice") }}</p>
		</div>
	</div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { INTERACTIVE_HUB_PATH, interactiveModules } from "~/data/interactive/modules.js";

definePageMeta({ blendFooter: true });

const { t } = useI18n();
const localePath = useLocalePath();
const accessPath = `${INTERACTIVE_HUB_PATH}/access`;

usePageSeo({
	title: t("interactive.meta.hub_title"),
	description: t("interactive.meta.hub_description"),
	path: INTERACTIVE_HUB_PATH
});
</script>

<style scoped>
.interactive-hub {
	--hub-tint: #effaf5;
	--hub-border: #c8e0d9;
	--hub-text: #153831;
	--hub-muted: #38574f;
	--hub-accent: #076b50;
	--hub-accent-hover: #05563f;
	min-height: 100vh;
	background: linear-gradient(
		180deg,
		#f6fcfae6 0%,
		#edf9f5db 40%,
		#e9f7f3d6 calc(100% - 19rem),
		#e2f3ed82 calc(100% - 7rem),
		transparent 100%
	);
	color: var(--hub-text);
}

.hub-content {
	max-width: 88rem;
	margin-inline: auto;
	padding: clamp(1rem, 3vw, 2.75rem) clamp(1rem, 4vw, 4rem) clamp(3rem, 6vw, 5rem);
}

.hub-hero {
	position: relative;
	isolation: isolate;
	display: grid;
	align-items: center;
	min-height: clamp(23rem, 36vw, 28rem);
	overflow: hidden;
	border: 1px solid var(--hub-border);
	border-radius: 1.5rem;
	background: var(--hub-tint);
	box-shadow: 0 14px 36px #225a4915;
}

.hero-image {
	position: absolute;
	inset: 0 0 0 auto;
	z-index: -2;
	width: 54%;
	height: 100%;
	object-fit: cover;
	object-position: 80% 54%;
}

.hub-hero::after {
	position: absolute;
	inset: 0;
	z-index: -1;
	background: linear-gradient(90deg, var(--hub-tint) 47%, #effaf5e6 50%, #effaf500 64%);
	content: "";
}

.hero-copy {
	width: 52%;
	max-width: 42rem;
	padding: clamp(2rem, 3.5vw, 3.25rem) clamp(2rem, 5.5vw, 5rem);
}

.hero-brand {
	margin-bottom: 1.1rem;
	color: var(--hub-accent);
	font-size: 0.9rem;
	font-weight: 700;
	letter-spacing: 0.12em;
}

.hero-copy h1 {
	color: var(--hub-text);
	font-size: clamp(2.5rem, 4.5vw, 4.6rem);
	font-weight: 800;
	line-height: 1.08;
	letter-spacing: -0.035em;
}

.hero-copy h1 span {
	display: block;
	color: var(--hub-accent);
}

.hero-lead {
	max-width: 27rem;
	margin-top: 1.2rem;
	color: var(--hub-muted);
	font-size: clamp(1rem, 1.7vw, 1.25rem);
	line-height: 1.6;
}

.hero-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.7rem;
	margin-top: 1.75rem;
}

.hero-primary,
.hero-secondary {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-height: 3rem;
	padding: 0.65rem 1.1rem;
	border: 1px solid transparent;
	border-radius: 0.7rem;
	font-weight: 700;
	text-decoration: none;
	transition: background-color 180ms ease, border-color 180ms ease;
}

.hero-primary {
	background: var(--hub-accent);
	color: #fff;
}

.hero-primary:hover {
	background: var(--hub-accent-hover);
}

.hero-secondary {
	border-color: #a5c9bd;
	background: #fff;
	color: var(--hub-text);
}

.hero-secondary:hover {
	border-color: var(--hub-accent);
	background: #e2f5ec;
}

#interactive-modules {
	margin-top: clamp(2rem, 4vw, 2.75rem);
	scroll-margin-top: 1.25rem;
}

.gallery-title {
	margin-bottom: 1.1rem;
	color: var(--hub-text);
	font-size: clamp(1.45rem, 2.5vw, 1.85rem);
	font-weight: 750;
}

.module-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: clamp(0.85rem, 2vw, 1.5rem);
}

.module-card {
	display: flex;
	height: 100%;
	flex-direction: column;
	overflow: hidden;
	border: 1px solid var(--hub-border);
	border-radius: 1.12rem;
	background: #fff;
	color: var(--hub-text);
	box-shadow: 0 6px 22px #20554512;
	text-decoration: none;
	transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
}

.module-image {
	position: relative;
	height: clamp(8rem, 12vw, 10.25rem);
	overflow: hidden;
	background: #e2f2eb;
}

.module-image::after {
	position: absolute;
	inset: 0;
	background: linear-gradient(transparent 74%, #0b1c1e20);
	content: "";
}

.module-image img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	object-position: center 47%;
	transition: transform 280ms ease;
}

.module-copy {
	display: flex;
	flex: 1;
	flex-direction: column;
	align-items: flex-start;
	padding: clamp(1rem, 1.7vw, 1.4rem);
}

.module-copy h3 {
	color: var(--hub-text);
	font-size: clamp(1.1rem, 1.6vw, 1.35rem);
	font-weight: 750;
	line-height: 1.3;
}

.module-copy p {
	flex: 1;
	margin-block: 0.5rem 1rem;
	color: var(--hub-muted);
	font-size: 0.95rem;
	line-height: 1.55;
}

.module-action {
	display: inline-flex;
	align-items: center;
	padding: 0.4rem 0.75rem;
	border: 1px solid #b5dace;
	border-radius: 0.5rem;
	background: #eaf8f1;
	color: var(--hub-accent);
	font-size: 0.875rem;
	font-weight: 700;
	transition: background-color 180ms ease, color 180ms ease;
}

.module-card:hover,
.module-card:focus-visible {
	border-color: var(--hub-accent);
	box-shadow: 0 12px 28px #17554326;
	transform: translateY(-3px);
}

.module-card:hover img {
	transform: scale(1.055);
}

.module-card:hover .module-action,
.module-card:focus-visible .module-action {
	background: var(--hub-accent);
	color: #fff;
}

.hero-actions a:focus-visible,
.module-card:focus-visible {
	outline: 2px solid var(--hub-accent);
	outline-offset: 4px;
}

.hub-note {
	width: fit-content;
	margin-top: 1.6rem;
	padding: 0.6rem 0.85rem;
	border-radius: 0.5rem;
	background: #f9fffcf2;
	color: var(--hub-muted);
	font-size: 0.875rem;
}

@media (max-width: 64rem) {
	.module-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (max-width: 50rem) {
	.hub-hero {
		min-height: auto;
	}

	.hero-image {
		position: static;
		z-index: auto;
		width: 100%;
		height: clamp(10.5rem, 31vw, 15rem);
		object-position: 70% 64%;
	}

	.hub-hero::after {
		display: none;
	}

	.hero-copy {
		width: 100%;
		padding: 1.5rem;
	}

	.hero-lead {
		margin-top: 0.85rem;
	}

	.hero-actions {
		margin-top: 1.2rem;
	}
}

@media (max-width: 38rem) {
	.module-grid {
		grid-template-columns: minmax(0, 1fr);
	}

	.module-image {
		height: 9rem;
	}
}

@media (prefers-reduced-motion: reduce) {
	.hero-actions a,
	.module-card,
	.module-image img,
	.module-action {
		transition: none;
	}

	.module-card:hover,
	.module-card:focus-visible,
	.module-card:hover img {
		transform: none;
	}
}
</style>
