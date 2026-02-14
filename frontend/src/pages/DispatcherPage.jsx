import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ArrowLeft, MessageSquare, Building2, Shield, Flame,
    Ambulance, LifeBuoy, CheckCircle, Send, PhoneCall, Copy, ClipboardCheck
} from 'lucide-react';
import clsx from 'clsx';

const EMERGENCY_CONTACTS = [
    {
        id: 'hospital',
        label: 'Hospital',
        number: '+918825946035',
        icon: Building2,
        color: 'from-blue-500 to-blue-700',
        bgColor: 'bg-blue-500/10',
        textColor: 'text-blue-400',
    },
    {
        id: 'police',
        label: 'Police Station',
        number: '+910987654321',
        icon: Shield,
        color: 'from-indigo-500 to-indigo-700',
        bgColor: 'bg-indigo-500/10',
        textColor: 'text-indigo-400',
    },
    {
        id: 'fire',
        label: 'Fire Department',
        number: '+911122334455',
        icon: Flame,
        color: 'from-orange-500 to-orange-700',
        bgColor: 'bg-orange-500/10',
        textColor: 'text-orange-400',
    },
    {
        id: 'ambulance',
        label: 'Ambulance Service',
        number: '+915566778899',
        icon: Ambulance,
        color: 'from-red-500 to-red-700',
        bgColor: 'bg-red-500/10',
        textColor: 'text-red-400',
    },
    {
        id: 'rescue',
        label: 'Rescue Team',
        number: '+919988776655',
        icon: LifeBuoy,
        color: 'from-emerald-500 to-emerald-700',
        bgColor: 'bg-emerald-500/10',
        textColor: 'text-emerald-400',
    },
];

const DispatcherPage = () => {
    const [sentTo, setSentTo] = useState([]);
    const [lastReport, setLastReport] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('rapid100_last_report');
        if (stored) {
            try {
                setLastReport(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse stored report');
            }
        }
    }, []);

    const buildReportMessage = () => {
        if (!lastReport) {
            return 'RAPID-100 EMERGENCY ALERT: No report data available. Please check the system.';
        }
        const a = lastReport;
        return [
            'RAPID-100 EMERGENCY ALERT',
            `Type: ${a.emergencyType || 'Unknown'}`,
            `Severity: ${a.severity || '?'}/5`,
            `Who: ${a.summary?.who || 'Unknown'}`,
            `What: ${a.summary?.what || 'Unknown'}`,
            `Where: ${a.summary?.where || 'Unknown'}`,
            `Condition: ${a.summary?.condition || 'Unknown'}`,
            `Action: ${a.recommended_action || a.dispatcherSummary || 'Assess situation'}`,
            `Routing: ${a.routing?.primary || 'Manual'}`
        ].join('\n');
    };

    // WhatsApp Web - works on Mac, Windows, Mobile, everywhere
    const handleWhatsApp = (contact) => {
        const message = encodeURIComponent(buildReportMessage());
        // Remove + from number for wa.me link
        const cleanNumber = contact.number.replace('+', '');
        window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
        setSentTo(prev => [...prev, contact.id]);
    };

    // Call - works on mobile, on desktop opens FaceTime/Skype etc.
    const handleCall = (contact) => {
        window.open(`tel:${contact.number}`, '_self');
        setSentTo(prev => [...prev, contact.id]);
    };

    // Copy report to clipboard
    const handleCopyReport = async () => {
        try {
            await navigator.clipboard.writeText(buildReportMessage());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = buildReportMessage();
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen text-white font-sans bg-rapid-bg"
        >
            <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none z-0"></div>

            {/* Header */}
            <header className="relative z-50 glass-panel border-b border-white/5 px-6 py-4 flex justify-between items-center sticky top-0 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <Link to="/live" className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="h-6 w-px bg-white/10"></div>
                    <div>
                        <h2 className="text-lg font-bold font-exo tracking-tight">EMERGENCY DISPATCHER</h2>
                        <p className="text-[10px] text-rapid-green tracking-widest font-mono uppercase flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rapid-green animate-pulse"></span>
                            Send Report to Emergency Services
                        </p>
                    </div>
                </div>
                {/* Copy Report Button */}
                <button
                    onClick={handleCopyReport}
                    className={clsx(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                        copied ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-slate-300 hover:bg-white/20"
                    )}
                >
                    {copied ? <><ClipboardCheck size={14} /> Copied!</> : <><Copy size={14} /> Copy Report</>}
                </button>
            </header>

            <main className="relative z-10 p-6 max-w-3xl mx-auto">

                {/* Report Preview */}
                <div className="glass-card p-6 mb-8 border border-white/10">
                    <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4">Current Report Summary</h3>
                    {lastReport ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className={clsx(
                                    "px-3 py-1 rounded-full text-xs font-bold uppercase",
                                    (lastReport.severity || 1) >= 4 ? "bg-red-500/20 text-red-400" :
                                        (lastReport.severity || 1) >= 3 ? "bg-orange-500/20 text-orange-400" :
                                            "bg-emerald-500/20 text-emerald-400"
                                )}>
                                    Severity {lastReport.severity || 1}/5
                                </span>
                                <span className="text-white font-bold text-lg">{lastReport.emergencyType || 'Unknown'}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-white/5 p-3 rounded-lg">
                                    <div className="text-[10px] text-slate-500 uppercase">Who</div>
                                    <div className="text-white">{lastReport.summary?.who || '-'}</div>
                                </div>
                                <div className="bg-white/5 p-3 rounded-lg">
                                    <div className="text-[10px] text-slate-500 uppercase">What</div>
                                    <div className="text-white">{lastReport.summary?.what || '-'}</div>
                                </div>
                                <div className="bg-white/5 p-3 rounded-lg">
                                    <div className="text-[10px] text-slate-500 uppercase">Where</div>
                                    <div className="text-white">{lastReport.summary?.where || '-'}</div>
                                </div>
                                <div className="bg-white/5 p-3 rounded-lg">
                                    <div className="text-[10px] text-slate-500 uppercase">Action</div>
                                    <div className="text-white">{lastReport.recommended_action || lastReport.dispatcherSummary || '-'}</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-slate-500 text-sm">No report available. Go to Live Console to analyze a call first.</p>
                    )}
                </div>

                {/* Emergency Contacts */}
                <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4">Emergency Contacts</h3>
                <div className="space-y-4">
                    {EMERGENCY_CONTACTS.map((contact) => {
                        const Icon = contact.icon;
                        const isSent = sentTo.includes(contact.id);

                        return (
                            <motion.div
                                key={contact.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={clsx(
                                    "glass-card p-5 border transition-all",
                                    isSent ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/10"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={clsx(
                                            "w-12 h-12 rounded-xl flex items-center justify-center",
                                            contact.bgColor, contact.textColor
                                        )}>
                                            <Icon size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold">{contact.label}</h4>
                                            <p className="text-slate-400 text-sm font-mono">{contact.number}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {isSent && (
                                            <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                                                <CheckCircle size={14} /> Sent
                                            </span>
                                        )}

                                        {/* WhatsApp Button */}
                                        <button
                                            onClick={() => handleWhatsApp(contact)}
                                            className={clsx(
                                                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                                                "bg-gradient-to-r from-green-500 to-green-700",
                                                "hover:scale-105 shadow-lg text-white"
                                            )}
                                        >
                                            <MessageSquare size={16} />
                                            WhatsApp
                                        </button>

                                        {/* Call Button */}
                                        <button
                                            onClick={() => handleCall(contact)}
                                            className={clsx(
                                                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                                                "bg-gradient-to-r", contact.color,
                                                "hover:scale-105 shadow-lg text-white"
                                            )}
                                        >
                                            <PhoneCall size={16} />
                                            Call
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Broadcast Button */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => {
                            EMERGENCY_CONTACTS.forEach((c, i) => {
                                // Stagger opening to avoid popup blockers
                                setTimeout(() => handleWhatsApp(c), i * 500);
                            });
                        }}
                        className="px-8 py-3 bg-gradient-to-r from-rapid-blue to-rapid-purple rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-blue-900/30 hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
                    >
                        <Send size={18} />
                        Broadcast Report to All Units
                    </button>
                </div>
            </main>
        </motion.div>
    );
};

export default DispatcherPage;
