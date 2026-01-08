export type AreaTag = {
    label: string;
    slug: string;
}

export const areaTags: AreaTag[] = [
    { label: '名駅', slug: 'meieki' },
    { label: '大須', slug: 'osu' },
    { label: '金山', slug: 'kanayama' },
    { label: '栄', slug: 'sakae' },
    { label: '伏見', slug: 'fushimi' },
    { label: '矢場町', slug: 'yabacho' },
    { label: '上前津', slug: 'kamimaezu' },
    { label: '鶴舞', slug: 'tsurumai' },
    { label: '星ヶ丘', slug: 'hoshigaoka' },
    { label: '八事', slug: 'yagoto' },
    { label: '桜山', slug: 'sakurayama' },
    { label: '今池', slug: 'imaike' },
    { label: '覚王山', slug: 'kakuozan' },
    { label: '本山', slug: 'motoyama' },
    { label: '新瑞橋', slug: 'aratamabashi' },
    { label: '久屋大通', slug: 'hisayaodori' },
]

export type PurposeTag = {
    label: string;
    slug: string;
}

export const purposeTags: PurposeTag[] = [
    { label: 'デート', slug: 'date' },
    { label: '友達', slug: 'friend' },
    { label: '映え', slug: 'photo' },
    { label: 'リラックス', slug: 'relax' },
    { label: '推し活', slug: 'bias' },
    { label: '勉強・作業', slug: 'study' },
    { label: '一人', slug: 'alone' },
    { label: '放課後', slug: 'after_school' },
    { label: 'アクティブ', slug: 'active' },
    { label: 'ゆっくり', slug: 'slow' },
    { label: '買い物', slug: 'shopping' },
    { label: '食事', slug: 'food' },
]

export type DateOption = {
    label: string;
    value: string;
};

export function getDateOptions(): DateOption[] {
    const options: DateOption[] = [];
    const today = new Date();

    for (let i = 0; i <= 10; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        options.push({
            label: `${year}年${month}月${day}日`,
            value: `${year}-${month}-${day}`,
        });
    }

    return options;
}

export type TimeOption = {
    label: string;
    value: string;
};

export function getTimeOptions(): TimeOption[] {
    const options: TimeOption[] = [];

    for (let hours = 0; hours < 24; hours++) {
        for (let minutes = 0; minutes < 60; minutes += 30) {
            const h = String(hours).padStart(2, '0');
            const m = String(minutes).padStart(2, '0');
            const time = `${h}:${m}`;

            options.push({
                label: time,
                value: time,
            });
        }
    }

    return options;
}

export type SearchParams = {
    searchText: string;
    areaSlugs: string[];
    date: string;
    startTime: string;
    endTime: string;
    isAllDay: boolean;
    purposeSlug: string;
    indoor: 'both' | 'outdoor' | 'indoor';
}

