<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParkingTicket extends Model
{
    use HasFactory;

    protected $fillable = [
        'spot_id', 'clientName', 'entry_time', 'exit_time',
        'status', 'base_rate_id', 'total_price', 'client_id'
    ];

    protected $hidden = ["created_at", "updated_at", "client"];

    protected $appends = ['client_first_name', 'client_last_name'];

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function getClientFirstNameAttribute(): ?string
    {
        return $this->client?->first_name ?? null;
    }

    public function getClientLastNameAttribute(): ?string
    {
        return $this->client?->last_name ?? null;
    }

    public function spot()
    {
        return $this->belongsTo(Spot::class, 'spot_id');
    }

    public function park()
    {
        return $this->spot ? $this->spot->park() : null;
    }
    }