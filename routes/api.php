<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShoeController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DesignController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\Api\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes — All use web middleware for session-based auth (SPA)
|--------------------------------------------------------------------------
*/

Route::middleware('web')->group(function () {

    // ── Public shoe endpoints ──
    Route::get('/shoes', [ShoeController::class, 'index']);
    Route::get('/shoes/{id}', [ShoeController::class, 'show']);

    // ── Auth endpoints ──
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('/reset-password', [AuthController::class, 'resetPassword']);

        Route::middleware('auth')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
            Route::put('/profile', [AuthController::class, 'updateProfile']);
            Route::put('/password', [AuthController::class, 'updatePassword']);
        });
    });

    // ── Design endpoints ──
    Route::get('/designs/gallery', [DesignController::class, 'gallery']);
    Route::get('/designs/shared/{token}', [DesignController::class, 'showByToken']);
    Route::get('/designs/{id}', [DesignController::class, 'show']);

    Route::middleware('auth')->group(function () {
        Route::post('/designs/save', [DesignController::class, 'save']);
        Route::get('/designs/mine', [DesignController::class, 'mine']);
        Route::put('/designs/{id}', [DesignController::class, 'update']);
        Route::delete('/designs/{id}', [DesignController::class, 'destroy']);
    });

    // ── Order endpoints (all require auth) ──
    Route::middleware('auth')->prefix('orders')->group(function () {
        Route::post('/place', [OrderController::class, 'place']);
        Route::get('/mine', [OrderController::class, 'mine']);
        Route::get('/{id}', [OrderController::class, 'show']);
        Route::post('/{id}/cancel', [OrderController::class, 'cancel']);
    });

    // ── Cart (session-based, no auth required) ──
    Route::post('/cart/add', [CartController::class, 'add']);
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/clear', [CartController::class, 'clear']);
    Route::delete('/cart/{id}', [CartController::class, 'remove']);

    // ── Admin routes ──
    Route::middleware('auth')->prefix('admin')->group(function () {
        Route::get('/orders', [AdminController::class, 'getOrders']);
        Route::put('/orders/{id}/status', [AdminController::class, 'updateOrderStatus']);
    });
});
