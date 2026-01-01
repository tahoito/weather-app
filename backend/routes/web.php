<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\AreaController;
use App\Http\Controllers\Api\SpotSearchController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/areas',[AreaController::class,'index']);
Route::get('/spots/search',[SpotSearchController::class,'index']);
Route::get('/favorites',[FavoriteController::class,'index']);
Route::post('/favorites',[FavoriteController::class,'store']);
Route::delete('/favorites/{spot}',[FavoriteController::class,'destroy']);
