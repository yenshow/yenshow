<template>
	<div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 animate-pulse w-full">
		<div v-for="n in 4" :key="n" class="bg-slate-50 border border-slate-200 rounded-lg shadow-md p-3 sm:p-4 text-center h-[100px] sm:h-[120px]">
			<div class="h-5 sm:h-6 bg-gray-300 rounded mb-2 sm:mb-3 w-3/4 mx-auto"></div>
			<div class="h-3 sm:h-4 bg-gray-300 rounded w-5/6 mx-auto"></div>
		</div>
	</div>
</template>
