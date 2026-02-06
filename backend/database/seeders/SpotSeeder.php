<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\Spot;
use App\Models\Tag;

class SpotSeeder extends Seeder
{
    public function run(): void
    {
        $dir = database_path('seeders/csv');

        if (!File::exists($dir)) {
            $this->command?->warn("CSV dir not found: {$dir}");
            return;
        }

        $csvFiles = collect(File::files($dir))
            ->filter(fn ($f) => strtolower($f->getExtension()) === 'csv')
            ->sortBy(fn ($f) => $f->getFilename())
            ->values();

        if ($csvFiles->isEmpty()) {
            $this->command?->warn("No CSV files in: {$dir}");
            return;
        }

        $this->command?->info("Found {$csvFiles->count()} CSV files.");

        foreach ($csvFiles as $file) {
            $path = $file->getPathname();
            $this->command?->info("Importing: " . $file->getFilename());

            $this->importCsv($path);
        }
    }

    private function importCsv(string $path): void
    {
        $fp = fopen($path, 'r');
        if ($fp === false) {
            $this->command?->error("Failed to open: {$path}");
            return;
        }

        // ヘッダー
        $header = fgetcsv($fp);
        if (!$header) {
            fclose($fp);
            $this->command?->warn("Empty CSV: {$path}");
            return;
        }

        // BOM除去（Excel対策）
        $header[0] = preg_replace('/^\xEF\xBB\xBF/', '', $header[0]);

        $count = 0;

        while (($row = fgetcsv($fp)) !== false) {
            if (count($row) !== count($header)) continue;

            $data = array_combine($header, $row);
            if (!$data) continue;

            // 必須: name
            $name = trim((string)($data['name'] ?? ''));
            if ($name === '') continue;

            // 文字列→boolean
            $isIndoor = $this->toBool($data['is_indoor'] ?? null);
            $weatherOk = $this->toBool($data['weather_ok'] ?? null);

            // "a|b|c" → ["a","b","c"] を想定（必要ならCSV側を合わせる）
            $imageUrls = $this->splitPipe($data['image_urls'] ?? '');
            $weatherSuitability = $this->splitPipe($data['weather_suitability'] ?? '');
            $highlights = $this->splitPipe($data['highlights'] ?? '');

            $spot = Spot::updateOrCreate(
                ['name' => $name],
                [
                    'area' => $data['area'] ?? null,
                    'description' => $data['description'] ?? null,
                    'detail' => $data['detail'] ?? null,
                    'image_url' => $data['image_url'] ?? null,
                    'image_urls' => json_encode($imageUrls, JSON_UNESCAPED_UNICODE),
                    'lat' => $this->toFloat($data['lat'] ?? null),
                    'lon' => $this->toFloat($data['lon'] ?? null),
                    'tag' => $data['tag'] ?? null,
                    'is_indoor' => $isIndoor,
                    'weather_ok' => $weatherOk,
                    'price' => $data['price'] ?? null,
                    'opening_hours' => $data['opening_hours'] ?? null,
                    'weather_suitability' => json_encode($weatherSuitability, JSON_UNESCAPED_UNICODE),
                    'highlights' => json_encode($highlights, JSON_UNESCAPED_UNICODE),
                ]
            );

            // tags リレーション
            $slug = trim((string)($data['tag'] ?? ''));
            if ($slug !== '') {
                $tag = Tag::where('slug', $slug)->first();
                if ($tag) {
                    $spot->tags()->syncWithoutDetaching([$tag->id]);
                }
            }

            $count++;
        }

        fclose($fp);

        $this->command?->info("Imported rows: {$count}");
    }

    private function splitPipe(?string $value): array
    {
        $value = trim((string)$value);
        if ($value === '') return [];
        return array_values(array_filter(array_map('trim', explode('|', $value)), fn($v) => $v !== ''));
    }

    private function toBool($v): bool
    {
        $s = strtolower(trim((string)$v));
        return in_array($s, ['1','true','yes','y','on'], true);
    }

    private function toFloat($v): ?float
    {
        $s = trim((string)$v);
        if ($s === '') return null;
        return (float)$s;
    }
}
