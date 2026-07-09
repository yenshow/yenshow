/** 解決方案 / 平台頁 Hero 區塊的錨點標籤樣式 */
export const getNavTagClass = (color) => {
	const base =
		"transform inline-block rounded-lg border px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:text-white hover:shadow-lg";
	const colorMap = {
		orange: "border-orange-400/80 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:shadow-orange-500/30",
		green: "border-green-400/80 bg-green-50 text-green-600 hover:bg-green-500 hover:shadow-green-500/30",
		blue: "border-blue-400/80 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:shadow-blue-500/30",
		purple: "border-purple-400/80 bg-purple-50 text-purple-600 hover:bg-purple-500 hover:shadow-purple-500/30",
		sky: "border-sky-400/80 bg-sky-50 text-sky-600 hover:bg-sky-500 hover:shadow-sky-500/30",
		emerald: "border-emerald-400/80 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-500/30",
		amber: "border-amber-400/80 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:shadow-amber-500/30",
		indigo: "border-indigo-400/80 bg-indigo-50 text-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/30",
		cyan: "border-cyan-400/80 bg-cyan-50 text-cyan-600 hover:bg-cyan-500 hover:shadow-cyan-500/30",
		default: "border-gray-400/80 bg-gray-50 text-gray-600 hover:bg-gray-500 hover:shadow-gray-500/30"
	};
	return `${base} ${colorMap[color] || colorMap.default}`;
};
