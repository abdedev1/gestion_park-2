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
            $table->foreignId('spot_id')->constrained('spots')->onDelete('cascade');
            $table->string('clientName');
            $table->dateTime('entry_time');
            $table->dateTime('exit_time')->nullable();
            $table->string('status');
            $table->float('discount');
            $table->bigInteger('total_price')->nullable();
            $table->foreignId('client_id')->nullable()->constrained('clients')->onDelete('set null');
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
