import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Play, MoreVertical, AlertTriangle, FileText } from 'lucide-react';

const mockHistory = [
    { id: "LOG-8821", date: "Today, 10:42 AM", type: "Fire / Hazmat", severity: 4.5, duration: "4m 12s", status: "Resolved", agent: "AI-Auto" },
    { id: "LOG-8820", date: "Today, 09:15 AM", type: "Medical Emergency", severity: 3.8, duration: "12m 05s", status: "Closed", agent: "J. Doe" },
    { id: "LOG-8819", date: "Today, 08:30 AM", type: "Domestic Disturbance", severity: 2.1, duration: "8m 45s", status: "Review", agent: "AI-Auto" },
    { id: "LOG-8818", date: "Yesterday, 11:20 PM", type: "Noise Complaint", severity: 1.2, duration: "2m 10s", status: "Closed", agent: "S. Smith" },
    { id: "LOG-8817", date: "Yesterday, 06:45 PM", type: "Vehicle Accident", severity: 4.1, duration: "25m 00s", status: "Archived", agent: "AI-Auto" },
];

const HistoryPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-8 max-w-7xl mx-auto"
        >
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-exo text-white mb-2">Call Log History</h1>
                    <p className="text-slate-400 text-sm">Forensic archives and past incident analysis reports.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="glass-card p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search logs by ID, Type, or Keywords..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-rapid-blue/50 transition-colors"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="px-3 py-2 bg-white/5 rounded-lg text-sm text-slate-400 hover:text-white flex items-center gap-2">
                        <Filter size={16} /> Severity: All
                    </button>
                    <button className="px-3 py-2 bg-white/5 rounded-lg text-sm text-slate-400 hover:text-white flex items-center gap-2">
                        <Filter size={16} /> Status: All
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10 text-xs font-bold text-slate-400 uppercase tracking-wider">
                            <th className="p-4" width="50"><input type="checkbox" className="rounded bg-white/10 border-white/20" /></th>
                            <th className="p-4">Log ID</th>
                            <th className="p-4">Incident Type</th>
                            <th className="p-4">Severity</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Agent</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-white/5">
                        {mockHistory.map((item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-4"><input type="checkbox" className="rounded bg-white/10 border-white/20" /></td>
                                <td className="p-4">
                                    <div className="font-mono font-medium text-white">{item.id}</div>
                                    <div className="text-[10px] text-slate-500">{item.date}</div>
                                </td>
                                <td className="p-4 font-medium text-white">{item.type}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${item.severity >= 4 ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                            item.severity >= 3 ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                                                'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                        }`}>
                                        {item.severity}/5
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Active' ? 'bg-rapid-green animate-pulse' : 'bg-slate-500'}`} />
                                        {item.status}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-400">{item.agent}</td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-rapid-blue" title="Replay">
                                            <Play size={16} />
                                        </button>
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white" title="View Report">
                                            <FileText size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default HistoryPage;
