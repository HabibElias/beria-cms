<?php
use App\Http\Controllers\BookController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SessionController;
use App\Models\User;
use Illuminate\Support\Facades\Route;

// Public Auth Routes
Route::post('login', [SessionController::class, 'store']);
Route::post('register', [SessionController::class, 'register']);
Route::post('refresh', [SessionController::class, 'update']);

// Protected Authenticated Routes
Route::middleware(['auth'])->group(function () {
    Route::post('logout', [SessionController::class, 'destroy']);

    // Books
    Route::get('books', [BookController::class, 'index']);
    Route::post('books', [BookController::class, 'store'])->can('create', User::class);
    Route::get('books/{book}', [BookController::class, 'show']);
    Route::put('books/{book}', [BookController::class, 'update']);
    Route::delete('books/{book}', [BookController::class, 'destroy']);

    // Categories
    Route::apiResource('categories', CategoryController::class);
});
