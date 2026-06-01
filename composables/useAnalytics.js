/**
 * GA4 事件追蹤（nuxt-gtag）
 */
export const useAnalytics = () => {
	const { gtag } = useGtag();

	const trackEvent = (eventName, params = {}) => {
		if (!gtag) return;
		gtag("event", eventName, params);
	};

	const trackGenerateLead = (params = {}) => {
		trackEvent("generate_lead", {
			currency: "TWD",
			...params
		});
	};

	const trackFaqCtaClick = (params = {}) => {
		trackEvent("faq_cta_click", params);
	};

	return {
		trackEvent,
		trackGenerateLead,
		trackFaqCtaClick
	};
};
