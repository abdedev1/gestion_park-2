<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDemandCardsTable extends Migration
{
    public function up()
    {
        Schema::create('demand_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->foreignId('park_id')->constrained()->onDelete('cascade');
            $table->foreignId('base_rate_id')->constrained('pricing_rates')->onDelete('cascade');
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('demand_cards');
    }
}