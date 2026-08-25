import { useEffect, useRef } from "react";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "../../styles/map.css";

function Map() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<L.Map | null>(null);

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

    return (
        <div
            ref={mapContainerRef}
            className="map-container"
        />
    );
}

export default Map;