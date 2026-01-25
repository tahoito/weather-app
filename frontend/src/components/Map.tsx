'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Location {
    id: number;
    name: string;
    slug: string;
    is_indoor: boolean;
    lat: string;
    lon: string;
}

interface MapComponentProps {
    spots: Location[];
    selectedSpotId?: number | null;
    onSpotSelect?: (spotId: number) => void;
    initialLat: number;
    initialLon: number;
}

export default function Map({
    spots,
    selectedSpotId,
    onSpotSelect,
    initialLat,
    initialLon
}: MapComponentProps) {

    const outdoorIcon = L.icon({
        iconUrl: '/images/map-pin-1.svg',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38],
    });

    // 屋外用アイコン
    const indoorIcon = L.icon({
        iconUrl: '/images/map-pin-2.svg',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38],
    });

    const handleMarkerClick = (spotId: number) => {
        if (onSpotSelect) {
            onSpotSelect(spotId);
        }
    };

    console.log(initialLat, initialLon)

    return (
        <MapContainer
            center={[initialLat, initialLon]}
            zoom={16}
            scrollWheelZoom={true}
            zoomControl={false}
            className='w-full h-full min-h-screen z-1'
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {Array.isArray(spots) &&
                spots.map((spot) => (
                    <Marker
                        key={spot.id}
                        position={[Number(spot.lat), Number(spot.lon)]}
                        icon={spot.is_indoor ? indoorIcon : outdoorIcon}
                        eventHandlers={{
                            click: () => handleMarkerClick(spot.id),
                        }}
                    >
                        <Popup>{spot.name}</Popup>
                    </Marker>
                ))}
        </MapContainer>
    );
}