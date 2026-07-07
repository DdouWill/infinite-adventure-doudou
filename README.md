# 無限冒險-豆豆版

一個以早期文字型網頁 RPG 為靈感、但重新設計內容與介面的純 HTML/CSS/JS 小型專案。第一版不需要後端，玩家進度存在瀏覽器 `localStorage`，可直接部署到 Cloudflare Pages Free Plan。

## 功能

- 角色建立：名稱、屬性、職業出身。
- 戰鬥：地圖選擇、怪物遭遇、經驗、熟練、金錢、掉寶、升級。
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

## Cloudflare Pages 部署

### 建議設定

| 項目 | 值 |
|---|---|
| Framework preset | None |
| Build command | `npm run check` |
| Build output directory | `dist` |
| Root directory | `/` |

`npm run check` 會執行語法檢查、單元測試、inline script/style 檢查，並產生 `dist/`。

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
├── scripts/
│   ├── build.mjs
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
