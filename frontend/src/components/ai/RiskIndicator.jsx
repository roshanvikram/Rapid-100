import React from 'react';
import { ShieldAlert, CheckCircle } from 'lucide-react';

const RiskIndicator = ({ fakeCallRisk }) => {
    const { probability, reasons } = fakeCallRisk || { probability: 0, reasons: [] };
    const isHighRisk = probability > 0.5;

    return (
        <div className={`glass-card p-5 border-l-4 ${isHighRisk ? 'border-l-red-500' : 'border-l-green-500'} transition-colors duration-500`}>
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ShieldAlert size={14} /> Credibility Score
            </h3>

            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white">Fake Call Probability</span>
                <span className={`text-xl font-mono font-bold ${isHighRisk ? 'text-red-500' : 'text-green-500'}`}>
                    {(probability * 100).toFixed(0)}%
                </span>
            </div>

            <div className="w-full bg-white/5 rounded-full h-1.5 mb-4">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ${isHighRisk ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${probability * 100}%` }}
                />
            </div>

            {reasons.length > 0 ? (
                <div className="text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">
                    Warning: {reasons.join(', ')}
                </div>
            ) : (
                <div className="flex items-center gap-2 text-xs text-green-500">
                    <CheckCircle size={12} />
                    <span>Caller pattern appears consistent.</span>
                </div>
            )}
        </div>
    );
};

export default RiskIndicator;
