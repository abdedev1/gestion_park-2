<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('parking_tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('spot_id')->constrained('spots');
            $table->string('vehicle_plate');
            $table->dateTime('entry_time');
            $table->dateTime('exit_time')->nullable();
            $table->string('status');
            $table->foreignId('base_rate_id')->constrained('pricing_rates');
            $table->bigInteger('amount_charged')->nullable();
            $table->foreignId('client_id')->nullable()->constrained('clients');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parking_tickets');
    }
};
