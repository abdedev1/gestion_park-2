<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParkingTicket extends Model
{
    /** @use HasFactory<\Database\Factories\ParkingTicketFactory> */
    use HasFactory;
    protected $fillable = [
        'spot_id', 'clientName', 'entry_time', 'exit_time',
        'status', 'base_rate_id', 'total_price', 'client_id'
    ];
}
