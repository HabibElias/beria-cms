<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\UserController;
use App\Models\Book;
use App\Models\User;
use Illuminate\Support\Facades\Route;

// Public Auth Routes
Route::post('login', [SessionController::class, 'store'])->name('login');
Route::post('register', [SessionController::class, 'register']);
Route::post('refresh', [SessionController::class, 'update']);

// Protected Authenticated Routes
Route::middleware(['auth'])->group(function () {
    Route::post('logout', [SessionController::class, 'destroy']);

    // Books
    Route::get('books', [BookController::class, 'index']);
    Route::post('books', [BookController::class, 'store'])->can('admin', Book::class);
    Route::get('books/{book}', [BookController::class, 'show']);
    Route::patch('books/{book}', [BookController::class, 'update'])->can('admin', Book::class);
    Route::delete('books/{book}', [BookController::class, 'destroy'])->can('admin', Book::class);
    // Categories
    Route::apiResource('categories', CategoryController::class);
});


Route::middleware(['auth'])->group(function () {
    //members
    Route::get('members', [UserController::class, 'index']);
    Route::get('members/{id}', [UserController::class, 'show']);
    Route::post('members', [UserController::class, 'store']);
    Route::delete('members/{id}', [UserController::class, 'destroy']);
});
