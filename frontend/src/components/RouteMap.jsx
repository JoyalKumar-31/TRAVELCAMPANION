import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

export default function RouteMap({ origin, destination }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);

  const [selectedMode, setSelectedMode] = useState('car'); // 'car', 'train', 'bike', 'flight'
  const [showDirectionsModal, setShowDirectionsModal] = useState(false);
  const [tileType, setTileType] = useState('street');

  const [routeInfo, setRouteInfo] = useState({
    origin: origin || "Hyderabad",
    destination: destination || "Switzerland",
    distance_km: 1240,
    road_distance_km: 1512,
    origin_coords: [17.3850, 78.4867],
    dest_coords: [47.3769, 8.5417],
    is_international: false,
    modes: {
      car: {
        mode: "car",
        label: "Car / Drive",
        icon: "fa-car",
        time_str: "10h 15m",
        distance_km: 1512,
        speed_avg: "62 km/h",
        fuel_cost_inr: 4200,
        toll_est_inr: 850,
        total_est_cost_inr: 5050,
        route_corridor: "National Highway / Expressway Corridor",
        google_directions_url: "https://www.google.com/maps/dir/?api=1&travelmode=driving"
      },
      train: {
        mode: "train",
        label: "Train / Rail",
        icon: "fa-train",
        time_str: "9h 30m",
        distance_km: 1420,
        speed_avg: "75 km/h",
        fare_inr: "3AC: ₹1,250 | SL: ₹490",
        rail_lines: "Superfast / Vande Bharat Express Corridor",
        google_directions_url: "https://www.google.com/maps/dir/?api=1&travelmode=transit"
      },
      bike: {
        mode: "bike",
        label: "Bike / Ride",
        icon: "fa-motorcycle",
        time_str: "13h 45m",
        distance_km: 1512,
        speed_avg: "48 km/h",
        fuel_cost_inr: 1650,
        pitstops: "3 Rest Stops recommended (every 120 km)",
        scenic_tip: "Scenic highway twisties with roadside dhabas",
        google_directions_url: "https://www.google.com/maps/dir/?api=1&travelmode=two_wheeler"
      },
      flight: {
        mode: "flight",
        label: "Flight / Air",
        icon: "fa-plane-departure",
        time_str: "2h 15m",
        distance_km: 1240,
        speed_avg: "750 km/h",
        fare_inr: "₹4,200 (Est. Economy)",
        google_directions_url: "https://www.google.com/maps/dir/?api=1&travelmode=flight"
      }
    }
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
      }).setView([20.5937, 78.9629], 4);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap'
      }).addTo(mapInstanceRef.current);
    }
  }, []);

  // Update Tile Layer (Street vs Satellite)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    if (tileType === 'satellite') {
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Esri World Imagery'
      }).addTo(mapInstanceRef.current);
    } else {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(mapInstanceRef.current);
    }
  }, [tileType]);

  // Fetch Logistics from Backend API
  useEffect(() => {
    let isMounted = true;

    async function fetchLogistics() {
      try {
        const res = await fetch('/api/distance/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ origin, destination })
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setRouteInfo(data);
            updateMapGraphics(data, selectedMode);
          }
        }
      } catch (err) {
        console.warn('Transit logistics sync:', err);
      }
    }

    fetchLogistics();

    return () => {
      isMounted = false;
    };
  }, [origin, destination]);

  // Update Polyline & Mode Styling when selectedMode changes
  useEffect(() => {
    if (routeInfo && mapInstanceRef.current) {
      updateMapGraphics(routeInfo, selectedMode);
    }
  }, [selectedMode]);

  function updateMapGraphics(data, mode) {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers & line
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];
    if (polylineRef.current) map.removeLayer(polylineRef.current);

    const origCoords = data.origin_coords || [17.3850, 78.4867];
    const destCoords = data.dest_coords || [15.2993, 74.1240];

    // Origin Marker (Cyan / Blue)
    const originMarker = L.circleMarker(origCoords, {
      radius: 9,
      fillColor: '#0284C7',
      color: '#FFFFFF',
      weight: 3,
      opacity: 1,
      fillOpacity: 1
    }).addTo(map).bindPopup(`<b>Start (Origin):</b> ${data.origin}`);
    markersRef.current.push(originMarker);

    // Destination Marker (Emerald / Rose)
    const destMarker = L.circleMarker(destCoords, {
      radius: 11,
      fillColor: '#E11D48',
      color: '#FFFFFF',
      weight: 3,
      opacity: 1,
      fillOpacity: 1
    }).addTo(map).bindPopup(`<b>Destination:</b> ${data.destination}<br><b>Geodesic:</b> ${data.distance_km} km`);
    markersRef.current.push(destMarker);

    // Customize Polyline styling based on Mode
    let lineColor = '#0284C7';
    let dashPattern = '6, 8';
    let lineWeight = 4;

    if (mode === 'car') {
      lineColor = '#059669'; // Emerald
      dashPattern = null; // Solid road
      lineWeight = 4;
    } else if (mode === 'train') {
      lineColor = '#7C3AED'; // Purple
      dashPattern = '8, 8'; // Rail ties
      lineWeight = 4;
    } else if (mode === 'bike') {
      lineColor = '#D97706'; // Amber / Orange
      dashPattern = '4, 6';
      lineWeight = 4;
    } else if (mode === 'flight') {
      lineColor = '#0284C7'; // Sky Blue
      dashPattern = '8, 12';
      lineWeight = 3;
    }

    polylineRef.current = L.polyline([origCoords, destCoords], {
      color: lineColor,
      weight: lineWeight,
      dashArray: dashPattern,
      opacity: 0.9
    }).addTo(map);

    // Fit bounds
    try {
      const group = new L.featureGroup(markersRef.current);
      if (group && group.getBounds && group.getBounds().isValid()) {
    
      }
    } catch (boundsErr) {
      console.warn("Leaflet fitBounds warning:", boundsErr);
    }

  }

  const originCity = (origin || "").split(",")[0];
  const destCity = (destination || "").split("(")[0].split(",")[0];

  const currentModeData = (routeInfo?.modes && routeInfo.modes[selectedMode]) || (routeInfo?.modes && routeInfo.modes.car) || {};

  // Active Google Directions URL
  const activeGoogleDirectionsUrl = currentModeData?.google_directions_url || 
    `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originCity)}&destination=${encodeURIComponent(destCity)}`;

  return (
    <div className="bg-white rounded-[2rem] p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-sky-500 text-white flex items-center justify-center font-bold text-base shadow-md shadow-brand-500/20">
            <i className="fa-solid fa-diamond-turn-right"></i>
          </div>
          <div>
            <h3 className="font-heading font-black text-slate-900 text-base sm:text-lg">
              Route & Go Directions
            </h3>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <span>{originCity}</span>
              <i className="fa-solid fa-arrow-right text-[10px] text-brand-600"></i>
              <span className="font-bold text-slate-800">{destCity}</span>
            </p>
          </div>
        </div>

        {/* Map Type Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <select 
            value={tileType} 
            onChange={(e) => setTileType(e.target.value)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="street">🗺️ Street Map</option>
            <option value="satellite">🛰️ Satellite View</option>
          </select>
        </div>
      </div>

      {/* Mode Switcher Tabs: Bike, Train, Car, Flight */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
            Select Transit Mode:
          </span>
          <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
            Estimated Travel Times
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          
          {/* 1. Car */}
          <button
            onClick={() => setSelectedMode('car')}
            className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center gap-1 ${
              selectedMode === 'car'
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/25 scale-102 ring-2 ring-emerald-300'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
            }`}
          >
            <i className="fa-solid fa-car text-base"></i>
            <span className="text-[11px] font-extrabold block">Car / Drive</span>
            <span className={`text-[10px] font-black ${selectedMode === 'car' ? 'text-emerald-100' : 'text-slate-500'}`}>
              {routeInfo.modes?.car?.time_str || "Drive"}
            </span>
          </button>

          {/* 2. Train */}
          <button
            onClick={() => setSelectedMode('train')}
            className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center gap-1 ${
              selectedMode === 'train'
                ? 'bg-purple-600 text-white border-purple-700 shadow-md shadow-purple-600/25 scale-102 ring-2 ring-purple-300'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
            }`}
          >
            <i className="fa-solid fa-train text-base"></i>
            <span className="text-[11px] font-extrabold block">Train / Rail</span>
            <span className={`text-[10px] font-black ${selectedMode === 'train' ? 'text-purple-200' : 'text-slate-500'}`}>
              {routeInfo.modes?.train?.time_str || "Train"}
            </span>
          </button>

          {/* 3. Bike */}
          <button
            onClick={() => setSelectedMode('bike')}
            className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center gap-1 ${
              selectedMode === 'bike'
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md shadow-amber-500/25 scale-102 ring-2 ring-amber-300'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
            }`}
          >
            <i className="fa-solid fa-motorcycle text-base"></i>
            <span className="text-[11px] font-extrabold block">Bike / Ride</span>
            <span className={`text-[10px] font-black ${selectedMode === 'bike' ? 'text-slate-900' : 'text-slate-500'}`}>
              {routeInfo.modes?.bike?.time_str || "Bike"}
            </span>
          </button>

          {/* 4. Flight */}
          <button
            onClick={() => setSelectedMode('flight')}
            className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center gap-1 ${
              selectedMode === 'flight'
                ? 'bg-sky-600 text-white border-sky-700 shadow-md shadow-sky-600/25 scale-102 ring-2 ring-sky-300'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
            }`}
          >
            <i className="fa-solid fa-plane-departure text-base"></i>
            <span className="text-[11px] font-extrabold block">Flight</span>
            <span className={`text-[10px] font-black ${selectedMode === 'flight' ? 'text-sky-200' : 'text-slate-500'}`}>
              {routeInfo.modes?.flight?.time_str?.split(' ')[0] || "Flight"}
            </span>
          </button>

        </div>
      </div>

      {/* Selected Mode Detail Summary Card */}
      {currentModeData && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-brand-50/40 border border-slate-200/80 space-y-3">
          
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <strong className="text-slate-900 font-extrabold text-sm">{currentModeData.label} Route</strong>
              <span className="text-xs text-slate-500 font-medium">· avg speed {currentModeData.speed_avg}</span>
            </div>

            <div className="text-right">
              <span className="text-base font-black text-slate-900 block leading-tight">
                ⏱️ {currentModeData.time_str}
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                {currentModeData.distance_km} km distance
              </span>
            </div>
          </div>

          {/* Pricing & Corridor Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/60">
            {selectedMode === 'car' && (
              <>
                <div className="p-2 rounded-xl bg-white border border-slate-200/60">
                  <span className="text-[10px] text-slate-400 font-bold block">⛽ Fuel & Tolls:</span>
                  <strong className="text-emerald-700 font-black">₹{currentModeData.total_est_cost_inr?.toLocaleString()}</strong>
                  <span className="text-[10px] text-slate-400 ml-1">(Fuel ₹{currentModeData.fuel_cost_inr} + Toll ₹{currentModeData.toll_est_inr})</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200/60">
                  <span className="text-[10px] text-slate-400 font-bold block">🛣️ Highway Corridor:</span>
                  <strong className="text-slate-800 font-bold">{currentModeData.route_corridor}</strong>
                </div>
              </>
            )}

            {selectedMode === 'train' && (
              <>
                <div className="p-2 rounded-xl bg-white border border-slate-200/60">
                  <span className="text-[10px] text-slate-400 font-bold block">🎫 Estimated Train Fare:</span>
                  <strong className="text-purple-700 font-black">{currentModeData.fare_inr}</strong>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200/60">
                  <span className="text-[10px] text-slate-400 font-bold block">🚆 Rail Network:</span>
                  <strong className="text-slate-800 font-bold">{currentModeData.rail_lines}</strong>
                </div>
              </>
            )}

            {selectedMode === 'bike' && (
              <>
                <div className="p-2 rounded-xl bg-white border border-slate-200/60">
                  <span className="text-[10px] text-slate-400 font-bold block">⛽ Est. Biker Fuel:</span>
                  <strong className="text-amber-700 font-black">₹{currentModeData.fuel_cost_inr?.toLocaleString()}</strong>
                  <span className="text-[10px] text-slate-400 ml-1">(~38 km/L mileage)</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200/60">
                  <span className="text-[10px] text-slate-400 font-bold block">☕ Rider Pitstops:</span>
                  <strong className="text-slate-800 font-bold">{currentModeData.pitstops}</strong>
                </div>
              </>
            )}

            {selectedMode === 'flight' && (
              <>
                <div className="p-2 rounded-xl bg-white border border-slate-200/60">
                  <span className="text-[10px] text-slate-400 font-bold block">✈️ Airfare:</span>
                  <strong className="text-sky-700 font-black">{currentModeData.fare_inr}</strong>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200/60">
                  <span className="text-[10px] text-slate-400 font-bold block">🛫 Airport Transit:</span>
                  <strong className="text-slate-800 font-bold">Terminal Check-in 2h prior</strong>
                </div>
              </>
            )}
          </div>

          {/* Go Directions Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <a
              href={activeGoogleDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-4 bg-brand-600 hover:bg-brand-700 active:scale-98 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-md shadow-brand-600/20"
            >
              <i className="fa-solid fa-location-arrow"></i>
              <span>Open Go Directions in Google Maps</span>
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-brand-200"></i>
            </a>

            <button
              onClick={() => setShowDirectionsModal(true)}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              title="View Turn-by-Turn Waypoints"
            >
              <i className="fa-solid fa-list-check"></i>
              <span className="hidden sm:inline">Steps</span>
            </button>
          </div>

        </div>
      )}

      {/* Interactive Map Canvas */}
      <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Origin & Destination Labels */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          <span>From: <strong>{originCity}</strong></span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span>To: <strong>{destCity}</strong></span>
        </span>
      </div>

      {/* Turn-by-Turn Waypoint Guidance Modal */}
      {showDirectionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20 p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm">
                  <i className="fa-solid fa-diamond-turn-right"></i>
                </div>
                <div>
                  <h4 className="font-heading font-black text-slate-900 text-base">Turn-by-Turn Waypoint Route</h4>
                  <span className="text-[10px] text-slate-400 font-bold">{originCity} to {destCity} by {currentModeData.label}</span>
                </div>
              </div>
              <button 
                onClick={() => setShowDirectionsModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition"
              >
                <i className="fa-solid fa-xmark text-xs"></i>
              </button>
            </div>

            {/* Waypoints Sequence */}
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                  A
                </div>
                <div>
                  <strong className="text-slate-800 block font-black">Depart {originCity}</strong>
                  <p className="text-slate-500 text-[11px]">Start navigation and merge onto regional arterial expressway.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <strong className="text-slate-800 block font-black">Follow {currentModeData.route_corridor || currentModeData.rail_lines || 'Express Corridor'}</strong>
                  <p className="text-slate-500 text-[11px]">Cruising at ~{currentModeData.speed_avg}. Stay on primary marked lanes.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <strong className="text-slate-800 block font-black">Midpoint Refreshment & Fuel Hub</strong>
                  <p className="text-slate-500 text-[11px]">Clean restrooms, EV fast-charging / fuel, and regional roadside dining.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                  B
                </div>
                <div>
                  <strong className="text-slate-800 block font-black">Arrive at {destCity} Day 1 Hub</strong>
                  <p className="text-slate-500 text-[11px]">Proceed to your booked Day 1 lodge and commence itinerary schedule.</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
              <a
                href={activeGoogleDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-location-arrow"></i>
                <span>Open in Google Maps Navigation</span>
              </a>
              <button
                onClick={() => setShowDirectionsModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
