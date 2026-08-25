import { useEffect, useRef } from "react";
import L from "leaflet";

import LocationSearch from "./locationSearch";

import "leaflet/dist/leaflet.css";
import "../../styles/map.css";

function Map() {
    const mapContainerRef =
        useRef<HTMLDivElement | null>(null);

    const mapRef =
        useRef<L.Map | null>(null);

    const markerRef =
        useRef<L.Marker | null>(null);

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
        };

    }, []);

    const handleLocationSelect = (
        location: {
            lat: string;
            lon: string;
            display_name: string;
        }
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

    return (
        <div className="map-wrapper">

            <div className="map-controls">

                <LocationSearch
                    onSelect={
                        handleLocationSelect
                    }
                />

            </div>

            <div
                ref={mapContainerRef}
                className="map-container"
            />

        </div>
    );
}

export default Map;