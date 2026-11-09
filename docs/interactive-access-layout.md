# Interactive Studio 統一版面藍圖

> 權威參考：`/interactive/access`  
> 用途：CCTV、第二期規劃模組對齊**殼層與節奏**；各系統內容／拓撲可不同。

---

## 1. 設計原則

1. **左舞台／右旁軌**：架構圖為主視覺；說明、情境、試算放右側。
2. **大螢幕固定工作室高度**：左圖高度穩定；右側過長時在 `rail` 內捲動。
3. **單一操作導引**：Tab 下方一條綠色提示，依模式切換；勿在頁首／圖上／內文重複同一句。
4. **結構與文案分離**：拓撲／routes／計算邏輯放 data／utils；顯示字串走 i18n。
5. **架構圖要有資訊密度**：分層欄位、卡片（標籤＋標題＋一句說明）、線材類型圖例、點狀底圖——避免「色塊＋短字」太陽春示意。

---

## 2. 頁面組成（必套）

| 層級 | 元件 | 職責 |
|------|------|------|
| 頁殼 | `InteractivePageShell` | 背景、container、`padding-class`／`main-class` |
| 頁首 | `InteractivePageHeader` | 返回、標題、lead（可選 badge） |
| 工作室 | `InteractiveStudioShell` | 左 `#stage` + 右 `#rail`；Tab、導引、行動版收合圖 |
| 模組組裝 | `AccessStudio` / `CctvStudio` / … | 只負責組狀態與塞 slot，不重做殼 |

### 頁面範本（Access／CCTV 相同節奏）

```vue
<InteractivePageShell main-class="space-y-3 md:space-y-4" padding-class="py-3 sm:py-4 md:py-5">
  <InteractivePageHeader :title="..." :lead="..." :back-label="..." />
  <XxxStudio />
</InteractivePageShell>
```

---

## 3. InteractiveStudioShell 契約

**Props**

| Prop | 說明 |
|------|------|
| `tabs` | `{ id, label }[]` |
| `activeTab` + `update:activeTab` | 目前模式 |
| `guide` | 目前模式一句導引 |
| `stageHidden` + `update:stageHidden` | 行動版收合左圖 |
| `showStageLabel` / `hideStageLabel` | 收合按鈕文案 |
| `density` | `compact` \| `default` \| `tall` |
| `idPrefix` | Tab／panel id 前綴（a11y） |
| `collapsible` | 是否顯示行動版收合（規劃頁可 `false`） |

**Slots**

- `#stage`：架構圖／主視覺  
- `#rail`：目前 Tab 內容  
- `#rail-header`（可選）

**斷點（現行）**

| density | lg 高度 | xl 高度 |
|---------|---------|---------|
| compact | `min(64vh,34rem)` | `min(68vh,38rem)` |
| default | `min(68vh,36rem)` | `min(72vh,42rem)` |
| tall | `min(76vh,44rem)` | `min(78vh,48rem)` |

欄寬：`lg: 1.25fr + 22–30rem` → `xl: 1.3fr + 24–34rem`（右軌加寬，避免說明／試算過窄）。

---

## 4. Access 現況（對照用）

| Tab | 左圖 | 右軌 |
|-----|------|------|
| `learn` | 點節點選取（並切回此模式） | 設備說明 |
| `scenario` | 路徑高亮＋線流動畫 | 情境步驟／狀態 |
| `plan` | 數量 badge；欄位 focus 高亮 | 規模 → 清單 → 輸出／洽詢 |

狀態：`composables/useAccessStudio.js`（provide／inject）。  
圖：`AccessDiagram.vue`（四欄門禁決策鏈＋四種線材圖例）。

### 架構圖視覺（對齊「質感」，拓撲各自獨立）

| 欄（Access） | 內容 | 欄（CCTV） | 內容 |
|--------------|------|------------|------|
| 現場辨識 | 人臉機 | 前端採集 | IPC |
| 決策與平台 | 平台＋控制器 | 接入／PoE | PoE |
| 門區執行 | 電鎖／門磁／出門 | 錄影／核心 | 核心網＋NVR |
| 安全與備援 | 消防／電源 | 平台／監看 | VMS＋監看端 |

Access 線材：藍實線＝控制；紫虛線＝管理；琥珀點線＝電源；紅虛線＝消防。  
CCTV 線材：藍實線＝錄影串流；綠虛線＝即時監看；紫虛線＝管理；琥珀點線＝遠端。  
卡片：`TAG` + 標題 + 一句說明；點狀 grid；底部深色圖例。

---

## 5. CCTV 現況（已對齊殼層／圖質感）

1. **頁面殼** — `InteractivePageShell` + `InteractivePageHeader` + `CctvStudio`。  
2. **`CctvDiagram`** — 四欄（前端採集 → 接入／PoE → 錄影／核心 → 平台／監看）；TAG＋標題＋一句說明；點狀底圖；線材圖例（串流／即時／管理／遠端）；路徑切換高亮；`density="tall"`。  
3. **右軌** — `inspect`（`CctvInspectPanel`）＋ `storage`（`CctvStoragePanel`）；各有一句 `guide_*`。  
4. **i18n** — `cctvContent.js` 僅結構；文案在 `interactive.cctv.*`（devices／views／node_desc／legend）。  
5. **狀態** — `useCctvStudio` provide／inject（viewId、selectedDevice、mode）。  

**不要做**：勿把 CCTV 圖改成門禁節點；拓撲保持影像監控鏈。

---

## 6. i18n 約定

- 結構 data：`data/interactive/*Content.js`  
- 文案：`i18n/locales/{zh,en}/interactive.json`  
- **葉鍵用 `t('a.b.title')`**；`tm()` 取陣列後必須 `rt()` 再渲染。  
- 避免同名鍵既是字串又是物件（Access 曾用 `doors` 當門數、`door_names` 當門區名）。  
- 計算摘要若要雙語：函式接收 `t`（見 `planSummary(plan, t)`）。

---

## 7. 規劃示意頁（非完整 Studio；官網不顯示期次標籤）

四模組：`intercom`／`parking`／`visitor`／`platform`。  
路由：`pages/interactive/[module].vue`（僅 `PLANNED_MODULE_IDS`；其餘 404）。`access`／`cctv` 靜態頁優先。

**官網 UI**：Hub 卡片與模組頁**不**顯示「第二期／規劃中／已可操作」等內部路線圖標籤；六卡統一樣式與「進入模組」CTA。內部 `modules.js` 仍可保留 `status` 供開發區分。資訊架構維持「Hub 目錄 → 各系統獨立路由」，不把六套 Studio 嵌進同一頁。

`PlannedModulePage.vue` + `PlannedModuleDiagram.vue`：

- 左：四欄靜態示意（可點節點）。
- 右：節點說明 + 導向 Access／CCTV CTA（對齊 Access learn 節奏；**不**堆 overview／重點列表）。
- 單一 `guide`（`interactive.planned.guide`）；Header `lead` 承載模組方向（無 badge）。
- `collapsible=false`；**無情境 Tab、無試算、無假操作按鈕**。

結構：`data/interactive/plannedContent.js`；文案：`interactive.planned.{module}.{lead,lanes,nodes,node_desc,devices}`（`devices` 僅 `desc`／`note`，標題用 `nodes`）。

| 模組 | 四欄示意 |
|------|----------|
| intercom | 現場對講 → 通話與管理 → 開門輸出 → 聯動（待核） |
| parking | 車道採集 → 辨識與控制 → 柵欄／感測 → 平台／白名單 |
| visitor | 預約入口 → 核驗／接待 → 證與權限 → 離場與稽核 |
| platform | 子系統接入 → 事件匯流 → 權限／營運 → 多廠區（待核） |

### 升級為完整 Studio（產品核可後再開；本輪不實作）

| 模組 | 建議 tabs | composable | content | diagram |
|------|-----------|------------|---------|---------|
| intercom | learn／call-flow | `useIntercomStudio` | `intercomContent.js` | `IntercomDiagram.vue` |
| parking | learn／release／estimate? | `useParkingStudio` | `parkingContent.js` | `ParkingDiagram.vue` |
| visitor | learn／journey | `useVisitorStudio` | `visitorContent.js` | `VisitorDiagram.vue` |
| platform | learn／integrate | `usePlatformStudio` | `platformContent.js` | `PlatformDiagram.vue` |

升級時仍套本文件殼層契約；勿在核可前加假情境按鈕或宣稱 YSOP／YSCP 未核准能力。

---

## 8. 相關檔案

```
# 共用殼
components/interactive/InteractivePageShell.vue
components/interactive/InteractivePageHeader.vue
components/interactive/InteractiveStudioShell.vue

# Access（參考實作）
pages/interactive/access.vue
components/interactive/AccessStudio.vue
components/interactive/AccessDiagram.vue
components/interactive/AccessLearnPanel.vue
components/interactive/AccessScenarioPanel.vue
components/interactive/AccessPlanner.vue
composables/useAccessStudio.js
data/interactive/accessContent.js
utils/interactive/model.js

# CCTV（對齊 Access 殼層／圖質感）
pages/interactive/cctv.vue
components/interactive/CctvStudio.vue
components/interactive/CctvDiagram.vue
components/interactive/CctvInspectPanel.vue
components/interactive/CctvStoragePanel.vue
composables/useCctvStudio.js
data/interactive/cctvContent.js

# 第二期規劃介紹（靜態示意）
pages/interactive/[module].vue
components/interactive/PlannedModulePage.vue
components/interactive/PlannedModuleDiagram.vue
data/interactive/plannedContent.js
data/interactive/modules.js

# 文案
i18n/locales/zh/interactive.json
i18n/locales/en/interactive.json
```

---

## 9. 刻意不做

- 架構圖不做「門扇開關」動畫。  
- Access 點節點會切回 `learn`（若 CCTV 要「點節點不換 Tab」可自行不同）。  
- 控制器／部分 BOM 維持「待確認」，避免假裝精確。  
- Access 圖是門禁決策鏈，不是全廠 EDGE→PoE 總覽（總覽若需要另開模組）。  
- 四個示意模組不做情境模擬、BOM／儲存試算或假完整互動；官網亦不標示內部開發期次。
