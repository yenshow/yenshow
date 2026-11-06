# YenShow 官網現況與架構說明（integration-audit）

| 欄位 | 內容 |
|---|---|
| 版本 | 1.1 |
| 日期 | 2026-11-03 |
| 文件性質 | **現況事實與架構資訊**（不含實作建議；整合由對方主導） |
| 交辦來源 | `YenShow_Interactive_Security_Handoff_20261103` |
| 公開官網 | `C:\Users\Yenshow Server\Desktop\yenshow`（套件名 `yenshow-website`） |
| API／後台 | `D:\web\yenshow` |
| 正式網域 | `https://www.yenshow.com` |
| API 網域 | `https://api.yenshow.com` |

本文件回答交辦包對「現有官網」的盤點問題：框架、路由、部署、認證、API、聯絡／CRM、品牌與目錄結構。

---

## 1. 程式資產對照

| 路徑 | 是什麼 | 技術 |
|---|---|---|
| `YenShow_Interactive_Security_Handoff_20261103` | 互動示範站＋規格文件 | 原生 HTML / ES Module / CSS |
| `Desktop\yenshow` | 正式公開官網前端 | Nuxt 3 + Vue 3 + Tailwind + Pinia + i18n |
| `D:\web\yenshow` | 管理後台前端 + 共用 API | client：Vue 3 + Vite；server：Express + MongoDB |

公開官網與 API 為**兩個 repo／兩套程式**。瀏覽器對官網打 `/api/*` 時，由 Vercel rewrite 轉到 `api.yenshow.com`。

---

## 2. 公開官網（Nuxt）— 問答

### 2.1 框架與執行

| 問題 | 答案 |
|---|---|
| 框架？ | Nuxt `^3.15.4`、Vue 3、`@nuxtjs/tailwindcss`、`@pinia/nuxt`、`@nuxtjs/i18n` |
| 主要設定檔？ | `nuxt.config.ts`、`tailwind.config.js`、`vercel.json`、`package.json` |
| 開發指令？ | `npm run dev` → `0.0.0.0:3001` |
| 建置指令？ | `npm run build` / `npm run preview`（本文件不執行 build） |
| Git remote（package.json）？ | `https://github.com/Inori0107/yenshow_website.git` |

### 2.2 語系與 SEO

| 問題 | 答案 |
|---|---|
| i18n 策略？ | `prefix_except_default`；預設 `zh`（無 prefix），英文為 `/en/...` |
| locale 檔位置？ | `i18n/locales/zh/*.json`、`i18n/locales/en/*.json`（於 `nuxt.config.ts` 註冊） |
| Sitemap／Robots？ | `@nuxtjs/sitemap`、`@nuxtjs/robots` |
| 分析？ | `nuxt-gtag`，id `G-K9YP86ZDRP` |
| 頁面 SEO helper？ | `composables/usePageSeo.js` |
| 站點常數 URL？ | `nuxt.config.ts` 內 `SITE_URL = https://www.yenshow.com` |

### 2.3 部署與反向代理

| 問題 | 答案 |
|---|---|
| 託管？ | Vercel |
| `/api/:path*`？ | rewrite → `https://api.yenshow.com/:path*`（`vercel.json`） |
| `/storage/:path*`？ | rewrite → `https://api.yenshow.com/storage/:path*` |
| Production 網域？ | `server/middleware/redirects.ts`：非 HTTPS 或非 `www.yenshow.com` 時 301 導向正式網域 |
| Runtime API base？ | `runtimeConfig.public.apiBaseUrl`（預設 `/api`） |

### 2.4 Layout、導覽、品牌

| 問題 | 答案 |
|---|---|
| 預設 layout？ | `layouts/default.vue`：背景圖 + `<main>` + Footer |
| 有全站頂部 Header 嗎？ | **沒有** |
| 首頁導覽？ | `components/Home/HeroPic.vue` 區塊錨點：`story` / `products` / `cases` / `news` |
| Footer 連結來源？ | `layouts/default.vue` 內 `linkCTA`（關於＋產品系列） |
| 品牌 LOGO？ | `public/logo/`（如 `yenshow.svg`、`yenshow-logo.webp`、`yenshow-icon.svg`） |
| 視覺主色？ | 品牌綠／primary、emerald 系（Tailwind + `assets/css/global.css`） |
| 根元件？ | `app.vue`（`NuxtLayout` + `NuxtPage` + i18n head） |

### 2.5 認證

| 問題 | 答案 |
|---|---|
| 前端 auth middleware？ | `middleware/auth.js`（檢查 `userStore.isLogin`；可要求 admin） |
| 使用者狀態？ | `stores/userStore.js`（JWT） |
| API 帶 Token？ | `composables/useApi.js` 的 `apiAuth` 加 `Authorization: Bearer …` |
| 公開頁是否需登入？ | 多數公開內容頁不需；middleware 採頁面宣告方式使用 |

### 2.6 現有路由（`pages/`）

```text
/
/contact
/success-stories
/news
/news/[slug]
/faqs
/faqs/[slug]
/products
/products/access-control
/products/surveillance-monitoring
/products/video-intercom
/products/security-solutions
/products/devices-accessories
/products/ysop
/products/ysos
/products/[code]
/solutions/...（含固定頁與 [slug]）
/license/activate
/employees/[slug]
/documents/open
```

| 問題 | 答案 |
|---|---|
| `/interactive` 或子路徑？ | **不存在** |
| `/privacy`？ | **不存在** |
| 門禁相關現有頁？ | `/products/access-control`（產品型錄；`SERIES_ID = 67ed0512296210e234e0de10`） |
| 監控相關現有頁？ | `/products/surveillance-monitoring`（產品型錄） |
| 平台頁？ | `/products/ysop`、`/products/ysos`；資料見 `data/platformProducts.js` |
| 方案頁資料？ | `data/solutions.js`、`data/solutionsMetaEn.js` |
| 洽詢頁？ | `/contact` → `pages/contact.vue` |

### 2.7 前端目錄結構（重點）

```text
yenshow/
├─ app.vue
├─ nuxt.config.ts
├─ vercel.json
├─ pages/                 # 檔案式路由
├─ components/
│  ├─ Home/
│  ├─ products/
│  ├─ solutions/
│  ├─ faqs/
│  ├─ license/
│  └─ common/
├─ composables/           # useApi, usePageSeo, useProductSeries…
├─ stores/                # user, hierarchy, news, products…
├─ data/                  # solutions, platformProducts, employees
├─ layouts/default.vue
├─ middleware/auth.js
├─ i18n/locales/{zh,en}/
├─ server/middleware/redirects.ts
├─ public/                # logo, solutions 圖等
└─ assets/css/
```

### 2.8 前端如何呼叫 API

- 入口：`composables/useApi.js`
- 實例：`api`（一般）、`apiAuth`（JWT）
- GET 會自動加 query `lang`；非 GET 的 JSON body 也會帶 `lang`
- 實體包裝：`entityApi()`、`hierarchyApi()`
- 聯絡表單實際呼叫：`pages/contact.vue` → `api.post("/api/contact", formData, …)`

---

## 3. API／後台（`D:\web\yenshow`）— 問答

### 3.1 結構

```text
D:\web\yenshow/
├─ client/          # 管理後台（Vue 3 + Vite + Pinia + Tailwind）
├─ server/          # Express API
│  ├─ app.js        # 掛載路由、CORS、helmet、靜態 /storage
│  ├─ routes/
│  ├─ controllers/
│  ├─ models/
│  ├─ services/
│  └─ middlewares/
└─ docker-compose.yml
```

| 問題 | 答案 |
|---|---|
| 後台前端路由？ | `client/src/router/index.js`（login、產品系列、內容管理、admin、licenses、comeo…；需登入） |
| API 進入點？ | `server/app.js` → `configureRoutes` |
| DB？ | MongoDB（docker-compose 服務 `mongodb`） |
| 公開站 URL env 例？ | `PUBLIC_SITE_URL` 預設 `https://www.yenshow.com` |
| 公開 API URL env 例？ | `PUBLIC_BASE_URL` 預設 `https://api.yenshow.com` |

### 3.2 已掛載 API（`server/app.js`）

| 掛載 | 檔案 |
|---|---|
| `/api/line` | `routes/line.js`（在 json parser 前） |
| `/api/hub` | `routes/hub.js` |
| `/api/license` | `routes/license.js` |
| `/api/crm/licenses` | `routes/crmLicenses.js` |
| `/api/users` | `routes/user.js` |
| `/api/faqs` | `routes/faq.js` |
| `/api/news` | `routes/news.js` |
| `/api/documents` | `routes/documents.js` |
| `/api`（hierarchy／products…） | `routes/hierarchyRoutes.js` |
| `/api`（contact） | `routes/contactRoutes.js` |
| `/api`（caseStudy） | `routes/caseStudy.js` |
| `/api/seo` | `routes/seo.js` |
| `/storage` | 靜態＋簽章下載 middleware |
| `GET /api/ping` | health |

### 3.3 聯絡表單（現況）

| 問題 | 答案 |
|---|---|
| 端點？ | `POST /api/contact` |
| Route？ | `server/routes/contactRoutes.js` |
| Controller？ | `server/controllers/common/contactController.js` |
| 行為？ | 驗證欄位後 `sendContactEmail`（Email）；成功後刪暫存上傳檔 |
| 成功是否回 `lead_id`？ | **否** |
| 是否寫入 CRM 商機？ | **否**（就現行程式而言） |

### 3.4 產品階層 API（摘要）

來源：`server/routes/hierarchyRoutes.js`

- 公開可讀（含 `Permissions.PUBLIC`）：`/api/hierarchy`、`/api/series`、`/api/categories`、`/api/subCategories`、`/api/specifications`、`/api/products` 等 GET
- 寫入需 auth + ADMIN/STAFF

### 3.5 既有 CRM 相關（現況）

| 路徑 | 現況用途 |
|---|---|
| `/api/crm/licenses` | CRM ↔ 授權相關 |
| `/api/hub` | LINE ID token、訂單／服務單 Hub |
| 環境變數例 | `CRM_LICENSE_API_TOKEN`、`CRM_API_BASE_URL`、`CRM_CA_FILE` 等 |

| 問題 | 答案 |
|---|---|
| `POST /api/public/solution-leads`？ | **不存在** |
| 公開「方案洽詢商機」API？ | **不存在** |
| 前端手冊中的 CRM lead 開關對應後端？ | 交辦包 `config.mjs` 的 `publicLeadEnabled` 目前為 `false`；官網／API **尚未接此端點** |

---

## 4. 交辦包路徑 vs 官網現況（事實對照）

| 交辦包 IA | 官網／API 現況 |
|---|---|
| `/interactive` | 無此路由 |
| `/interactive/access` | 無；相近內容為型錄 `/products/access-control` |
| `/interactive/cctv` | 無；相近內容為型錄 `/products/surveillance-monitoring` |
| `/interactive/sales` | 無 |
| `/interactive/academy` | 無 |
| `/consultation` | 無此路徑；現有洽詢為 `/contact` + `POST /api/contact`（Email） |
| `/privacy` | 無 |
| 公開 lead API + `lead_id` | 無 |
| 交辦示範計算 | 在 handoff `site/assets/js/model.mjs`；**尚未**進入 Nuxt repo |

---

## 5. 交辦包本身（對方交付物現況）

| 項目 | 位置／內容 |
|---|---|
| 示範頁 | `site/index.html`、`access.html`、`cctv.html`、`sales.html`、`training.html` |
| 計算核心 | `site/assets/js/model.mjs` |
| 門禁／CCTV UI 邏輯 | `access.mjs`、`cctv.mjs` 等 |
| CRM 前端設定 | `site/assets/js/config.mjs`（`publicLeadEnabled: false`） |
| 提交適配 | `site/assets/js/api-adapter.mjs`（要求同網域相對路徑、回應含 `lead_id`） |
| API 規格例 | `examples/openapi-public-lead.yaml`、`examples/crm-lead.example.json` |
| 測試 | `npm test`、`tests/static_integrity.py` |
| 整合說明（對方文件） | handoff `docs/11_網站整合與部署.md` 等 |

---

## 6. 關鍵檔案索引（方便對方 agent 查閱）

### 公開官網

| 主題 | 路徑 |
|---|---|
| Nuxt 設定 | `nuxt.config.ts` |
| Vercel／API proxy | `vercel.json` |
| Layout／Footer | `layouts/default.vue` |
| 首頁 | `pages/index.vue`、`components/Home/*` |
| 洽詢 | `pages/contact.vue` |
| 門禁型錄 | `pages/products/access-control.vue` |
| 監控型錄 | `pages/products/surveillance-monitoring.vue` |
| API client | `composables/useApi.js` |
| Auth | `middleware/auth.js`、`stores/userStore.js` |
| 網域 redirect | `server/middleware/redirects.ts` |
| 方案靜態資料 | `data/solutions.js` |

### API／後台

| 主題 | 路徑 |
|---|---|
| 路由掛載 | `D:\web\yenshow\server\app.js` |
| Contact | `server/routes/contactRoutes.js`、`server\controllers\common\contactController.js` |
| 產品階層 | `server/routes/hierarchyRoutes.js` |
| CRM 授權 | `server/routes/crmLicenses.js` |
| Hub | `server/routes/hub.js` |
| 後台路由 | `D:\web\yenshow\client\src\router\index.js` |
| Compose | `D:\web\yenshow\docker-compose.yml` |

---

## 7. 補充事實（有／無）

| 項目 | 有／無 |
|---|---|
| 正式品牌 LOGO 於官網 `public/logo` | 有 |
| 全站頂部導覽列 | 無 |
| `/interactive*` | 無 |
| `/privacy` | 無 |
| `POST /api/contact`（Email） | 有 |
| `POST /api/public/solution-leads` | 無 |
| 官網內嵌 handoff `site/` 靜態檔 | 無 |
| 官網與 API 分離部署 | 有（Vercel ↔ api.yenshow.com） |
| zh／en 雙語 | 有 |
| JWT 使用者體系（後台／部分前台能力） | 有 |
| 交辦包所述業務／訓練正式 RBAC＋成績持久化 | 無（就現有官網／API 程式而言） |
