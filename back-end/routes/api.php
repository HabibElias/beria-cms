<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\SessionController;
use Illuminate\Support\Facades\Route;

// Public Routes

// Protected Routes (JWT-protected)
Route::middleware(['auth'])->group(function () {
    Route::get('/books', [BookController::class, 'index']);
    Route::post('/books', [BookController::class, 'store']);
    Route::get('/books/{book}', [BookController::class, 'show']);
    Route::put('/books/{book}', [BookController::class, 'update']);
    Route::delete('/books/{book}', [BookController::class, 'destroy']);
});

// auth

Route::get('/login', [SessionController::class, 'index'])
    ->name('login');
Route::post('/login', [SessionController::class, 'store']);
Route::post('/register', [SessionController::class, 'register']);
Route::post('/refresh', [SessionController::class, 'update']);

Route::middleware(['auth'])->group(function () {
    Route::post('/logout', [SessionController::class, 'destroy']);
});
