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
