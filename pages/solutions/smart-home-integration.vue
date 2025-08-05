<template>
	<div v-if="solutionData">
		<SolutionHero
			:solution-data="solutionData"
			:features="featuresData"
			:prev-solution="prevSolution"
			:next-solution="nextSolution"
			:embed-url="embedUrl"
			:scroll-to-feature="scrollToFeature"
			:get-feature-tag-class="getFeatureTagClass"
		/>

		<main class="bg-white">
			<!-- Section 2: BA System Introduction -->
			<section id="ba-introduction" class="py-12 sm:py-24 feature-section">
				<div class="container mx-auto px-4">
					<div class="text-center mb-8 lg:mb-12">
						<h2 class="text-2xl lg:text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-sky-300 bg-clip-text">Yenshow BA 樓宇自動化系統</h2>
						<p class="mt-2 lg:mt-4 text-base lg:text-lg leading-8 text-gray-600">整合建築內機電設備，實現集中監控、高效管理與節能運營。</p>
					</div>
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<!-- BA System Image -->
						<div>
							<NuxtImg
								src="/solutions/BA.webp"
								alt="BA 系統架構圖"
								class="w-full h-auto rounded-lg shadow-lg cursor-pointer"
								@click="openImageModal('/solutions/BA.webp', $event.target)"
								tabindex="0"
								role="button"
								@keydown.enter="openImageModal('/solutions/BA.webp', $event.target)"
								@keydown.space.prevent="openImageModal('/solutions/BA.webp', $event.target)"
							/>
						</div>
						<!-- Feature Navigation -->
						<div class="grid grid-cols-2 gap-4">
							<a
								v-for="feature in featuresData"
								:key="feature.id"
								:href="`#${feature.id}`"
								class="flex flex-col items-center justify-center p-4 rounded-lg text-center transition-all duration-300 border border-gray-400 border-l-4 border-l-teal-600 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 text-gray-700"
								@click.prevent="scrollToFeature(feature.id)"
							>
								<span class="text-lg font-bold">{{ feature.title }}</span>
							</a>
						</div>
					</div>
				</div>
			</section>

			<!-- Section 3: Sub-systems -->
			<section class="bg-gray-50 py-12 sm:py-24">
				<div class="container mx-auto px-4 space-y-24">
					<div
						v-for="(feature, index) in featuresData"
						:key="feature.id"
						:id="feature.id"
						class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center feature-section"
					>
						<div :class="{ 'lg:order-last': index % 2 !== 1 }" class="lg:col-span-7">
							<NuxtImg
								:src="feature.image"
								:alt="feature.title"
								class="w-full h-auto rounded-xl shadow-2xl cursor-pointer"
								loading="lazy"
								@click="openImageModal(feature.image, $event.target)"
								tabindex="0"
								role="button"
								@keydown.enter="openImageModal(feature.image, $event.target)"
								@keydown.space.prevent="openImageModal(feature.image, $event.target)"
							/>
						</div>
						<div class="space-y-4 lg:col-span-5">
							<h3 class="text-xl lg:text-2xl font-bold text-gray-800">{{ feature.title }}</h3>
							<p class="text-base lg:text-lg text-gray-600">{{ feature.description }}</p>
							<ul v-if="feature.points" class="space-y-2">
								<li v-for="point in feature.points" :key="point" class="flex">
									<svg
										class="flex-shrink-0 w-6 lg:w-8 aspect-square text-teal-500 mr-3"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										/>
									</svg>
									<span class="text-base lg:text-lg">{{ point }}</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</section>
		</main>
		<!-- Image Lightbox Modal -->
		<ClientOnly>
			<div
				v-if="isImageModalOpen"
				class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
				role="dialog"
				aria-modal="true"
				@click.self="closeImageModal"
				@keydown.esc="closeImageModal"
			>
				<button
					ref="closeModalButtonRef"
					@click="closeImageModal"
					class="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white rounded-full p-1"
					aria-label="關閉圖片預覽"
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
					</svg>
				</button>
				<NuxtImg :src="modalImage" alt="Image preview" class="max-w-full max-h-[90vh] object-contain" loading="lazy" />
			</div>
		</ClientOnly>
	</div>
</template>

<script setup>
import { useSolutionPage } from "~/composables/useSolutionPage";
import SolutionHero from "~/components/solutions/SolutionHero.vue";
import { ref, nextTick, onBeforeUnmount } from "vue";

const slug = "smart-home-integration";

// Use the new composable for shared page logic
const { solutionData, featuresData, embedUrl, prevSolution, nextSolution, scrollToFeature, getFeatureTagClass } = useSolutionPage(slug);

// Lightbox state & helpers
const isImageModalOpen = ref(false);
const modalImage = ref(null);
const closeModalButtonRef = ref(null);
let triggerElement = null;

function openImageModal(image, eventTarget) {
	modalImage.value = image;
	isImageModalOpen.value = true;
	document.body.style.overflow = "hidden";
	triggerElement = eventTarget || document.activeElement;
	nextTick(() => {
		if (closeModalButtonRef.value) {
			closeModalButtonRef.value.focus();
		}
	});
}

function closeImageModal() {
	isImageModalOpen.value = false;
	document.body.style.overflow = "";
	if (triggerElement && typeof triggerElement.focus === "function") {
		triggerElement.focus();
	}
	triggerElement = null;
}

onBeforeUnmount(() => {
	if (isImageModalOpen.value) {
		document.body.style.overflow = "";
	}
});
</script>
