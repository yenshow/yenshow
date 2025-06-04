<template>
	<div v-if="isLoading" class="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 animate-pulse">
		<div v-for="i in 3" :key="`skeleton-nav-${i}`">
			<div
				:class="[
					'trapezoid py-2 sm:py-2.5 md:py-3 lg:py-3.5 xl:py-4 ps-3 sm:ps-4 md:ps-5 lg:ps-6 xl:ps-7',
					'bg-gray-200 w-36 sm:w-44 md:w-48 lg:w-60 xl:w-[300px] h-10 sm:h-12 md:h-14 lg:h-16 xl:h-[70px]'
				]"
			>
				<div class="h-4 sm:h-5 md:h-6 lg:h-7 xl:h-8 bg-gray-300 rounded w-3/4"></div>
			</div>
		</div>
	</div>
	<div v-else class="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
		<div v-for="category in categories" :key="getCategoryId(category)">
			<button
				type="button"
				@click="toggleActive(getCategoryId(category))"
				:class="[
					'trapezoid py-2 sm:py-2.5 md:py-3 lg:py-3.5 xl:py-4 ps-3 sm:ps-4 md:ps-5 lg:ps-6 xl:ps-7 text-left transition-all duration-300 ease-in-out relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
					isCategoryActive(category)
						? 'bg-primary text-white w-48 sm:w-56 md:w-64 lg:w-80 xl:w-[504px]'
						: 'bg-gray-100 hover:bg-gray-200 text-gray-600 w-36 sm:w-44 md:w-48 lg:w-60 xl:w-[300px]'
				]"
				:aria-expanded="isCategoryActive(category) ? 'true' : 'false'"
				:aria-controls="`sublist-${getCategoryId(category)}`"
			>
				<span
					:class="[
						'transition-all duration-300 block truncate',
						isCategoryActive(category) ? 'text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl' : 'text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl'
					]"
					>{{ getCategoryName(category) }}</span
				>
			</button>
			<div
				v-if="isCategoryActive(category) && getSubItems(category)"
				class="mt-2 sm:mt-3 md:mt-4 lg:mt-5 xl:mt-6 ms-4 sm:ms-5 md:ms-6 ps-3 sm:ps-4 py-2 border-l-2 border-primary-light w-48 sm:w-56 md:w-64 lg:w-80 xl:w-[504px]"
				:id="`sublist-${getCategoryId(category)}`"
				role="region"
				:aria-labelledby="getCategoryId(category)"
			>
				<ul class="list-none space-y-1.5 sm:space-y-2 md:space-y-2.5 lg:space-y-3 xl:space-y-4">
					<li
						v-for="item in getSubItems(category)"
						:key="item._id || item"
						class="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-700 hover:text-primary transition-all duration-200 group cursor-pointer"
						role="button"
						tabindex="0"
						@click="selectSubItem(category, item)"
						@keydown.enter="selectSubItem(category, item)"
						@keydown.space.prevent="selectSubItem(category, item)"
					>
						<span class="opacity-60 group-hover:opacity-100 transition-opacity">-&nbsp;</span>
						{{ typeof item === "string" ? item : getCategoryName(item) }}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useLanguageStore } from "~/stores/core/languageStore";

const props = defineProps({
	categories: {
		type: Array,
		required: true
	},
	initialActiveId: {
		type: String,
		default: null
	},
	isLoading: {
		type: Boolean,
		default: false
	}
});

const emit = defineEmits(["category-selected", "subitem-selected"]);

const languageStore = useLanguageStore();
const activeId = ref(props.initialActiveId);

// Helper functions
const getCategoryId = (category) => category?._id || category?.id || null;
const isCategoryActive = (category) => activeId.value === getCategoryId(category);
const getSubItems = (category) => category?.subCategories || category?.items || category?.features;

// 如果沒有初始 activeId 且 categories 存在，預設選中第一個
if (!activeId.value && props.categories && props.categories.length > 0) {
	activeId.value = props.categories[0]._id || props.categories[0].id;
}

watch(
	() => props.initialActiveId,
	(newId) => {
		activeId.value = newId;
	}
);

watch(
	() => props.categories,
	(newCategories) => {
		// 當 categories 列表變化時，檢查當前 activeId 是否仍然有效
		if (newCategories && newCategories.length > 0) {
			const currentCategoryExists = newCategories.some((cat) => getCategoryId(cat) === activeId.value);
			// 如果當前選中的分類不存在於新列表中，或者沒有任何選中項，則默認選中第一個
			if (!currentCategoryExists || !activeId.value) {
				const firstCategory = newCategories[0];
				activeId.value = getCategoryId(firstCategory);
				emit("category-selected", firstCategory);
			}
		} else {
			// 如果新列表為空，則清除選中狀態
			activeId.value = null;
			emit("category-selected", null);
		}
	},
	{ immediate: true }
);

const getCategoryName = (item) => {
	if (!item) return "";
	return languageStore.getLocalizedField(item, "name") || item.title || "";
};

const toggleActive = (id) => {
	// 如果點擊的項目已經是 active，則不取消選擇，保持其 active 狀態
	if (activeId.value === id) {
		return; // 不做任何改變
	}
	activeId.value = id;

	// 找到對應的 category 物件並發送事件
	const selectedCategory = props.categories.find((cat) => getCategoryId(cat) === id);
	emit("category-selected", selectedCategory);
};

const selectSubItem = (category, subItem) => {
	emit("subitem-selected", { category, subItem });
	// 這裡可以根據需要添加更多邏輯，例如導航或觸發其他操作
	console.log("Subitem selected:", category, subItem);
};
</script>

<style scoped>
.trapezoid {
	clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%);
	/* 微調 15px 來改變斜角幅度 */
}

@media (max-width: 640px) {
	.trapezoid {
		clip-path: polygon(0 0, 100% 0, 90% 100%, 0 100%); /* 小螢幕時斜度小一些 */
	}
}
</style>
