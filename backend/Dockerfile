FROM php:8.4-cli

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    git unzip libzip-dev libpng-dev libpq-dev \
 && docker-php-ext-configure zip \
 && docker-php-ext-install pdo_pgsql pgsql zip \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /backend

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY . .

RUN composer install

RUN chmod -R 775 storage bootstrap/cache || true

EXPOSE 8000
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
