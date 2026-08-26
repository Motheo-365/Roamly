import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
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
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const markersRef = useRef<L.Marker[]>([]);

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
     * Create the map
     */
    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) {
            return;
        }

        const map = L.map(mapContainerRef.current).setView(
            [35.6762, 139.6503],
            12
        );

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
            }
        ).addTo(map);

        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    /*
     * Update map markers whenever filtering changes
     */
    useEffect(() => {
        if (!mapRef.current) {
            return;
        }

        // Remove previous markers
        markersRef.current.forEach((marker) => {
            marker.remove();
        });

        markersRef.current = [];

        // Add new markers
        filteredPlaces.forEach((place) => {
            const marker = L.marker([place.lat, place.lng])
                .addTo(mapRef.current!)
                .bindPopup(`
                    <strong>${place.name}</strong>
                    <br />
                    ⭐ ${place.rating}
                `);

            marker.on("click", () => {
                setSelectedPlace(place);
            });

            markersRef.current.push(marker);
        });
    }, [filteredPlaces]);

    /*
     * Focus map on a place
     */
    const focusPlace = (place: Place) => {
        setSelectedPlace(place);

        if (!mapRef.current) {
            return;
        }

        mapRef.current.flyTo(
            [place.lat, place.lng],
            16,
            {
                duration: 1,
            }
        );
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

                {/* Map */}
                <section className="explore-map">
                    <div
                        ref={mapContainerRef}
                        className="map-container"
                    />

                    {/* Selected place popup */}
                    {selectedPlace && (
                        <div className="selected-place">
                            <button
                                className="close-selected"
                                onClick={() =>
                                    setSelectedPlace(null)
                                }
                            >
                                ×
                            </button>

                            <span>
                                {getPlaceIcon(selectedPlace.type)}
                            </span>

                            <div>
                                <h3>
                                    {selectedPlace.name}
                                </h3>

                                <p>
                                    ⭐ {selectedPlace.rating}
                                </p>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Explore;