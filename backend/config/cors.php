<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://weather-app-i2no.vercel.app',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'supports_credentials' => true,

    'max_age' => 0,

    // ✅ Bearerトークン運用なら基本 false でOK（Cookie送らないから）
    'supports_credentials' => false,
];
