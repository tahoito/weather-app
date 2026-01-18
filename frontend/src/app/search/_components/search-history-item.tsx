'use client'

import { History } from 'lucide-react';
import { X } from 'lucide-react';

type SearchHistoryItemProps = {
    historyItem: string;
    onSelect: (text: string) => void;
    onRemove: (text: string) => void;
}

export function SearchHistoryItem({ historyItem, onSelect, onRemove }: SearchHistoryItemProps) {
    return (
        <li className='flex items-center justify-between py-3'>
            <button
                onClick={() => onSelect(historyItem)}
                className='flex items-center gap-4 flex-1 text-left'
            >
                <History size={24} className='text-holder' />
                <p className='text-base'>{historyItem}</p>
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(historyItem);
                }}
            >
                <X size={24} className='text-holder' />
            </button>
        </li>
    );
}

