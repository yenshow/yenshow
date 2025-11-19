export const useNFC = () => {
	const isSupported = ref(false);
	const isScanning = ref(false);
	const isWriting = ref(false);
	const error = ref(null);

	onMounted(() => {
		// 檢查瀏覽器是否支援 Web NFC
		if (typeof window !== "undefined" && "NDEFReader" in window) {
			isSupported.value = true;
		}
	});

	// 寫入 NFC 標籤
	const writeToNFC = async (data) => {
		if (!isSupported.value) {
			const err = new Error("此瀏覽器不支援 Web NFC API");
			error.value = err.message;
			throw err;
		}

		if (isWriting.value) {
			return;
		}

		isWriting.value = true;
		error.value = null;

		try {
			const ndef = new NDEFReader();

			// 建立 vCard 格式的資料
			const vCard = createVCard(data);

			// 寫入多個記錄：URL 和文字（vCard 格式）
			await ndef.write({
				records: [
					{
						recordType: "url",
						data: data.url || data.website || "https://www.yenshow.com"
					},
					{
						recordType: "text",
						data: vCard,
						mediaType: "text/vcard"
					},
					{
						recordType: "text",
						data: JSON.stringify({
							name: data.name,
							phone: data.phone,
							email: data.email,
							website: data.website || data.url
						})
					}
				]
			});

			return { success: true };
		} catch (err) {
			error.value = err.message || "寫入 NFC 標籤時發生錯誤";
			throw err;
		} finally {
			isWriting.value = false;
		}
	};

	// 讀取 NFC 標籤
	const readFromNFC = async () => {
		if (!isSupported.value) {
			const err = new Error("此瀏覽器不支援 Web NFC API");
			error.value = err.message;
			throw err;
		}

		if (isScanning.value) {
			return;
		}

		isScanning.value = true;
		error.value = null;

		try {
			const ndef = new NDEFReader();

			return new Promise((resolve, reject) => {
				ndef.addEventListener("reading", async ({ message }) => {
					try {
						const records = message.records;
						const data = [];

						for (const record of records) {
							if (record.recordType === "text") {
								const reader = record.data.getReader();
								const { value } = await reader.read();
								const decoder = new TextDecoder();
								const text = decoder.decode(value);
								data.push({ type: "text", content: text });
							} else if (record.recordType === "url") {
								const reader = record.data.getReader();
								const { value } = await reader.read();
								const decoder = new TextDecoder();
								const url = decoder.decode(value);
								data.push({ type: "url", content: url });
							}
						}

						isScanning.value = false;
						resolve(data);
					} catch (err) {
						isScanning.value = false;
						error.value = "讀取 NFC 資料時發生錯誤";
						reject(err);
					}
				});

				ndef.addEventListener("readingerror", (err) => {
					isScanning.value = false;
					error.value = "讀取 NFC 標籤時發生錯誤";
					reject(err);
				});

				ndef.scan().catch((err) => {
					isScanning.value = false;
					error.value = err.message || "掃描 NFC 標籤時發生錯誤";
					reject(err);
				});
			});
		} catch (err) {
			isScanning.value = false;
			error.value = err.message || "初始化 NFC 讀取器時發生錯誤";
			throw err;
		}
	};

	// 建立 vCard 格式
	const createVCard = (data) => {
		const lines = ["BEGIN:VCARD", "VERSION:3.0"];

		if (data.name) {
			lines.push(`FN:${data.name}`);
			lines.push(`N:${data.name};;;;`);
		}

		if (data.position) {
			lines.push(`TITLE:${data.position}`);
		}

		if (data.company) {
			lines.push(`ORG:${data.company}${data.department ? `;${data.department}` : ""}`);
		}

		if (data.phone) {
			lines.push(`TEL;TYPE=WORK,VOICE:${data.phone}`);
		}

		if (data.email) {
			lines.push(`EMAIL;TYPE=WORK:${data.email}`);
		}

		if (data.website || data.url) {
			lines.push(`URL:${data.website || data.url}`);
		}

		lines.push("END:VCARD");

		return lines.join("\r\n");
	};

	// 下載 vCard 檔案
	const downloadVCard = (data, filename = "contact.vcf") => {
		const vCard = createVCard(data);
		const blob = new Blob([vCard], { type: "text/vcard;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	return {
		isSupported,
		isScanning,
		isWriting,
		error,
		writeToNFC,
		readFromNFC,
		downloadVCard
	};
};
