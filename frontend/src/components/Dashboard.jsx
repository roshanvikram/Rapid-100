import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ShieldAlert, BrainCircuit, Phone, Activity, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

const Dashboard = ({ transcript, analysis, history }) => {
    const [showTranslated, setShowTranslated] = React.useState(false);

    // Use history for chart data, or fallback to empty array
    const chartData = (history || []).map((h, i) => ({
        time: i,
        severity: Number(h.severity) || 1,
        panic: (Number(h.panic_level) || 0) / 20 // Scale panic to 0-5
    })).slice(-30);

    const getSeverityColor = (score) => {
        if (score >= 4) return 'from-red-600 to-red-900 border-red-500 shadow-red-500/20';
        if (score >= 2.5) return 'from-orange-500 to-orange-800 border-orange-500 shadow-orange-500/20';
        return 'from-emerald-600 to-emerald-900 border-emerald-500 shadow-emerald-500/20';
    };

    const getSeverityText = (score) => {
        if (score >= 4.5) return "CRITICAL EMERGENCY";
        if (score >= 3.5) return "HIGH THREAT";
        if (score >= 2.5) return "ELEVATED RISK";
        return "ROUTINE INCIDENT";
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            {/* Column 1: Live Transcript (Is wider now) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="glass-card flex flex-col h-[600px]">
                    <div className="p-5 border-b border-white/5 flex items-center justify-between bg-black/20 shrink-0">
                        <h3 className="font-semibold flex items-center gap-2 text-blue-100">
                            <Phone size={18} className="text-rapid-blue" />
                            Real-time Transcript
                        </h3>
                        <div className="flex gap-2 items-center">
                            {analysis?.translation?.isTranslated && (
                                <button
                                    onClick={() => setShowTranslated(!showTranslated)}
                                    className="px-2 py-1 bg-white/10 rounded text-xs font-bold text-slate-300 hover:text-white border border-white/10 transition-colors"
                                >
                                    {showTranslated ? 'SHOW ORIGINAL' : 'TRANSLATE'}
                                </button>
                            )}
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        </div>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto min-h-0 space-y-4">
                        {transcript ? (
                            <div className="space-y-4">
                                {/* Simulated "Chat Bubble" effect for transcript chunks */}
                                <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 text-slate-200 leading-relaxed font-light text-lg whitespace-pre-wrap animate-in fade-in slide-in-from-left-2 duration-300">
                                    {showTranslated && analysis?.translation?.isTranslated
                                        ? "Hola, hay un incendio en la cocina. ¡Ayuda! (Translated from ES)"
                                        : transcript}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-3">
                                <Activity size={40} className="opacity-20" />
                                <p className="font-mono text-sm">Waiting for voice input...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Signal Analysis Panel */}
                <div className="glass-card p-6">
                    <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-6">Signal Metrics</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-400">Panic Level</span>
                                <span className="text-white font-mono font-bold text-lg">{analysis?.panic_level || 0}%</span>
                            </div>
                            <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-500 via-orange-500 to-red-500 transition-all duration-700 ease-out relative"
                                    style={{ width: `${analysis?.panic_level || 0}%` }}
                                >
                                    <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white/50 shadow-[0_0_10px_white]"></div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                <div className="text-xs text-slate-500 mb-1">Confidence</div>
                                <div className="text-2xl font-mono text-rapid-blue">{Math.round((analysis?.confidence_score || 0) * 100)}%</div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                <div className="text-xs text-slate-500 mb-1">Fake Prob.</div>
                                <div className={clsx("text-2xl font-mono", (analysis?.fake_call_probability || 0) > 0.5 ? "text-red-400" : "text-emerald-400")}>
                                    {Math.round((analysis?.fake_call_probability || 0) * 100)}%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Column 2: Dashboard Core */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                {/* Top KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Severity Card */}
                    <div className={`relative overflow-hidden rounded-2xl p-1 shadow-2xl transition-all duration-500 bg-gradient-to-br ${getSeverityColor(analysis?.severity || 1)}`}>
                        {/* Escalation Warning Banner */}
                        {analysis?.emotionalState?.panic > 80 && (
                            <div className="absolute top-0 left-0 right-0 bg-red-600/90 text-white text-[10px] font-bold uppercase tracking-widest py-1 text-center animate-pulse z-20">
                                ⚠ Risk Escalation Predicted
                            </div>
                        )}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                        <div className="relative h-full bg-black/20 backdrop-blur-sm rounded-xl p-6 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-white/10 rounded-full backdrop-blur-md">
                                    <ShieldAlert size={32} className="text-white" />
                                </div>
                                <span className="font-mono text-5xl font-black tracking-tighter text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                                    {analysis?.severity || 1}<span className="text-2xl opacity-50">/5</span>
                                </span>
                            </div>

                            <div className="mt-6">
                                <h4 className="font-bold text-white text-lg tracking-wide uppercase mb-1">
                                    {getSeverityText(analysis?.severity || 1)}
                                </h4>
                                <p className="text-white/70 text-sm font-medium">
                                    Current incident threat classification
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* AI Recommendation Card */}
                    <div className="relative glass-card overflow-hidden group">
                        <div className="absolute top-0 right-0 p-32 bg-rapid-blue/10 blur-[80px] rounded-full group-hover:bg-rapid-blue/20 transition-all duration-700"></div>

                        <div className="relative p-7 h-full flex flex-col">
                            <div className="flex items-center gap-3 mb-4">
                                <BrainCircuit size={24} className="text-rapid-blue" />
                                <h4 className="font-bold text-sm text-rapid-blue uppercase tracking-widest">AI Strategy</h4>
                            </div>

                            <div className="flex-1 flex flex-col justify-center">
                                <div className="text-3xl font-bold text-white mb-3 leading-tight">
                                    {analysis?.recommended_action || "System Standby"}
                                </div>
                                <div className="pl-4 border-l-2 border-rapid-blue/30 py-1">
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        {analysis?.explanation || "Waiting for incident data to formulate strategy..."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Chart */}
                <div className="glass-card p-6 flex-1 min-h-[350px] flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Activity size={20} className="text-rapid-orange" />
                            Temporal Risk Analysis
                        </h3>
                        <div className="flex gap-4 text-xs font-medium">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-rapid-red"></span> Severity
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-rapid-orange"></span> Panic Idx
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorSeverity" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorPanic" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" tick={false} axisLine={false} />
                                <YAxis domain={[0, 5]} stroke="rgba(255,255,255,0.2)" tickLine={false} axisLine={false} tickCount={6} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        borderColor: 'rgba(255,255,255,0.1)',
                                        color: '#f8fafc',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                                    }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="severity"
                                    stroke="#ef4444"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorSeverity)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="panic"
                                    stroke="#f59e0b"
                                    strokeWidth={2}
                                    strokeDasharray="4 4"
                                    fillOpacity={1}
                                    fill="url(#colorPanic)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
