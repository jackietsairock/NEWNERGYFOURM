# 2026 今周刊第十屆新能源國際論壇

以 Vue 3 與 Vite 建置的單頁活動官網，主題為「算力爆發大挑戰・台灣能源轉型新思維」，包含論壇介紹、講者、議程、報名表單與活動回顧。

- 正式網址：<https://events.businesstoday.com.tw/2026/NEWNERGYFOURM/>
- 正式部署路徑：`/2026/NEWNERGYFOURM/`

## 技術棧

- Vue 3
- Vite 6
- Tailwind CSS 4（透過 `@tailwindcss/vite`）
- Sass
- AOS
- v-slick-carousel

## 環境需求

- Node.js 18 以上（建議使用 LTS）
- npm 9 以上

## 開發指令

安裝套件：

```bash
npm install
```

啟動開發伺服器：

```bash
npm run dev
```

建置正式版：

```bash
npm run build
```

在本機預覽正式版：

```bash
npm run preview
```

## 專案結構

```text
NEWNERGYFOURM/
├─ public/                    # 不經轉換、直接複製的靜態檔案
├─ src/
│  ├─ assets/
│  │  ├─ image/            # 網站圖片素材
│  │  ├─ json/             # 頁面與講者內容
│  │  └─ scss/             # 樣式資源
│  ├─ components/           # 各頁面區塊的 Vue 元件
│  ├─ seo/                  # Meta、JSON-LD、sitemap 與 robots 邏輯
│  ├─ utils/                # 共用工具
│  ├─ App.vue               # 首頁區塊組裝
│  ├─ main.js               # Vue 入口
│  └─ style.css            # 全站樣式
├─ index.html
├─ vite.config.js              # Vite、部署路徑與 SEO 產物設定
└─ package.json
```

## 內容維護

主要內容由 JSON 管理：

- `src/assets/json/info.json`：選單、前言、議程、報名、交通與 Footer 等內容
- `src/assets/json/speaker.json`：講者資料

`info.json` 內的 `cmsType` 會用來對應 `App.vue` 的頁面區塊，調整時請保留現有值。圖片素材放在 `src/assets/image/`。

交通區塊目前由 `src/App.vue` 的 `showTrafficSection` 設為 `false` 而隱藏。

## SEO 設定

SEO 主要設定位於 `src/seo/siteSeo.js`，包含：

- Meta title、description 與 keywords
- Canonical 與 hreflang
- Open Graph 與 Twitter Card
- Organization、WebSite、WebPage、Event 與講者 JSON-LD
- `sitemap.xml` 與 `robots.txt` 內容

Vite 會在建置時把 SEO 標籤寫入 `dist/index.html`，並產生 `dist/sitemap.xml` 與 `dist/robots.txt`。前端啟動後也會由 `src/seo/applySeo.js` 套用相同設定。

分享圖與網站圖示位於：

- `public/fb-share.jpg`
- `public/favicon.png`

## 報名表單 API

報名送出邏輯位於 `src/components/SignUp.vue` 的 `sign_up()`。

目前程式使用測試站 API：

```text
http://events-kenny.businesstoday.com.tw/backend/SDGsforum2026/sign_up
```

正式上線前請向後端確認新能源論壇專用的 HTTPS API 網址並更新 `url`，否則 HTTPS 頁面可能因 Mixed Content 而阻擋 HTTP 請求。

報名欄位的 `inputName` 會對應後端接收欄位，未同步調整後端時請勿任意修改。

## 部署

`vite.config.js` 依模式使用不同 base path：

- 開發環境：`/`
- 正式環境：`/2026/NEWNERGYFOURM/`

正式部署時，伺服器掛載路徑必須與 base path 一致，否則 JavaScript、CSS 與圖片路徑會失效。

## 其他備註

- 專案目前沒有測試框架與 lint 流程。
- `dist/` 是正式建置產物，已列入 `.gitignore`。
- 修改 SEO、頁面內容或圖片後，建議在上線前重新執行 `npm run build`。
