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
- 存檔：localStorage 自動保存，可手動匯出 / 匯入 JSON。
- RWD：桌機與手機都可操作。

## 本機使用

```bash
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

`npm run check` 會執行語法檢查、單元測試、inline script/style 檢查、Free tier 靜態部署檢查，並產生 `dist/`。

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
│   └── styles.css
├── wrangler.toml
├── scripts/
│   ├── build.mjs
│   ├── check-cloudflare-free.mjs
│   └── check-inline.mjs
└── tests/
    └── game-core.test.mjs
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
