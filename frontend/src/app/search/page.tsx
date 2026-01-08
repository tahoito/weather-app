'use client'

// hooks
import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// icon
import { Search } from 'lucide-react';
import { History } from 'lucide-react';
import { X } from 'lucide-react';
import { LandPlot } from 'lucide-react';
import { CalendarFold } from 'lucide-react';
import { ChevronDown } from 'lucide-react';

// component
import { NavigationBar } from "@/components/navigation-bar";

// other
import Cookies from 'js-cookie';

export type AreaTag = {
    label: string;
    slug: string;
}

export const areaTags: AreaTag[] = [
    { label: '名駅', slug: 'meieki' },
    { label: '大須', slug: 'osu' },
    { label: '金山', slug: 'kanayama' },
    { label: '栄', slug: 'sakae' },
    { label: '伏見', slug: 'fushimi' },
    { label: '矢場町', slug: 'yabacho' },
    { label: '上前津', slug: 'kamimaezu' },
    { label: '鶴舞', slug: 'tsurumai' },
    { label: '星ヶ丘', slug: 'hoshigaoka' },
    { label: '八事', slug: 'yagoto' },
    { label: '桜山', slug: 'sakurayama' },
    { label: '今池', slug: 'imaike' },
    { label: '覚王山', slug: 'kakuozan' },
    { label: '本山', slug: 'motoyama' },
    { label: '新瑞橋', slug: 'aratamabashi' },
    { label: '久屋大通', slug: 'hisayaodori' },
]

export type PurposeTag = {
    label: string;
    slug: string;
}

export const purposeTags: PurposeTag[] = [
    { label: 'デート', slug: 'date' },
    { label: '友達', slug: 'friend' },
    { label: '映え', slug: 'photo' },
    { label: 'リラックス', slug: 'relax' },
    { label: '推し活', slug: 'bias' },
    { label: '勉強・作業', slug: 'study' },
    { label: '一人', slug: 'alone' },
    { label: '放課後', slug: 'after_school' },
    { label: 'アクティブ', slug: 'active' },
    { label: 'ゆっくり', slug: 'slow' },
    { label: '買い物', slug: 'shopping' },
    { label: '食事', slug: 'food' },
]

export type DateOption = {
    label: string;
    value: string;
};

function getDateOptions(): DateOption[] {
    const options: DateOption[] = [];
    const today = new Date();

    for (let i = 0; i <= 10; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        options.push({
            label: `${year}年${month}月${day}日`,
            value: `${year}-${month}-${day}`,
        });
    }

    return options;
}

export type TimeOption = {
    label: string;
    value: string;
};

function getTimeOptions(): TimeOption[] {
    const options: TimeOption[] = [];

    for (let hours = 0; hours < 24; hours++) {
        for (let minutes = 0; minutes < 60; minutes += 30) {
            const h = String(hours).padStart(2, '0');
            const m = String(minutes).padStart(2, '0');
            const time = `${h}:${m}`;

            options.push({
                label: time,
                value: time,
            });
        }
    }

    return options;
}

export type SearchParams = {
    searchText: string;
    areaSlugs: string[];
    date: string;
    startTime: string;
    endTime: string;
    isAllDay: boolean;
    purposeSlug: string;
    indoor: 'both' | 'outdoor' | 'indoor';
}


export default function Page() {
    const router = useRouter();

    const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [activeFilter, setActiveFilter] = useState<('area' | 'date')>('area');

    const [searchText, setSearchText] = useState<string>('');
    const [areaSlugs, setAreaSlugs] = useState<string[]>(['meieki']);
    const [date, setDate] = useState<string>('');
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [isAllDay, setIsAllDay] = useState<boolean>(false);
    const [purposeSlug, setPurposeSlug] = useState<string>('date');
    const [indoor, setIndoor] = useState<'both' | 'outdoor' | 'indoor'>('both');

    const dateOptions = getDateOptions();
    const timeOptions = getTimeOptions();

    useEffect(() => {
        const savedHistory = Cookies.get('searchHistory');
        if (savedHistory) {
            try {
                const history = JSON.parse(savedHistory);
                setSearchHistory(Array.isArray(history) ? history : []);
            } catch (e) {
                setSearchHistory([]);
            }
        }
    }, []);

    const saveSearchHistory = (text: string) => {
        if (!text.trim()) return;

        const trimmedText = text.trim();
        const updatedHistory = [
            trimmedText,
            ...searchHistory.filter(item => item !== trimmedText)
        ].slice(0, 10); // 最大10件まで保存

        setSearchHistory(updatedHistory);
        Cookies.set('searchHistory', JSON.stringify(updatedHistory), { expires: 365 });
    };

    const removeSearchHistory = (text: string) => {
        const updatedHistory = searchHistory.filter(item => item !== text);
        setSearchHistory(updatedHistory);
        if (updatedHistory.length > 0) {
            Cookies.set('searchHistory', JSON.stringify(updatedHistory), { expires: 365 });
        } else {
            Cookies.remove('searchHistory');
        }
    };

    const clearAllSearchHistory = () => {
        setSearchHistory([]);
        Cookies.remove('searchHistory');
    };

    const selectSearchHistory = (text: string) => {
        setSearchText(text);
    };

    const toggleAreaSelection = (slug: string) => {
        setAreaSlugs(prev =>
            prev.includes(slug)
                ? prev.filter(s => s !== slug)
                : [...prev, slug]
        );
    };

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (isInputFocused) {
            if (searchText.trim()) {
                saveSearchHistory(searchText.trim());
                params.append('query', searchText.trim());
            }
        } else {
            if (searchText.trim()) {
                saveSearchHistory(searchText.trim());
                params.append('query', searchText.trim());
            }

            if (activeFilter === 'area') {
                if (areaSlugs.length > 0) {
                    areaSlugs.forEach(slug => {
                        params.append('area', slug);
                    });
                }
            }

            if (activeFilter === 'date') {
                if (date) {
                    params.append('date', date);
                }

                if (!isAllDay) {
                    if (startTime) {
                        params.append('start_time', startTime);
                    }
                    if (endTime) {
                        params.append('end_time', endTime);
                    }
                }
            }

            params.append('purpose', purposeSlug);

            if (indoor !== 'both') {
                params.append('is_indoor', indoor === 'indoor' ? 'true' : 'false');
            }
        }

        const queryString = params.toString();
        if (queryString) {
            router.push(`/search/results?${queryString}`);
        } else {
            alert('検索条件が入力されていません');
        }
    }

    return (
        <>
            <NavigationBar />
            <div className="bg-back min-h-screen px-5 pt-18 pb-42">
                <div className="bg-primary">
                    <div className='relative flex items-center gap-3'>
                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onFocus={() => setIsInputFocused(true)}
                            className={`w-full bg-white border border-fg rounded-[12px] font-medium ${isInputFocused ? 'px-4 py-3' : 'py-3 pl-13 pr-3'}`}
                            placeholder='検索'
                        />
                        {isInputFocused ? (
                            <button
                                onClick={() => {
                                    setIsInputFocused(false);
                                    setSearchText('');
                                }}
                                className='text-sm whitespace-nowrap'
                            >
                                キャンセル
                            </button>
                        ) : (
                            <Search size={24} className='absolute top-1/2 left-4 -translate-y-1/2' />
                        )}
                    </div>
                </div>

                {isInputFocused && (
                    <div className='w-full bg-back'>
                        <div className='flex items-center justify-between py-4'>
                            <p className='text-sm font-medium text-holder'>検索履歴</p>
                            {searchHistory.length > 0 && (
                                <button
                                    onClick={clearAllSearchHistory}
                                    className='text-sm font-medium text-holder'
                                >
                                    全部削除
                                </button>
                            )}
                        </div>
                        {searchHistory.length > 0 ? (
                            <ul className=''>
                                {searchHistory.map((historyItem, index) => (
                                    <li
                                        key={index}
                                        className='flex items-center justify-between py-3'
                                    >
                                        <button
                                            onClick={() => selectSearchHistory(historyItem)}
                                            className='flex items-center gap-4 flex-1 text-left'
                                        >
                                            <History size={24} className='text-holder' />
                                            <p className='text-base'>{historyItem}</p>
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeSearchHistory(historyItem);
                                            }}
                                        >
                                            <X size={24} className='text-holder' />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className='text-sm text-holder py-4'>検索履歴がありません</p>
                        )}
                    </div>
                )}

                {!isInputFocused && (
                    <div className="px-4 mt-8">
                        <div className='flex items-center'>
                            <button
                                className={`w-full ${activeFilter === 'area' ? '' : 'text-holder'}`}
                                onClick={() => setActiveFilter('area')}
                                disabled={activeFilter === 'area'}
                            >
                                <LandPlot size={50} strokeWidth={1} className="mx-auto" />
                                <p className='text-base mt-2'>場所から検索</p>
                            </button>
                            <button
                                className={`w-full ${activeFilter === 'date' ? '' : 'text-holder'}`}
                                onClick={() => setActiveFilter('date')}
                                disabled={activeFilter === 'date'}
                            >
                                <CalendarFold size={50} strokeWidth={1} className="mx-auto" />
                                <p className='text-base mt-2'>日付から検索</p>
                            </button>
                        </div>

                        {activeFilter === 'area' && (
                            <div className='flex flex-col gap-6 mt-8'>
                                <p>エリア<span className='text-xs pl-2'>複数選択可</span></p>
                                <ul className='grid grid-cols-4 gap-2'>
                                    {areaTags.map((area) => (
                                        <li
                                            key={area.slug}
                                            className={`w-full py-1 border broder-holder rounded-full text-sm text-center ${areaSlugs.includes(area.slug)
                                                ? 'bg-main'
                                                : 'bg-white'
                                                }`}>
                                            <button onClick={() => toggleAreaSelection(area.slug)}>{area.label}</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {activeFilter === 'date' && (
                            <div className='flex flex-col gap-6 mt-8'>
                                <div>
                                    <label htmlFor="date" className='block'>日付</label>
                                    <div className='relative'>
                                        <select
                                            id="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className='w-full p-3 bg-white border border-fg rounded-[12px] mt-1 appearance-none'
                                        >
                                            <option value="">選択してください</option>
                                            {dateOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown size={24} className='absolute top-[18px] right-3 pointer-events-none' />
                                    </div>
                                </div>
                                <div className='relative flex items-center gap-6'>
                                    <p className='absolute top-11 left-1/2 -translate-x-1/2 text-sm'>〜</p>
                                    <div className='w-full'>
                                        <label htmlFor="start-time">開始時間</label>
                                        <div className='relative'>
                                            <select
                                                id="start-time"
                                                value={startTime}
                                                onChange={(e) => setStartTime(e.target.value)}
                                                className='w-full p-3 bg-white border border-fg rounded-[12px] mt-1 appearance-none'
                                            >
                                                {timeOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown size={18} className='absolute top-5 right-3 pointer-events-none' />
                                        </div>
                                    </div>
                                    <div className='w-full'>
                                        <label htmlFor="end-time">終了時間</label>
                                        <div className='relative'>
                                            <select
                                                id="end-time"
                                                value={endTime}
                                                onChange={(e) => setEndTime(e.target.value)}
                                                className='w-full p-3 bg-white border border-fg rounded-[12px] mt-1 appearance-none'
                                            >
                                                {timeOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown size={18} className='absolute top-5 right-3 pointer-events-none' />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsAllDay(!isAllDay)}
                                    className='flex items-center gap-2'
                                >
                                    <span className={`relative w-4 h-4 border border-fg rounded-full ${isAllDay
                                        ? "before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-fg before:rounded-full"
                                        : ''

                                        }`} ></span>
                                    <p className='w-fit text-base'>終日</p>
                                </button>
                            </div>
                        )}

                        <div className='flex flex-col gap-6 mt-8'>
                            <p>目的</p>
                            <ul className='grid grid-cols-3 gap-x-4 gap-y-3'>
                                {purposeTags.map((tag) => (
                                    <li
                                        key={tag.slug}
                                        className={`w-full py-1 border broder-holder rounded-full text-sm text-center ${tag.slug === purposeSlug
                                            ? 'bg-main'
                                            : 'bg-white'
                                            }`}
                                    >
                                        <button onClick={() => setPurposeSlug(tag.slug)} >{tag.label}</button>
                                    </li>
                                ))}
                            </ul>
                            <div className='flex gap-4'>
                                <button onClick={() => { setIndoor('both') }} className='flex items-center gap-2'>
                                    <span className={`relative w-4 h-4 border border-fg rounded-full ${indoor === 'both'
                                        ? "before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-fg before:rounded-full"
                                        : ''
                                        }`}></span>
                                    <p className='text-base'>どちらでも</p>
                                </button>
                                <button onClick={() => { setIndoor('outdoor') }} className='flex items-center gap-2'>
                                    <span className={`relative w-4 h-4 border border-fg rounded-full ${indoor === 'outdoor'
                                        ? "before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-fg before:rounded-full"
                                        : ''
                                        }`}></span>
                                    <p className='text-base'>屋外</p>
                                </button>
                                <button onClick={() => { setIndoor('indoor') }} className='flex items-center gap-2'>
                                    <span className={`relative w-4 h-4 border border-fg rounded-full ${indoor === 'indoor'
                                        ? "before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-fg before:rounded-full"
                                        : ''
                                        }`}></span>
                                    <p className='text-base'>屋内</p>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleSearch}
                    className='fixed left-1/2 -translate-x-1/2 bottom-24 w-[calc(100%-36px*2)] h-12 bg-sub rounded-full text-lg shadow-[1px_2px_1px_rgba(0,0,0,0.25)]'
                >
                    検索
                </button>
            </div >
        </>
    )
}