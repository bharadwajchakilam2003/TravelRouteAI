import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

interface MapProps {
  source: { name: string; lat: number; lng: number };
  destination: { name: string; lat: number; lng: number };
  attractions?: any[];
  polyline?: string;
}

function decodePolyline(encoded: string): [number, number][] {
  if (!encoded) return [];
  try {
    const poly = [];
    let index = 0, lat = 0, lng = 0;
    while (index < encoded.length) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;
      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;
      poly.push([lat / 1e5, lng / 1e5] as [number, number]);
    }
    return poly;
  } catch {
    return [];
  }
}

const createIcon = (color: string) =>
  new L.DivIcon({
    className: 'custom-marker',
    html: `<div style="background:${color};width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

const sourceIcon = createIcon('#3b82f6');
const destIcon = createIcon('#ef4444');
const attractionIcon = createIcon('#22c55e');

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions.map(p => L.latLng(p[0], p[1])));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, positions]);
  return null;
}

export default function RouteMap({ source, destination, attractions = [], polyline }: MapProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const positions: [number, number][] = [
    [source.lat, source.lng],
    [destination.lat, destination.lng],
    ...attractions.filter(a => a.lat && a.lng).map(a => [a.lat, a.lng] as [number, number]),
  ];

  const routeCoords = decodePolyline(polyline ?? '');

  if (!mounted) {
    return <div className="glass-card p-6"><div className="skeleton h-96 w-full rounded-xl" /></div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4"
    >
      <h2 className="section-title flex items-center gap-2">
        🗺️ Route Map
        <span className="text-sm font-normal text-gray-400 dark:text-gray-500">
          {source.name} → {destination.name}
        </span>
      </h2>
      <div className="h-[400px] md:h-[500px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <MapContainer center={[source.lat, source.lng]} zoom={7} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds positions={positions} />

          <Marker position={[source.lat, source.lng]} icon={sourceIcon}>
            <Popup><div className="font-semibold text-blue-600">📍 {source.name}</div><div className="text-xs text-gray-500">Source</div></Popup>
          </Marker>
          <Marker position={[destination.lat, destination.lng]} icon={destIcon}>
            <Popup><div className="font-semibold text-red-500">🎯 {destination.name}</div><div className="text-xs text-gray-500">Destination</div></Popup>
          </Marker>

          {attractions.filter(a => a.lat && a.lng).map((attraction, i) => (
            <Marker key={i} position={[attraction.lat, attraction.lng]} icon={attractionIcon}>
              <Popup>
                <div className="min-w-[150px]">
                  {attraction.image && <img src={attraction.image} alt={attraction.name} className="w-full h-24 object-cover rounded-lg mb-2" />}
                  <div className="font-semibold text-green-600">{attraction.name}</div>
                  {attraction.rating && <div className="text-xs text-gray-500">⭐ {attraction.rating}</div>}
                </div>
              </Popup>
            </Marker>
          ))}

          {routeCoords.length > 0 && (
            <Polyline positions={routeCoords} color="#3b82f6" weight={4} opacity={0.7} dashArray="10, 10" />
          )}
        </MapContainer>
      </div>
    </motion.div>
  );
}
