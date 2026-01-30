FROM php:8.4-cli

# 必要パッケージインストール
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
 && docker-php-ext-configure zip \
 && docker-php-ext-install pdo_mysql zip \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# アプリコピー
COPY . .

# 依存インストール（本番想定）
RUN composer install --no-dev --optimize-autoloader

# 権限（Laravelが書き込む場所）
RUN chmod -R 775 storage bootstrap/cache || true

# Railway 用: 公開ポート
EXPOSE 8080

# 起動（Railway は $PORT を渡してくることが多い）
CMD sh -c "php artisan serve --host=0.0.0.0 --port=${PORT:-8080}"