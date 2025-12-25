<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FavoriteController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/favorites',[FavoriteController::class,'index']);
Route::post('/favorites',[FavoriteController::class,'store']);
Route::delete('/favorites/{spot}',[FavoriteController::class,'destroy']);
