import React from 'react';
import { Map, Navigation, Layers } from 'lucide-react';

const HeatmapPoint = ({ incident, cx, cy }) => {
    // Simple projection for demo: offset from center
    // Scale factor
    const scale = 4000;
    const isFire = incident.type === 'FIRE';
    const color = isFire ? 'bg-orange-500' : incident.type === 'MEDICAL' ? 'bg-red-500' : 'bg-blue-500';

    // Randomize slightly for demo static output if lat/long are close
    const x = cx + (incident.lng + 74.0060) * scale;
    const y = cy - (incident.lat - 40.7128) * scale;

    const size = incident.severity * 4;

    return (
        <div
            className={`absolute rounded-full ${color} opacity-80 animate-pulse border border-white/30 hover:scale-150 transition-transform cursor-pointer group`}
            style={{
                left: `${x}px`,
                top: `${y}px`,
                width: `${size}px`,
                height: `${size}px`,
                boxShadow: `0 0 ${size * 2}px ${isFire ? 'orange' : 'red'}`
            }}
        >
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-black/80 text-white text-[10px] p-2 rounded hidden group-hover:block z-50 pointer-events-none border border-white/10">
                <div className="font-bold">{incident.type}</div>
                <div>Severity: {incident.severity}</div>
                <div className="text-slate-400">{incident.status}</div>
            </div>
        </div>
    );
};

const SupervisorHeatmap = () => {
    // Mock data connected to what backend would send
    const centerLat = 40.7128;
    const centerLng = -74.0060;
    const startData = [
        { id: '1', type: 'FIRE', severity: 4, lat: centerLat + 0.01, lng: centerLng - 0.02, status: 'Active' },
        { id: '2', type: 'MEDICAL', severity: 5, lat: centerLat - 0.005, lng: centerLng + 0.01, status: 'Critical' },
        { id: '3', type: 'POLICE', severity: 3, lat: centerLat + 0.008, lng: centerLng + 0.005, status: 'Active' },
    ];

    return (
        <div className="glass-card p-0 overflow-hidden relative h-[300px] w-full bg-[#050b14]">
            {/* Map Header */}
            <div className="absolute top-4 left-4 z-10 flex flex-col">
                <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Map size={14} /> Geospatial Cluster
                </h3>
                <div className="text-xl font-bold text-white mt-1">Metro Sector 4</div>
            </div>

            <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors">
                    <Layers size={16} />
                </button>
                <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors">
                    <Navigation size={16} />
                </button>
            </div>

            {/* Grid & Radar Lines */}
            <div className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                    backgroundSize: '20px 20px, 100px 100px, 100px 100px'
                }}>
            </div>

            {/* Central Point */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500/20 rounded-full border border-blue-500 animate-ping"></div>

            {/* Render Incidents */}
            <div className="absolute inset-0">
                {startData.map((inc, i) => (
                    <HeatmapPoint key={inc.id} incident={inc} cx={250} cy={150} /> // Hardcoded center for this small panel
                ))}
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex gap-4 text-[10px] items-center">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Medical</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Fire</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Police</div>
            </div>
        </div>
    );
};

export default SupervisorHeatmap;
