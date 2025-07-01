<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        //
        $query = Book::with('category');

        if ($request->has('title')) {
            $query->where('title', 'like', '%' . $request->get('title') . '%');
        }

        if ($request->has('category')) {
            $query->where('category_id', '=', (int) $request->get('category'));
        }

        if ($request->has('status')) {
            if ($request->get('status') === 'available') {
                $query->where('is_available', true);
            } elseif ($request->get('status') === 'checked-out') {
                $query->where('is_available', false);
            }
        }

        return $query->paginate(
            $request->get('per_page', 10)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $attr = $request->validate(
                [
                    'title' => 'required|min:3|max:100',
                    'author' => 'required|min:3|max:100',
                    'description' => 'required|min:3|max:400',
                    'notes' => 'max:400',
                    'pages' => 'required|integer',
                    'location' => 'required|min:1|max:10',
                    'publisher' => 'max:100',
                    'published_year' => 'required|integer:min:0',
                    'category_id' => 'required|integer',
                    'condition' => 'required|in:excellent,good,bad',
                    'book_img' => 'url:http,https'
                ]
            );

            // Proceed with storing book
        } catch (ValidationException $e) {
            return response()->json([
                'status' => false,
                'errors' => $e->errors(),
            ], 422);
        }

        Book::create($attr);

        return response()->json([
            'status' => true,
            'message' => 'book created successfully',
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        return Book::findOrFail($id);
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
        //
    }
}
