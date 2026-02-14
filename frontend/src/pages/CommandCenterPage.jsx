import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Activity, Shield, AlertTriangle, Clock,
    MapPin, Phone, ArrowUpRight, Search,
    MoreVertical, Zap, CheckCircle
} from 'lucide-react';

const IncidentCard = ({ id, type, severity, time, status, location }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="glass-card p-4 flex items-center justify-between group cursor-pointer border-l-4 border-l-transparent hover:border-l-rapid-blue transition-all"
    >
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${severity >= 4 ? 'bg-red-500/20 text-red-500' :
                    severity >= 3 ? 'bg-orange-500/20 text-orange-500' :
                        'bg-blue-500/20 text-blue-500'
                }`}>
                <AlertTriangle size={24} />
            </div>
            <div>
                <h4 className="font-bold text-white text-sm">{type} <span className="text-slate-500 font-normal">#{id}</span></h4>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1"><Clock size={10} /> {time}</span>
                    <span className="flex items-center gap-1"><MapPin size={10} /> {location}</span>
                </div>
            </div>
        </div>

        <div className="text-right">
            <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${status === 'Active' ? 'text-rapid-green animate-pulse' : 'text-slate-500'
                }`}>
                {status}
            </div>
            <div className="text-xl font-mono font-bold text-white">
                {severity}<span className="text-slate-600 text-sm">/5</span>
            </div>
        </div>
    </motion.div>
);

const CommandCenterPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen bg-rapid-bg text-white p-6"
        >
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-rapid-blue to-rapid-purple rounded-lg">
                        <Activity className="text-white w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold font-exo tracking-tight">COMMAND CENTER</h1>
                        <p className="text-[10px] text-rapid-blue tracking-[0.2em] font-mono uppercase">Overseer Level 5</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="glass-panel px-4 py-2 rounded-lg flex items-center gap-2 text-sm text-slate-300">
                        <div className="w-2 h-2 rounded-full bg-rapid-green animate-pulse"></div>
                        System Nominal
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                        <span className="font-bold text-xs">JD</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Main Content Area (8 Cols) */}
                <div className="lg:col-span-8 flex flex-col gap-6">

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="glass-card p-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={40} /></div>
                            <p className="text-slate-400 text-xs font-bold uppercase">Active Incidents</p>
                            <h3 className="text-4xl font-mono font-bold text-white mt-1">24</h3>
                            <div className="flex items-center gap-1 text-rapid-green text-xs mt-2 font-medium">
                                <ArrowUpRight size={12} /> +12% from last hour
                            </div>
                        </div>
                        <div className="glass-card p-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><Shield size={40} /></div>
                            <p className="text-slate-400 text-xs font-bold uppercase">Avg Response</p>
                            <h3 className="text-4xl font-mono font-bold text-white mt-1">1.2m</h3>
                            <div className="flex items-center gap-1 text-rapid-green text-xs mt-2 font-medium">
                                <CheckCircle size={12} /> Within target
                            </div>
                        </div>
                        <div className="glass-card p-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><Activity size={40} /></div>
                            <p className="text-slate-400 text-xs font-bold uppercase">AI Accuracy</p>
                            <h3 className="text-4xl font-mono font-bold text-rapid-purple mt-1">99.8%</h3>
                            <div className="flex items-center gap-1 text-slate-400 text-xs mt-2 font-medium">
                                Last 24h calibration
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="glass-card p-6 border-l-4 border-l-rapid-blue">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Initialize Analysis</h3>
                            <Link to="/live">
                                <button className="px-6 py-2 bg-gradient-to-r from-rapid-blue to-rapid-purple rounded-lg font-bold text-sm shadow-lg shadow-blue-900/20 hover:scale-105 transition-transform">
                                    New Session
                                </button>
                            </Link>
                        </div>
                        <p className="text-slate-400 text-sm max-w-xl">
                            Start a new real-time voice analysis session or upload archived call recordings for forensic AI review.
                        </p>
                    </div>

                    {/* Incident Stack */}
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-end">
                            <h3 className="font-bold text-lg">Recent Alerts</h3>
                            <div className="flex items-center gap-2 text-sm text-slate-400 bg-white/5 px-3 py-1 rounded-lg">
                                <Search size={14} /> Filter
                            </div>
                        </div>
                        <div className="space-y-3">
                            <IncidentCard id="8821" type="Fire / Hazmat" severity={4.5} time="2 mins ago" status="Active" location="Sector 7G" />
                            <IncidentCard id="8820" type="Medical Emergency" severity={3.2} time="15 mins ago" status="Dispatched" location="Downtown" />
                            <IncidentCard id="8819" type="Domestic Disturbance" severity={2.1} time="45 mins ago" status="Resolved" location="North Ave" />
                        </div>
                    </div>

                </div>

                {/* Sidebar (4 Cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6">

                    {/* Deployment Heatmap (Simulated) */}
                    <div className="glass-card p-6 h-80 relative overflow-hidden flex flex-col">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <MapPin size={16} className="text-rapid-purple" /> Threat Heatmap
                        </h3>
                        <div className="flex-1 bg-white/5 rounded-xl relative overflow-hidden group">
                            {/* Simulated Map Pulse */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-red-500/30 rounded-full blur-xl animate-pulse"></div>
                            <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-orange-500/20 rounded-full blur-lg animate-pulse delay-500"></div>
                            <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
                        </div>
                    </div>

                    {/* Team Status */}
                    <div className="glass-card p-6 flex-1">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Phone size={16} className="text-rapid-green" /> Active Units
                        </h3>
                        <div className="space-y-4">
                            {['Alpha', 'Bravo', 'Charlie'].map((unit) => (
                                <div key={unit} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                    <span className="font-mono text-sm font-bold text-slate-300">Unit {unit}</span>
                                    <span className="text-xs px-2 py-1 bg-rapid-green/10 text-rapid-green rounded font-bold uppercase">On Patrol</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </motion.div>
    );
};

export default CommandCenterPage;
