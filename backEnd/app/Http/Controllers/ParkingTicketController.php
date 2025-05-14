<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ParkingTicket;
use Illuminate\Support\Facades\Log;

class ParkingTicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tickets = ParkingTicket::all();
        return response()->json($tickets);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Log::info('Incoming parking ticket request:', $request->all());

        $validatedData = $request->validate([
            'spot_id' => 'required|exists:spots,id',
            'clientName' => 'required|string|max:255',
            'entry_time' => 'required|date',
            'exit_time' => 'nullable|date',
            'status' => 'required|string|max:255',
            'base_rate_id' => 'required|exists:pricing_rates,id',
            'total_price' => 'nullable|numeric',
            'client_id' => 'nullable|exists:clients,id',
        ]);

        $ticket = ParkingTicket::create($validatedData);
        return response()->json($ticket, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ParkingTicket $parkingTicket,$id)
    {
        $parkingTicket = ParkingTicket::find($id);
        if (!$parkingTicket) {
            return response()->json(['message' => 'Parking ticket not found'], 404);
        }
        return response()->json($parkingTicket);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ParkingTicket $parkingTicket)
    {
        Log::info('FULL REQUEST:', $request->all());
        $validatedData = $request->validate([
            'spot_id' => 'sometimes|exists:spots,id',
            'clientName' => 'sometimes|string|max:255',
            'entry_time' => 'sometimes|date',
            'exit_time' => 'nullable|date',
            'status' => 'sometimes|string|max:255',
            'base_rate_id' => 'sometimes|exists:pricing_rates,id',
            'total_price' => 'nullable|numeric',
            'client_id' => 'nullable|exists:clients,id',
        ]);
        Log::info('validatedData:', $validatedData);


        $parkingTicket->update($validatedData);
        return response()->json($parkingTicket);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ParkingTicket $parkingTicket)
    {
        $parkingTicket->delete();
        return response()->json(['message' => 'Parking ticket deleted successfully']);
    }
}