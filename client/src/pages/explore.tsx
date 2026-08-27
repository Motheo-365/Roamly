import { useState, useEffect, useRef } from "react";
import { searchLocations, type LocationResult, type NearbyPlaces } from "../services/locationServices";

import "../styles/explore.css";

type PlaceType = "attraction" | "restaurant" | "hotel";

interface ExploreProps {
    onLocationSelect: (location: LocationResult) => void;
    nearbyPlaces: NearbyPlaces;
}

interface Place extends LocationResult {
    type: PlaceType;
}

function Explore({ onLocationSelect, nearbyPlaces }: ExploreProps) {
    const [selectedCategory, setSelectedCategory] = useState< "all" | PlaceType>("all");

    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const selectingLocation = useRef(false);

    useEffect(() => {
        if (selectingLocation.current) {
            selectingLocation.current = false;
            return;
        }

        if (search.trim().length < 2) return;

        const controller = new AbortController();

        const searchLocation = async () => {
            try {
                setLoadingSearch(true);

                const results = await searchLocations(
                    search,
                    controller.signal
                );

                setSearchResults(results);
                setShowSearchResults(true);
            } catch (error) {
                if (
                    error instanceof DOMException &&
                    error.name === "AbortError"
                ) {
                    return;
                }

                console.error("Location search failed:", error);
                setSearchResults([]);
                setShowSearchResults(false);
            } finally {
                setLoadingSearch(false);
            }
        };

        const timeout = setTimeout(searchLocation, 400);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [search]);

    // Add a function to select a location
    const handleLocationSelect = (location: LocationResult) => {
        selectingLocation.current = true;

        setSearch(location.display_name);
        setSearchResults([]);
        setShowSearchResults(false);

        onLocationSelect(location);
    };


    // For search button
    const handleSearchSubmit = ( event: React.FormEvent<HTMLFormElement> ) => {
        event.preventDefault();

        if (searchResults.length > 0) {
            handleLocationSelect(searchResults[0]);
        }
    };

    const [savedPlaces, setSavedPlaces] = useState<string[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
    
    const [currentPage, setCurrentPage] = useState(1);

    const getPlaceId = (place: Place) => `${place.lat}-${place.lon}`;

    const placesPerPage = 6;

    const allNearbyPlaces: Place[] = [
        ...nearbyPlaces.attraction.map( (place) => ({
            ...place,
            type: "attraction" as PlaceType,
        })),
        ...nearbyPlaces.restaurant.map( (place) => ({
            ...place,
            type: "restaurant" as PlaceType,
        })),
        ...nearbyPlaces.hotel.map( (place) => ({
            ...place,
            type: "hotel" as PlaceType,
        })),
    ]

    const filteredPlaces =
        selectedCategory === "all"
            ? allNearbyPlaces
            : allNearbyPlaces.filter(
                (place) => place.type === selectedCategory
            );

    const totalPages = Math.ceil(
        filteredPlaces.length / placesPerPage
    );

    const startIndex = (currentPage - 1) * placesPerPage;

    const currentPlaces = filteredPlaces.slice(
        startIndex,
        startIndex + placesPerPage
    );
    /*
     * Focus map on a place
     */
    const focusPlace = (place: Place) => {
        setSelectedPlace(place);
        onLocationSelect(place);
    };

    /*
     * Save / unsave a place
     */
    const toggleSaved = (id: string) => {
        setSavedPlaces((current) => {
            if (current.includes(id)) {
                return current.filter((placeId) => placeId !== id);
            }

            return [...current, id];
        });
    };

    /*
     * Get icon for place type
     */
    const getPlaceIcon = (type: PlaceType) => {
        switch (type) {
            case "attraction":
                return "📍";

            case "restaurant":
                return "🍜";

            case "hotel":
                return "🏨";
        }
    };

    return (
        <div className="explore-page">
            {/* Header */}
            <header className="explore-header">
                <div>
                    <p>
                        Discover places, restaurants and experiences
                        for your next trip.
                    </p>
                </div>

                <div className="search-wrapper">
                    {/* Search */}
                    <form className="explore-search" onSubmit={handleSearchSubmit} >
                        <input
                            type="text"
                            placeholder="Search a city, area or destination..."
                            value={search}
                            onChange={(event) => {
                                const value = event.target.value;
                                setSearch(value);

                                if (value.trim().length < 2) {
                                    setSearchResults([]);
                                    setShowSearchResults(false);
                                }
                            }}
                            onFocus={() => {
                                if (searchResults.length > 0) {
                                    setShowSearchResults(true);
                                }
                            }}
                        />

                        {loadingSearch && (
                            <span className="explore-search-loading">
                                Searching...
                            </span>
                        )}

                        {search && (
                            <button
                                type="button"
                                className="clear-search"
                                onClick={() => {
                                    setSearch("");
                                    setSearchResults([]);
                                    setShowSearchResults(false);
                                }}
                            >
                                ×
                            </button>
                        )}

                        {showSearchResults && searchResults.length > 0 && (
                            <div className="explore-search-results">
                                {searchResults.map((location, index) => (
                                    <button
                                        type="button"
                                        key={`${location.lat}-${location.lon}-${index}`}
                                        className="explore-search-result"
                                        onClick={() =>
                                            handleLocationSelect(location)
                                        }
                                    >
                                        <span>
                                            {location.display_name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </form>

                    {/* Popular destinations */}
                    <div className="popular-destinations">
                        <span>Popular:</span>

                        <button
                            onClick={() => setSearch("Tokyo")}
                        >
                            Tokyo
                        </button>

                        <button
                            onClick={() => setSearch("Seoul")}
                        >
                            Seoul
                        </button>

                        <button
                            onClick={() => setSearch("Paris")}
                        >
                            Paris
                        </button>

                        <button
                            onClick={() => setSearch("Cape Town")}
                        >
                            Cape Town
                        </button>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="explore-content">
                {/* Sidebar */}
                <aside className="explore-sidebar">

                    <div className="sidebar-heading">
                        <div>
                            <h2>Explore</h2>

                            <span>
                                {filteredPlaces.length} places
                            </span>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="category-filters">
                        <button
                            className={
                                selectedCategory === "all"
                                    ? "active"
                                    : ""
                            }
                            onClick={() => 
                                {
                                    setSelectedCategory("all");
                                    setCurrentPage(1);
                                }
                            }
                        >
                            All
                        </button>

                        <button
                            className={
                                selectedCategory === "attraction"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                {   
                                    setSelectedCategory("attraction");
                                    setCurrentPage(1);
                                }
                            }
                        >
                            Attractions
                        </button>

                        <button
                            className={
                                selectedCategory === "restaurant"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                {
                                    setSelectedCategory("restaurant");
                                    setCurrentPage(1);
                                }
                            }
                        >
                            Restaurants
                        </button>

                        <button
                            className={
                                selectedCategory === "hotel"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                {
                                    setSelectedCategory("hotel");
                                    setCurrentPage(1);
                                }
                            }
                        >
                            Hotels
                        </button>
                    </div>

                    {/* Results */}
                    <div className="place-results">
                        {filteredPlaces.length === 0 && (
                            <div className="no-results">
                                <h3>No places found</h3>

                                <p>
                                    Try searching for another
                                    destination.
                                </p>
                            </div>
                        )}

                        {currentPlaces.map((place, index) => {
                            const isSaved = savedPlaces.includes(getPlaceId(place));
                            const isSelected = selectedPlace ? getPlaceId(selectedPlace) === getPlaceId(place) : false;
                            const key = `${place.lat}-${place.lon}-${index}`

                            return (
                                <article
                                    key={key}
                                    className={`place-card ${
                                        isSelected
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        focusPlace(place)
                                    }
                                >
                                    <div className="place-image">
                                        <span>
                                            {getPlaceIcon(place.type)}
                                        </span>
                                    </div>

                                    <div className="place-info">
                                        <div className="place-title">
                                            <h3>{place.display_name.split(",")[0]}</h3>
                                            <button
                                                className={`save-button ${
                                                    isSaved
                                                        ? "saved"
                                                        : ""
                                                }`}
                                                onClick={(event) => {
                                                    event.stopPropagation();

                                                    toggleSaved(
                                                        getPlaceId(place)
                                                    );
                                                }}
                                            >
                                                {isSaved
                                                    ? "♥"
                                                    : "♡"}
                                            </button>
                                        </div>

                                        <span className="place-type">
                                            {place.type}
                                        </span>

                                        <p>
                                            {place.display_name}
                                        </p>
                                        <button
                                            className="add-button"
                                            onClick={(event) => {
                                                event.stopPropagation();

                                                console.log(
                                                    "Add to trip:",
                                                    place
                                                );
                                            }}
                                        >
                                            + Add to trip
                                        </button>
                                    </div>
                                </article>
                            );
                        })} 
                        {
                            totalPages > 1 && (
                                <div className="pagination">
                                        <button
                                            type="button"
                                            className="pagination-button"
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage((page) => page - 1)}
                                        >
                                            ←
                                        </button>

                                        <div className="pagination-pages">
                                            {Array.from(
                                                { length: totalPages },
                                                (_, index) => index + 1
                                            ).map((page) => (
                                                <button
                                                    key={page}
                                                    type="button"
                                                    className={`pagination-page ${
                                                        currentPage === page
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                    onClick={() => setCurrentPage(page)}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            className="pagination-button"
                                            disabled={currentPage === totalPages}
                                            onClick={() =>
                                                setCurrentPage((page) => page + 1)
                                            }
                                        >
                                            →
                                        </button>
                                </div>
                            )}
                    </div>
                </aside>

            </main>
        </div>
    );
}

export default Explore;