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
            $table->decimal('lon',10,7)->after('lat');

            $table->text('detail')->nullable()->after('description');
            $table->string('price')->nullable()->after('tips');
            $table->string('opening_hours')->nullable()->after('price');

            $table->json('image_urls')->nullable()->after('image_url');
            $table->json('tags_json')->nullable()->after('tips');
            $table->json('weather_suitability')->nullable()->after('weather_ok');
            $table->json('highlights')->nullable()->after('weather_suitability');

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
