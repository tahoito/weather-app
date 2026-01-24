<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Models\Spot;

class ImportSpotsFromCsv extends Command
{
    protected $signature = 'spots:import {path : CSV file path (e.g. storage/app/spots.csv)} {--truncate : Truncate spots before import}';
    protected $description = 'Import spots from a CSV file (upsert by area+name, update columns, and sync tags if relation exists).';

    public function handle(): int
    {
        $path = $this->argument('path');

        if (!is_file($path)) {
            $this->error("File not found: {$path}");
            return self::FAILURE;
        }

        $fp = fopen($path, 'r');
        if ($fp === false) {
            $this->error("Failed to open: {$path}");
            return self::FAILURE;
        }

        $header = fgetcsv($fp);
        if (!$header) {
            $this->error("CSV header is missing.");
            fclose($fp);
            return self::FAILURE;
        }

        // normalize header
        $header = array_map(fn($h) => trim((string)$h), $header);

        $required = ['name','area','lat','lon','is_indoor','weather_ok'];
        foreach ($required as $col) {
            if (!in_array($col, $header, true)) {
                $this->error("Missing required column: {$col}");
                $this->line("Header: " . implode(',', $header));
                fclose($fp);
                return self::FAILURE;
            }
        }

        if ($this->option('truncate')) {
            DB::table('spots')->truncate();
            $this->warn("Truncated spots table.");
        }

        $now = now();
        $count = 0;
        $skipped = 0;

        DB::beginTransaction();
        try {
            while (($row = fgetcsv($fp)) !== false) {
                // Skip empty lines
                if (count($row) === 1 && trim((string)$row[0]) === '') continue;

                $data = [];
                foreach ($header as $i => $key) {
                    $data[$key] = $row[$i] ?? null;
                }

                // Basic required
                $name = trim((string)($data['name'] ?? ''));
                $area = trim((string)($data['area'] ?? ''));
                if ($name === '' || $area === '') {
                    $skipped++;
                    continue;
                }

                $lat = $this->toFloat($data['lat']);
                $lon = $this->toFloat($data['lon']);
                if ($lat === null || $lon === null) {
                    $this->warn("Skip (invalid lat/lon): {$area} / {$name}");
                    $skipped++;
                    continue;
                }

                $isIndoor = $this->toBool($data['is_indoor']);
                $weatherOk = $this->toBool($data['weather_ok']);

                // Optional text fields
                $payload = [
                    'name' => $name,
                    'area' => $area,
                    'description' => $this->nullIfEmpty($data['description'] ?? null),
                    'detail' => $this->nullIfEmpty($data['detail'] ?? null),
                    'image_url' => $this->nullIfEmpty($data['image_url'] ?? null),
                    'lat' => $lat,
                    'lon' => $lon,
                    'is_indoor' => $isIndoor,
                    'weather_ok' => $weatherOk,
                    'price' => $this->nullIfEmpty($data['price'] ?? null),
                    'opening_hours' => $this->nullIfEmpty($data['opening_hours'] ?? null),
                    'updated_at' => $now,
                ];

                // JSON-ish fields (accept: JSON or comma-separated)
                $payload['image_urls'] = $this->toJsonArray($data['image_urls'] ?? null);
                $tagsArray = $this->toStringArray($data['tags'] ?? null);

                // keep legacy tags column (string) if exists
                if (Schema::hasColumn('spots', 'tags')) {
                    // store first tag only, for backward compatibility
                    $payload['tags'] = $tagsArray[0] ?? null;
                }

                $payload['tags_json'] = $tagsArray;
                $payload['weather_suitability'] = $this->toStringArray($data['weather_suitability'] ?? null);
                $payload['highlights'] = $this->toStringArray($data['highlights'] ?? null);

                // upsert key: area + name (stable enough)
                $spot = Spot::query()->where('area', $area)->where('name', $name)->first();

                if (!$spot) {
                    $payload['created_at'] = $now;
                    $spot = Spot::create($payload);
                } else {
                    $spot->fill($payload)->save();
                }

                // Sync pivot tags if relation exists + tags table exists
                $this->syncTagsIfPossible($spot, $tagsArray);

                $count++;
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            fclose($fp);
            $this->error("Import failed: " . $e->getMessage());
            return self::FAILURE;
        }

        fclose($fp);

        $this->info("Imported/updated: {$count}");
        $this->info("Skipped: {$skipped}");
        return self::SUCCESS;
    }

    private function nullIfEmpty($v): ?string
    {
        $s = trim((string)($v ?? ''));
        return $s === '' ? null : $s;
    }

    private function toFloat($v): ?float
    {
        if ($v === null) return null;
        $s = trim((string)$v);
        if ($s === '') return null;
        $n = (float)$s;
        return is_finite($n) ? $n : null;
    }

    private function toBool($v): bool
    {
        $s = strtolower(trim((string)($v ?? '')));
        return in_array($s, ['1','true','yes','y','on','t'], true);
    }

    /**
     * Accepts JSON array string like ["a","b"] or comma-separated like "a,b"
     */
    private function toJsonArray($v): ?array
    {
        $s = trim((string)($v ?? ''));
        if ($s === '') return null;

        // JSON array
        if (str_starts_with($s, '[')) {
            $decoded = json_decode($s, true);
            if (is_array($decoded)) return array_values(array_filter($decoded, fn($x) => trim((string)$x) !== ''));
        }

        // comma-separated
        $arr = array_values(array_filter(array_map('trim', explode(',', $s)), fn($x) => $x !== ''));
        return $arr ?: null;
    }

    /**
     * Comma-separated string -> array<string>
     * Also accepts JSON array string.
     */
    private function toStringArray($v): array
    {
        $s = trim((string)($v ?? ''));
        if ($s === '') return [];

        if (str_starts_with($s, '[')) {
            $decoded = json_decode($s, true);
            if (is_array($decoded)) {
                return array_values(array_filter(array_map('trim', array_map('strval', $decoded)), fn($x) => $x !== ''));
            }
        }

        return array_values(array_filter(array_map('trim', explode(',', $s)), fn($x) => $x !== ''));
    }

    private function syncTagsIfPossible($spot, array $tagsArray): void
    {
        // If no tags, do nothing
        if (!$tagsArray) return;

        // Relation exists?
        if (!method_exists($spot, 'tags')) return;

        // tags table exists?
        if (!Schema::hasTable('tags')) return;

        // Get tag ids by slug
        $ids = DB::table('tags')->whereIn('slug', $tagsArray)->pluck('id')->all();
        if (!$ids) return;

        // sync without detaching (keep existing)
        $spot->tags()->syncWithoutDetaching($ids);
    }
}
