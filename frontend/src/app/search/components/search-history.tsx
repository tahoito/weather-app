'use client'

import { SearchHistoryItem } from './search-history-item';

type SearchHistoryProps = {
    searchHistory: string[];
    onSelectHistory: (text: string) => void;
    onRemoveHistory: (text: string) => void;
    onClearAll: () => void;
}

export function SearchHistory({ searchHistory, onSelectHistory, onRemoveHistory, onClearAll }: SearchHistoryProps) {
    return (
        <div className='w-full bg-back'>
            <div className='flex items-center justify-between py-4'>
                <p className='text-sm font-medium text-holder'>検索履歴</p>
                {searchHistory.length > 0 && (
                    <button
                        onClick={onClearAll}
                        className='text-sm font-medium text-holder'
                    >
                        全部削除
                    </button>
                )}
            </div>
            {searchHistory.length > 0 ? (
                <ul className=''>
                    {searchHistory.map((historyItem, index) => (
                        <SearchHistoryItem
                            key={index}
                            historyItem={historyItem}
                            onSelect={onSelectHistory}
                            onRemove={onRemoveHistory}
                        />
                    ))}
                </ul>
            ) : (
                <p className='text-sm text-holder text-center py-4'>検索履歴がありません</p>
            )}
        </div>
    );
}

