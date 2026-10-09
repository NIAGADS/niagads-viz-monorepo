import SearchResults from "@/components/SearchResults/SearchResults";

const SearchPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const searchTerm = (await searchParams).term;

    // make api call to search endpoint
    const results = {
        datasets: {
            columns: [],
            data: [],
        },
        genes: {
            columns: [],
            data: [],
        },
    };

    return (
        <main>
            <div className="content-section content-section-centered">
                <h2>Searching for: {searchTerm}</h2>
                <h2>Results:</h2>
                <SearchResults searchResults={results} />
            </div>
        </main>
    );
};

export default SearchPage;
