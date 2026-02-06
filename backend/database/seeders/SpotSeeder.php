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
            // 列ズレ検出（CSV壊れてるとここで弾かれる）
            if (count($row) !== count($header)) {
                // デバッグしたいなら次行のコメント外して
                // $this->command?->warn("Column mismatch: {$path} -> " . implode(',', $row));
                continue;
            }

            $data = array_combine($header, $row);
            if (!$data) continue;

            $name = trim((string)($data['name'] ?? ''));
            if ($name === '') continue;

            $isIndoor = $this->toBool($data['is_indoor'] ?? null);
            $weatherOk = $this->toBool($data['weather_ok'] ?? null);

            // image_urls は "|" 区切り推奨だけど、","も来るので両対応
            $imageUrls = $this->splitList($data['image_urls'] ?? '');

            // weather_suitability / weather_sutability 両対応
            $wsRaw = $data['weather_suitability'] ?? ($data['weather_sutability'] ?? '');
            $weatherSuitability = $this->splitList($wsRaw);

            $highlights = $this->splitList($data['highlights'] ?? '');

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
                    'tag' => $data['tag'] ?? null, // カラム残してるなら入れておく
                    'is_indoor' => $isIndoor,
                    'weather_ok' => $weatherOk,
                    'price' => $data['price'] ?? null,
                    'opening_hours' => $data['opening_hours'] ?? null,
                    'weather_suitability' => json_encode($weatherSuitability, JSON_UNESCAPED_UNICODE),
                    'highlights' => json_encode($highlights, JSON_UNESCAPED_UNICODE),
                ]
            );

            // tags リレーション（tags / tag どっちでもOK、区切りは "|" or ","）
            $rawTags = trim((string)($data['tags'] ?? ($data['tag'] ?? '')));
            if ($rawTags !== '') {
                $slugs = preg_split('/[|,]/', $rawTags);
                foreach ($slugs as $slug) {
                    $slug = trim($slug);
                    if ($slug === '') continue;

                    $tag = Tag::where('slug', $slug)->first();
                    if ($tag) {
                        $spot->tags()->syncWithoutDetaching([$tag->id]);
                    }
                }
            }

            $count++;
        }

        fclose($fp);

        $this->command?->info("Imported rows: {$count}");
    }

    private function splitList(?string $value): array
    {
        $value = trim((string)$value);
        if ($value === '') return [];

        // "|" 優先、なければ "," で分割
        $delimiter = str_contains($value, '|') ? '|' : ',';

        return array_values(
            array_filter(
                array_map('trim', explode($delimiter, $value)),
                fn($v) => $v !== ''
            )
        );
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
