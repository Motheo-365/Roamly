import { useState, useEffect, useRef } from "react";
import { searchLocations, type LocationResult } from "../services/locationServices";

import "../styles/explore.css";

type PlaceType = "attraction" | "restaurant" | "hotel";

interface ExploreProps {
    onLocationSelect: (location: LocationResult) => void;
}


interface Place {
    id: number;
    name: string;
    type: PlaceType;
    rating: number;
    description: string;
    lat: number;
    lng: number;
}

const places: Place[] = [
    {
        id: 1,
        name: "Tokyo Tower",
        type: "attraction",
        rating: 4.6,
        description: "Iconic landmark with panoramic views of Tokyo.",
        lat: 35.6586,
        lng: 139.7454,
    },
    {
        id: 2,
        name: "Senso-ji Temple",
        type: "attraction",
        rating: 4.8,
        description: "Historic Buddhist temple in Asakusa.",
        lat: 35.7148,
        lng: 139.7967,
    },
    {
        id: 3,
        name: "Shibuya Crossing",
        type: "attraction",
        rating: 4.7,
        description: "One of the world's busiest pedestrian crossings.",
        lat: 35.6595,
        lng: 139.7005,
    },
    {
        id: 4,
        name: "Sushi Saito",
        type: "restaurant",
        rating: 4.9,
        description: "Highly rated Japanese sushi restaurant.",
        lat: 35.6655,
        lng: 139.7407,
    },
    {
        id: 5,
        name: "Ichiran Ramen",
        type: "restaurant",
        rating: 4.5,
        description: "Popular ramen restaurant known for tonkotsu ramen.",
        lat: 35.6618,
        lng: 139.6983,
    },
    {
        id: 6,
        name: "Shinjuku Granbell Hotel",
        type: "hotel",
        rating: 4.3,
        description: "Modern hotel in the heart of Shinjuku.",
        lat: 35.6951,
        lng: 139.7037,
    },
];

function Explore({onLocationSelect}: ExploreProps) {
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

    const [savedPlaces, setSavedPlaces] = useState<number[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

    /*
     * Filter places based on category and search
     */
    const filteredPlaces = places.filter((place) => {
        const matchesCategory =
            selectedCategory === "all" ||
            place.type === selectedCategory;

        const searchTerm = search.toLowerCase();

        const matchesSearch =
            place.name.toLowerCase().includes(searchTerm) ||
            place.description.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    /*
     * Focus map on a place
     */
    const focusPlace = (place: Place) => {
        setSelectedPlace(place);
    };

    /*
     * Save / unsave a place
     */
    const toggleSaved = (id: number) => {
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
                                setSelectedCategory("all")
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
                                setSelectedCategory("attraction")
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
                                setSelectedCategory("restaurant")
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
                                setSelectedCategory("hotel")
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

                        {filteredPlaces.map((place) => {
                            const isSaved =
                                savedPlaces.includes(place.id);

                            const isSelected =
                                selectedPlace?.id === place.id;

                            return (
                                <article
                                    key={place.id}
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
                                            <h3>{place.name}</h3>
                                            <button
                                                className={`save-button ${
                                                    isSaved
                                                        ? "saved"
                                                        : ""
                                                }`}
                                                onClick={(event) => {
                                                    event.stopPropagation();

                                                    toggleSaved(
                                                        place.id
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

                                        <div className="place-rating">
                                            ⭐ {place.rating}
                                        </div>

                                        <p>
                                            {place.description}
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
                    </div>
                </aside>

            </main>
        </div>
    );
}

export default Explore;