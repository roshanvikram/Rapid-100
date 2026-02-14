import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldAlert, Activity, Lock, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-rapid-bg text-white overflow-hidden relative selection:bg-rapid-blue/30 scale-100">

            {/* Dynamic Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rapid-blue/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rapid-purple/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-10 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-rapid-blue to-rapid-purple rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                        <Activity className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold tracking-tighter font-exo">RAPID<span className="text-rapid-blue">100</span></span>
                </div>
                <Link to="/login">
                    <button className="px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all text-sm font-medium tracking-wide">
                        Access Terminal
                    </button>
                </Link>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-12 flex flex-col items-center text-center">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rapid-blue/10 border border-rapid-blue/20 text-rapid-blue mb-8 backdrop-blur-sm"
                >
                    <ShieldAlert size={14} />
                    <span className="text-xs font-bold uppercase tracking-widest">Enterprise Emergency Intelligence</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent font-exo"
                >
                    Predict the <br />
                    <span className="bg-gradient-to-r from-rapid-blue via-rapid-purple to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                        Unpredictable
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed"
                >
                    The world's most advanced AI-powered emergency call analysis platform.
                    Detect threats, visualize panic levels, and automate dispatch decisions in real-time.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 w-full justify-center"
                >
                    <Link to="/login">
                        <button className="group relative px-8 py-4 bg-white text-black font-bold rounded-xl text-lg hover:scale-105 transition-transform duration-200 overflow-hidden">
                            <span className="relative z-10 flex items-center gap-2">
                                Initialize System <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-rapid-blue to-rapid-purple opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        </button>
                    </Link>
                    <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-medium rounded-xl text-lg hover:bg-white/10 backdrop-blur-md transition-all">
                        View Documentation
                    </button>
                </motion.div>

                {/* Floating UI Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 50, rotateX: 10 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 1, delay: 0.8, type: "spring" }}
                    className="mt-20 w-full max-w-5xl rounded-2xl border border-white/10 bg-[#0B101B]/80 backdrop-blur-xl shadow-2xl overflow-hidden relative group"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-rapid-blue/5 to-transparent pointer-events-none"></div>

                    {/* Mockup Header */}
                    <div className="h-10 border-b border-white/5 flex items-center px-4 gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                        </div>
                        <div className="ml-4 w-60 h-4 rounded-full bg-white/5"></div>
                    </div>

                    {/* Simulated Dashboard Content */}
                    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-80 group-hover:opacity-100 transition-opacity">
                        {/* Audio Viz Mock */}
                        <div className="h-40 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-40">
                                {[...Array(20)].map((_, i) => (
                                    <div key={i} className="w-1 bg-rapid-blue h-8 animate-pulse" style={{ height: Math.random() * 60 + 10 + '%' }}></div>
                                ))}
                            </div>
                        </div>
                        {/* Stats Mock */}
                        <div className="h-40 rounded-xl bg-white/5 border border-white/5 p-4 space-y-3">
                            <div className="flex justify-between">
                                <div className="w-20 h-2 bg-white/10 rounded"></div>
                                <div className="w-8 h-2 bg-red-500/50 rounded"></div>
                            </div>
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="w-[85%] h-full bg-red-500"></div>
                            </div>
                            <div className="pt-4 flex gap-2">
                                <div className="flex-1 h-16 bg-white/5 rounded-lg border border-white/5"></div>
                                <div className="flex-1 h-16 bg-white/5 rounded-lg border border-white/5"></div>
                            </div>
                        </div>
                        {/* Map Mock */}
                        <div className="h-40 rounded-xl bg-gradient-to-br from-rapid-purple/20 to-rapid-blue/5 border border-white/5 flex items-center justify-center">
                            <Activity className="text-white/20 w-12 h-12" />
                        </div>
                    </div>

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent h-40 bottom-0 top-auto"></div>
                </motion.div>

            </main>
        </div>
    );
};

export default LandingPage;
