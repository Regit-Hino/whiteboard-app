# オンラインホワイトボードアプリ

リアルタイムで複数人が同時に描画できるオンラインホワイトボードアプリです。

## 構成

- **Server**: Node.js + Express + Socket.io (Render)
- **Client**: Next.js + React + TypeScript (Vercel)

## デプロイ手順

### サーバー側 (Render)

1. **Renderアカウント作成**
   - [render.com](https://render.com)にアクセス
   - GitHubアカウントでサインアップ

2. **新しいWebサービス作成**
   - ダッシュボードで「New +」→「Web Service」を選択
   - GitHubリポジトリを接続（初回はGitHubアカウント連携が必要）

3. **リポジトリ選択**
   - `Regit-Hino/whiteboard-app`を選択
   - 「Connect」をクリック

4. **サービス設定**
   - **Name**: `whiteboard-server`（任意の名前）
   - **Environment**: `Node`
   - **Region**: `Oregon`（最寄りのリージョン選択）
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. **環境変数設定（オプション）**
   - 「Advanced」→「Add Environment Variable」
   - `NODE_ENV`: `production`

6. **デプロイ実行**
   - 「Create Web Service」をクリック
   - 自動でビルド・デプロイが開始されます
   - 完了後、`https://your-service-name.onrender.com`のURLが発行されます

### クライアント側 (Vercel)

1. **Vercelアカウント作成**
   - [vercel.com](https://vercel.com)にアクセス
   - GitHubアカウントでサインアップ

2. **CLIデプロイ**
   ```bash
   cd client
   npm install
   npm install -g vercel
   vercel --yes
   ```

3. **環境変数設定**
   - Vercelダッシュボードで「Settings」→「Environment Variables」
   - `NEXT_PUBLIC_SERVER_URL`: Renderで発行されたサーバーURL

## ローカル開発

### サーバー
```bash
cd server
npm install
npm run dev
```

### クライアント
```bash
cd client
npm install
npm run dev
```

## 機能

- リアルタイム描画同期
- 色の変更
- ブラシサイズ調整
- キャンバスクリア
- 複数人同時描画