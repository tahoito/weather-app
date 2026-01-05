<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\AreaController;
use App\Http\Controllers\Api\SpotSearchController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\SpotController;

Route::get('/areas',[AreaController::class,'index']);
Route::get('/spots/search',[SpotSearchController::class,'index']);
Route::get('/favorites',[FavoriteController::class,'index']);
Route::post('/favorites',[FavoriteController::class,'store']);
Route::delete('/favorites/{spot}',[FavoriteController::class,'destroy']);
Route::get('/tags', [TagController::class,'index']);
Route::get('/spots/recommended', [SpotController::class, 'recommended']);
