import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Activity, ArrowRight, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            navigate('/dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full bg-rapid-bg flex items-center justify-center relative overflow-hidden p-4">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-rapid-blue/5 rounded-full blur-[150px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-rapid-purple/5 rounded-full blur-[150px] animate-pulse delay-700"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
                        <div className="p-2 bg-gradient-to-br from-rapid-blue to-rapid-purple rounded-lg shadow-lg group-hover:shadow-rapid-blue/20 transition-all">
                            <Activity className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold font-exo text-white">RAPID<span className="text-rapid-blue">100</span></span>
                    </Link>
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-slate-400">Enter your credentials to access the command center.</p>
                </div>

                <div className="glass-card p-8 bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-rapid-blue transition-colors" size={20} />
                                <input
                                    type="email"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-rapid-blue/50 focus:bg-white/10 transition-all"
                                    placeholder="agent@rapid100.ai"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-rapid-purple transition-colors" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder-slate-600 focus:outline-none focus:border-rapid-purple/50 focus:bg-white/10 transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-white transition-colors">
                                <input type="checkbox" className="rounded bg-white/10 border-white/20 text-rapid-blue focus:ring-0" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="text-rapid-blue hover:text-rapid-purple transition-colors font-medium">Forgot Password?</a>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-rapid-blue to-rapid-purple rounded-xl font-bold text-white shadow-lg shadow-blue-900/20 hover:scale-[1.02] hover:shadow-blue-900/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Authenticating...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-slate-500 text-sm">
                    Restricted System. Authorized Personnel Only. <br />
                    ID: <span className="font-mono text-slate-400">RAPID-SEC-LEVEL-5</span>
                </p>

            </motion.div>
        </div>
    );
};

export default LoginPage;
