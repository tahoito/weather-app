<?php

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\WeatherController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\AreaController;
use App\Http\Controllers\Api\SpotSearchController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\SpotController;


Route::post('/sign-up-login/signup', function (Request $request) {
    $validated = $request->validate([
        'auth.email' => ['required', 'email', Rule::unique('users', 'email')],
        'auth.password' => ['required', 'min:8'],
    ]);

    $user = User::create([
        'name' => 'No Name',
        'email' => $validated['auth']['email'],
        'password' => Hash::make($validated['auth']['password']),
    ]);

    $token = $user->createToken('web')->plainTextToken;

    return response()->json([
        'success' => true,
        'message' => 'created',
        'authToken' => $token,
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ],
    ]);
});

Route::post('/sign-up-login/login', function (Request $request) {
    $validated = $request->validate([
        'auth.email' => ['required','email'],
        'auth.password' => ['required'],
    ]);

    $user = User::where('email', $validated['auth']['email'])->first();

    if (!$user || !Hash::check($validated['auth']['password'], $user->password)) {
        return response()->json([
            'success' => false,
            'message' => 'メールアドレスかパスワードが違います',
            'authToken' => '',
        ], 401);
    }

    
    $token = $user->createToken('web')->plainTextToken;

    return response()->json([
        'success' => true,
        'message' => 'ok',
        'authToken' => $token,
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ],
    ]);
});

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', function (Request $request) {
        return response()->json([
            'success' => true,
            'user' => $request->user(),
        ]);
    });

    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'logged out',
        ]);
    });

    Route::get('/weather/current', [WeatherController::class, 'current']);
    Route::get('/areas', [AreaController::class,'index']);
    Route::get('/spots/search', [SpotSearchController::class,'index']);

    Route::get('/favorites', [FavoriteController::class,'index']);
    Route::post('/favorites', [FavoriteController::class,'store']);
    Route::delete('/favorites/{spotId}', [FavoriteController::class,'destroy']);

    Route::get('/tags', [TagController::class,'index']);

    Route::get('/spots/recommended', [SpotController::class,'recommended']);
    Route::get('/spots', [SpotController::class,'index']);
    Route::get('/spot/{spot}', [SpotController::class,'show']);
    Route::get('/spots/in-bounds', [SpotController::class,'inBounds']);
});
