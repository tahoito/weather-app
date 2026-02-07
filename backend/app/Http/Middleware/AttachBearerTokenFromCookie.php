<?php 

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AttachBearerTokenFromCookie
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->bearerToken()) {
            $token = $request->cookie('auth_token'); // ← cookie名はこれで統一

            if (is_string($token) && $token !== '') {
                $value = 'Bearer ' . $token;

                // Header bag
                $request->headers->set('Authorization', $value);

                // Symfonyが参照する可能性がある方もセット
                $request->server->set('HTTP_AUTHORIZATION', $value);
            }
        }

        return $next($request);
    }
}
