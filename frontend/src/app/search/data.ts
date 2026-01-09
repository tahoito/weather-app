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

export function getNearestTimeOption(timeOptions: TimeOption[]): string {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    // 現在時刻を分単位で計算
    const currentTotalMinutes = currentHours * 60 + currentMinutes;

    // 30分刻みに丸める（切り上げ）
    const roundedMinutes = Math.ceil(currentTotalMinutes / 30) * 30;

    // 24時間を超える場合は翌日の00:00を返す
    if (roundedMinutes >= 24 * 60) {
        return '00:00';
    }

    // 丸めた時間をHH:MM形式に変換
    const roundedHours = Math.floor(roundedMinutes / 60);
    const roundedMins = roundedMinutes % 60;
    const nearestTime = `${String(roundedHours).padStart(2, '0')}:${String(roundedMins).padStart(2, '0')}`;

    // 時間オプションに存在するか確認し、存在すれば返す
    const exists = timeOptions.some(option => option.value === nearestTime);
    if (exists) {
        return nearestTime;
    }

    // 存在しない場合は最初のオプションを返す（フォールバック）
    return timeOptions[0]?.value || '';
}

/**
 * 開始時間から1時間後の時間を取得する
 * 30分刻みの時間オプションから、開始時間の1時間後に最も近い時間を返す
 */
export function getOneHourLaterTime(startTime: string, timeOptions: TimeOption[]): string {
    if (!startTime) {
        return '';
    }

    // 開始時間を分単位で計算
    const [hours, minutes] = startTime.split(':').map(Number);
    const startTotalMinutes = hours * 60 + minutes;

    // 1時間後を計算
    const oneHourLaterMinutes = startTotalMinutes + 60;

    // 24時間を超える場合は翌日の00:00を返す
    if (oneHourLaterMinutes >= 24 * 60) {
        return '00:00';
    }

    // 30分刻みに丸める（切り上げ）
    const roundedMinutes = Math.ceil(oneHourLaterMinutes / 30) * 30;

    // 24時間を超える場合は翌日の00:00を返す
    if (roundedMinutes >= 24 * 60) {
        return '00:00';
    }

    // 丸めた時間をHH:MM形式に変換
    const roundedHours = Math.floor(roundedMinutes / 60);
    const roundedMins = roundedMinutes % 60;
    const oneHourLaterTime = `${String(roundedHours).padStart(2, '0')}:${String(roundedMins).padStart(2, '0')}`;

    // 時間オプションに存在するか確認し、存在すれば返す
    const exists = timeOptions.some(option => option.value === oneHourLaterTime);
    if (exists) {
        return oneHourLaterTime;
    }

    // 存在しない場合は最初のオプションを返す（フォールバック）
    return timeOptions[0]?.value || '';
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

