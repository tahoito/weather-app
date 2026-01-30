'use client'

import { ChevronDown } from 'lucide-react';
import { DateOption, TimeOption } from '../data';

type DateTimeFilterProps = {
    dateOptions: DateOption[];
    timeOptions: TimeOption[];
    date: string;
    setDate: (date: string) => void;
    startTime: string;
    setStartTime: (time: string) => void;
    endTime: string;
    setEndTime: (time: string) => void;
    isAllDay: boolean;
    setIsAllDay: (isAllDay: boolean) => void;
}

export function DateTimeFilter({
    dateOptions,
    timeOptions,
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    isAllDay,
    setIsAllDay,
}: DateTimeFilterProps) {
    return (
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
                    ? "border-main before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-main before:rounded-full"
                    : ''
                    }`} ></span>
                <p className='w-fit text-base'>終日</p>
            </button>
        </div>
    );
}

