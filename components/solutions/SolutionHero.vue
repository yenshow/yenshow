<template>
	<section class="relative bg-gradient-to-br from-blue-900/95 via-teal-800/90 to-emerald-900/95 overflow-hidden">
		<!-- Background elements -->
		<div class="container mx-auto grid grid-cols-1 items-center gap-12 px-4 py-12 lg:grid-cols-2 lg:py-24 relative z-10">
			<div class="relative py-24 lg:py-36 text-center">
				<!-- Prev Solution Link -->
				<NuxtLink :to="localePath(`/solutions/${prevSolution.slug}`)" class="absolute left-0 top-0 z-20 group hero-anim-prev">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="280"
						height="150"
						fill="currentColor"
						viewBox="0 0 280 150"
						class="w-[180px] h-auto lg:w-[280px] text-white opacity-20 hover:opacity-40 rotate-[-30deg] transition-all duration-300 ease-in-out"
					>
						<path
							fill="currentColor"
							d="M150 16.18c0-7.433-7.823-12.268-14.472-8.944l-130 65A10 10 0 0 0 0 81.18v52.64c0 7.433 7.823 12.268 14.472 8.944L150 75V16.18Z"
						/>
						<path
							fill="currentColor"
							d="M130 16.18c0-7.433 7.823-12.268 14.472-8.944l130 65A10 10 0 0 1 280 81.18v52.64c0 7.433-7.823 12.268-14.472 8.944L130 75V16.18Z"
						/>
					</svg>
					<p class="absolute top-[25%] left-[30%] rotate-[-30deg] text-[16px] lg:text-[21px] font-bold text-white">
						{{ prevSolution.shortTitle }}
					</p>
				</NuxtLink>

				<h1 class="font-bold uppercase text-cyan-300 drop-shadow-lg hero-anim-h1">智慧方案</h1>
				<h2 class="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl hero-anim-h2">{{ solutionData.title }}</h2>
				<p class="mt-6 text-lg md:text-xl lg:text-2xl leading-8 text-white/90 hero-anim-p">{{ solutionData.subtitle }}</p>

				<!-- Quick Navigation -->
				<div class="my-8 flex flex-wrap items-center justify-center gap-4 hero-anim-nav">
					<a
						v-for="feature in features"
						:key="feature.id"
						:href="`#${feature.id}`"
						:class="getFeatureTagClass(feature.color)"
						@click.prevent="scrollToFeature(feature.id)"
					>
						{{ feature.title }}
					</a>
				</div>

				<!-- Next Solution Link -->
				<NuxtLink :to="localePath(`/solutions/${nextSolution.slug}`)" class="absolute right-0 bottom-0 z-20 group hero-anim-next">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="280"
						height="150"
						fill="currentColor"
						viewBox="0 0 280 150"
						class="w-[180px] h-auto lg:w-[280px] text-white opacity-20 hover:opacity-40 rotate-[150deg] transition-all duration-300 ease-in-out"
					>
						<path
							fill="currentColor"
							d="M150 16.18c0-7.433-7.823-12.268-14.472-8.944l-130 65A10 10 0 0 0 0 81.18v52.64c0 7.433 7.823 12.268 14.472 8.944L150 75V16.18Z"
						/>
						<path
							fill="currentColor"
							d="M130 16.18c0-7.433 7.823-12.268 14.472-8.944l130 65A10 10 0 0 1 280 81.18v52.64c0 7.433-7.823 12.268-14.472 8.944L130 75V16.18Z"
						/>
					</svg>
					<p class="absolute bottom-[25%] right-[30%] rotate-[-30deg] text-[16px] lg:text-[21px] font-bold text-white">
						{{ nextSolution.shortTitle }}
					</p>
				</NuxtLink>
			</div>
			<div class="flex items-center justify-center hero-anim-img">
				<div v-if="solutionData.videoUrl" class="w-full aspect-video rounded-lg overflow-hidden shadow-2xl">
					<iframe
						:src="embedUrl"
						frameborder="0"
						allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
						class="w-full h-full"
						loading="lazy"
					></iframe>
				</div>
				<NuxtImg
					v-else
					:src="solutionData.heroImage"
					:alt="solutionData.title"
					class="max-h-[60vh] w-auto rounded-lg object-contain shadow-2xl"
					loading="eager"
					fetchpriority="high"
				/>
			</div>
		</div>
	</section>
</template>

<script setup>
const localePath = useLocalePath();
defineProps({
	solutionData: {
		type: Object,
		required: true
	},
	features: {
		type: Array,
		required: true
	},
	prevSolution: {
		type: Object,
		required: true
	},
	nextSolution: {
		type: Object,
		required: true
	},
	embedUrl: {
		type: String,
		required: true
	},
	scrollToFeature: {
		type: Function,
		required: true
	},
	getFeatureTagClass: {
		type: Function,
		required: true
	}
});
</script>
