import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import AudioStreamer from '../components/AudioStreamer';
import Dashboard from '../components/Dashboard';
import EmotionMeter from '../components/ai/EmotionMeter';
import RiskIndicator from '../components/ai/RiskIndicator';
import SuggestionPanel from '../components/ai/SuggestionPanel';
import SupervisorHeatmap from '../components/ai/SupervisorHeatmap';
import IncidentReportCard from '../components/ai/IncidentReportCard';
import CoreLiveDashboard from '../components/CoreLiveDashboard';
import { Activity, Radio, ShieldCheck, AlertOctagon, ArrowLeft, MoreHorizontal, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const SOCKET_URL = 'http://localhost:5001';

function LiveConsole() {
    const navigate = useNavigate();
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isCallActive, setIsCallActive] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [history, setHistory] = useState([]);

    // Save analysis to localStorage whenever it updates (for dispatcher page)
    useEffect(() => {
        if (analysis) {
            localStorage.setItem('rapid100_last_report', JSON.stringify(analysis));
        }
    }, [analysis]);

    const handleDispatch = () => {
        navigate('/dispatcher');
    };

    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to backend');
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected');
            setIsConnected(false);
        });

        newSocket.on('ai-update', (data) => {
            setAnalysis(data);
            setHistory(prev => [...prev, data]);
        });

        newSocket.on('analysis-update', (data) => {
            console.log('Analysis update received:', data);
            setAnalysis(data);
            setHistory(prev => [...prev, data]);
        });

        newSocket.on('transcript-update', (text) => {
            setTranscript(text);
        });

        newSocket.on('error', (msg) => {
            console.error('Server error:', msg);
        });

        return () => newSocket.close();
    }, []);

    const handleStartCall = () => {
        if (socket) {
            socket.emit('start-call');
        }
        setIsCallActive(true);
        setTranscript("");
        setHistory([]);
        setAnalysis(null);
    };

    const handleEndCall = () => {
        setIsCallActive(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen text-white font-sans selection:bg-rapid-blue/30 overflow-x-hidden bg-rapid-bg"
        >
            {/* Background Grid Animation */}
            <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none z-0"></div>

            {/* Live Console Header */}
            <header className="relative z-50 glass-panel border-b-0 border-b-white/5 px-6 py-4 flex justify-between items-center sticky top-0 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="h-6 w-px bg-white/10"></div>
                    <div>
                        <h2 className="text-lg font-bold font-exo tracking-tight">LIVE ANALYSIS CONSOLE</h2>
                        <p className="text-[10px] text-rapid-green tracking-widest font-mono uppercase flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-rapid-green animate-pulse"></div>
                            Secure Channel 042-A
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className={clsx(
                        "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold border tracking-wide font-mono",
                        isConnected ? 'bg-rapid-green/5 border-rapid-green/20 text-rapid-green' : 'bg-red-500/10 border-red-500/20 text-red-500'
                    )}>
                        {isConnected ? 'NET_ONLINE' : 'NET_OFFLINE'}
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold border tracking-wide font-mono bg-blue-500/10 border-blue-500/20 text-blue-400">
                        {/* 
                            In a real app, we'd fetch this status from backend. 
                            For now, we assume simulation if not explicitly told otherwise via event.
                         */}
                        {analysis?.model ? 'GROQ LLaMA 3 CONNECTED' : 'SIMULATION CORE'}
                    </div>

                    {analysis && (
                        <button
                            onClick={handleDispatch}
                            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-rapid-blue to-rapid-purple hover:scale-105 transition-transform shadow-lg"
                        >
                            <Send size={14} />
                            DISPATCH
                        </button>
                    )}

                    <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 p-6 flex flex-col gap-6 max-w-[1800px] mx-auto w-full h-[calc(100vh-80px)]">
                <div className="flex flex-col xl:flex-row gap-6 items-stretch h-full">

                    {/* Left Column: Audio & Controls */}
                    <div className="w-full xl:w-[400px] shrink-0 flex flex-col gap-6">
                        <AudioStreamer
                            socket={socket}
                            isCallActive={isCallActive}
                            onCallStart={handleStartCall}
                            onCallEnd={handleEndCall}
                            onAnalysisComplete={(data) => {
                                setTranscript(data.transcript);
                                setAnalysis(data.analysis);
                                setHistory(prev => [...prev, data.analysis]);
                            }}
                        />

                        {/* Session Metadata Card */}
                        <div className="glass-card p-5 flex-1 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-5"><ShieldCheck size={100} /></div>
                            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4">Session Telemetry</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-3 rounded-lg">
                                    <div className="text-[10px] text-slate-500 uppercase">Input Engine</div>
                                    <div className="text-sm font-mono text-white">WebAudio</div>
                                </div>
                                <div className="bg-white/5 p-3 rounded-lg">
                                    <div className="text-[10px] text-slate-500 uppercase">Sample Rate</div>
                                    <div className="text-sm font-mono text-white">48kHz</div>
                                </div>
                                <div className="bg-white/5 p-3 rounded-lg">
                                    <div className="text-[10px] text-slate-500 uppercase">Buffer Size</div>
                                    <div className="text-sm font-mono text-white">4096</div>
                                </div>
                                <div className="bg-white/5 p-3 rounded-lg">
                                    <div className="text-[10px] text-slate-500 uppercase">Encoding</div>
                                    <div className="text-sm font-mono text-white">PCM 16-bit</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Visualization */}
                    <div className="flex-1 w-full bg-black/20 rounded-2xl border border-white/5 overflow-hidden relative">
                        {!isCallActive && !analysis && !transcript ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                                <div className="bg-white/5 p-8 rounded-full mb-8 relative group cursor-pointer hover:bg-white/10 transition-all border border-white/5 hover:border-rapid-blue/30 hover:scale-105 duration-300" onClick={handleStartCall}>
                                    <div className="absolute inset-0 bg-rapid-blue rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                                    <Radio size={48} className="text-slate-400 group-hover:text-white relative z-10 transition-colors" />
                                </div>
                                <h2 className="text-4xl font-bold text-white mb-4 font-exo">Awaiting Signal</h2>
                                <p className="text-slate-500 max-w-md text-lg leading-relaxed">
                                    Initialize input stream from the control panel or upload forensic audio file to begin deep analysis.
                                </p>
                            </div>
                        ) : (
                            <div className="h-full bg-slate-900/50">
                                <CoreLiveDashboard
                                    transcript={transcript}
                                    analysis={analysis}
                                />
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </motion.div>
    );
}

export default LiveConsole;
