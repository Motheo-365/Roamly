import { useState } from "react";
import "../styles/explore.css";

type PlaceType = "attraction" | "restaurant" | "hotel";

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

function Explore() {
    const [selectedCategory, setSelectedCategory] = useState<
        "all" | PlaceType
    >("all");

    const [search, setSearch] = useState("");
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
                    <h1>Explore your next adventure</h1>

                    <p>
                        Discover places, restaurants and experiences
                        for your next trip.
                    </p>
                </div>

                <div className="search-wrapper">
                    {/* Search */}
                    <div className="explore-search">
                        <input
                            type="text"
                            placeholder="Search a city, area or destination..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />

                        {search && (
                            <button
                                className="clear-search"
                                onClick={() => setSearch("")}
                            >
                                ×
                            </button>
                        )}
                    </div>

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