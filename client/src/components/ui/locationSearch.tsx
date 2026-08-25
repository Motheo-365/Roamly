import { useEffect, useState } from "react";

import {
    searchLocations,
    type LocationResult,
} from "../../services/locationServices";

interface LocationSearchProps {
    placeholder?: string;
    onSelect: (location: LocationResult) => void;
}

function LocationSearch({
    placeholder = "Search a destination...",
    onSelect,
}: LocationSearchProps) {

    const [search, setSearch] = useState("");
    const [results, setResults] = useState<LocationResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (search.trim().length < 2) {
            return;
        }

        const controller = new AbortController();

        const searchLocationsAsync = async () => {
            try {
                setLoading(true);

                const data = await searchLocations(
                    search,
                    controller.signal
                );

                setResults(data);
                setShowResults(true);

            } catch (error) {
                if (
                    error instanceof DOMException &&
                    error.name === "AbortError"
                ) {
                    return;
                }

                console.error(
                    "Location search failed:",
                    error
                );

            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(
            searchLocationsAsync,
            400
        );

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };

    }, [search]);

    const handleSelect = (
        location: LocationResult
    ) => {
        setSearch(location.display_name);
        setResults([]);
        setShowResults(false);

        onSelect(location);
    };

    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (results.length > 0) {
            handleSelect(results[0]);
        }
    };

    const handleSearchChange = (
        value: string
    ) => {
        setSearch(value);

        if (value.trim().length < 2) {
            setResults([]);
            setShowResults(false);
        }
    };

    return (
        <form
            className="location-search"
            onSubmit={handleSubmit}
        >
            <div className="search-input-wrapper">

                <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                        handleSearchChange(event.target.value)
                    }
                    onFocus={() => {
                        if (results.length > 0) {
                            setShowResults(true);
                        }
                    }}
                    placeholder={placeholder}
                    aria-label={placeholder}
                />

                {loading && (
                    <span className="search-loading">
                        ...
                    </span>
                )}

                {showResults &&
                    results.length > 0 && (
                        <div className="search-results">

                            {results.map(
                                (location, index) => (
                                    <button
                                        key={`${location.lat}-${location.lon}-${index}`}
                                        type="button"
                                        className="search-result"
                                        onClick={() =>
                                            handleSelect(
                                                location
                                            )
                                        }
                                    >
                                        <span className="result-icon">
                                            📍
                                        </span>

                                        <span className="result-name">
                                            {
                                                location.display_name
                                            }
                                        </span>
                                    </button>
                                )
                            )}

                        </div>
                    )}

            </div>

            <button
                type="submit"
                disabled={
                    loading ||
                    results.length === 0
                }
            >
                Search
            </button>
        </form>
    );
}

export default LocationSearch;