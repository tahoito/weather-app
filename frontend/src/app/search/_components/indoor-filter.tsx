'use client'

type IndoorFilterProps = {
    indoor: 'both' | 'outdoor' | 'indoor';
    setIndoor: (indoor: 'both' | 'outdoor' | 'indoor') => void;
}

export function IndoorFilter({ indoor, setIndoor }: IndoorFilterProps) {
    return (
        <div className='flex gap-4'>
            <button onClick={() => { setIndoor('both') }} className='flex items-center gap-2'>
                <span className={`relative w-4 h-4 border border-fg rounded-full ${indoor === 'both'
                    ? "border-main before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-main before:rounded-full"
                    : ''
                    }`}></span>
                <p className='text-base'>どちらでも</p>
            </button>
            <button onClick={() => { setIndoor('outdoor') }} className='flex items-center gap-2'>
                <span className={`relative w-4 h-4 border border-fg rounded-full ${indoor === 'outdoor'
                    ? "border-main before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-main before:rounded-full"
                    : ''
                    }`}></span>
                <p className='text-base'>屋外</p>
            </button>
            <button onClick={() => { setIndoor('indoor') }} className='flex items-center gap-2'>
                <span className={`relative w-4 h-4 border border-fg rounded-full ${indoor === 'indoor'
                    ? "border-main before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-main before:rounded-full"
                    : ''
                    }`}></span>
                <p className='text-base'>屋内</p>
            </button>
        </div>
    );
}

