<?php

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\AreaController;
use App\Http\Controllers\Api\SpotSearchController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\SpotController;


Route::post('/sign-up-login/signup', function (Request $request){
    $validated = $request->validate([
        'auth.email' => ['required', 'email', Rule::unique('users', 'email')],
        'auth.password' => ['required', 'min:8'],
    ]);

    $user = User::create([
        'name' => 'No Name',
        'email' => $validated['auth']['email'],
        'password' => Hash::make($validated['auth']['password']),
    ]);


    return response()->json([
        'success' => true,
        'message' => 'created',
        'authToken' => 'dummy-token',
    ]);
});


Route::post('/sign-up-login/login', function (Request $request){
    $validated = $request->validate([
        'auth.email' => ['required','email'],
        'auth.password' => ['required'],
    ]);

    $email = $validated['auth']['email'];
    $password = $validated['auth']['password'];

    $user = User::where('email',$email)->first();

    if (!$user || !Hash::check($password, $user->password)) {
        return response()->json([
            'success' => false,
            'message' => 'メールアドレスかパスワードが違います',
            'authToken' => '',
        ],401);
    }

    return response()->json([
        'success' => true,
        'message' => 'ok',
        'authToken' => 'dummy-token-login',
    ]);
});

Route::get('/areas',[AreaController::class,'index']);
Route::get('/spots/search',[SpotSearchController::class,'index']);
Route::get('/favorites',[FavoriteController::class,'index']);
Route::post('/favorites',[FavoriteController::class,'store']);
Route::delete('/favorites/{spot}',[FavoriteController::class,'destroy']);
Route::get('/tags', [TagController::class,'index']);
Route::get('/spots/recommended', [SpotController::class, 'recommended']);
Route::get('/spots',[SpotController::class,'index']);
Route::get('/spot/{spot}',[SpotController::class,'show']);
Route::get('/spots/in-bounds',[SpotController::class,'inBounds']);
