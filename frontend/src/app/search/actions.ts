'use server'

import { cookies } from 'next/headers';

export async function getSearchHistory(): Promise<string[]> {
    const cookieStore = await cookies();
    const savedHistory = cookieStore.get('searchHistory');

    if (!savedHistory) {
        return [];
    }

    try {
        const history = JSON.parse(savedHistory.value);
        return Array.isArray(history) ? history : [];
    } catch (e) {
        return [];
    }
}

export async function saveSearchHistory(text: string): Promise<void> {
    if (!text.trim()) return;

    const cookieStore = await cookies();
    const currentHistory = await getSearchHistory();
    const trimmedText = text.trim();

    const updatedHistory = [
        trimmedText,
        ...currentHistory.filter(item => item !== trimmedText)
    ].slice(0, 10); // 最大10件まで保存

    cookieStore.set('searchHistory', JSON.stringify(updatedHistory), {
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 365日
        httpOnly: false, // クライアント側でも読み取り可能にする必要がある場合は false
        sameSite: 'lax',
    });
}

export async function removeSearchHistory(text: string): Promise<void> {
    const cookieStore = await cookies();
    const currentHistory = await getSearchHistory();
    const updatedHistory = currentHistory.filter(item => item !== text);

    if (updatedHistory.length > 0) {
        cookieStore.set('searchHistory', JSON.stringify(updatedHistory), {
            expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            httpOnly: false,
            sameSite: 'lax',
        });
    } else {
        cookieStore.delete('searchHistory');
    }
}

export async function clearSearchHistory(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete('searchHistory');
}

