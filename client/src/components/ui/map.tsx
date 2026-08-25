import { useEffect, useRef, useState } from "react";
import L from "leaflet";

import LocationSearch from "./locationSearch";
import { type LocationResult } from "../../services/locationServices";
import { getRoute } from "../../services/routeServices";

import "leaflet/dist/leaflet.css";
import "../../styles/map.css";

function Map() {
    const mapContainerRef =
        useRef<HTMLDivElement | null>(null);

    const mapRef =
        useRef<L.Map | null>(null);

    const markerRef =
        useRef<L.Marker | null>(null);

    const routeRef =
        useRef<L.Polyline | null>(null);

    const [fromLocation, setFromLocation] =
        useState<LocationResult | null>(null);

    const [toLocation, setToLocation] =
        useState<LocationResult | null>(null);

    const [loadingRoute, setLoadingRoute] =
        useState(false);

    const [routeError, setRouteError] =
        useState<string | null>(null);

    const [routeSummary, setRouteSummary] =
        useState<{ distance: number; duration: number } | null>(null);

    useEffect(() => {
        if (
            !mapContainerRef.current ||
            mapRef.current
        ) {
            return;
        }

        const map = L.map(
            mapContainerRef.current
        ).setView(
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
            markerRef.current = null;
            routeRef.current = null;
        };

    }, []);

    const handleLocationSelect = (location: LocationResult) => {

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

        markerRef.current = L.marker([
            lat,
            lon,
        ])
            .addTo(mapRef.current)
            .bindPopup(
                location.display_name
            )
            .openPopup();
    };

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

    const handleShowRoute = async () => {
        if (!fromLocation || !toLocation || !mapRef.current) {
            return;
        }

        setLoadingRoute(true);
        setRouteError(null);

        try {
            const route = await getRoute(
                Number(fromLocation.lat),
                Number(fromLocation.lon),
                Number(toLocation.lat),
                Number(toLocation.lon)
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

            <button
                type="button"
                className="route-button"
                disabled={
                    !fromLocation ||
                    !toLocation ||
                    loadingRoute
                }
                onClick={handleShowRoute}
            >
                {loadingRoute
                    ? "Calculating route..."
                    : "Show route"}
            </button>

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

        </div>

        <div
            ref={mapContainerRef}
            className="map-container"
        />
        </div>
    );
}

export default Map;