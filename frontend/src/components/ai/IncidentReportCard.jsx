import React from 'react';
import { FileText, CheckCircle, AlertTriangle } from 'lucide-react';

const IncidentReportCard = ({ analysis }) => {
    const {
        emergencyTypes,
        severityScore,
        primaryThreat,
        locationData,
        recommendedAction
    } = analysis || {};

    const isDispatchReady = (emergencyTypes?.length > 0) && (locationData?.candidates?.length > 0);

    return (
        <div className="glass-card p-5 border-t-4 border-t-white/20">
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                <span><FileText size={14} className="inline mr-2" /> Incident Report</span>
                {isDispatchReady ? (
                    <span className="text-green-400 flex items-center gap-1"><CheckCircle size={10} /> DISPATCH READY</span>
                ) : (
                    <span className="text-orange-400 flex items-center gap-1"><AlertTriangle size={10} /> INFO MISSING</span>
                )}
            </h3>

            <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">Primary Type</span>
                    <span className="font-bold text-white uppercase">{primaryThreat || "Analysis Pending..."}</span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">Severity</span>
                    <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-rapid-red" style={{ width: `${(severityScore || 1) / 5 * 100}%` }}></div>
                        </div>
                        <span className="font-mono text-white">{severityScore?.toFixed(1) || "0.0"}</span>
                    </div>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">Location</span>
                    <span className="font-bold text-white text-right max-w-[150px] truncate">
                        {locationData?.candidates?.[0] || "Scanning..."}
                    </span>
                </div>

                <div className="pt-2">
                    <span className="text-slate-400 block mb-1">Recommended Service</span>
                    <div className="p-2 bg-white/5 rounded border border-white/10 text-center font-mono text-xs uppercase text-rapid-blue">
                        {recommendedAction || "STANDBY"}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncidentReportCard;
