'use client'

import { LandPlot } from 'lucide-react';
import { CalendarFold } from 'lucide-react';

type FilterToggleProps = {
    activeFilter: 'area' | 'date';
    setActiveFilter: (filter: 'area' | 'date') => void;
}

export function FilterToggle({ activeFilter, setActiveFilter }: FilterToggleProps) {
    return (
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
    );
}

