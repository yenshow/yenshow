# Interactive 整合｜Preflight 紀錄（2026-11-03）

## 風險 A：API 路徑

- 本機 `.env`：`API_BASE_URL=https://api.yenshow.com`（直連 API 網域，非同網域 `/api` proxy）。
- 前端 `useApi` 以 `runtimeConfig.public.apiBaseUrl` 為 base；contact 請求路徑為 `/api/contact`。
- 因此正式／本機常見路徑為：`https://api.yenshow.com/api/contact`，**不依賴** Vercel rewrite 是否保留 `/api` 前綴。
- `vercel.json` 的 `/api/:path*` → `https://api.yenshow.com/:path*` 僅在 `apiBaseUrl` 為相對 `/api` 時生效；**本次不修改 vercel.json**（未證實 production 故障）。

## 風險 B：Preview 301

- 已將 `server/middleware/redirects.ts` 網域強制條件由 `NODE_ENV === "production"` 改為 `VERCEL_ENV === "production"`。
- Preview／development 不再被導向 `www.yenshow.com`。
