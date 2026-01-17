'use client'

type SearchButtonProps = {
    handleSearch: () => void;
}

export function SearchButton({ handleSearch }: SearchButtonProps) {
    return (
        <button
            onClick={handleSearch}
            className='fixed left-1/2 -translate-x-1/2 bottom-24 w-[calc(100%-36px*2)] h-12 bg-sub rounded-full text-lg shadow-[1px_2px_1px_rgba(0,0,0,0.25)]'
        >
            検索
        </button>
    );
}

