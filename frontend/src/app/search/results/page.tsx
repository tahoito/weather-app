'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import { NavigationBar } from '@/components/navigation-bar';
import { SpotCard } from '@/components/spot-card';

import { Spot } from '@/types/spot';
import { areaTags, purposeTags } from '../data';

export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const areas = searchParams.getAll('area');
    const params = {
        query: searchParams.get('query') ?? undefined,
        area: areas.length ? areas : undefined,
        purpose: searchParams.get('purpose') ?? undefined,
        date: searchParams.get('date') ?? undefined,
        start_time: searchParams.get('start_time') ?? undefined,
        end_time: searchParams.get('end_time') ?? undefined,
    };

    // 表示用ラベル生成
    const areaLabel = params.area
        ?.map(slug => areaTags.find(a => a.slug === slug)?.label)
        .filter(Boolean)
        .join('・');

    const purposeLabel = purposeTags.find(
        p => p.slug === params.purpose
    )?.label;

    const dateLabel = (() => {
        if (!params.date) return;
        const d = new Date(params.date);
        const w = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];
        return `${d.getMonth() + 1}/${d.getDate()}(${w})`;
    })();

    const timeLabel =
        params.start_time && params.end_time
            ? `${params.start_time} ~ ${params.end_time}`
            : undefined;

    const conditionLabel = [
        params.query,
        areaLabel,
        purposeLabel,
        dateLabel,
        timeLabel,
    ]
        .filter(Boolean)
        .join(' / ');

    const [spots, setSpots] = useState<Spot[]>([]);
    const [loading, setLoading] = useState(true);

    // フェッチ
    const buildQuery = (params: Record<string, any>) => {
        const search = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (!value) return;
            if (Array.isArray(value)) {
                value.forEach(v => search.append(key, v));
            } else {
                search.append(key, value);
            }
        });
        return search.toString();
    };

    useEffect(() => {
        const fetchSpots = async () => {
            try {
                setLoading(true);

                const apiParams = {
                    query: params.query,
                    area: params.area,
                    tag: params.purpose,
                    is_indoor: undefined,
                    weather_ok: undefined,
                };

                const query = buildQuery(apiParams);
                const res = await fetch(
                    `http://localhost:8000/api/spots/search?${query}`
                );
                if (!res.ok) throw new Error('fetch failed');

                const raw = await res.json();
                const items = Array.isArray(raw) ? raw : raw.data ?? [];

                const normalized: Spot[] = raw.map((spot: any) => ({
                    id: spot.id,
                    name: spot.name,
                    area: spot.area,
                    description: spot.description,
                    imageUrl: spot.image_url,
                    tag: spot.tag ?? null,
                }));
                setSpots(normalized);
            } catch (e) {
                console.error(e);
                setSpots([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSpots();
    }, [searchParams]);

    return (
        <>
            <div className="bg-back min-h-screen pb-18">
                <div className="relative py-3">
                    <button
                        onClick={() => router.back()}
                        className="absolute top-1/2 left-5 -translate-y-1/2"
                    >
                        <ArrowLeft size={28} />
                    </button>
                    <h2 className="text-base font-medium text-center">場所一覧</h2>
                </div>

                <div className="flex items-center justify-between bg-[#FFFEF7] px-5 py-2 border-y border-holder">
                    <div className="flex items-center">
                        <p className="text-base">
                            {spots.length}
                            <span className="text-xs">件</span>
                        </p>
                        <p className="ml-3 text-sm">{conditionLabel}</p>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className="px-3 py-2 text-sm font-medium text-sub border border-sub rounded-full"
                    >
                        条件変更
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-2 p-5">
                    {loading && <p>読み込み中...</p>}

                    {!loading && spots.length === 0 && (
                        <p className="col-span-2 text-center text-sm">
                            条件に一致するスポットが見つかりませんでした
                        </p>
                    )}

                    {!loading &&
                        spots.map(spot => (
                            <SpotCard key={spot.id} spot={spot} />
                        ))}
                </div>
            </div>

            <NavigationBar />
        </>
    );
}
