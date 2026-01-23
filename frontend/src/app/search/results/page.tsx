'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ArrowLeft, X } from 'lucide-react';

import { NavigationBar } from '@/components/navigation-bar';
import { SpotCard } from '@/components/spot-card';

import { Spot } from '@/types/spot';
import {
    areaTags,
    purposeTags,
    getDateOptions,
    getTimeOptions,
    getNearestTimeOption,
    getOneHourLaterTime
} from '../data';
import Modal from '@/components/Modal';
import { AreaFilter } from '../_components/area-filter';
import { DateTimeFilter } from '../_components/date-time-filter';
import { PurposeFilter } from '../_components/purpose-filter';


export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // 検索オプションを取得
    const queryParam = searchParams.get('query') ?? undefined;
    const areasParam = searchParams.getAll('area');
    const dateParam = searchParams.get('date') ?? undefined;
    const startParam = searchParams.get('start_time') ?? undefined;
    const endParam = searchParams.get('end_time') ?? undefined;
    const purposeParam = searchParams.get('purpose') ?? undefined;
    const indoorParam = searchParams.get('is_indoor') ?? undefined;

    // 日付オプションと時間オプションを取得
    const dateOptions = getDateOptions();
    const timeOptions = getTimeOptions();

    // 検索条件の状態保持（検索ページと同じ構造）
    const [areaSlugs, setAreaSlugs] = useState<string[]>(() => {
        return areasParam.length ?  areasParam : ['meieki']
    });
    const [date, setDate] = useState<string>(
        dateParam ?? (dateOptions[0]?.value || '')
    );
    const initialStartTime = startParam ?? getNearestTimeOption(timeOptions);
    const [startTime, setStartTime] = useState<string>(initialStartTime);
    const [endTime, setEndTime] = useState<string>(
        endParam ?? getOneHourLaterTime(initialStartTime, timeOptions)
    );
    const [isAllDay, setIsAllDay] = useState<boolean>(
        !startParam && !endParam
    );
    const [purposeSlug, setPurposeSlug] = useState<string>(
        purposeParam ?? 'date'
    );
    const [indoor, setIndoor] = useState<'both' | 'outdoor' | 'indoor'>(
        indoorParam === 'true' ? 'indoor' : indoorParam === 'false' ? 'outdoor' : 'both'
    );

    // 検索結果・ローディング状態
    const [spots, setSpots] = useState<Spot[]>([]);
    const [loading, setLoading] = useState(false);

    // モーダル表示状態（条件変更ボタンが押されたかどうか）
    const [showModal, setShowModal] = useState(false);

    // 検索オプションを構築（API用）
    // 状態が変更されたら再計算される
    const searchOptions = useMemo(() => {
        if (queryParam) {
            return {
                query: queryParam,
                area: undefined,
                purpose: undefined,
                is_indoor: indoorParam,
            };
        }

        if (dateParam) {
            return {
                query: undefined,
                area: undefined,
                purpose: purposeSlug,
                is_indoor: indoor !== 'both' ? (indoor === 'indoor' ? 'true' : 'false') : undefined
            };
        }

        return {
            query: undefined,
            area: areaSlugs.length > 0 ? areaSlugs : undefined,
            purpose: purposeSlug,
            is_indoor: indoor !== 'both' ? (indoor === 'indoor' ? 'true' : 'false') : undefined
        };
    }, [queryParam, dateParam, areaSlugs, purposeSlug, indoor, indoorParam]);

    // buildQuery関数
    type QueryValue = string | string[] | undefined;
    const buildQuery = (params: Record<string, QueryValue>) => {
        const query = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value === undefined) return;

            if (Array.isArray(value)) {
                value.forEach(v => query.append(key, v));
            } else {
                query.append(key, value);
            }
        });

        return query.toString();
    };

    // エリア選択のトグル関数
    const toggleAreaSelection = (slug: string) => {
        setAreaSlugs(prev =>
            prev.includes(slug)
                ? prev.filter(s => s !== slug)
                : [...prev, slug]
        );
    };

    // 検索条件が変わったら再フェッチ
    useEffect(() => {
        const fetchSpots = async () => {
            setLoading(true);

            try {
                if (date) {
                    const targetTime = isAllDay ? "12:00" : (startTime || "12:00");
                    const area = areaSlugs[0] ?? "meieki";

                    const areaMeta = areaTags.find(a => a.slug === area);
                    if (!areaMeta) throw new Error("area not found");

                    const wxRes = await fetch(
                        `/api/forecast?lat=${areaMeta.lat}&lon=${areaMeta.lon}&date=${date}&time=${targetTime}`
                    );

                    if (!wxRes.ok) throw new Error("forecast failed");
                    const wx = await wxRes.json();

                    const qs = new URLSearchParams({
                        area, 
                        temp: String(wx.temp),
                        pop: String(wx.pop),
                        wind: String(wx.wind),
                        humidity: String(wx.humidity),
                        limit: "20",
                    });

                    const recRes = await fetch(
                        `http://localhost:8000/api/spots/recommended?${qs.toString()}`
                    );

                    if (!recRes.ok) throw new Error("recommended failed");
                    
                    const raw = await recRes.json();
                    const items = Array.isArray(raw?.data) ? raw.data : [];

                    setSpots(
                        items.map((spot: any) => ({
                            id: spot.id,
                            name: spot.name,
                            area: spot.area,
                            description: spot.description,
                            imageUrl: spot.image_url,
                            tag: spot.tag,
                        }))
                    );

                    return;
                }

                const apiParams = {
                    query: searchOptions.query,
                    area: searchOptions.area,
                    purpose: searchOptions.purpose,
                    is_indoor:
                        searchOptions.is_indoor === undefined
                            ? undefined
                            : searchOptions.is_indoor === 'true'
                                ? '1'
                                : '0',
                };

                const query = buildQuery(apiParams);
                const res = await fetch(
                    `http://localhost:8000/api/spots/search?${query}`
                );

                if (!res.ok) {
                    throw new Error('fetch failed');
                }

                const raw = await res.json();

                const items = Array.isArray(raw?.data)
                    ? raw.data
                    : Array.isArray(raw)
                        ? raw
                        : [];

                const normalized: Spot[] = items.map((spot: any) => ({
                    id: spot.id,
                    name: spot.name,
                    area: spot.area,
                    description: spot.description,
                    imageUrl: spot.image_url,
                    tag: spot.tag,
                }));

                setSpots(normalized);
            } catch (e) {
                console.error("fetchSpots error", e);
                setSpots([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSpots();
    }, [searchOptions, date, startTime, isAllDay, areaSlugs ]);

    return (
        <>
            <div className="relative bg-back min-h-screen pb-18">
                {/* ヘッダー */}
                <div className="relative py-3">
                    <button
                        onClick={() => router.push('/search')}
                        className="absolute top-1/2 left-5 -translate-y-1/2"
                    >
                        <ArrowLeft size={28} />
                    </button>
                    <h2 className="text-base font-medium text-center">場所一覧</h2>
                </div>

                {/* ラベルエリア */}
                <div className="flex items-center justify-between h-14 bg-[#FFFEF7] px-5 border-y border-holder">
                    <div className="flex items-center gap-3">
                        <p className="text-base">
                            {spots.length}
                            <span className="text-xs">件</span>
                        </p>
                        <div className="flex flex-col gap-1 ml-3 text-sm">
                            {(() => {
                                if (queryParam) {
                                    // テキスト検索
                                    return <p>{queryParam}</p>
                                } else if (dateParam) {
                                    // 日付検索
                                    const dateLabel = `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}`
                                    const hasTime = startTime || endTime
                                    const timeLabel = hasTime
                                        ? `${startTime ?? ''} ~ ${endTime ?? ''}`
                                        : ''
                                    const firstLine = [dateLabel, timeLabel].filter(Boolean).join(' ')
                                    const purposeLabel = purposeSlug
                                        ? purposeTags.find(tag => tag.slug === purposeSlug)?.label ?? purposeSlug
                                        : ''
                                    const indoorLabel = indoor !== 'both'
                                        ? (indoor === 'indoor' ? '屋内' : '屋外')
                                        : ''
                                    const secondLine = [purposeLabel, indoorLabel].filter(Boolean).join(' / ')

                                    return (
                                        <>
                                            <p>{firstLine}</p>
                                            {secondLine && <p>{secondLine}</p>}
                                        </>
                                    )
                                } else {
                                    // エリア検索
                                    const areaLabels = areaSlugs.length > 0
                                        ? areaSlugs.map(slug => areaTags.find(tag => tag.slug === slug)?.label ?? slug).join(' ')
                                        : ''
                                    const purposeLabel = purposeSlug ? purposeTags.find(tag => tag.slug === purposeSlug)?.label ?? purposeSlug : ''
                                    const indoorLabel = indoor !== 'both' ? (indoor === 'indoor' ? '屋内' : '屋外') : ''
                                    const secondLine = [purposeLabel, indoorLabel].filter(Boolean).join(' / ')

                                    return (
                                        <>
                                            {areaLabels && <p>{areaLabels}</p>}
                                            {secondLine && <p>{secondLine}</p>}
                                        </>
                                    )
                                }
                            })()}
                        </div>
                    </div>
                    {!queryParam && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-3 py-2 text-sm font-medium text-sub border border-sub rounded-full"
                        >
                            条件変更
                        </button>
                    )}
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
                            <SpotCard
                                key={spot.id}
                                spot={spot}
                                initialIsFavorite={Boolean((spot as any).is_favorite)} />
                        ))}
                </div>
            </div >

            <NavigationBar />

            {showModal && (
                <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                    <div className="px-9 pt-4 pb-8">
                        <button onClick={() => setShowModal(false)} className='flex ml-auto'><X size={28}></X></button>

                        {/* params.dateがある場合は日付選択のエリアと目的選択エリアを表示 */}
                        {dateParam ? (
                            <>
                                <DateTimeFilter
                                    dateOptions={dateOptions}
                                    timeOptions={timeOptions}
                                    date={date}
                                    setDate={setDate}
                                    startTime={startTime}
                                    setStartTime={setStartTime}
                                    endTime={endTime}
                                    setEndTime={setEndTime}
                                    isAllDay={isAllDay}
                                    setIsAllDay={setIsAllDay}
                                />
                                <PurposeFilter
                                    purposeTags={purposeTags}
                                    purposeSlug={purposeSlug}
                                    setPurposeSlug={setPurposeSlug}
                                    indoor={indoor}
                                    setIndoor={setIndoor}
                                />
                            </>
                        ) : (
                            /* 日付選択モーダルでなかった時はエリア選択のエリアと目的選択エリアを表示 */
                            <>
                                <AreaFilter
                                    areaTags={areaTags}
                                    areaSlugs={areaSlugs}
                                    toggleAreaSelection={toggleAreaSelection}
                                />
                                <PurposeFilter
                                    purposeTags={purposeTags}
                                    purposeSlug={purposeSlug}
                                    setPurposeSlug={setPurposeSlug}
                                    indoor={indoor}
                                    setIndoor={setIndoor}
                                />
                            </>
                        )}
                    </div>
                </Modal>
            )}
        </>
    )
}