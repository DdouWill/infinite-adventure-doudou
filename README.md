# 無限冒險：終端異界

一個以早期文字型網頁 RPG 為靈感、但重新設計內容與介面的純 HTML/CSS/JS 小型專案。第一版不需要後端，玩家進度存在瀏覽器 `localStorage`，可直接部署到 Cloudflare Pages Free Plan。

## 功能

- 角色建立：名稱、屬性、職業出身。
- 戰鬥：地圖選擇、怪物遭遇、經驗、熟練、金錢、掉寶、升級。
- 原版圖像：角色 No.1–No.70 與怪物 1–5 使用 BadGameShow 公開原站 GIF，本地保存避免 hotlink。
- 休息：花金幣恢復 HP / MP。
- 裝備：商店購買、背包裝備、攻防加成。
- 任務：討伐任務進度與獎勵。
- 世界：國家勢力、城鎮、排行榜展示。
- 本機帳號：帳密只在此瀏覽器驗證，密碼保存為加鹽 SHA-256 摘要；不同帳號使用獨立角色存檔。
- 存檔：localStorage 自動保存、上一份有效備份、嚴格 JSON 匯入驗證與舊版存檔移轉。
- RWD：桌機與手機都可操作。

## 本機使用

```bash
npm install
npm run check
python3 -m http.server 4173
```

打開：

```txt
http://127.0.0.1:4173
```

## Cloudflare Pages Free tier 部署

本專案已固定走 **Cloudflare Pages Free tier / 純靜態部署**：

- 不使用 Pages Functions。
- 不使用 D1、KV、R2、Queues、Durable Objects 或 Workers paid features。
- 只輸出 `dist/` 靜態檔案。
- 使用 `_headers` 提供 CSP 與基本安全標頭。
- `wrangler.toml` 只設定 `pages_build_output_dir = "dist"`。

### Cloudflare Pages 後台建議設定

| 項目 | 值 |
|---|---|
| Framework preset | None |
| Build command | `npm run check` |
| Build output directory | `dist` |
| Root directory | `/` |

`npm run check` 會執行語法檢查、單元測試、inline script/style 檢查、Free tier 靜態部署檢查，並產生 `dist/`。`npm run check:full` 會再加跑 Playwright 桌機／手機 smoke，可直接作為 CI gate。`docs/github-actions-ci.yml.example` 提供 GitHub Actions 範例。

### Google OAuth（選用）

把 `index.html` 的 `google-oauth-client-id` meta content 設成部署網域對應的 Client ID。未設定時 Google 按鈕會停用，也不會下載 Google SDK；設定後只在使用者開啟授權時按需載入。

> 本機帳號與 Google session 都只是純靜態單機身份分區，不是伺服器安全邊界。真正多人帳號仍需後端驗證 token、建立 server session 並把角色綁定伺服器 identity。

> 目前 Cloudflare Pages 專案若沒有設定 Build command，仍會直接讀取 repo 內已提交的 `dist/`。因此本 repo 會提交 `dist/` 作為 no-build 部署保底；若你在 Cloudflare 後台把 Build command 設為 `npm run check`，Cloudflare 也會在部署前重新產生同一份 `dist/`。

### Wrangler CLI 部署

非互動環境需要先登入 Cloudflare 或設定 `CLOUDFLARE_API_TOKEN`，再執行：

```bash
npm run deploy:cf:free
```

如果只想本機確認 Free tier 靜態部署設定：

```bash
npm run check:cloudflare-free
```

### 靜態安全設定

`_headers` 已包含：

- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy`
- `Permissions-Policy`
- `frame-ancestors 'none'`

## 專案結構

```txt
.
├── index.html
├── _headers
├── robots.txt
├── assets/
│   ├── app.js
│   ├── game-core.js
│   ├── local-accounts.js
│   ├── storage.js
│   └── styles.css
├── docs/
│   └── github-actions-ci.yml.example
├── wrangler.toml
├── scripts/
│   ├── build.mjs
│   ├── check-cloudflare-free.mjs
│   ├── check-inline.mjs
│   ├── run-smoke.mjs
│   └── smoke.mjs
└── tests/
    ├── game-core.test.mjs
    ├── local-accounts.test.mjs
    └── storage.test.mjs
```

## 後續可擴充方向

第二版若要多人同步，可加入 Cloudflare Pages Functions + D1：

- `/api/register`：建立角色。
- `/api/login`：登入。
- `/api/battle`：伺服器端戰鬥判定。
- `/api/ranking`：排行榜。
- D1：角色、物品、戰鬥紀錄。
- KV：線上狀態與短期排行快取。

目前第一版刻意保持純靜態，方便快速部署與驗證玩法手感。
