<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\AreaController;
use App\Http\Controllers\Api\SpotSearchController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\SpotController;

Route::post('/sign-up-login/signup', function (Request $request){
    $validated = $request->validate([
        'email' => ['required', 'email', 'max:255', 'unique:user,email'],
        'password' => ['required', 'min:8'],
    ]);

    $user = User::create([
        'name' => 'No Name',
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']),
    ]);

    return response()->json([
        'success' => true,
        'message' => 'created',
        'authToken' => 'dummy-token',
    ]);
});

Route::post('/sign-up-login/login', function (Request $request){
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
