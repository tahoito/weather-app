'use client'

import { PurposeTag } from '../data';
import { IndoorFilter } from './indoor-filter';

type PurposeFilterProps = {
    purposeTags: PurposeTag[];
    purposeSlug: string;
    setPurposeSlug: (slug: string) => void;
    indoor: 'both' | 'outdoor' | 'indoor';
    setIndoor: (indoor: 'both' | 'outdoor' | 'indoor') => void;
}

export function PurposeFilter({ purposeTags, purposeSlug, setPurposeSlug, indoor, setIndoor }: PurposeFilterProps) {
    return (
        <div className='flex flex-col gap-6 mt-8'>
            <p>目的</p>
            <ul className='grid grid-cols-3 gap-x-4 gap-y-3'>
                {purposeTags.map((tag) => (
                    <li
                        key={tag.slug}
                        className={`w-full py-1 border border-holder rounded-full text-sm text-center ${tag.slug === purposeSlug
                            ? 'bg-main'
                            : 'bg-white'
                            }`}
                    >
                        <button type="button" onClick={() => setPurposeSlug(tag.slug)}
                            className="w-full py-1 text-center">
                            {tag.label}
                        </button>
                    </li>
                ))}
            </ul>
            <IndoorFilter
                indoor={indoor}
                setIndoor={setIndoor}
            />
        </div>
    );
}

