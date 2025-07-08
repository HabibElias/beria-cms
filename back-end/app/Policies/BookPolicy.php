<?php

namespace App\Policies;

use App\Models\Book;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

class BookPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function admin(User $user)
    {
        return $user->role === 'admin';
    }
}
