'use client'

import { Search } from 'lucide-react';
import { SearchHistory } from './search-history';

type SearchInputProps = {
    searchText: string;
    setSearchText: (text: string) => void;
    isInputFocused: boolean;
    setIsInputFocused: (focused: boolean) => void;
    searchHistory: string[];
    onSelectHistory: (text: string) => void;
    onRemoveHistory: (text: string) => void;
    onClearAllHistory: () => void;
}

export function SearchInput({
    searchText,
    setSearchText,
    isInputFocused,
    setIsInputFocused,
    searchHistory,
    onSelectHistory,
    onRemoveHistory,
    onClearAllHistory,
}: SearchInputProps) {
    return (
        <>
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
                <SearchHistory
                    searchHistory={searchHistory}
                    onSelectHistory={onSelectHistory}
                    onRemoveHistory={onRemoveHistory}
                    onClearAll={onClearAllHistory}
                />
            )}
        </>
    );
}

