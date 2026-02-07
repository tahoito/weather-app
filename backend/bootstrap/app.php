<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Middleware;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'cookie.bearer' => \App\Http\Middleware\AttachBearerTokenFromCookie::class,
        ]);

        // auth より先に cookie.bearer を確実に動かす
        $middleware->priority([
            \App\Http\Middleware\AttachBearerTokenFromCookie::class,
            \Illuminate\Auth\Middleware\Authenticate::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (Request $request, RouteNotFoundException $e) {
            if ($request->is('api/*') && str_contains($e->getMessage(), 'Route [login] not defined')) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            return null;
        });
    })->create();
