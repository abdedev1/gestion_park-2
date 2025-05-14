<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    
    public function index()
    {
        return Client::with('user')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'cart_id' => 'required|exists:carts,id'
        ]);

        $client = Client::create($validated);

        return response()->json($client, 201);
    }
    
    public function show(Client $client,$id)
    {
        $client = Client::findOrFail($id);
        $client->load('user');
        return response()->json($client, 200);
    }

}
