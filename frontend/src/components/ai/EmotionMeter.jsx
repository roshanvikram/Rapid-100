import React from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, Zap, AlertCircle } from 'lucide-react';

const EmotionBar = ({ label, value, color }) => (
    <div className="mb-3">
        <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
            <span>{label}</span>
            <span className={`${color}`}>{value}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1 }}
                className={`h-full rounded-full ${color.replace('text-', 'bg-')}`}
            />
        </div>
    </div>
);

const EmotionMeter = ({ emotionalState }) => {
    const { panic, aggression, distressConfidence } = emotionalState || { panic: 0, aggression: 0, distressConfidence: 0 };

    return (
        <div className="glass-card p-5 border-l-4 border-l-purple-500">
            <h3 className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <HeartPulse size={14} /> Biometric/Emotion Analysis
            </h3>

            <EmotionBar label="Panic / Stress Level" value={panic} color="text-rapid-red" />
            <EmotionBar label="Aggression Index" value={aggression} color="text-orange-500" />

            <div className="mt-4 flex items-center gap-2 bg-white/5 p-2 rounded-lg">
                <AlertCircle size={14} className="text-blue-400" />
                <span className="text-xs text-slate-300">
                    Distress Confidence: <span className="text-white font-mono font-bold">
                        {!isNaN(distressConfidence) ? (distressConfidence * 100).toFixed(0) : 0}%
                    </span>
                </span>
            </div>
        </div>
    );
};

export default EmotionMeter;
