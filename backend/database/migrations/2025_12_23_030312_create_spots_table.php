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
            $table->timestamps();
            $table->string('name');
            $table->string('area');
            $table->text('description')->nullable();
            $table->string('image_url')->nullable();
            $table->decimal('lat', 10, 7);
            $table->decimal('long', 10, 7);
            $table->string('tags')->nullable();
            $table->text('tips')->nullable();
            $table->boolean('is_indoor');
            $table->boolean('weather_ok'); 
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
