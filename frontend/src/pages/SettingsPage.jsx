import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, RefreshCw, Smartphone, Shield, Bell, Cpu, Volume2, Globe } from 'lucide-react';

const SettingsSection = ({ title, icon: Icon, children }) => (
    <div className="glass-card p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Icon className="text-rapid-blue" size={20} />
            {title}
        </h3>
        <div className="space-y-6">
            {children}
        </div>
    </div>
);

const Toggle = ({ label, desc, checked, onChange }) => (
    <div className="flex items-center justify-between">
        <div>
            <div className="text-sm font-medium text-white">{label}</div>
            <div className="text-xs text-slate-400">{desc}</div>
        </div>
        <button
            onClick={() => onChange(!checked)}
            className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${checked ? 'bg-rapid-blue' : 'bg-slate-700'}`}
        >
            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
    </div>
);

const RangeSlider = ({ label, value, min, max, unit }) => (
    <div>
        <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-slate-300">{label}</label>
            <span className="text-xs font-mono text-rapid-blue">{value}{unit}</span>
        </div>
        <input
            type="range" min={min} max={max} defaultValue={value}
            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rapid-blue"
        />
    </div>
);

const SettingsPage = () => {
    const [safetyOverride, setSafetyOverride] = useState(true);
    const [autoDispatch, setAutoDispatch] = useState(false);
    const [notifications, setNotifications] = useState(true);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-8 max-w-5xl mx-auto"
        >
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-exo text-white mb-2">System Configuration</h1>
                    <p className="text-slate-400 text-sm">Manage AI sensitivity, notification preferences, and system overrides.</p>
                </div>
                <button className="px-6 py-2 bg-rapid-blue hover:bg-blue-600 rounded-lg font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
                    <Save size={16} /> Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Column 1 */}
                <div>
                    <SettingsSection title="Reasoning Engine" icon={Cpu}>
                        <RangeSlider label="Confidence Threshold" value={75} min={0} max={100} unit="%" />
                        <RangeSlider label="Keyword Sensitivity" value={4} min={1} max={10} unit="/10" />
                        <Toggle
                            label="Contextual Awareness"
                            desc="Allow AI to use historical call data for reasoning."
                            checked={true} onChange={() => { }}
                        />
                    </SettingsSection>

                    <SettingsSection title="Safety & Ethics" icon={Shield}>
                        <Toggle
                            label="Automated Safety Override"
                            desc="Force Severity 5 if life-threatening keywords detected."
                            checked={safetyOverride} onChange={setSafetyOverride}
                        />
                        <Toggle
                            label="Fake Call Detection"
                            desc="Flag potential prank calls based on laughter/tone."
                            checked={true} onChange={() => { }}
                        />
                    </SettingsSection>
                </div>

                {/* Column 2 */}
                <div>
                    <SettingsSection title="Notifications & Alerts" icon={Bell}>
                        <Toggle
                            label="Desktop Alerts"
                            desc="Show popup notifications for Severity 4+."
                            checked={notifications} onChange={setNotifications}
                        />
                        <Toggle
                            label="Auto-Dispatch Logic"
                            desc="Automatically notify units for confidence > 95%."
                            checked={autoDispatch} onChange={setAutoDispatch}
                        />
                    </SettingsSection>

                    <SettingsSection title="Audio Processing" icon={Volume2}>
                        <RangeSlider label="Noise Suppression" value={60} min={0} max={100} unit="%" />
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                            <div className="w-2 h-2 rounded-full bg-rapid-green animate-pulse" />
                            <span className="text-sm font-mono text-slate-300">WebAudio API: Active (48kHz)</span>
                        </div>
                    </SettingsSection>
                </div>

            </div>
        </motion.div>
    );
};

export default SettingsPage;
