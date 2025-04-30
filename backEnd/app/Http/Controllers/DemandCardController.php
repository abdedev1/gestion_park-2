<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DemandCard;

class DemandCardController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'park_id' => 'required|exists:parks,id',
            'duration' => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:0',
        ]);

        $demandCard = DemandCard::create($validated);

        return response()->json($demandCard, 201);
    }
}