## 開発環境セットアップ

### 1. リポジトリを clone

```bash
git clone https://github.com/tahoito/weather-app.git
cd weather-app

```

### 2. 環境変数ファイル（.env）を作成
📌 Backend（Laravel）
```bash
cp backend/.env.example backend/.env
```

APP_KEY を作成：
```bash
docker compose exec backend php artisan key:generate
```

📌 Frontend（Next.js）
```bash
cp frontend/.env.example frontend/.env.local
```

### 3. Docker起動
```bash
docker compose up --build -d
```
※ 初回だけ --build をつける
（以降は docker compose up -d ）


## 開発フロー

### 1.mainを最新にする
```bash
git checkout main
git pull origin main
```
### 2.ブランチ作成
```bash
git checkout -b feature/機能名
```
### 3.pushする
```bash
git push origin feature/機能名
```


