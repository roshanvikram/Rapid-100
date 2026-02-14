import React from 'react';
import { AlertTriangle, Ambulance, Flame, ShieldAlert, FileText, CheckCircle2, Activity, MapPin, User, Stethoscope } from 'lucide-react';
import clsx from 'clsx';

const CoreLiveDashboard = ({ transcript, analysis }) => {
    // Default empty state matching the new backend schema
    const data = analysis || {
        emergencyType: "Waiting...",
        intent: "...",
        severity: 1,
        routing: { primary: "Pending", secondary: [], reason: "" },
        summary: { who: "-", what: "-", where: "-", condition: "-", confidence: 0 }
    };

    const getSeverityColor = (s) => {
        if (s >= 5) return 'bg-red-600 text-white animate-pulse';
        if (s >= 4) return 'bg-orange-600 text-white';
        if (s >= 3) return 'bg-amber-500 text-black';
        return 'bg-emerald-600 text-white';
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full p-4">

            {/* COLUMN 1: TRANSCRIPT & INTENT */}
            <div className="xl:col-span-1 flex flex-col gap-6 min-h-0">
                {/* 1. Rolling Transcript */}
                <div className="glass-card flex-1 flex flex-col min-h-0 border border-white/10">
                    <div className="p-4 border-b border-white/10 bg-white/5 font-mono text-sm tracking-widest text-slate-400 uppercase shrink-0">
                        Real-time Transcript
                    </div>
                    <div className="p-4 flex-1 overflow-y-auto font-mono text-sm leading-relaxed text-slate-300 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                        {transcript || <span className="text-slate-600 italic">Listening for audio stream...</span>}
                    </div>
                </div>

                {/* 2. Intent & Type */}
                <div className="glass-card p-6 border border-white/10 shrink-0">
                    {data.detectedLanguage && (
                        <div className="mb-3">
                            <div className="text-xs font-mono text-slate-500 uppercase mb-1">Detected Language</div>
                            <span className="px-2 py-1 bg-rapid-purple/20 text-rapid-purple text-sm font-bold rounded-md">
                                {data.detectedLanguage}
                            </span>
                        </div>
                    )}

                    <div className="text-xs font-mono text-slate-500 uppercase mb-2">Caller Intent</div>
                    <div className="text-2xl font-bold text-white mb-4">{data.intent}</div>

                    <div className="text-xs font-mono text-slate-500 uppercase mb-2">Emergency Classification</div>
                    <div className="text-3xl font-black text-rapid-blue tracking-tight uppercase">
                        {data.emergencyType}
                    </div>
                </div>
            </div>

            {/* COLUMN 2: CRITICAL METRICS (SEVERITY & ROUTING) */}
            <div className="xl:col-span-1 flex flex-col gap-6 min-h-0 overflow-y-auto scrollbar-none">

                {/* 3. Severity Level */}
                <div className="glass-card p-8 flex flex-col items-center justify-center text-center border border-white/10 relative overflow-hidden shrink-0">
                    <div className="text-sm font-mono text-slate-400 uppercase tracking-widest mb-4">Priority Level</div>
                    <div className={clsx(
                        "w-32 h-32 rounded-full flex items-center justify-center text-6xl font-black mb-4 transition-all duration-500 shadow-2xl",
                        getSeverityColor(data.severity)
                    )}>
                        {data.severity}
                    </div>
                    <div className="text-lg font-bold text-white">
                        {data.severity >= 5 ? "CRITICAL THREAT" :
                            data.severity >= 3 ? "URGENT RESPONSE" : "ROUTINE INCIDENT"}
                    </div>
                </div>

                {/* 4. Routing Decision */}
                <div className="glass-card p-6 border-l-4 border-l-rapid-blue flex-1 min-h-0 flex flex-col">
                    <div className="flex items-center gap-3 mb-4 shrink-0">
                        <div className="p-2 bg-rapid-blue/20 rounded-lg text-rapid-blue">
                            <Ambulance size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">Dispatch Routing</h3>
                    </div>

                    <div className="mb-6 shrink-0">
                        <div className="text-xs text-slate-400 uppercase mb-1">Primary Unit</div>
                        <div className="text-3xl font-bold text-white tracking-wide">
                            {data.routing?.primary || "Calculating..."}
                        </div>
                    </div>

                    {data.routing?.secondary?.length > 0 && (
                        <div className="mb-4 shrink-0">
                            <div className="text-xs text-slate-400 uppercase mb-1">Backup Units</div>
                            <div className="flex gap-2">
                                {data.routing.secondary.map(unit => (
                                    <span key={unit} className="px-2 py-1 bg-white/10 rounded text-sm text-slate-300 border border-white/5">
                                        {unit}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-black/30 p-3 rounded text-sm text-slate-400 italic border border-white/5 mt-auto">
                        "{data.routing?.reason || "Waiting for sufficient data..."}"
                    </div>
                </div>
            </div>

            {/* COLUMN 3: STRUCTURED SUMMARY */}
            <div className="xl:col-span-1 flex flex-col h-full min-h-0">
                {/* 5. Structured Summary */}
                <div className="glass-card flex-1 flex flex-col min-h-0 border border-white/20 bg-slate-900/80">
                    <div className="p-4 bg-rapid-blue/10 border-b border-rapid-blue/20 flex justify-between items-center shrink-0">
                        <h3 className="font-bold text-rapid-blue flex items-center gap-2">
                            <FileText size={18} /> DISPATCHER SUMMARY
                        </h3>
                        <div className="px-2 py-1 bg-black/40 rounded text-xs font-mono text-rapid-blue">
                            CONFIDENCE: {Math.round((data.summary?.confidence || 0) * 100)}%
                        </div>
                    </div>

                    <div className="p-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                        {/* Who */}
                        <div className="shrink-0">
                            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase mb-1">
                                <User size={12} /> Who / Subject
                            </div>
                            <div className="text-lg text-white font-medium border-b border-white/5 pb-2">
                                {data.summary?.who || "Unknown"}
                            </div>
                        </div>

                        {/* What */}
                        <div className="shrink-0">
                            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase mb-1">
                                <Activity size={12} /> What / Incident
                            </div>
                            <div className="text-lg text-white font-medium border-b border-white/5 pb-2">
                                {data.summary?.what || "Unknown"}
                            </div>
                        </div>

                        {/* Where */}
                        <div className="shrink-0">
                            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase mb-1">
                                <MapPin size={12} /> Where / Location
                            </div>
                            <div className="text-lg text-white font-medium border-b border-white/5 pb-2">
                                {data.summary?.where || "Unknown"}
                            </div>
                        </div>

                        {/* Condition */}
                        <div className="shrink-0">
                            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase mb-1">
                                <Stethoscope size={12} /> Status / Condition
                            </div>
                            <div className="text-lg text-white font-medium">
                                {data.summary?.condition || "Unknown"}
                            </div>
                        </div>
                    </div>

                    {/* Dispatcher One-Liner */}
                    <div className="mt-auto p-4 bg-yellow-500/10 border-t border-yellow-500/20 text-yellow-200 text-sm font-medium shrink-0">
                        <span className="font-bold text-yellow-500 uppercase mr-2">ACTION:</span>
                        {data.dispatcherSummary || "Standby..."}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoreLiveDashboard;
