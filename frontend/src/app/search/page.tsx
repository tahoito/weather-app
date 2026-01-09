import { NavigationBar } from "@/components/navigation-bar";
import { areaTags, purposeTags, getDateOptions, getTimeOptions } from './data';
import { getSearchHistory } from './actions';
import { SearchFormContainer } from "./components/search-form-container";

export default async function Page() {
    const initialSearchHistory = await getSearchHistory();
    const dateOptions = getDateOptions();
    const timeOptions = getTimeOptions();

    return (
        <>
            <NavigationBar />
            <SearchFormContainer
                areaTags={areaTags}
                purposeTags={purposeTags}
                dateOptions={dateOptions}
                timeOptions={timeOptions}
                initialSearchHistory={initialSearchHistory}
            />
        </>
    );
}
