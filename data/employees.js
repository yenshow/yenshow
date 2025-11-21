export const employees = {
	"jerry-chung": {
		slug: "jerry-chung",
		name: "鍾善武",
		nameEn: "Jerry Chung",
		position: "總經理",
		positionEn: "General Manager",
		company: "遠岫科技有限公司",
		companyEn: "YENSHOW Technology Co., Ltd.",
		mobile: "0928-271-303",
		phone: "02-2223-3355",
		phoneExt: "55",
		email: "jerry@yenshow.com",
		address: "新北市中和區橋和路122號7樓",
		addressEn: "7F., No. 122, Qiaohe Rd., Zhonghe Dist., New Taipei City, Taiwan (R.O.C.)",
		taxId: "83124007",
		facebook: "@YENSHOW2020",
		line: "https://lin.ee/kJ5KPrt",
		headshot: "/headshot/Jerry.png"
	},
	"stan-chen": {
		slug: "stan-chen",
		name: "陳司廉",
		nameEn: "Stan Chen",
		position: "副總經理",
		positionEn: "Vice President",
		company: "遠岫科技有限公司",
		companyEn: "YENSHOW Technology Co., Ltd.",
		mobile: "0920-370-177",
		phone: "02-2223-3355",
		phoneExt: "66",
		email: "stan@yenshow.com",
		address: "新北市中和區橋和路122號7樓",
		addressEn: "7F., No. 122, Qiaohe Rd., Zhonghe Dist., New Taipei City, Taiwan (R.O.C.)",
		taxId: "83124007",
		facebook: "@YENSHOW2020",
		line: "https://lin.ee/kJ5KPrt",
		headshot: "/headshot/Stan.png"
	},
	"steve-chung": {
		slug: "steve-chung",
		name: "鍾天萌",
		nameEn: "Steve Chung",
		position: "工程師",
		positionEn: "Engineer",
		company: "遠岫科技有限公司",
		companyEn: "YENSHOW Technology Co., Ltd.",
		mobile: "0912-855-536",
		phone: "02-2223-3355",
		phoneExt: "68",
		email: "steve@yenshow.com",
		address: "新北市中和區橋和路122號7樓",
		addressEn: "7F., No. 122, Qiaohe Rd., Zhonghe Dist., New Taipei City, Taiwan (R.O.C.)",
		taxId: "83124007",
		facebook: "@YENSHOW2020",
		line: "https://lin.ee/kJ5KPrt",
		headshot: "/headshot/Steve.png"
	},
	"yi-ping-lu": {
		slug: "yi-ping-lu",
		name: "盧怡萍",
		nameEn: "Yi Ping Lu",
		position: "銷售總監",
		positionEn: "Sales Director",
		company: "遠岫科技有限公司",
		companyEn: "YENSHOW Technology Co., Ltd.",
		mobile: "0931-321-595",
		phone: "02-2223-3355",
		phoneExt: "58",
		email: "yp@yenshow.com",
		address: "新北市中和區橋和路122號7樓",
		addressEn: "7F., No. 122, Qiaohe Rd., Zhonghe Dist., New Taipei City, Taiwan (R.O.C.)",
		taxId: "83124007",
		facebook: "@YENSHOW2020",
		line: "https://lin.ee/kJ5KPrt",
		headshot: "/headshot/YP.png"
	},
	"leo-liao": {
		slug: "leo-liao",
		name: "廖逸安",
		nameEn: "Leo Liao",
		position: "高級工程師",
		positionEn: "Senior Engineer",
		company: "遠岫科技有限公司",
		companyEn: "YENSHOW Technology Co., Ltd.",
		mobile: "0908-977-332",
		phone: "02-2223-3355",
		phoneExt: "67",
		email: "leo@yenshow.com",
		address: "新北市中和區橋和路122號7樓",
		addressEn: "7F., No. 122, Qiaohe Rd., Zhonghe Dist., New Taipei City, Taiwan (R.O.C.)",
		taxId: "83124007",
		facebook: "@YENSHOW2020",
		line: "https://lin.ee/kJ5KPrt",
		headshot: "/headshot/Leo.png"
	}
};

// 獲取所有員工列表
export const getEmployeesList = () => {
	return Object.values(employees);
};

// 根據 slug 獲取單個員工資料
export const getEmployeeBySlug = (slug) => {
	return employees[slug] || null;
};
