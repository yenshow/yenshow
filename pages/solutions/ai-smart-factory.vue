<template>
	<div class="bg-gray-50">
		<div class="min-h-screen">
			<!-- Section 1: Hero -->
			<section class="relative bg-slate-800 text-white py-16 md:py-24 flex flex-col justify-center items-center text-center px-4 sm:px-6">
				<div class="absolute inset-0 overflow-hidden z-0">
					<NuxtImg
						:src="solution.image"
						:alt="solution.title"
						class="w-full h-full object-cover opacity-20"
						format="webp"
						loading="eager"
						fetchpriority="high"
						aria-hidden="true"
					/>
					<div class="absolute inset-0 bg-gradient-to-t from-slate-800 via-slate-800/80 to-transparent"></div>
				</div>
				<div class="relative z-10 space-y-4">
					<p class="text-sky-300 font-semibold text-lg">遠岫科技｜解決方案</p>
					<h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">{{ solution.title }}</h1>
				</div>
			</section>

			<!-- 麵包屑導航 -->
			<div class="bg-white shadow-sm">
				<div class="container mx-auto p-4">
					<nav class="text-sm text-gray-500" aria-label="breadcrumb">
						<ol class="flex items-center space-x-2">
							<li><NuxtLink to="/" class="hover:text-primary">首頁</NuxtLink></li>
							<li><span class="mx-2">/</span></li>
							<li><span class="font-medium text-gray-700">解決方案</span></li>
							<li><span class="mx-2">/</span></li>
							<li class="font-medium text-gray-800 truncate" aria-current="page">{{ solution.title }}</li>
						</ol>
					</nav>
				</div>
			</div>

			<!-- Section 2: Main Content -->
			<main class="container mx-auto py-12 md:py-16 px-4">
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
					<!-- Left: Solution Details -->
					<div class="lg:col-span-2 bg-white p-6 md:p-8 rounded-lg shadow">
						<h2 class="text-2xl md:text-3xl font-bold text-gray-800 border-b pb-4 mb-6">方案詳解</h2>
						<div class="prose max-w-none text-gray-700 leading-relaxed" v-html="solution.longDescription"></div>
					</div>

					<!-- Right: Related Products -->
					<aside class="space-y-8">
						<div class="bg-white p-6 md:p-8 rounded-lg shadow">
							<h3 class="text-xl md:text-2xl font-bold text-gray-800 border-b pb-3 mb-5">核心產品組合</h3>
							<div v-if="solution.relatedProducts && solution.relatedProducts.length > 0" class="space-y-4">
								<div
									v-for="(product, pIndex) in solution.relatedProducts"
									:key="pIndex"
									class="bg-sky-50 hover:bg-sky-100/70 p-4 rounded-md shadow-sm transition-all duration-300 border border-sky-200/50 hover:shadow-md"
								>
									<p class="font-semibold text-sky-800 mb-1">{{ product.name }}</p>
									<p class="text-sm text-gray-600 mb-3">{{ product.description }}</p>
									<NuxtLink
										:to="product.link"
										class="text-sm text-primary hover:text-sky-700 hover:underline font-semibold rounded-sm inline-flex items-center group"
									>
										查看系列
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-4 w-4 ml-1 transition-transform duration-200 group-hover:translate-x-1"
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
							<div v-else>
								<p class="text-gray-500">此方案相關產品資訊尚待補充。</p>
							</div>
						</div>
					</aside>
				</div>
			</main>

			<!-- Section 3: Related Success Stories -->
			<section v-if="solution.relatedCases && solution.relatedCases.length > 0" class="bg-gray-100 py-12 md:py-16">
				<div class="container mx-auto px-4">
					<h2 class="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8 md:mb-12">相關成功案例</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						<div v-for="(caseItem, cIndex) in solution.relatedCases" :key="cIndex" class="bg-white rounded-lg shadow-lg overflow-hidden group">
							<NuxtImg :src="caseItem.image" :alt="caseItem.name" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
							<div class="p-6">
								<h3 class="text-lg font-semibold text-gray-800 mb-2">{{ caseItem.name }}</h3>
								<NuxtLink :to="caseItem.link" class="text-primary hover:underline font-medium">
									了解更多
									<span aria-hidden="true">&rarr;</span>
								</NuxtLink>
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- Section 4: CTA -->
			<section class="bg-white py-12 md:py-16">
				<div class="container mx-auto text-center px-4 space-y-4">
					<h2 class="text-2xl md:text-3xl font-bold text-gray-800">對此解決方案有興趣嗎？</h2>
					<p class="text-lg text-gray-600 max-w-2xl mx-auto">我們的專業團隊隨時準備好為您提供更深入的諮詢服務，並根據您的具體需求量身打造最合適的方案。</p>
					<div class="pt-4">
						<ButtonCTA label="立即諮詢" to="/contact" class="w-fit"></ButtonCTA>
					</div>
				</div>
			</section>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { useHead } from "#app";
import ButtonCTA from "~/components/common/Button-CTA.vue";

// 靜態內容資料
const solution = ref({
	id: "ai-smart-factory",
	title: "AI智慧工廠",
	image: "/solutions/AI智慧工廠強化安全與工作流程.png",
	longDescription: `
		<p class="mb-4">遠岫科技的AI智慧工廠解決方案，旨在透過先進的影像辨識技術，從根本上強化生產場域的安全規範與工作流程效率。我們深知在現代工業環境中，僅僅依靠人力管理難以做到全時段、全方位的覆蓋，因此我們導入AI進行賦能。</p>
		<h3 class="text-lg font-semibold text-gray-800 mt-6 mb-3">核心應用場景：</h3>
		<ul class="list-disc list-inside space-y-2 mb-4">
			<li><strong>人員行為規範：</strong> 系統能即時偵測工作人員是否按規定佩戴安全帽、反光背心等個人防護裝備(PPE)，一旦發現違規，立即觸發警報，從源頭降低工安意外風險。</li>
			<li><strong>煙火與危險偵測：</strong> 透過特定的影像分析演算法，實現24小時的煙霧與火焰偵測，反應速度遠超傳統感測器，為您的資產提供多一重保障。</li>
			<li><strong>電子圍籬與區域管制：</strong> 在廠區內劃定虛擬的電子圍籬，無論是限制區域的入侵、或確保關鍵設備周遭淨空，AI都能自動監控並發出警示。</li>
			<li><strong>產線自動化監控：</strong> 監控產品在產線上的流動、計數、或初步的瑕疵檢測，輔助品管流程，提升生產效率。</li>
		</ul>
		<p>我們將門禁管制、環境監測與AI影像分析無縫整合至單一中央管理平台，將複雜的數據轉化為直觀的可視化圖表，助您洞察管理死角，做出更精準的決策，全面提升工廠的智能化水平、運營效率與安全等級。</p>
	`,
	relatedProducts: [
		{ name: "AI影像分析攝影機", description: "內建智能演算法，實現多種工業場景辨識。", link: "/products/surveillance-monitoring" },
		{ name: "工業級門禁系統", description: "嚴格管制人員與車輛進出特定區域。", link: "/products/access-control" },
		{ name: "環境與安全感測器", description: "監測工廠內溫度、濕度、有害氣體等。", link: "/products/security-solutions" },
		{ name: "中央管理平台", description: "整合各系統數據，提供決策支援。", link: "/products/surveillance-monitoring" }
	],
	relatedCases: [
		{
			id: 1,
			name: "某電子大廠智慧安防升級專案",
			image: "/case/company.svg", // 替換為真實案例圖片
			link: "/success-stories"
		}
	]
});

// 設定頁面的 Head 資訊 (SEO)
useHead({
	title: `解決方案 - ${solution.value.title}`,
	meta: [
		{
			name: "description",
			content: solution.value.longDescription.replace(/<[^>]*>?/gm, "").substring(0, 150)
		}
	]
});
</script>

<style scoped>
/* 使用 amax-w-none 清除 prose 預設的 max-width，使其填滿容器 */
.prose {
	max-width: none;
}
</style>
