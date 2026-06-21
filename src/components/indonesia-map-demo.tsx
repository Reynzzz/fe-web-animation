// components/ui/indonesia-map-demo.tsx
"use client";

import { Map, MapArc, MapMarker, MarkerContent, MarkerLabel } from "@/components/ui/mapcn-map-arc";

// Strategic Coordinates for Indonesian Cities
const cities = {
  jakarta: { name: "Jakarta", lng: 106.8456, lat: -6.2088 },
  lampung: { name: "Lampung", lng: 105.2663, lat: -5.4500 },
  semarang: { name: "Semarang", lng: 110.4203, lat: -6.9932 },
  jogja: { name: "Yogyakarta", lng: 110.3608, lat: -7.7956 },
  bali: { name: "Bali", lng: 115.2167, lat: -8.6500 },
};

// Arc distribution lines (connecting routes sequentially)
const routeArcs = [
  { id: "jkt-lampung", from: [cities.jakarta.lng, cities.jakarta.lat] as [number, number], to: [cities.lampung.lng, cities.lampung.lat] as [number, number] },
  { id: "jkt-semarang", from: [cities.jakarta.lng, cities.jakarta.lat] as [number, number], to: [cities.semarang.lng, cities.semarang.lat] as [number, number] },
  { id: "jkt-jogja", from: [cities.jakarta.lng, cities.jakarta.lat] as [number, number], to: [cities.jogja.lng, cities.jogja.lat] as [number, number] },
  { id: "jogja-bali", from: [cities.jogja.lng, cities.jogja.lat] as [number, number], to: [cities.bali.lng, cities.bali.lat] as [number, number] },
];

export default function IndonesiaMapDemo() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-black p-4 sm:p-8">
      <div className="h-[500px] w-full max-w-5xl overflow-hidden rounded-xl border bg-background shadow-md">
        
        <Map 
          center={[110.5000, -7.2000]} // Shift viewport focus exactly over Central Java
          zoom={5.5}                   // Calibrated close-up regional zoom depth
          projection={{ type: "mercator" }}
        >
          {/* Arc Rendering Layer */}
          <MapArc 
            data={routeArcs} 
            curvature={0.25}
            paint={{ 
              "line-color": "#3b82f6", 
              "line-width": 3,
              "line-dasharray": [3, 2] 
            }} 
            interactive={false} 
          />

          {/* City Markers Configuration */}
          {Object.values(cities).map((city) => {
            const isHub = city.name === "Jakarta";
            return (
              <MapMarker key={city.name} longitude={city.lng} latitude={city.lat}>
                <MarkerContent>
                  <div 
                    className={`rounded-full border-2 border-white shadow-md transition-transform hover:scale-125 ${
                      isHub ? "size-3.5 bg-blue-600" : "size-2.5 bg-emerald-500"
                    }`} 
                  />
                  <MarkerLabel 
                    position="top" 
                    className="bg-background/90 rounded-md px-2 py-0.5 text-[11px] font-medium border shadow-xs backdrop-blur-xs text-foreground"
                  >
                    {city.name}
                  </MarkerLabel>
                </MarkerContent>
              </MapMarker>
            );
          })}
        </Map>

      </div>
    </div>
  );
}
