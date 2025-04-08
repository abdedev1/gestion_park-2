<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ParcController;
use App\Http\Controllers\SpotController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    
    Route::post('/logout', [AuthController::class, 'logout']);
});
Route::post("/register", [AuthController::class, 'register']);
Route::post("/login", [AuthController::class, 'login']);
Route::get("/users", [UserController::class, 'index']);
Route::apiResource("parcs",ParcController::class);
Route::apiResource('spots',SpotController::class);
Route::get('/parcs/{id}/employes',[ParcController::class,'getParcEmployes']);
