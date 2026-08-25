import { useEffect, useRef, useState } from "react";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "../../styles/map.css";

interface LocationResult {
    lat: string;
    lon: string;
    display_name: string;
}

function Map() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    const [search, setSearch] = useState("");
    const [results, setResults] = useState<LocationResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) {
            return;
        }

        const map = L.map(mapContainerRef.current).setView(
            [-25.7479, 28.2293],
            12
        );

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }
        ).addTo(map);

        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (search.trim().length < 2) {
            return;
        }

        const controller = new AbortController();

        const searchLocations = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                        search
                    )}&limit=5&addressdetails=1`,
                    {
                        signal: controller.signal,
                    }
                );

                if (!response.ok) {
                    throw new Error("Search failed.");
                }

                const data: LocationResult[] =
                    await response.json();

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
            searchLocations,
            400
        );

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [search]);

    const handleSearchChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;

        setSearch(value);

        if (value.trim().length < 2) {
            setResults([]);
            setShowResults(false);
        }
    };

    const selectLocation = (
        location: LocationResult
    ) => {
        if (!mapRef.current) {
            return;
        }

        const lat = Number(location.lat);
        const lon = Number(location.lon);

        mapRef.current.flyTo(
            [lat, lon],
            13,
            {
                duration: 1.5,
            }
        );

        if (markerRef.current) {
            markerRef.current.remove();
        }

        markerRef.current = L.marker([lat, lon])
            .addTo(mapRef.current)
            .bindPopup(location.display_name)
            .openPopup();

        setSearch(location.display_name);
        setResults([]);
        setShowResults(false);
    };

    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (results.length > 0) {
            selectLocation(results[0]);
        }
    };

    return (
        <div className="map-wrapper">

            <form
                className="map-search"
                onSubmit={handleSubmit}
            >
                <div className="search-input-wrapper">

                    <input
                        type="text"
                        value={search}
                        onChange={handleSearchChange}
                        onFocus={() => {
                            if (results.length > 0) {
                                setShowResults(true);
                            }
                        }}
                        placeholder="Search a destination..."
                        aria-label="Search destination"
                    />

                    {loading && (
                        <span className="search-loading">
                            ...
                        </span>
                    )}

                    {showResults && results.length > 0 && (
                        <div className="search-results">

                            {results.map((location, index) => (
                                <button
                                    key={`${location.lat}-${location.lon}-${index}`}
                                    type="button"
                                    className="search-result"
                                    onClick={() =>
                                        selectLocation(location)
                                    }
                                >
                                    <span className="result-icon">

                                    </span>

                                    <span className="result-name">
                                        {location.display_name}
                                    </span>
                                </button>
                            ))}

                        </div>
                    )}

                </div>

                <button
                    type="submit"
                    disabled={loading || results.length === 0}
                >
                    Search
                </button>
            </form>

            <div
                ref={mapContainerRef}
                className="map-container"
            />

        </div>
    );
}

export default Map;