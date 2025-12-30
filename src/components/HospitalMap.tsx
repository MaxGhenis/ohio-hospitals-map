'use client';

import { useRef, useCallback, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl, MapRef } from 'react-map-gl/maplibre';
import { Hospital } from '@/types/hospital';
import { Cross } from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css';

interface HospitalMapProps {
  hospitals: Hospital[];
  selectedHospital: Hospital | null;
  onSelectHospital: (hospital: Hospital | null) => void;
}

// Ohio bounds
const OHIO_BOUNDS: [[number, number], [number, number]] = [
  [-84.82, 38.40], // Southwest
  [-80.52, 42.00], // Northeast
];

export function HospitalMap({
  hospitals,
  selectedHospital,
  onSelectHospital,
}: HospitalMapProps) {
  const mapRef = useRef<MapRef>(null);

  // Fly to selected hospital
  useEffect(() => {
    if (selectedHospital && mapRef.current) {
      mapRef.current.flyTo({
        center: selectedHospital.coordinates,
        zoom: 11,
        duration: 1000,
      });
    }
  }, [selectedHospital]);

  // Fit bounds to show all hospitals
  const fitToHospitals = useCallback(() => {
    if (hospitals.length > 0 && mapRef.current) {
      const lngs = hospitals.map((h) => h.coordinates[0]);
      const lats = hospitals.map((h) => h.coordinates[1]);

      mapRef.current.fitBounds(
        [
          [Math.min(...lngs) - 0.5, Math.min(...lats) - 0.3],
          [Math.max(...lngs) + 0.5, Math.max(...lats) + 0.3],
        ],
        { padding: 50, duration: 1000 }
      );
    }
  }, [hospitals]);

  // Fit bounds when hospitals change
  useEffect(() => {
    if (hospitals.length > 0 && !selectedHospital) {
      const timer = setTimeout(fitToHospitals, 100);
      return () => clearTimeout(timer);
    }
  }, [hospitals, selectedHospital, fitToHospitals]);

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: -82.9,
        latitude: 40.0,
        zoom: 6.5,
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle={{
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
            paint: {
              'raster-saturation': -0.2,
              'raster-brightness-min': 0.1,
            },
          },
        ],
      }}
      maxBounds={OHIO_BOUNDS}
      onClick={() => onSelectHospital(null)}
    >
      <NavigationControl position="top-right" />

      {hospitals.map((hospital) => (
        <Marker
          key={hospital.id}
          longitude={hospital.coordinates[0]}
          latitude={hospital.coordinates[1]}
          anchor="center"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            onSelectHospital(hospital);
          }}
        >
          <div
            className={`
              w-8 h-8 rounded-full border-[3px] border-white shadow-md
              flex items-center justify-center cursor-pointer
              transition-all duration-200 hover:scale-110
              ${
                selectedHospital?.id === hospital.id
                  ? 'bg-coral-500 scale-110'
                  : 'bg-teal-600 hover:bg-teal-500'
              }
            `}
          >
            <Cross className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
        </Marker>
      ))}

      {selectedHospital && (
        <Popup
          longitude={selectedHospital.coordinates[0]}
          latitude={selectedHospital.coordinates[1]}
          anchor="bottom"
          offset={20}
          closeOnClick={false}
          onClose={() => onSelectHospital(null)}
          className="hospital-popup"
        >
          <div className="p-4 min-w-[200px]">
            <h3 className="font-display text-lg font-medium text-ink mb-1">
              {selectedHospital.name}
            </h3>
            <p className="text-sm text-ink-muted mb-2">
              {selectedHospital.city}, Ohio
            </p>
            <span className="inline-block px-2 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded uppercase tracking-wide">
              {selectedHospital.county} County
            </span>
          </div>
        </Popup>
      )}
    </Map>
  );
}
