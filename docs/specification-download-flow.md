# 產品規格 PDF 下載（登入、簽章、一次性 token）

## 目標

- 不可只靠前端按鈕「假登入」：直接輸入 `/storage/products/<id>/documents/*.pdf` 不得永久可讀。
- 已登入使用者可取得**短效**、**一次性**的下載連結（`?dl=`）。
- 使用者在網址列直接開 raw PDF 時，不要只看到 JSON，改導向可**登入**的頁面。

## 前端（Nuxt）


| 項目                                       | 說明                                                                                            |
| ---------------------------------------- | --------------------------------------------------------------------------------------------- |
| `composables/useSpecificationPresign.js` | 呼叫 `GET /api/documents/specifications/presign`，組出 `fileServiceBaseUrl + /storage/... + ?dl=`。 |
| `pages/products/[code].vue`              | 「下載規格」：未登入開 `LoginDialog`；登入後走 `buildSignedSpecificationUrl`，`window.open` 新分頁。               |
| `pages/documents/open.vue`               | 後端 302 帶入 `?path=/storage/...`：說明文案 + `LoginDialog`，登入後 `location.assign` 到簽章網址。              |
| `i18n`                                   | `documents.open.`*（`zh/en/common.json`）。                                                      |


## 後端（Express，`d:\web\yenshow\server`）


| 項目                                     | 說明                                                                                                                                                     |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `routes/documents.js`                  | `GET /api/documents/specifications/presign`：驗 JWT、確認 `documentUrl` 屬於該產品、寫入 `DocumentDownloadToken`、回傳 `storagePath` + HMAC token（payload 含 `jti`、過期）。 |
| `middlewares/signedStorageDownload.js` | 掛在 `/storage` 靜態檔之前：路徑符合 `products/*/documents/*.pdf` 時必須有有效 `dl`；失敗時瀏覽器導向 `FRONTEND_PUBLIC_URL`（預設官網）`/documents/open?path=...`，否則 `403` JSON。        |
| `utils/storageDownloadSign.js`         | HMAC 簽章 / 驗簽（`LICENSE_SIGN_SECRET`）。                                                                                                                   |
| `models/DocumentDownloadToken.js`      | 記錄 `jti`、消耗時間 `usedAt`、TTL 清理。                                                                                                                         |
| `app.js`                               | 掛載 `/api/documents` 與 `signedStorageDownloadMiddleware`。                                                                                               |


## 環境變數

- `LICENSE_SIGN_SECRET`：簽章必填。
- `FRONTEND_PUBLIC_URL`（可選）：302 導向的官網基底，預設 `https://www.yenshow.com`。

## 行為摘要

1. 產品頁或 `/documents/open`：登入 → presign → 開啟帶 `?dl=` 的 URL。
2. 第一次成功 GET PDF 會消耗 DB 中該 `jti`；短時間內允許 `Range` 後續請求（避免 PDF 讀取失敗）。
3. 無 `dl` 或憑證無效：瀏覽器 → 302 到 `/documents/open`；純 JSON 客戶端 → 403 JSON。

