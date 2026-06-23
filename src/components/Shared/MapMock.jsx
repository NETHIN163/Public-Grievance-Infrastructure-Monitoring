import React, { useState } from 'react';
import { MapPin, Info, ShieldAlert, CheckCircle, Radio } from 'lucide-react';

export default function MapMock({ complaints, onSelectComplaint }) {
  const [hoveredPin, setHoveredPin] = useState(null);

  // Filter complaints that have valid coordinates (all our mock data has them!)
  const activePins = complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed');

  // Simple bounding box coordinates for Delhi mapping simulation
  // Latitude: 28.55 to 28.65, Longitude: 77.10 to 77.25
  const getXY = (lat, lng) => {
    const minLat = 28.55;
    const maxLat = 28.65;
    const minLng = 77.10;
    const maxLng = 77.25;

    // Calculate percentage coordinates
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100; // Invert Y for screen coordinates

    return { 
      x: Math.max(5, Math.min(95, x)), 
      y: Math.max(5, Math.min(95, y)) 
    };
  };

  return (
    <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-hidden h-[380px] flex flex-col justify-between shadow-inner">
      {/* Grid Overlay for Tech/Sci-fi look */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      
      {/* Map Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center space-x-2">
          <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-widest">Live GPS Telemetry Map</h3>
        </div>
        <span className="text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono border border-slate-700">
          GRID: 28.61° N, 77.20° E
        </span>
      </div>

      {/* Map Content Container */}
      <div className="relative w-full h-[280px] bg-slate-950/40 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center mt-3">
        {/* Mock Graphic Contour Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.5" fill="none" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="0.5" fill="none" />
          <path d="M 10 50 Q 30 20, 50 50 T 90 50" stroke="white" strokeWidth="0.3" fill="none" />
          <path d="M 20 80 Q 50 60, 80 80" stroke="white" strokeWidth="0.3" fill="none" />
        </svg>

        {/* Delhi Zone Boundaries Mock Labels */}
        <div className="absolute top-4 left-6 text-[9px] font-bold text-slate-600 uppercase tracking-widest pointer-events-none">Zone E (North)</div>
        <div className="absolute bottom-4 left-6 text-[9px] font-bold text-slate-600 uppercase tracking-widest pointer-events-none">Zone C (West)</div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-700 uppercase tracking-widest pointer-events-none bg-slate-950/20 px-2 py-0.5 rounded-full border border-slate-800/30">Zone A (Central)</div>
        <div className="absolute bottom-4 right-6 text-[9px] font-bold text-slate-600 uppercase tracking-widest pointer-events-none">Zone B (South)</div>

        {/* Complaint GPS Pins */}
        {activePins.map(pin => {
          const { x, y } = getXY(pin.latitude, pin.longitude);
          const isHigh = pin.priority === 'High';
          
          return (
            <div
              key={pin.id}
              style={{ left: `${x}%`, top: `${y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
            >
              {/* Pulsing Outer Circle */}
              <span className={`absolute -inset-2 rounded-full animate-ping opacity-60 ${
                isHigh ? 'bg-red-500' : 'bg-amber-400'
              }`} />
              
              {/* Solid Pin Anchor */}
              <button
                onClick={() => onSelectComplaint && onSelectComplaint(pin)}
                onMouseEnter={() => setHoveredPin(pin)}
                onMouseLeave={() => setHoveredPin(null)}
                className={`relative w-4 h-4 rounded-full flex items-center justify-center border shadow-lg transform hover:scale-125 transition-transform ${
                  isHigh 
                    ? 'bg-red-600 border-red-400 text-white' 
                    : 'bg-amber-500 border-amber-300 text-slate-950'
                }`}
              >
                <MapPin className="w-2.5 h-2.5" />
              </button>

              {/* Individual Pin Info Box */}
              {hoveredPin?.id === pin.id && (
                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-48 bg-slate-900/95 border border-slate-700 rounded-lg p-2.5 shadow-2xl z-30 pointer-events-none animate-fade-in text-left">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1">
                    <span className="text-[9px] font-bold text-slate-400 font-mono">{pin.id}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                      isHigh ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {pin.priority}
                    </span>
                  </div>
                  <h4 className="text-[10px] font-bold text-white leading-tight truncate">{pin.title}</h4>
                  <p className="text-[9px] text-slate-400 line-clamp-2 mt-1 leading-normal">{pin.location}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Map Legend */}
      <div className="flex items-center space-x-4 mt-2 text-[9px] text-slate-400 font-semibold z-10 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-red-400 animate-pulse" />
          <span>High Severity (Active)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-amber-300 animate-pulse" />
          <span>Medium Severity</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-600" />
          <span>Resolved / Closed (Archived)</span>
        </div>
      </div>

    </div>
  );
}
