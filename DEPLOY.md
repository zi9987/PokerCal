# PokerCal 部署指南

## 🚀 Vercel 部署步驟

### 1. 推送到 GitHub
```bash
# 如果還沒有遠程倉庫，創建一個新的 GitHub 倉庫，然後：
git remote add origin https://github.com/你的用戶名/pokercal.git
git branch -M main
git push -u origin main
```

### 2. Vercel 部署
1. 前往 https://vercel.com
2. 使用 GitHub 登入
3. 點擊 "New Project"
4. 選擇你的 PokerCal 倉庫
5. 配置設定：
   - **Framework Preset**: Create React App
   - **Root Directory**: `./` (保持預設)
   - **Build Command**: `npm run build` (保持預設)
   - **Output Directory**: `build` (保持預設)

### 3. 環境變數設定
在 Vercel 項目設定中，添加以下環境變數：

```
REACT_APP_FIREBASE_API_KEY=AIzaSyBQXGD-Ofc_Eba2EJ2SaWdj4XW8uLN9Nus
REACT_APP_FIREBASE_AUTH_DOMAIN=pokercal-58dab.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://pokercal-58dab-default-rtdb.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=pokercal-58dab
REACT_APP_FIREBASE_STORAGE_BUCKET=pokercal-58dab.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=622703743900
REACT_APP_FIREBASE_APP_ID=1:622703743900:web:60431ee41da1f756732e59
REACT_APP_FIREBASE_MEASUREMENT_ID=G-3W16S4GSF9
```

### 4. 部署
點擊 "Deploy" 按鈕，Vercel 會自動：
- 從 GitHub 拉取代碼
- 安裝依賴
- 構建項目
- 部署到 CDN

### 5. 取得網址
部署完成後，你會得到一個像這樣的網址：
`https://pokercal-用戶名.vercel.app`

## 🔄 自動部署
之後每次推送到 GitHub main 分支，Vercel 會自動重新部署！

## 🌍 自定義域名（可選）
在 Vercel 項目設定中，你可以添加自己的域名。