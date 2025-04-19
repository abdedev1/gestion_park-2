<?php

use App\Http\Middleware\IsAdminEmployeeMiddleware;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ParcController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SpotController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EmployeController;
use App\Http\Controllers\PricingRateController;
use App\Http\Controllers\ParkingTicketController;
use App\Http\Middleware\AlreadyLoggedInMiddleware;
use App\Http\Middleware\isAdminMiddleWare;
use App\Http\Middleware\isClientMiddleWare;
use App\Http\Middleware\isEmployeMiddleWare;

Route::middleware(AlreadyLoggedInMiddleware::class)->group(function(){
    Route::post("/register", [AuthController::class, 'register']);
    Route::post("/login", [AuthController::class, 'login']);
});

Route::middleware("auth:sanctum")->controller(AuthController::class)->group(function(){
    Route::get("user", "getUser");
    Route::post("logout", "logout");
});

Route::middleware(isAdminMiddleWare::class)->group(function(){
    Route::apiResource('users', UserController::class);
    Route::apiResource('roles', RoleController::class);
    Route::apiResource('employes', EmployeController::class);
    Route::apiResource("parcs",ParcController::class);
    Route::delete('spots', [SpotController::class, 'destroyMultiple'])->name('spots.destroyMultiple');
    Route::post('spots/multiple', [SpotController::class, 'storeMultiple'])->name('spots.storeMultiple');

    
});

Route::middleware(isEmployeMiddleWare::class)->group(function(){
    Route::apiResource('pricing_rates', PricingRateController::class);
    Route::apiResource('employes', EmployeController::class);
    
});

Route::middleware(isClientMiddleWare::class)->group(function(){
    // client routes
});
Route::middleware(IsAdminEmployeeMiddleware::class)->group(function(){
    // admin and employe routes
    Route::apiResource('spots',controller: SpotController::class);
    Route::apiResource('employes', EmployeController::class);


});



Route::get('/parcs/{id}/employes',[ParcController::class,'getParcEmployes']);
Route::get('/parcs/{id}/spots',[ParcController::class,'getParcSpots']);
Route::get("/parcs", [ParcController::class, 'index']);

Route::post("/parcs", [ParcController::class, 'store']);

Route::get('/employes/{id}/spots', [EmployeController::class, 'getEmployeSpots']);
Route::apiResource('parking-tickets', ParkingTicketController::class);
