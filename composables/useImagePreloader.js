import { ref, readonly } from "vue";

export const useImagePreloader = () => {
	const preloadedImages = ref(new Set());
	const isPreloading = ref(false);

	/**
	 * 預加載單張圖片
	 * @param {string} src - 圖片來源
	 * @returns {Promise} 載入完成的 Promise
	 */
	const preloadImage = (src) => {
		return new Promise((resolve, reject) => {
			if (preloadedImages.value.has(src)) {
				resolve(src);
				return;
			}

			const img = new Image();

			img.onload = () => {
				preloadedImages.value.add(src);
				resolve(src);
			};

			img.onerror = () => {
				reject(new Error(`Failed to preload image: ${src}`));
			};

			img.src = src;
		});
	};

	/**
	 * 批量預加載圖片
	 * @param {string[]} imageUrls - 圖片 URL 陣列
	 * @param {number} concurrency - 並發載入數量，預設為 3
	 * @returns {Promise} 所有圖片載入完成的 Promise
	 */
	const preloadImages = async (imageUrls, concurrency = 3) => {
		if (!imageUrls || imageUrls.length === 0) return;

		isPreloading.value = true;

		try {
			// 過濾已預加載的圖片
			const urlsToPreload = imageUrls.filter((url) => !preloadedImages.value.has(url));

			if (urlsToPreload.length === 0) {
				isPreloading.value = false;
				return;
			}

			// 分批處理，控制並發數量
			const batches = [];
			for (let i = 0; i < urlsToPreload.length; i += concurrency) {
				batches.push(urlsToPreload.slice(i, i + concurrency));
			}

			for (const batch of batches) {
				await Promise.allSettled(batch.map((url) => preloadImage(url)));
			}
		} catch (error) {
			console.warn("Image preloading error:", error);
		} finally {
			isPreloading.value = false;
		}
	};

	/**
	 * 預加載頁面中的圖片
	 * @param {string} selector - 圖片選擇器，預設為 'img[data-preload]'
	 */
	const preloadPageImages = (selector = "img[data-preload]") => {
		if (process.client) {
			const images = document.querySelectorAll(selector);
			const imageUrls = Array.from(images)
				.map((img) => img.src)
				.filter(Boolean);
			preloadImages(imageUrls);
		}
	};

	/**
	 * 預加載視窗內的圖片
	 * @param {string} selector - 圖片選擇器
	 * @param {number} threshold - 觸發預加載的距離閾值
	 */
	const preloadVisibleImages = (selector = "img[data-preload-visible]", threshold = 100) => {
		if (!process.client) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const img = entry.target;
						if (img.src && !preloadedImages.value.has(img.src)) {
							preloadImage(img.src);
						}
						observer.unobserve(img);
					}
				});
			},
			{
				rootMargin: `${threshold}px`
			}
		);

		const images = document.querySelectorAll(selector);
		images.forEach((img) => observer.observe(img));

		return observer;
	};

	/**
	 * 檢查圖片是否已預加載
	 * @param {string} src - 圖片來源
	 * @returns {boolean}
	 */
	const isImagePreloaded = (src) => {
		return preloadedImages.value.has(src);
	};

	/**
	 * 清除預加載快取
	 */
	const clearPreloadCache = () => {
		preloadedImages.value.clear();
	};

	return {
		preloadedImages: readonly(preloadedImages),
		isPreloading: readonly(isPreloading),
		preloadImage,
		preloadImages,
		preloadPageImages,
		preloadVisibleImages,
		isImagePreloaded,
		clearPreloadCache
	};
};
