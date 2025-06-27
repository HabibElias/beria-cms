<?php

namespace App\Http\Controllers;

use App\Http\Requests\SessionRequest;
use Illuminate\Support\Facades\Auth;

class SessionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return redirect(to: env('VITE_APP_URL', 'http://localhost:3000') . '/login');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SessionRequest $request)
    {
        //
        if (!$token = Auth::attempt($request->all())) {
            return response()->json(['error' => 'Invalid Credentials'], 401);
        }

        return response()->json(['token' => $token]);
    }
    
    /**
     * Remove the specified resource from storage.
     */
    public function destroy()
    {
        Auth::logout();
        return response()->json(['message' => 'success']);
    }
}
