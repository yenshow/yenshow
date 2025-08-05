<template>
	<div>
		<!-- Section 1: Hero - Title, Intro, Logo Wall -->
		<section ref="heroSectionRef" class="relative text-white overflow-hidden min-h-screen flex flex-col justify-center items-center">
			<div class="container mx-auto relative space-y-[24px] md:space-y-[48px] px-8 z-10 py-[48px]">
				<!-- Page Title -->
				<div class="text-center space-y-[24px]">
					<h1 ref="pageTitleRef" class="text-[28px] sm:text-[36px] md:text-[48px] lg:text-[60px] xl:text-[72px] font-bold opacity-0">攜手共進，成就卓越</h1>
					<p
						ref="pageSubtitleRef"
						class="max-w-5xl text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px] text-sky-200 mx-auto opacity-0"
						style="text-shadow: 0 0 10px rgba(0, 0, 0, 0.5)"
					>
						探索我們與各行各業夥伴的合作故事<br />
						透過創新技術與專業服務 創造非凡價值
					</p>
				</div>

				<!-- Cooperation Philosophy (Intro Text) -->
				<div ref="philosophyRef" class="max-w-5xl mx-auto opacity-0">
					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
						<div
							v-for="(item, index) in philosophyItems"
							:key="index"
							class="philosophy-item flex flex-col items-center text-center p-4 bg-sky-700/40 rounded-lg shadow-lg"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="aspect-square w-10 md:w-12 lg:w-16 xl:w-20 mb-3 text-sky-300"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
							</svg>
							<h3 class="text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] font-semibold text-secondary mb-1.5">{{ item.title }}</h3>
							<p class="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] text-secondary leading-relaxed">{{ item.description }}</p>
						</div>
					</div>
				</div>

				<!-- Logo Wall -->
				<div ref="logoWallRef" class="opacity-0">
					<div class="relative w-full h-16 lg:h-24 mx-auto overflow-hidden">
						<div ref="logoTrackRef" class="logo-track absolute top-0 left-0 flex items-center whitespace-nowrap">
							<NuxtImg
								v-for="(logo, index) in partnerLogos"
								:key="'logo-initial-' + index"
								:src="logo.src"
								:alt="logo.alt"
								class="partner-logo h-16 lg:h-24 object-contain mx-4 md:mx-6 transition-transform duration-300 ease-in-out hover:scale-110 hover:brightness-125"
								loading="lazy"
								height="100"
							/>
							<!-- Duplicates for seamless scroll -->
							<NuxtImg
								v-for="(logo, index) in partnerLogos"
								:key="'logo-duplicate-' + index"
								:src="logo.src"
								:alt="logo.alt"
								class="partner-logo h-16 lg:h-24 object-contain mx-4 md:mx-6 transition-transform duration-300 ease-in-out hover:scale-110 hover:brightness-125"
								loading="lazy"
								height="100"
							/>
						</div>
					</div>
				</div>
				<!-- Second Logo Wall (Right Scroll) -->
				<div ref="logoWallSecondRef" class="opacity-0">
					<div class="relative w-full h-16 lg:h-24 mx-auto overflow-hidden">
						<div ref="logoTrackSecondRef" class="logo-track-reverse absolute top-0 left-0 flex items-center whitespace-nowrap">
							<NuxtImg
								v-for="(logo, index) in partnerLogosSecond"
								:key="'logo-second-initial-' + index"
								:src="logo.src"
								:alt="logo.alt"
								class="partner-logo h-16 lg:h-24 max-w-40 object-contain mx-4 md:mx-6 transition-transform duration-300 ease-in-out hover:scale-110 hover:brightness-125"
								loading="lazy"
								height="100"
							/>
							<!-- Duplicates for seamless scroll -->
							<NuxtImg
								v-for="(logo, index) in partnerLogosSecond"
								:key="'logo-second-duplicate-' + index"
								:src="logo.src"
								:alt="logo.alt"
								class="partner-logo h-16 lg:h-24 max-w-40 object-contain mx-4 md:mx-6 transition-transform duration-300 ease-in-out hover:scale-110 hover:brightness-125"
								loading="lazy"
								height="100"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Section 2: Clarifying Needs / Common Challenges -->
		<section ref="clarifyingNeedsSectionRef" class="clarifying-needs-section py-16 md:py-24 bg-gray-100">
			<div class="container mx-auto px-8 space-y-4 md:space-y-8">
				<div class="text-center space-y-[24px]">
					<h2
						ref="clarifyingNeedsTitleRef"
						class="text-[21px] sm:text-[24px] md:text-[28px] lg:text-[36px] xl:text-[48px] 2xl:text-[60px] font-bold text-transparent bg-gradient-to-r from-[#dd1c1c] to-[#212a37] bg-clip-text opacity-0"
					>
						您是否正為以下問題煩惱？
					</h2>
				</div>

				<!-- Business Challenges Section -->
				<div>
					<h3
						ref="businessChallengesTitleRef"
						class="text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] xl:text-[28px] font-bold text-primary/80 mb-4 md:mb-6 text-center opacity-0 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-1/2 after:transform after:-translate-x-1/2 after:w-24 after:h-1 after:bg-sky-500/30 after:rounded-full"
					>
						企業夥伴常見挑戰
					</h3>
					<div class="overflow-x-auto pb-4 md:overflow-visible">
						<div ref="businessChallengesListRef" class="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
							<div
								v-for="(item, index) in business_feature"
								:key="'business-' + index"
								class="flip-card-container challenge-card opacity-0 h-[360px] sm:h-[380px] md:h-[420px] w-[280px] sm:w-[300px] md:w-auto flex-shrink-0"
								style="perspective: 1000px"
								@mouseenter="!isMobileView && toggleFlip('business', index)"
								@mouseleave="!isMobileView && toggleFlip('business', index)"
								@pointerdown="isMobileView && handlePointerDown($event)"
								@click="isMobileView && handleCardClick('business', index, $event)"
							>
								<div
									class="flip-card-inner relative w-full h-full text-center"
									:class="{ 'is-flipped': flippedCards['business-' + index] }"
									style="transform-style: preserve-3d"
								>
									<!-- Front Face -->
									<div
										class="card-face absolute w-full h-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow duration-300 p-6 text-center flex flex-col items-center justify-center border border-gray-100"
									>
										<h4
											class="text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px] font-semibold text-gray-800 mb-4 tracking-tight"
										>
											{{ item.title }}
										</h4>
										<p class="text-gray-600 text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[21px] leading-relaxed">
											{{ item.pain_point }}
										</p>
										<span class="absolute bottom-4 text-sm text-sky-600 group-hover:text-sky-700 flex items-center gap-1 transition-colors duration-200">
											查看解決方案
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-4 w-4 inline-block transition-transform duration-200 group-hover:translate-x-1"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												stroke-width="2"
											>
												<path stroke-linecap="round" stroke-linejoin="round" d="M13 5l7 7-7 7" />
											</svg>
										</span>
									</div>
									<!-- Back Face -->
									<div
										class="flip-card-back card-face absolute w-full h-full bg-gradient-to-br from-sky-600 to-sky-700 text-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 flex flex-col items-center justify-center text-center border border-sky-500/20"
										style="transform: rotateY(180deg)"
									>
										<h4 class="text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px] mb-4 tracking-tight">
											{{ item.title }}
										</h4>
										<p class="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[21px] opacity-90 leading-relaxed">{{ item.description }}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Public Sector Challenges Section -->
				<div>
					<h3
						ref="publicChallengesTitleRef"
						class="text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] xl:text-[28px] font-bold text-primary/80 mb-4 md:mb-6 text-center opacity-0 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-1/2 after:transform after:-translate-x-1/2 after:w-24 after:h-1 after:bg-sky-500/30 after:rounded-full"
					>
						公共領域常見挑戰
					</h3>
					<div class="overflow-x-auto pb-4 md:overflow-visible">
						<div ref="publicChallengesListRef" class="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
							<div
								v-for="(item, index) in public_feature_filtered"
								:key="'public-' + index"
								class="flip-card-container challenge-card opacity-0 h-[360px] sm:h-[380px] md:h-[420px] w-[280px] sm:w-[300px] md:w-auto flex-shrink-0"
								style="perspective: 1000px"
								@mouseenter="!isMobileView && toggleFlip('public', index)"
								@mouseleave="!isMobileView && toggleFlip('public', index)"
								@pointerdown="isMobileView && handlePointerDown($event)"
								@click="isMobileView && handleCardClick('public', index, $event)"
							>
								<div
									class="flip-card-inner relative w-full h-full text-center"
									:class="{ 'is-flipped': flippedCards['public-' + index] }"
									style="transform-style: preserve-3d"
								>
									<!-- Front Face -->
									<div
										class="card-face absolute w-full h-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow duration-300 p-6 text-center flex flex-col items-center justify-center border border-gray-100"
									>
										<h4
											class="text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px] font-semibold text-gray-800 mb-4 tracking-tight"
										>
											{{ item.title }}
										</h4>
										<p class="text-gray-600 text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[21px] leading-relaxed">
											{{ item.pain_point }}
										</p>
										<span class="absolute bottom-4 text-sm text-sky-600 group-hover:text-sky-700 flex items-center gap-1 transition-colors duration-200">
											查看解決方案
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-4 w-4 inline-block transition-transform duration-200 group-hover:translate-x-1"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												stroke-width="2"
											>
												<path stroke-linecap="round" stroke-linejoin="round" d="M13 5l7 7-7 7" />
											</svg>
										</span>
									</div>
									<!-- Back Face -->
									<div
										class="flip-card-back card-face absolute w-full h-full bg-gradient-to-br from-sky-600 to-sky-700 text-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 flex flex-col items-center justify-center text-center border border-sky-500/20"
										style="transform: rotateY(180deg)"
									>
										<h4 class="text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px] mb-4 tracking-tight">
											{{ item.title }}
										</h4>
										<p class="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[21px] opacity-90 leading-relaxed">{{ item.description }}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Section 3: Case Studies (Builders with Taiwan Map) -->
		<section ref="buildersCaseStudiesSectionRef" class="py-16 md:py-24 bg-white">
			<div class="container mx-auto">
				<!-- Section Title -->
				<div class="text-center mb-8 md:mb-16 space-y-[24px]">
					<h2
						ref="buildersCaseStudiesTitleRef"
						class="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-gradient-to-r from-green-600 to-green-300 bg-clip-text mb-4 opacity-0"
					>
						深耕台灣 共築理想家園
					</h2>
					<p
						ref="buildersCaseStudiesSubtitleRef"
						class="text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px] text-gray-600 max-w-3xl mx-auto opacity-0"
					>
						我們與全台各地的建商緊密合作，從智慧住宅到大型社區，提供全面的弱電整合與智能建築解決方案。
					</p>
				</div>

				<!-- Main Content: Map and Case Details -->
				<div class="flex flex-col lg:flex-row gap-8 md:gap-12 relative overflow-hidden p-4">
					<!-- Left Column for Intro Card -->
					<div
						ref="caseDetailsContainerRef"
						class="w-full lg:w-1/2 opacity-0 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] flex relative z-10 transition-opacity duration-500 ease-in-out"
					>
						<!-- Intro Card with Case Transition Animation -->
						<transition name="case-fade" mode="out-in">
							<div v-if="selectedBuilderCase" :key="'intro-' + selectedBuilderCase.id" class="w-full h-full bg-sky-50 rounded-lg shadow-xl flex flex-col">
								<div class="flex justify-between items-center p-4">
									<div class="flex flex-col">
										<h4 class="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-sky-700 mb-0.5">
											{{ selectedBuilderCase.location }}
										</h4>
										<p class="text-xs sm:text-sm md:text-base text-gray-600">建案規劃：{{ selectedBuilderCase.households }}</p>
									</div>
									<p class="text-sm sm:text-base md:text-lg lg:text-xl text-gray-800 font-semibold">
										{{ selectedBuilderCase.projectType }}
									</p>
								</div>

								<div class="relative min-h-[160px] sm:min-h-[180px] md:min-h-[200px] lg:min-h-[250px]">
									<NuxtImg
										:src="selectedBuilderCase.image"
										:alt="selectedBuilderCase.image_alt || '案例圖片'"
										class="w-full h-full object-cover cursor-pointer rounded-lg transition-all duration-300"
										loading="lazy"
										tabindex="0"
										width="480"
										height="480"
										role="button"
										@click="openLightbox(selectedBuilderCase.image, $event.target)"
										@keydown.enter="openLightbox(selectedBuilderCase.image, $event.target)"
										@keydown.space.prevent="openLightbox(selectedBuilderCase.image, $event.target)"
									/>
									<button
										@click="toggleExpandedDetails"
										class="absolute bottom-2 right-2 bg-primary/90 text-white px-2.5 py-1.5 rounded-md text-xs sm:text-sm md:text-base hover:bg-sky-600 hover:scale-105 backdrop-blur-sm transition-all duration-300 flex items-center shadow-md hover:shadow-lg z-50 active:scale-95"
										:aria-label="isDetailedViewExpanded ? '收合詳情' : '了解更多'"
									>
										{{ isDetailedViewExpanded ? "收合內容" : "了解更多" }}
										<svg
											v-if="!isDetailedViewExpanded"
											xmlns="http://www.w3.org/2000/svg"
											class="h-3.5 w-3.5 ml-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											stroke-width="2.5"
										>
											<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
										</svg>
										<svg
											v-else
											xmlns="http://www.w3.org/2000/svg"
											class="h-3.5 w-3.5 ml-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											stroke-width="2.5"
										>
											<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
										</svg>
									</button>
								</div>
							</div>
						</transition>
					</div>

					<!-- Right Column Wrapper -->
					<div ref="rightColumnWrapperRef" class="w-full lg:w-1/2 relative opacity-0 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
						<!-- Map Container (now inside rightColumnWrapperRef) -->
						<div ref="taiwanMapContainerRef" class="w-full h-full p-4 bg-sky-50 rounded-lg shadow-md flex items-center justify-center relative z-0">
							<img src="/case/Taiwan.svg" alt="台灣地圖" class="w-full h-full object-contain" />

							<!-- Case Markers -->
							<button
								v-for="caseItem in builderCaseStudies"
								:key="caseItem.id"
								@click="handleSelectBuilderCase(caseItem)"
								class="absolute w-2.5 h-2.5 md:w-4 md:h-4 bg-sky-600 rounded-full shadow-md transform -translate-x-1/2 -translate-y-1/2 hover:bg-sky-400 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition-all duration-200 ease-in-out cursor-pointer active:scale-95"
								:style="{
									left: caseItem.mapPosition.x,
									top: caseItem.mapPosition.y,
									zIndex: selectedBuilderCase && selectedBuilderCase.id === caseItem.id ? 10 : 1
								}"
								:class="{
									'bg-red-600 scale-150 ring-2 ring-red-400 ring-offset-2 ring-offset-gray-200': selectedBuilderCase && selectedBuilderCase.id === caseItem.id
								}"
								:aria-label="`查看 ${caseItem.name} 案例`"
							>
								<span class="sr-only">{{ caseItem.name }}</span>
								<!-- Pulsing animation for selected marker -->
								<span
									v-if="selectedBuilderCase && selectedBuilderCase.id === caseItem.id"
									class="absolute inset-[-2px] rounded-full bg-red-500 animate-ping-slow opacity-75"
								></span>
							</button>
							<p v-if="!builderCaseStudies || builderCaseStudies.length === 0" class="text-center z-0">暫無建商案例標記</p>
						</div>

						<!-- Case Navigation Buttons (Moved to map top-right) -->
						<div v-if="builderCaseStudies && builderCaseStudies.length > 1 && selectedBuilderCase" class="absolute top-4 right-4 z-30 flex space-x-2">
							<button
								@click="selectPreviousCase"
								aria-label="上一個案例"
								class="p-2 bg-white/70 hover:bg-white/90 hover:scale-110 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200 active:scale-95"
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
									<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
								</svg>
							</button>
							<button
								@click="selectNextCase"
								aria-label="下一個案例"
								class="p-2 bg-white/70 hover:bg-white/90 hover:scale-110 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200 active:scale-95"
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
									<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
								</svg>
							</button>
						</div>

						<!-- Detailed Info Panel (now inside rightColumnWrapperRef, lg:w-1/2 removed from its classes) -->
						<transition
							enter-active-class="transition-all duration-500 ease-in-out"
							enter-from-class="translate-x-full opacity-0"
							enter-to-class="translate-x-0 opacity-100"
							leave-active-class="transition-all duration-500 ease-in-out"
							leave-from-class="translate-x-0 opacity-100"
							leave-to-class="translate-x-full opacity-0"
						>
							<div
								v-if="selectedBuilderCase && isDetailedViewExpanded"
								class="detailed-info-panel absolute top-0 right-0 h-full w-full bg-sky-700 text-white p-4 md:p-6 shadow-2xl overflow-y-auto z-20 rounded-l-lg lg:rounded-l-xl"
							>
								<div class="min-w-[200px] md:min-w-[250px]">
									<p class="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-4 border-b border-sky-600 pb-3">專案詳細資訊</p>

									<div
										v-if="
											selectedBuilderCase.projectNeeds ||
											selectedBuilderCase.solutionOverview ||
											(selectedBuilderCase.productsUsed && selectedBuilderCase.productsUsed.length)
										"
									>
										<div>
											<h6 class="font-semibold text-sky-100 mb-1.5 text-sm sm:text-base md:text-lg">專案需求</h6>
											<p class="leading-relaxed text-white">{{ selectedBuilderCase.projectNeeds }}</p>
										</div>
										<div class="border-t border-sky-600 my-3"></div>
										<div>
											<h6 class="font-semibold text-sky-100 mb-1.5 text-sm sm:text-base md:text-lg">解決方案概覽</h6>
											<p class="leading-relaxed text-white">{{ selectedBuilderCase.solutionOverview }}</p>
										</div>
										<div v-if="selectedBuilderCase.productsUsed && selectedBuilderCase.productsUsed.length > 0">
											<div class="border-t border-sky-600 my-3"></div>
											<h6 class="font-semibold text-sky-100 mb-2.5 text-sm sm:text-base md:text-lg">採用產品／服務</h6>
											<div class="space-y-3">
												<div
													v-for="(product, pIndex) in selectedBuilderCase.productsUsed"
													:key="pIndex"
													class="bg-sky-600/60 hover:bg-sky-600/90 p-3 rounded-md shadow-sm transition-colors duration-200 border border-sky-500/50"
												>
													<p class="text-xs sm:text-sm md:text-base font-semibold text-white mb-0.5">
														{{ product.series }}
													</p>
													<p class="text-xs sm:text-sm md:text-base text-sky-100 mb-1.5 leading-snug">
														{{ product.description }}
													</p>
													<NuxtLink
														:to="product.link"
														class="text-xs sm:text-sm md:text-base text-sky-100 hover:text-white hover:underline focus:outline-none focus:ring-1 focus:ring-sky-300 rounded-sm inline-flex items-center"
													>
														查看系列產品
														<svg
															xmlns="http://www.w3.org/2000/svg"
															class="h-3 w-3 ml-1"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
															stroke-width="2.5"
														>
															<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
														</svg>
													</NuxtLink>
												</div>
											</div>
										</div>
									</div>
									<div v-else>
										<div class="flex flex-col items-center justify-center h-full py-20">
											<svg class="w-20 h-20 text-sky-200 mb-4" fill="none" viewBox="0 0 30 30" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
											<p class="text-lg text-sky-100 mb-2">此案例詳細資料尚待補充</p>
											<p class="text-md text-sky-200">聯絡我們了解更多資訊！</p>
										</div>
									</div>
								</div>
							</div>
						</transition>
					</div>
				</div>
			</div>
		</section>

		<!-- Lightbox Modal for Builder Case Images -->
		<div
			v-if="isLightboxOpen"
			class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
			role="dialog"
			aria-modal="true"
			:aria-labelledby="selectedBuilderCase ? 'builder-case-modal-title-' + selectedBuilderCase.id : 'lightbox-title'"
			@click.self="closeLightbox"
			@keydown.esc="closeLightbox"
		>
			<h2 v-if="selectedBuilderCase" :id="'builder-case-modal-title-' + selectedBuilderCase.id" class="sr-only">{{ selectedBuilderCase.name }} 案例圖片預覽</h2>
			<h2 v-else id="lightbox-title" class="sr-only">圖片預覽</h2>
			<button ref="closeModalButtonRef" @click="closeLightbox" class="absolute top-4 right-4 text-white rounded-full p-1" aria-label="關閉圖片預覽">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
					aria-hidden="true"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
			<div class="max-w-5xl max-h-[90vh]">
				<NuxtImg
					:src="lightboxImageSrc"
					:alt="selectedBuilderCase ? selectedBuilderCase.image_alt || selectedBuilderCase.name : '放大圖片'"
					class="max-w-full max-h-[90vh] object-contain"
					loading="lazy"
					width="640"
					height="640"
					sizes="sm:320px md:384px lg:480px xl:640px"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, onUnmounted } from "vue";
import gsap from "gsap";
import { useScrollAnimation } from "@/composables/useScrollAnimation"; // 引入 useScrollAnimation
import { useHead } from "#app";

useHead({
	title: "- 合作案例",
	meta: [{ name: "description", content: "深入探索遠岫科技與各行業夥伴的成功合作案例，了解我們如何以創新技術與專業服務，應對挑戰，共創價值。" }]
});

const scrollAnimation = useScrollAnimation();

// Refs for section 1 elements
const heroSectionRef = ref(null);
const pageTitleRef = ref(null);
const pageSubtitleRef = ref(null);
const philosophyRef = ref(null);
const logoWallRef = ref(null);

const philosophyItems = ref([
	{
		icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", // Light Bulb icon for Deep Understanding
		title: "深入理解",
		description: "致力於深入洞察您的業務需求與潛在挑戰，從根本尋求最佳解決方案。"
	},
	{
		icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z", // Cog icon for Tailor-made Solutions
		title: "量身打造",
		description: "提供最合適的客製化解決方案，以精準的技術滿足您的獨特商業目標。"
	},
	{
		icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", // Shield Check icon for Professional Execution
		title: "專業執行",
		description: "以嚴謹的專案管理與專業的技術實力，確保每個合作高效執行與卓越交付。"
	}
]);

const logoTrackRef = ref(null);
const logoTrackSecondRef = ref(null); // 第二排 logo track
const logoWallSecondRef = ref(null); // 第二排 logo wall 容器

const partnerLogos = ref([
	{ src: "/logo/aurora.webp", alt: "Aurora" },
	{ src: "/logo/BES.webp", alt: "BES" },
	{ src: "/logo/E-united.webp", alt: "E-united" },
	{ src: "/logo/jci.webp", alt: "jci" },
	{ src: "/logo/ALP.webp", alt: "ALP" },
	{ src: "/logo/brother.webp", alt: "brother at your side" },
	{ src: "/logo/Chung_king.webp", alt: "Chung King" },
	{ src: "/logo/dolphin.webp", alt: "dolphin" },
	{ src: "/logo/greatg.webp", alt: "greatg" },
	{ src: "/logo/he-tzung.webp", alt: "he-tzung" },
	{ src: "/logo/jdprinting.webp", alt: "jdprinting" },
	{ src: "/logo/jianyang.webp", alt: "jianyang" },
	{ src: "/logo/turtle_Beach.webp", alt: "turtle_Beach" },
	{ src: "/logo/wangbang.webp", alt: "wangbang" },
	{ src: "/logo/zongtai.webp", alt: "zongtai" }
]);

// 第二排 logo（第一排的反向順序）
const partnerLogosSecond = computed(() => [...partnerLogos.value].reverse());

// Refs for Section 2: Clarifying Needs
const clarifyingNeedsSectionRef = ref(null);
const clarifyingNeedsTitleRef = ref(null);
const publicChallengesListRef = ref(null);
const businessChallengesTitleRef = ref(null);
const publicChallengesTitleRef = ref(null);

// --- Mobile View Detection ---
const isMobileView = ref(false);
const checkMobileView = () => {
	isMobileView.value = window.innerWidth < 768; // Tailwind's md breakpoint
};

// --- Tap vs. Scroll Detection for Mobile Card Click ---
const touchStart = ref({ x: 0, y: 0, time: 0 });
const MAX_DRAG_DISTANCE = 10; // pixels
const MAX_TAP_DURATION = 300; // ms // Increased slightly for better tap experience

function handlePointerDown(event) {
	if (event.pointerType === "touch" || event.button === 0) {
		touchStart.value.x = event.clientX;
		touchStart.value.y = event.clientY;
		touchStart.value.time = Date.now();
	}
}

function handleCardClick(type, index, event) {
	// This function is only called if isMobileView is true due to v-on binding
	const dx = Math.abs(event.clientX - touchStart.value.x);
	const dy = Math.abs(event.clientY - touchStart.value.y);
	const dt = Date.now() - touchStart.value.time;

	if (dx < MAX_DRAG_DISTANCE && dy < MAX_DRAG_DISTANCE && dt < MAX_TAP_DURATION) {
		toggleFlip(type, index);
	}
	// If it's a drag/swipe, do nothing, the browser handles scrolling.
}

// Data for Section 2 Challenges
const business_feature = ref([
	{
		pain_point: "整合弱電與 IoT 系統時，工程協調及維運是否屢屢卡關？",
		title: "系統整合商",
		description: "模組化 API ＋開放協定，降低整合成本 40 %，單一後台集中維運。"
	},
	{
		pain_point: "想提升門市體驗，又需要精準蒐集顧客數據，該怎麼做？",
		title: "品牌客戶",
		description: "AIoT 感測即時回傳客流熱區，資料直串 CRM，打造差異化體驗。"
	},
	{
		pain_point: "傳統門禁考勤是否已無法滿足現代企業的高效管理？",
		title: "公司行號",
		description: "為各類型企業導入智慧化門禁考勤系統，提升管理效率，保障辦公環境安全，優化員工體驗。"
	}
]);

const public_feature = ref([
	{
		pain_point: "想讓建案在競爭激烈市場中脫穎而出，還能提高銷售吸引力？",
		title: "建設公司",
		description: "提供完整的社區弱電系統規劃與新穎的智慧家庭設備，提高建案附加價值與市場競爭力，加速銷售。"
	},
	{
		pain_point: "醫院安全與動線管理標準嚴格，人員負擔依舊沉重？",
		title: "醫療院所",
		description: "號誌化感測＋雲端派工，患者動線即時導引，人力需求減少 30 %。"
	},
	{
		pain_point: "校園安全事件頻傳，如何打造更安全的學習環境？",
		title: "學校",
		description: "針對各級學校、幼兒園等教育場所，提供全方位的校園安全解決方案，建構安心的學習成長環境。"
	}
]);

const public_feature_filtered = computed(() => {
	return public_feature.value.filter((item) => item.title !== "公家機關");
});

const flippedCards = ref({});

function toggleFlip(type, index) {
	const key = `${type}-${index}`;
	flippedCards.value[key] = !flippedCards.value[key];
}

// --- Refs for Section 3: Builder Case Studies ---
const buildersCaseStudiesSectionRef = ref(null);
const buildersCaseStudiesTitleRef = ref(null);
const buildersCaseStudiesSubtitleRef = ref(null);
const taiwanMapContainerRef = ref(null);
const caseDetailsContainerRef = ref(null);
const rightColumnWrapperRef = ref(null); // New ref for the right column wrapper

const builderCaseStudies = ref([
	{
		id: 1,
		location: "雲林縣斗南鎮",
		projectType: "集合式住宅建案",
		households: "91 戶住家、2 戶店鋪",
		projectNeeds: "提升社區門禁系統的安全性、便利性與科技感，吸引潛在住戶，提升建案價值。",
		solutionOverview: "導入整合人臉辨識的智慧可視對講系統與門禁控制，並搭配集中管理平台，實現全社區及各戶的無卡化人臉辨識通行。",
		productsUsed: [
			{ series: "可視對講系統", description: "全戶型智慧可視對講 (10吋室內機 YS-9510, 4.3吋人臉辨識住戶門口機)", link: "/products/video-intercom" },
			{ series: "門禁管理", description: "人臉辨識門禁整合方案", link: "/products/access-control" },
			{ series: "影像監控", description: "社區安全監控系統整合", link: "/products/surveillance-monitoring" },
			{ series: "周邊設備與軟體", description: "系統傳輸設備、集中管理平台", link: "/products/devices-accessories" }
		],
		image: "/case/huzong.webp",
		image_alt: "合總君悅建案外觀",
		mapPosition: { x: "35%", y: "47%" }
	},
	{
		id: 2,
		location: "台中市沙鹿區",
		projectType: "集合式住宅建案",
		households: "129 戶住家",
		projectNeeds: "為大型社區（129戶）提供高效的門禁管理與便捷的住戶通行體驗，以現代化方案取代傳統磁卡。",
		solutionOverview: "採用全社區可視對講系統，配置10吋室內機及人臉辨識門口機，整合視頻監控與門禁系統，實現無磁卡人臉辨識通行。",
		productsUsed: [
			{ series: "可視對講系統", description: "全社區型可視對講 (10吋室內機 YS-8520, 人臉辨識門口機)", link: "/products/video-intercom" },
			{ series: "門禁管理", description: "社區人臉辨識門禁系統", link: "/products/access-control" },
			{ series: "影像監控", description: "整合型視頻監控方案", link: "/products/surveillance-monitoring" }
		],
		image: "/case/little-3.webp",
		image_alt: "小時代 III 建案",
		mapPosition: { x: "43%", y: "33%" }
	},
	{
		id: 3,
		location: "新竹市東區",
		projectType: "集合式住宅建案",
		households: "39 戶住家",
		projectNeeds: "",
		solutionOverview: "",
		productsUsed: [],
		image: "/case/BaoSouthDoor.webp",
		image_alt: "豹南門建案",
		mapPosition: { x: "49%", y: "17%" }
	},
	{
		id: 4,
		location: "桃園市觀音區",
		projectType: "集合式住宅建案",
		households: "136 戶住家",
		projectNeeds: "",
		solutionOverview: "",
		productsUsed: [],
		image: "/case/ZhuYun.webp",
		image_alt: "和境寓見",
		mapPosition: { x: "52%", y: "11%" }
	},
	{
		id: 5,
		location: "南投縣竹山鎮",
		projectType: "集合式住宅建案",
		households: "42 戶住家",
		projectNeeds: "",
		solutionOverview: "",
		productsUsed: [],
		image: "/case/ChunFengZhuShan.webp",
		image_alt: "聖德淳風竹山一期",
		mapPosition: { x: "44%", y: "46%" }
	},
	{
		id: 6,
		location: "雲林縣斗南鎮",
		projectType: "集合式住宅建案",
		households: "58 戶住家",
		projectNeeds: "",
		solutionOverview: "",
		productsUsed: [],
		image: "/case/WeiFengCity.webp",
		image_alt: "微風city",
		mapPosition: { x: "35%", y: "47%" }
	},
	{
		id: 7,
		location: "新竹縣芎林鄉",
		projectType: "集合式住宅建案",
		households: "36 戶住家 1 戶店面",
		projectNeeds: "",
		solutionOverview: "",
		productsUsed: [],
		image: "/case/FuyuWenChang.webp",
		image_alt: "馥郁文昌建案",
		mapPosition: { x: "51%", y: "17%" }
	},
	{
		id: 8,
		location: "新竹縣竹東鎮",
		projectType: "集合式住宅建案",
		households: "96 戶住家 3 戶店面",
		projectNeeds: "",
		solutionOverview: "",
		productsUsed: [],
		image: "/case/NineNine.webp",
		image_alt: "九九建案",
		mapPosition: { x: "51%", y: "17%" }
	}
]);

const selectedBuilderCase = ref(null);
const isDetailedViewExpanded = ref(false); // New state for expanded details

// Computed property to get the index of the current selected case
const currentCaseIndex = computed(() => {
	if (!selectedBuilderCase.value || !builderCaseStudies.value || builderCaseStudies.value.length === 0) return -1;
	return builderCaseStudies.value.findIndex((c) => c.id === selectedBuilderCase.value.id);
});

// Lightbox state and functions
const isLightboxOpen = ref(false);
const lightboxImageSrc = ref("");
const closeModalButtonRef = ref(null);
let triggerElement = null;

const openLightbox = (imageSrc, eventTarget) => {
	lightboxImageSrc.value = imageSrc;
	isLightboxOpen.value = true;
	document.body.style.overflow = "hidden";
	triggerElement = eventTarget || document.activeElement; // Store the element that triggered the modal
	nextTick(() => {
		if (closeModalButtonRef.value) {
			closeModalButtonRef.value.focus();
		}
	});
};

const closeLightbox = () => {
	isLightboxOpen.value = false;
	document.body.style.overflow = "";
	if (triggerElement && typeof triggerElement.focus === "function") {
		triggerElement.focus(); // Return focus to the triggering element
	}
	triggerElement = null;
};

const handleSelectBuilderCase = (caseItem) => {
	selectedBuilderCase.value = caseItem;
	isDetailedViewExpanded.value = false; // Reset expanded state when new case is selected
};

const toggleExpandedDetails = () => {
	isDetailedViewExpanded.value = !isDetailedViewExpanded.value;
};

// Functions to navigate to next/previous case
function selectNextCase() {
	if (!builderCaseStudies.value || builderCaseStudies.value.length === 0) return;
	const currentIndex = currentCaseIndex.value;
	const nextIndex = (currentIndex + 1) % builderCaseStudies.value.length;
	selectedBuilderCase.value = builderCaseStudies.value[nextIndex];
}

function selectPreviousCase() {
	if (!builderCaseStudies.value || builderCaseStudies.value.length === 0) return;
	const currentIndex = currentCaseIndex.value;
	const prevIndex = (currentIndex - 1 + builderCaseStudies.value.length) % builderCaseStudies.value.length;
	selectedBuilderCase.value = builderCaseStudies.value[prevIndex];
}

// Initialize with the first case or null - currently commented out
onMounted(() => {
	if (builderCaseStudies.value.length > 0) {
		selectedBuilderCase.value = builderCaseStudies.value[0]; // Optionally select the first case by default
		if (selectedBuilderCase.value) isDetailedViewExpanded.value = false;
	}
});

onMounted(async () => {
	await nextTick();
	let logoScrollAnimation = null;

	if (scrollAnimation && typeof scrollAnimation.initScrollPlugins === "function") {
		await scrollAnimation.initScrollPlugins();
	}

	// --- Hero Section Animation ---
	if (pageTitleRef.value && pageSubtitleRef.value && philosophyRef.value && logoWallRef.value && logoWallSecondRef.value) {
		const tlHero = gsap.timeline({ delay: 0.2 });
		tlHero
			.to(pageTitleRef.value, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }, "+=0.2")
			.to(pageSubtitleRef.value, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.5")
			.to(philosophyRef.value, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.7)" }, "-=0.4")
			.to(logoWallRef.value, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.4")
			.to(logoWallSecondRef.value, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.3");
		gsap.set(pageTitleRef.value, { y: 30, autoAlpha: 0 });
		gsap.set(pageSubtitleRef.value, { y: 25, autoAlpha: 0 });
		gsap.set(philosophyRef.value, { y: 20, scale: 0.95, autoAlpha: 0 });
		gsap.set(logoWallRef.value, { y: 20, autoAlpha: 0 });
		gsap.set(logoWallSecondRef.value, { y: 20, autoAlpha: 0 });
	}

	// --- Partner Logo Carousel Animation (First Row - Left Scroll) ---
	if (logoTrackRef.value && partnerLogos.value.length > 0) {
		const logos = Array.from(logoTrackRef.value.querySelectorAll(".partner-logo")).slice(0, partnerLogos.value.length);
		let totalWidth = 0;
		const imageLoadPromises = logos.map(
			(img) =>
				new Promise((resolve) => {
					if (img.complete) {
						totalWidth += img.offsetWidth + (parseInt(getComputedStyle(img).marginLeft) || 0) + (parseInt(getComputedStyle(img).marginRight) || 0);
						resolve();
					} else {
						img.onload = () => {
							totalWidth += img.offsetWidth + (parseInt(getComputedStyle(img).marginLeft) || 0) + (parseInt(getComputedStyle(img).marginRight) || 0);
							resolve();
						};
						img.onerror = () => {
							resolve();
						};
					}
				})
		);
		await Promise.all(imageLoadPromises);
		const isMobile = window.innerWidth < 768;
		const shouldAnimate = isMobile || (totalWidth > 0 && logoTrackRef.value.parentElement.offsetWidth < totalWidth);

		if (shouldAnimate && totalWidth > 0) {
			const animationDuration = totalWidth / 50;
			logoScrollAnimation = gsap.to(logoTrackRef.value, { x: -totalWidth, ease: "none", duration: animationDuration, repeat: -1 });
			logoTrackRef.value.parentElement.addEventListener("mouseenter", () => logoScrollAnimation && logoScrollAnimation.pause());
			logoTrackRef.value.parentElement.addEventListener("mouseleave", () => logoScrollAnimation && logoScrollAnimation.play());
		} else if (logoTrackRef.value) {
			logoTrackRef.value.style.justifyContent = "center";
		}
	}

	// --- Second Partner Logo Carousel Animation (Second Row - Right Scroll) ---
	let logoScrollAnimationSecond = null;
	if (logoTrackSecondRef.value && partnerLogosSecond.value.length > 0) {
		const logosSecond = Array.from(logoTrackSecondRef.value.querySelectorAll(".partner-logo")).slice(0, partnerLogosSecond.value.length);
		let totalWidthSecond = 0;
		const imageLoadPromisesSecond = logosSecond.map(
			(img) =>
				new Promise((resolve) => {
					if (img.complete) {
						totalWidthSecond += img.offsetWidth + (parseInt(getComputedStyle(img).marginLeft) || 0) + (parseInt(getComputedStyle(img).marginRight) || 0);
						resolve();
					} else {
						img.onload = () => {
							totalWidthSecond += img.offsetWidth + (parseInt(getComputedStyle(img).marginLeft) || 0) + (parseInt(getComputedStyle(img).marginRight) || 0);
							resolve();
						};
						img.onerror = () => {
							resolve();
						};
					}
				})
		);
		await Promise.all(imageLoadPromisesSecond);
		const isMobileSecond = window.innerWidth < 768;
		const shouldAnimateSecond = isMobileSecond || (totalWidthSecond > 0 && logoTrackSecondRef.value.parentElement.offsetWidth < totalWidthSecond);

		if (shouldAnimateSecond && totalWidthSecond > 0) {
			const animationDurationSecond = totalWidthSecond / 50;
			// 設置初始位置為負值，然後向右移動到 0
			gsap.set(logoTrackSecondRef.value, { x: -totalWidthSecond });
			logoScrollAnimationSecond = gsap.to(logoTrackSecondRef.value, {
				x: 0,
				ease: "none",
				duration: animationDurationSecond,
				repeat: -1
			});
			logoTrackSecondRef.value.parentElement.addEventListener("mouseenter", () => logoScrollAnimationSecond && logoScrollAnimationSecond.pause());
			logoTrackSecondRef.value.parentElement.addEventListener("mouseleave", () => logoScrollAnimationSecond && logoScrollAnimationSecond.play());
		} else if (logoTrackSecondRef.value) {
			logoTrackSecondRef.value.style.justifyContent = "center";
		}
	}

	// --- Section 2: Clarifying Needs Animation ---
	if (clarifyingNeedsSectionRef.value) {
		gsap.set([clarifyingNeedsTitleRef.value, businessChallengesTitleRef.value, publicChallengesTitleRef.value], {
			y: 30,
			autoAlpha: 0
		});

		const tlNeeds = gsap.timeline({
			scrollTrigger: {
				trigger: clarifyingNeedsSectionRef.value,
				start: "top 85%", // Adjust as needed
				toggleActions: "play none none none"
			}
		});

		tlNeeds
			.to(clarifyingNeedsTitleRef.value, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" })
			.to(businessChallengesTitleRef.value, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.3")
			.to(
				clarifyingNeedsSectionRef.value ? clarifyingNeedsSectionRef.value.querySelectorAll(".challenge-card.opacity-0") : [],
				{ autoAlpha: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.15, ease: "back.out(1.7)" },
				"-=0.2"
			)
			.to(publicChallengesTitleRef.value, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=1.0")
			.to(
				publicChallengesListRef.value ? publicChallengesListRef.value.querySelectorAll(".challenge-card.opacity-0") : [],
				{ autoAlpha: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.15, ease: "back.out(1.7)" },
				"-=0.2"
			);
	}

	// Mobile view listener
	checkMobileView();
	window.addEventListener("resize", checkMobileView);

	// --- Section 3: Builder Case Studies Animation ---
	if (buildersCaseStudiesSectionRef.value) {
		gsap.set([buildersCaseStudiesTitleRef.value, buildersCaseStudiesSubtitleRef.value, rightColumnWrapperRef.value, caseDetailsContainerRef.value], {
			autoAlpha: 0,
			y: 30
		});

		const tlBuilderCases = gsap.timeline({
			scrollTrigger: {
				trigger: buildersCaseStudiesSectionRef.value,
				start: "top 80%",
				toggleActions: "play none none none"
			}
		});

		tlBuilderCases
			.to(buildersCaseStudiesTitleRef.value, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" })
			.to(buildersCaseStudiesSubtitleRef.value, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.3")
			.to(caseDetailsContainerRef.value, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.3")
			.to(rightColumnWrapperRef.value, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.3");
	}
});

onUnmounted(() => {
	window.removeEventListener("resize", checkMobileView);
});
</script>

<style scoped>
/* Logo Carousel Styles - 漸層淡化效果 */
.logo-carousel-container {
	mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
	-webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

/* Logo 軌道效能優化 */
.logo-track,
.logo-track-reverse {
	will-change: transform;
}

/* 3D 翻轉卡片效果 */
.flip-card-inner {
	transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
	transform-style: preserve-3d;
}

.flip-card-inner.is-flipped {
	transform: rotateY(180deg);
}

.card-face {
	-webkit-backface-visibility: hidden;
	backface-visibility: hidden;
	overflow-wrap: break-word;
	word-wrap: break-word;
	hyphens: auto;
}

/* 地圖標記動畫 */
@keyframes ping-slow {
	75%,
	100% {
		transform: scale(2.5);
		opacity: 0;
	}
}
.animate-ping-slow {
	animation: ping-slow 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* 案例切換動畫效果 */
.case-fade-enter-active,
.case-fade-leave-active {
	transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.case-fade-enter-from {
	opacity: 0;
	transform: translateY(10px) scale(0.98);
}

.case-fade-leave-to {
	opacity: 0;
	transform: translateY(-10px) scale(0.98);
}

.case-fade-enter-to,
.case-fade-leave-from {
	opacity: 1;
	transform: translateY(0) scale(1);
}
</style>
