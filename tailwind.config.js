/** @type {import('tailwindcss').Config} */
export default {
	// data/ 內的平台主題色以字串傳入元件，需納入掃描避免 JIT 漏編譯
	content: ["./data/**/*.{js,ts}"],
	safelist: ["from-emerald-600", "to-green-500", "bg-emerald-600", "text-emerald-600"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Noto Sans TC"], // 設定主要無襯線字體
				serif: ["Noto Serif TC"], // 設定襯線字體
				mono: ["Courier New", "monospace"] // 設定等寬字體
			},
			colors: {
				primary: "#212A37",
				secondary: "#F2F2F2",
				tertiary: "#000000"
			},
			container: {
				center: true, // 讓 container 預設置中
				padding: "2rem" // 預設左右 padding
			}
		}
	},
	plugins: []
};
