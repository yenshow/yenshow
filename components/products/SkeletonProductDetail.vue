<template>
	<div class="bg-secondary animate-pulse" aria-hidden="true">
		<!-- Skeleton for Breadcrumbs -->
		<div class="p-4 md:p-6 lg:p-8">
			<div class="h-4 bg-gray-300 rounded w-1/2 md:w-1/3"></div>
		</div>

		<!-- Skeleton for Main Product Section -->
		<section class="container flex flex-col md:flex-row py-4 md:py-6 lg:py-8 justify-center items-center gap-4 md:gap-8 lg:gap-12">
			<!-- Skeleton for Image -->
			<div class="bg-gray-300 rounded-lg w-[282px] h-[282px] md:w-[384px] md:h-[384px]"></div>

			<!-- Skeleton for Info -->
			<div class="space-y-4 md:space-y-6 w-full md:w-1/2 py-4 md:py-6 lg:py-8">
				<div class="h-8 bg-gray-300 rounded w-3/4"></div>
				<!-- Product Name -->
				<div class="h-4 bg-gray-300 rounded w-1/4"></div>
				<!-- Product Code -->
				<div class="space-y-3 pt-4">
					<div class="h-4 bg-gray-300 rounded w-1/3"></div>
					<!-- Description Title -->
					<div class="h-4 bg-gray-300 rounded w-full"></div>
					<!-- Description Line 1 -->
					<div class="h-4 bg-gray-300 rounded w-5/6"></div>
					<!-- Description Line 2 -->
				</div>
				<div class="h-10 bg-gray-300 rounded w-24 mt-4"></div>
				<!-- CTA Button -->
			</div>
		</section>

		<!-- Skeleton for Features Section -->
		<section class="bg-slate-50 py-8 md:py-12 lg:py-16">
			<div class="container space-y-6 md:space-y-8">
				<div class="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-8"></div>
				<!-- Section Title -->

				<div class="mx-auto space-y-4 md:space-y-6 md:max-w-4xl">
					<div v-for="n in 3" :key="n" class="flex items-start bg-white p-4 rounded-lg shadow-sm border border-gray-100">
						<div class="h-6 w-6 bg-gray-300 rounded-full mr-3 shrink-0 mt-0.5"></div>
						<!-- Feature Marker -->
						<div class="w-full space-y-2">
							<div class="h-5 bg-gray-300 rounded w-4/5"></div>
							<!-- Feature Text Line 1 -->
							<div class="h-5 bg-gray-300 rounded w-3/5"></div>
							<!-- Feature Text Line 2 -->
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Skeleton for CTA Section -->
		<section class="bg-primary bg-opacity-5 py-8 md:py-12 space-y-4 md:space-y-6 text-center">
			<div class="h-8 bg-gray-300 rounded w-1/2 mx-auto"></div>
			<!-- CTA Title -->
			<div class="h-6 bg-gray-300 rounded w-3/4 mx-auto"></div>
			<!-- CTA Subtitle -->
			<div class="flex justify-center gap-3 md:gap-4 pt-4">
				<div class="h-10 bg-gray-300 rounded w-24"></div>
				<!-- CTA Button 1 -->
				<div class="h-10 bg-gray-300 rounded w-24"></div>
				<!-- CTA Button 2 -->
			</div>
		</section>
	</div>
</template>
