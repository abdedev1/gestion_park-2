<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ParcController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SpotController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EmployeController;
use App\Http\Controllers\PricingRateController;
use App\Http\Controllers\ParkingTicketController;

Route::middleware('auth:sanctum')->group(function () {
    
    Route::post('/logout', [AuthController::class, 'logout']);
});
Route::post("/register", [AuthController::class, 'register']);
Route::post("/login", [AuthController::class, 'login']);
Route::get("/users", [UserController::class, 'index']);
Route::get("/user", [AuthController::class, 'getUser']);
Route::apiResource("parcs",ParcController::class);
Route::apiResource('spots',SpotController::class);
Route::get('/parcs/{id}/employes',[ParcController::class,'getParcEmployes']);
Route::get('/parcs/{id}/spots',[ParcController::class,'getParcSpots']);
Route::apiResource('employes', EmployeController::class);
Route::apiResource('/users', UserController::class);
Route::apiResource('/roles', RoleController::class);
Route::apiResource('/pricing_rates', PricingRateController::class);
Route::get("/parcs", [ParcController::class, 'index']);
Route::post("/parcs", [ParcController::class, 'store']);
Route::get('/employes/{id}/spots', [EmployeController::class, 'getEmployeSpots']);
Route::apiResource('parking-tickets', ParkingTicketController::class);
