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
        Schema::create('spots', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->enum("status", [ 'available', 'reserved', 'maintenance']);
            $table->enum("type", [ 'standard', 'accessible', 'electric']);
            $table->integer("x");
            $table->integer("y");
            $table->foreignId(column: 'park_id')->constrained('parks')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spots');
    }
};
