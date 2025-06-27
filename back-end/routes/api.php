<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\SessionController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::get('/login', [SessionController::class, 'index'])->name('login');
Route::post('/login', [SessionController::class, 'store']);
Route::post('/register', [SessionController::class, 'register']);

// Protected Routes (JWT-protected)
Route::middleware(['auth'])->group(function () {
    Route::get('/books', [BookController::class, 'index']);
    Route::post('/books', [BookController::class, 'store']);
    Route::get('/books/{book}', [BookController::class, 'show']);
    Route::put('/books/{book}', [BookController::class, 'update']);
    Route::delete('/books/{book}', [BookController::class, 'destroy']);
    Route::post('/logout', [SessionController::class, 'destroy']);
});
