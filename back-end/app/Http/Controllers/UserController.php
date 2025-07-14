<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->query('perPage', 10);
        $page = $request->query('page', 1);

        return User::with('checkouts')->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $attr = $request->validate(
                [
                    'name' => 'required|min:3',
                    'email' => 'required|email',
                    'phone' => 'required|min:10',
                    'role' => 'required|in:admin,librarian,user'
                ]
            );

            // Proceed with storing book
        } catch (ValidationException $e) {
            return response()->json([
                'status' => false,
                'errors' => $e->errors(),
            ], 422);
        }

        // check if the user already exists
        if (User::where('email', $attr['email'])->exists()) {
            return response()->json([
                'status' => false,
                'message' => 'User already exists with that email',
            ], 409);
        }

        // validate
        User::create(array_merge($attr, ['password' => password_hash('12341234', PASSWORD_BCRYPT)]));

        return response()->json(
            [
                'status' => true,
                'message' => 'user create',
            ],
            201
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $user = User::find($id);
        if ($user) {
            return response()->json(['status' => true, 'data' => $user]);
        } else
            return response()->json(['status' => false, 'message' => 'no user with this id'], 400);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        if (!$id) {
            return response()->json(['status' => false, 'message' => 'no id provided'], 422);
        }

        $user = User::find($id);

        if ($user) {
            $user->delete();
            return response()->json(['status' => true, 'message' => 'user deleted'], 200);
        } else
            return response()->json(['status' => false, 'message' => 'no user with this id'], 400);
    }
}
