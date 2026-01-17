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
        Schema::table('spots', function (Blueprint $table) {
            
            $table->text('detail')->nullable();
            $table->string('price')->nullable();
            $table->string('opening_hours')->nullable();

            $table->json('image_urls')->nullable();
            $table->json('tags_json')->nullable();
            $table->json('weather_suitability')->nullable();
            $table->json('highlights')->nullable();

            if (Schema::hasColumn('spots', 'lon') && Schema::hasColumn('spots', 'long')) {
                DB::statement('UPDATE spots SET lon = `long` WHERE lon IS NULL');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('spots', function (Blueprint $table) {
            $table->dropColumn([
                'lon',
                'detail',
                'price',
                'opening_hours',
                'image_urls',
                'tags_json',
                'weather_suitability',
                'highlights'
            ]);
        });
    }
};
