'use client'

import { AreaTag } from '../data';

type AreaFilterProps = {
    areaTags: AreaTag[];
    areaSlugs: string[];
    toggleAreaSelection: (slug: string) => void;
}

export function AreaFilter({ areaTags, areaSlugs, toggleAreaSelection }: AreaFilterProps) {
    return (
        <div className='flex flex-col gap-6 mt-8'>
            <p>エリア<span className='text-xs pl-2'>複数選択可</span></p>
            <ul className='grid grid-cols-4 gap-2'>
                {areaTags.map((area) => (
                    <li
                        key={area.slug}
                        className={`w-full py-1 border border-holder rounded-full text-sm text-center ${areaSlugs.includes(area.slug)
                            ? 'bg-main'
                            : 'bg-white'
                            }`}
                    >
                        <button onClick={() => toggleAreaSelection(area.slug)}>{area.label}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

