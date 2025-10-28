<template>
	<section class="bg-white p-4 rounded-lg shadow-lg border border-slate-200 h-full flex flex-col">
		<h3 v-if="title" class="text-xl font-semibold mb-4 text-slate-700 flex-shrink-0">{{ title }}</h3>
		<div class="relative flex-1">
			<ul :class="gridClasses" class="overflow-y-auto pr-1" :style="{ maxHeight: listMaxHeight }" ref="listEl" @scroll="onScroll">
				<li v-for="(item, index) in displayedItems" :key="item.slug" class="">
					<NuxtLink :to="getItemPath(item.slug)" :class="getLinkClasses()">
						<!-- 右側內容 -->
						<div class="min-w-0 flex-1">
							<h4 class="text-slate-800 font-medium truncate">{{ item.titleText }}</h4>
							<p v-if="showDate && item.date" class="text-xs text-slate-500 mt-1">{{ item.date }}</p>
						</div>

						<!-- 右側箭頭圖標 -->
						<div class="flex-shrink-0 ml-2">
							<svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
							</svg>
						</div>
					</NuxtLink>
				</li>
			</ul>
			<!-- 滾動提示（內容溢出且尚未捲到最底時顯示） -->
			<div
				v-show="showScrollHint"
				class="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white via-white/90 to-transparent flex items-end justify-center pb-2"
			>
				<div class="rounded-full bg-white/95 shadow ring-1 ring-slate-200 px-3 py-1 flex items-center gap-2 text-slate-600 text-sm md:text-base font-medium">
					<span>{{ t("common.scroll_more") }}</span>
					<svg class="w-4 h-4 md:w-5 md:h-5 animate-bounce" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
						<path
							fill-rule="evenodd"
							d="M10 14a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L10 11.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 14z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { useLanguageStore } from "~/stores/core/languageStore";
import { useI18n } from "vue-i18n";

const props = defineProps({
	title: { type: String, default: "" },
	// items: [{ slug, titleText (string or i18n object), imageUrl, date (already formatted) }]
	items: { type: Array, default: () => [] },
	// Named route, e.g. 'news-slug' or 'faqs-slug'
	routeName: { type: String, required: true },
	// 欄數：1 或 2
	columns: { type: Number, default: 2 },
	// 是否顯示日期
	showDate: { type: Boolean, default: true }
});

const localePath = useLocalePath();
const languageStore = useLanguageStore();
const { t } = useI18n();

// 獲取本地化文字 (用於標題)
const getLocalizedText = (field) => {
	if (typeof field === "object" && field !== null) {
		const lang = languageStore.currentLang.toUpperCase();

		// 優先使用當前語言的內容
		if (field[lang]) return field[lang];

		// 英文頁面但沒有英文內容時，顯示提示信息
		if (lang === "EN" && field.TW) {
			return `[TW] ${field.TW}`;
		}

		// 標準回退機制
		return field.TW || field.EN || "";
	}
	return typeof field === "string" ? field : "";
};

// 顯示資料（處理多語言標題）
const displayedItems = computed(() => {
	// 確保 computed 屬性依賴於語言變化
	languageStore.currentLang; // 觸發響應式更新

	return props.items.map((item) => ({
		...item,
		titleText: getLocalizedText(item.titleText)
	}));
});

// 動態欄位樣式
const gridClasses = computed(() => (props.columns === 1 ? "grid grid-cols-1 gap-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"));

// 固定顯示 4 列的最大高度
const listMaxHeight = computed(() => "224px"); // 4 * 56px

// 滾動提示：當內容大於容器且尚未捲到底部時顯示
const listEl = ref(null);
const showScrollHint = ref(false);

const evaluateScrollHint = () => {
	const el = listEl.value;
	if (!el) {
		showScrollHint.value = false;
		return;
	}
	const canScroll = el.scrollHeight > el.clientHeight + 2;
	const atBottom = el.scrollTop >= el.scrollHeight - el.clientHeight - 2;
	showScrollHint.value = canScroll && !atBottom;
};

const onScroll = () => evaluateScrollHint();

// 獲取項目路徑
const getItemPath = (slug) => {
	// 根據 routeName 決定路徑前綴
	const pathMap = {
		"news-slug": "/news",
		"faqs-slug": "/faqs"
	};
	const basePath = pathMap[props.routeName] || "/";
	// 確保 slug 統一為小寫
	const normalizedSlug = slug ? slug.toLowerCase() : "";
	return localePath(`${basePath}/${normalizedSlug}`);
};

// 獲取連結樣式類別
const getLinkClasses = () => {
	const baseClasses = "flex items-center gap-3 p-3 rounded-md transition-all duration-200 no-underline min-h-[56px] group";
	const hoverClasses = {
		"news-slug": "hover:bg-blue-50 hover:border-l-4 hover:border-blue-500",
		"faqs-slug": "hover:bg-green-50 hover:border-l-4 hover:border-green-500",
		default: "hover:bg-slate-50 hover:border-l-4 hover:border-slate-400"
	};
	return `${baseClasses} ${hoverClasses[props.routeName] || hoverClasses.default}`;
};

onMounted(() => {
	// 初次判斷
	evaluateScrollHint();
	// 視窗尺寸改變時重新評估
	if (typeof window !== "undefined") {
		const handler = () => evaluateScrollHint();
		window.addEventListener("resize", handler);
		onBeforeUnmount(() => window.removeEventListener("resize", handler));
	}
});
</script>
