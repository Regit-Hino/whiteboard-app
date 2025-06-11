# オンラインホワイトボードアプリ

リアルタイムで複数人が同時に描画できるオンラインホワイトボードアプリです。

## 構成

- **Server**: Node.js + Express + Socket.io (Heroku)
- **Client**: Next.js + React + TypeScript (Vercel)

## セットアップ

### サーバー側 (Heroku)

1. Herokuアカウントを作成
2. Heroku CLIをインストール
3. サーバーディレクトリで以下を実行:

```bash
cd server
npm install
heroku create your-app-name
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a your-app-name
git push heroku main
```

### クライアント側 (Vercel)

1. Vercelアカウントを作成
2. クライアントディレクトリで以下を実行:

```bash
cd client
npm install
```

3. `.env.local`ファイルを作成し、HerokuのURLを設定:
```
NEXT_PUBLIC_SERVER_URL=https://your-app-name.herokuapp.com
```

4. Vercelにデプロイ:
```bash
npm install -g vercel
vercel
```

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