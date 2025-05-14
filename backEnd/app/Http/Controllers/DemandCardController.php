<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DemandCard;

class DemandCardController extends Controller
{
    public function index()
    {
        $demandCards = DemandCard::with(['client.user', 'park'])->get();
        return response()->json($demandCards);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'park_id' => 'required|exists:parks,id',
            'duration' => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:0',
            'base_rate_id' => 'required|exists:pricing_rates,id',
            'status' => 'in:pending,accepted,rejected'
        ]);
        if (!isset($validated['status'])) {
            $validated['status'] = 'pending';
        }

        $demandCard = DemandCard::create($validated);

        return response()->json($demandCard, 201);
    }
    public function update(Request $request, $id)
    {
        $demandCard = DemandCard::findOrFail($id);
        $validated = $request->validate([
            'status' => 'required|in:pending,accepted,rejected'
        ]);
        $demandCard->status = $validated['status'];
        $demandCard->save();

        return response()->json($demandCard);
    }
}