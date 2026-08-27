import { useEffect, useRef, useState } from "react";
import L from "leaflet";

import LocationSearch from "./locationSearch";
import {
    searchNearbyLocations,
    type LocationResult,
    type NearbyLocationType,
} from "../../services/locationServices";
import { getRoute } from "../../services/routeServices";

import "leaflet/dist/leaflet.css";
import "../../styles/map.css";

export type NearbyPlaces = Record<NearbyLocationType, LocationResult[]>;

interface MapProps {
    selectedLocation: LocationResult | null;
    onNearbyPlacesChange: (places: NearbyPlaces) => void;
}

interface SavedItem {
    id: string;
    type: "route";
    title: string;
    fromLocation: LocationResult;
    toLocation: LocationResult;
    date: string;
}

const nearbyTypes: NearbyLocationType[] = [
    "attraction",
    "hotel",
    "restaurant",
];

const nearbyLabels: Record<NearbyLocationType, string> = {
    attraction: "Attractions",
    hotel: "Hotels",
    restaurant: "Restaurants",
};

function Map({ selectedLocation, onNearbyPlacesChange }: MapProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const routeRef = useRef<L.Polyline | null>(null);
    const nearbyLayersRef = useRef< Record<NearbyLocationType, L.LayerGroup> >({
        attraction: L.layerGroup(),
        hotel: L.layerGroup(),
        restaurant: L.layerGroup(),
    });

    const [fromLocation, setFromLocation] = useState<LocationResult | null>(null);
    const [toLocation, setToLocation] = useState<LocationResult | null>(null);
    const [loadingRoute, setLoadingRoute] = useState(false);
    const [routeError, setRouteError] = useState<string | null>(null);
    const [routeSummary, setRouteSummary] = useState<{ distance: number; duration: number } | null>(null);
    
    const [nearbyPlaces, setNearbyPlaces] = useState< Record<NearbyLocationType, LocationResult[]> >({ attraction: [], hotel: [], restaurant: [] });
    const [visibleNearbyTypes, setVisibleNearbyTypes] = useState< Record<NearbyLocationType, boolean> >({ attraction: true, hotel: true, restaurant: true });
    const [nearbyError, setNearbyError] = useState<string | null>(null);

    const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
        const localData = localStorage.getItem("roam_saved_routes");

        if (!localData) return [];

        try {
            const parsed: unknown = JSON.parse(localData);
            return Array.isArray(parsed) ? parsed as SavedItem[] : [];
        } catch (error) {
            console.error("Failed to parse saved routes", error);
            return [];
        }
    });
    const [showSavedList, setShowSavedList] = useState(false);

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

        nearbyTypes.forEach((type) => {
            nearbyLayersRef.current[type].addTo(map);
        });

        return () => {
            map.remove();
            mapRef.current = null;
            markerRef.current = null;
            routeRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!toLocation || !mapRef.current) {
            return;
        }

        let cancelled = false;
        setNearbyError(null);

        const loadNearbyPlaces = async () => {
            try {
                const results = await Promise.allSettled(
                    nearbyTypes.map((type) =>
                        searchNearbyLocations(
                            Number(toLocation.lat),
                            Number(toLocation.lon),
                            type
                        )
                    )
                );

                if (cancelled) return;

                const failedRequests = results.filter(
                    (result) => result.status === "rejected"
                ).length;
                const places: NearbyPlaces = {
                    attraction: results[0].status === "fulfilled" ? results[0].value : [],
                    hotel: results[1].status === "fulfilled" ? results[1].value : [],
                    restaurant: results[2].status === "fulfilled" ? results[2].value : [],
                };
                setNearbyPlaces(places);
                onNearbyPlacesChange(places);
                if (failedRequests > 0) {
                    setNearbyError("Some nearby place categories could not be loaded.");
                }

                nearbyTypes.forEach((type) => {
                    const layer = nearbyLayersRef.current[type];
                    layer.clearLayers();

                    places[type].forEach((place) => {
                        L.circleMarker(
                            [Number(place.lat), Number(place.lon)],
                            {
                                radius: 7,
                                color: "#18232d",
                                weight: 1,
                                fillColor:
                                    type === "attraction"
                                        ? "#d46b3c"
                                        : type === "hotel"
                                            ? "#397d8a"
                                            : "#d4a33c",
                                fillOpacity: 0.9,
                            }
                        )
                            .bindPopup(place.display_name)
                            .addTo(layer);
                    });
                });
            } catch (error) {
                if (!cancelled) {
                    console.error("Nearby places failed:", error);
                    setNearbyError("Unable to load nearby places.");
                }
            }
        };

        loadNearbyPlaces();

        return () => {
            cancelled = true;
        };
    }, [onNearbyPlacesChange, toLocation]);

    const toggleNearbyType = (type: NearbyLocationType) => {
        const map = mapRef.current;
        const layer = nearbyLayersRef.current[type];
        const isVisible = visibleNearbyTypes[type];

        if (map) {
            if (isVisible) {
                layer.removeFrom(map);
            } else {
                layer.addTo(map);
            }
        }

        setVisibleNearbyTypes((current) => ({
            ...current,
            [type]: !isVisible,
        }));
    };

    const handleLocationSelect = (location: LocationResult) => {
        if (!mapRef.current) return;

        const lat = Number(location.lat);
        const lon = Number(location.lon);

        mapRef.current.flyTo([lat, lon], 13, { duration: 1.5 });

        if (markerRef.current) {
            markerRef.current.remove();
        }

        markerRef.current = L.marker([lat, lon])
            .addTo(mapRef.current)
            .bindPopup(location.display_name)
            .openPopup();
    };

    // Effect to move map
    useEffect(() => {
        if (!selectedLocation || !mapRef.current) {
            return;
        }

        setToLocation(selectedLocation);

        const lat = Number(selectedLocation.lat);
        const lon = Number(selectedLocation.lon);

        mapRef.current.flyTo( 
            [lat, lon],
            15,
            { duration: 1.2 }
        );

        if (markerRef.current) {
            markerRef.current.remove();
        }

        markerRef.current = L.marker( [lat, lon] )
            .addTo(mapRef.current)
            .bindPopup(selectedLocation.display_name)
            .openPopup();

        // handleLocationSelect(selectedLocation);
    }, [selectedLocation]);

    const handleFromSelect = (location: LocationResult) => {
        setFromLocation(location);
        setRouteError(null);
        setRouteSummary(null);
        handleLocationSelect(location);
    };

    const handleToSelect = (location: LocationResult) => {
        setToLocation(location);
        setRouteError(null);
        setRouteSummary(null);
        handleLocationSelect(location);
    };

    const calculateAndDrawRoute = async (from: LocationResult, to: LocationResult) => {
        if (!mapRef.current) return;

        setLoadingRoute(true);
        setRouteError(null);

        try {
            const route = await getRoute(
                Number(from.lat),
                Number(from.lon),
                Number(to.lat),
                Number(to.lon)
            );

            routeRef.current?.remove();
            routeRef.current = L.polyline(route.geometry, {
                color: "#d46b3c",
                weight: 5,
                opacity: 0.85,
            }).addTo(mapRef.current);

            mapRef.current.fitBounds(routeRef.current.getBounds(), {
                padding: [40, 40],
            });

            setRouteSummary({
                distance: route.distance / 1000,
                duration: Math.round(route.duration / 60),
            });
        } catch (error) {
            console.error("Route calculation failed:", error);
            setRouteError(
                error instanceof Error
                    ? error.message
                    : "Unable to calculate route."
            );
            setRouteSummary(null);
        } finally {
            setLoadingRoute(false);
        }
    };

    const handleShowRoute = () => {
        if (!fromLocation || !toLocation) return;
        calculateAndDrawRoute(fromLocation, toLocation);
    };

    // Save current route to LocalStorage
    const persistSavedItems = (items: SavedItem[]) => {
        setSavedItems(items);
        localStorage.setItem("roam_saved_routes", JSON.stringify(items));
    };

    const handleSaveRoute = () => {
        if (!fromLocation || !toLocation) return;

        const newItem: SavedItem = {
            id: crypto.randomUUID(),
            type: "route",
            title: `${fromLocation.display_name.split(",")[0]} → ${toLocation.display_name.split(",")[0]}`,
            fromLocation,
            toLocation,
            date: new Date().toLocaleDateString(),
        };

        persistSavedItems([newItem, ...savedItems]);
    };

    const handleDeleteSavedItem = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = savedItems.filter((item) => item.id !== id);
        persistSavedItems(updated);
    };

    const handleSelectSavedItem = (item: SavedItem) => {
        setFromLocation(item.fromLocation);
        setToLocation(item.toLocation);
        setShowSavedList(false);
        calculateAndDrawRoute(item.fromLocation, item.toLocation);
    };

    return (
        <div className="map-wrapper">
            <div className="map-controls">
                <LocationSearch
                    label="From"
                    placeholder="Where are you starting?"
                    onSelect={handleFromSelect}
                />

                <LocationSearch
                    label="To"
                    placeholder="Where are you going?"
                    onSelect={handleToSelect}
                />

                <div className="action-button-group">
                    <button
                        type="button"
                        className="route-button"
                        disabled={!fromLocation || !toLocation || loadingRoute}
                        onClick={handleShowRoute}
                    >
                        {loadingRoute ? "Calculating route..." : "Show route"}
                    </button>

                    <button
                        type="button"
                        className="save-button"
                        disabled={!fromLocation || !toLocation}
                        onClick={handleSaveRoute}
                        title="Save Route"
                    >
                        ★ Save
                    </button>
                </div>

                {routeSummary && (
                    <span className="route-summary">
                        {routeSummary.duration} min drive, {routeSummary.distance.toFixed(1)} km
                    </span>
                )}

                {routeError && (
                    <div className="search-error" role="alert">
                        {routeError}
                    </div>
                )}

                <div className="nearby-controls" aria-label="Nearby places">
                    <span className="nearby-title">Explore nearby</span>
                    <div className="nearby-toggle-list">
                        {nearbyTypes.map((type) => (
                            <button
                                key={type}
                                type="button"
                                className={visibleNearbyTypes[type] ? "nearby-toggle active" : "nearby-toggle"}
                                disabled={!toLocation || nearbyPlaces[type].length === 0}
                                onClick={() => toggleNearbyType(type)}
                            >
                                {nearbyLabels[type]} ({nearbyPlaces[type].length})
                            </button>
                        ))}
                    </div>
                    {nearbyError && (
                        <span className="nearby-error" role="alert">
                            {nearbyError}
                        </span>
                    )}
                </div>

                {/* Saved Routes Drawer */}
                <div className="saved-header">
                    <button
                        type="button"
                        className="saved-toggle-btn"
                        onClick={() => setShowSavedList((prev) => !prev)}
                    >
                        <span>Saved Routes ({savedItems.length})</span>
                        <span>{showSavedList ? "▲" : "▼"}</span>
                    </button>

                    {showSavedList && (
                        <div className="saved-dropdown">
                            {savedItems.length === 0 ? (
                                <p className="empty-saved">No saved routes yet.</p>
                            ) : (
                                savedItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="saved-item"
                                        onClick={() => handleSelectSavedItem(item)}
                                    >
                                        <div className="saved-info">
                                            <span className="saved-title">{item.title}</span>
                                            <span className="saved-date">{item.date}</span>
                                        </div>
                                        <button
                                            type="button"
                                            className="delete-saved-btn"
                                            onClick={(e) => handleDeleteSavedItem(item.id, e)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div ref={mapContainerRef} className="map-container" />
        </div>
    );
}

export default Map;