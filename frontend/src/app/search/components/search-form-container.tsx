'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AreaTag, PurposeTag, DateOption, TimeOption } from '../data';
import { saveSearchHistory, removeSearchHistory, clearSearchHistory } from '../actions';
import { SearchInput } from './search-input';
import { FilterToggle } from './filter-toggle';
import { AreaFilter } from './area-filter';
import { DateTimeFilter } from './date-time-filter';
import { PurposeFilter } from './purpose-filter';
import { SearchButton } from './search-button';

type SearchFormContainerProps = {
    areaTags: AreaTag[];
    purposeTags: PurposeTag[];
    dateOptions: DateOption[];
    timeOptions: TimeOption[];
    initialSearchHistory: string[];
}

export function SearchFormContainer({
    areaTags,
    purposeTags,
    dateOptions,
    timeOptions,
    initialSearchHistory,
}: SearchFormContainerProps) {
    const router = useRouter();

    const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
    const [searchHistory, setSearchHistory] = useState<string[]>(initialSearchHistory);
    const [activeFilter, setActiveFilter] = useState<('area' | 'date')>('area');

    const [searchText, setSearchText] = useState<string>('');
    const [areaSlugs, setAreaSlugs] = useState<string[]>(['meieki']);
    const [date, setDate] = useState<string>(dateOptions[0]?.value || '');
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [isAllDay, setIsAllDay] = useState<boolean>(false);
    const [purposeSlug, setPurposeSlug] = useState<string>('date');
    const [indoor, setIndoor] = useState<'both' | 'outdoor' | 'indoor'>('both');

    // 初期検索履歴を設定
    useEffect(() => {
        setSearchHistory(initialSearchHistory);
    }, [initialSearchHistory]);

    const handleSaveSearchHistory = async (text: string) => {
        if (!text.trim()) return;
        await saveSearchHistory(text);
        // 状態を更新
        const trimmedText = text.trim();
        const updatedHistory = [
            trimmedText,
            ...searchHistory.filter(item => item !== trimmedText)
        ].slice(0, 10);
        setSearchHistory(updatedHistory);
    };

    const handleRemoveSearchHistory = async (text: string) => {
        await removeSearchHistory(text);
        const updatedHistory = searchHistory.filter(item => item !== text);
        setSearchHistory(updatedHistory);
    };

    const handleClearAllSearchHistory = async () => {
        await clearSearchHistory();
        setSearchHistory([]);
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

    const handleSearch = async () => {
        const params = new URLSearchParams();

        if (isInputFocused) {
            if (searchText.trim()) {
                await handleSaveSearchHistory(searchText.trim());
                params.append('query', searchText.trim());
            }
        } else {
            if (searchText.trim()) {
                await handleSaveSearchHistory(searchText.trim());
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
    };

    return (
        <div className="bg-back min-h-screen px-5 pt-18 pb-42">
            <SearchInput
                searchText={searchText}
                setSearchText={setSearchText}
                isInputFocused={isInputFocused}
                setIsInputFocused={setIsInputFocused}
                searchHistory={searchHistory}
                onSelectHistory={selectSearchHistory}
                onRemoveHistory={handleRemoveSearchHistory}
                onClearAllHistory={handleClearAllSearchHistory}
            />

            {!isInputFocused && (
                <div className="px-4 mt-8">
                    <FilterToggle
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                    />

                    {activeFilter === 'area' && (
                        <AreaFilter
                            areaTags={areaTags}
                            areaSlugs={areaSlugs}
                            toggleAreaSelection={toggleAreaSelection}
                        />
                    )}

                    {activeFilter === 'date' && (
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
                    )}

                    <PurposeFilter
                        purposeTags={purposeTags}
                        purposeSlug={purposeSlug}
                        setPurposeSlug={setPurposeSlug}
                        indoor={indoor}
                        setIndoor={setIndoor}
                    />
                </div>
            )}

            <SearchButton handleSearch={handleSearch} />
        </div>
    );
}

