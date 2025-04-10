<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParkingTicket extends Model
{
    /** @use HasFactory<\Database\Factories\ParkingTicketFactory> */
    use HasFactory;
    protected $fillable = [
        'spot_id', 'vehicle_plate', 'entry_time', 'exit_time',
        'status', 'base_rate_id', 'amount_charged', 'client_id'
    ];
}
