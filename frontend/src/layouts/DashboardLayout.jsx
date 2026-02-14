import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, Activity, History, Settings,
    LogOut, Bell, Search, Menu, X, Users
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, path, active }) => (
    <Link to={path}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active
                ? 'bg-rapid-blue/10 text-rapid-blue shadow-[0_0_15px_rgba(59,130,246,0.2)] border border-rapid-blue/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}>
            <Icon size={20} className={active ? 'text-rapid-blue' : 'text-slate-500 group-hover:text-white'} />
            <span className="font-medium text-sm">{label}</span>
            {active && <motion.div layoutId="sidebar-active" className="ml-auto w-1.5 h-1.5 rounded-full bg-rapid-blue shadow-[0_0_10px_#3B82F6]" />}
        </div>
    </Link>
);

const DashboardLayout = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex min-h-screen bg-rapid-bg text-white overflow-hidden selection:bg-rapid-blue/30">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-rapid-blue/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-rapid-purple/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
            </div>

            {/* Sidebar */}
            <aside className="w-64 glass-panel border-r border-white/5 z-20 flex flex-col hidden md:flex sticky top-0 h-screen">
                <div className="p-6 flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-rapid-blue to-rapid-purple rounded-lg shadow-lg">
                        <Activity className="text-white w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold font-exo tracking-tight">RAPID<span className="text-rapid-blue">100</span></h1>
                        <p className="text-[10px] text-slate-500 tracking-[0.2em] uppercase">Enterprise</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <div className="text-xs font-bold text-slate-600 uppercase px-4 mb-2 mt-4 tracking-wider">Main</div>
                    <SidebarItem icon={LayoutDashboard} label="Command Center" path="/dashboard" active={isActive('/dashboard')} />
                    <SidebarItem icon={Activity} label="Live Console" path="/live" active={isActive('/live')} />

                    <div className="text-xs font-bold text-slate-600 uppercase px-4 mb-2 mt-6 tracking-wider">Analysis</div>
                    <SidebarItem icon={History} label="Call History" path="/history" active={isActive('/history')} />
                    <SidebarItem icon={Users} label="Active Units" path="/units" active={isActive('/units')} />

                    <div className="text-xs font-bold text-slate-600 uppercase px-4 mb-2 mt-6 tracking-wider">System</div>
                    <SidebarItem icon={Settings} label="Configuration" path="/settings" active={isActive('/settings')} />
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="glass-card p-3 flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center font-bold text-black text-xs">
                            JD
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold truncate">John Doe</h4>
                            <p className="text-[10px] text-slate-400 truncate">Senior Dispatcher</p>
                        </div>
                    </div>
                    <Link to="/login">
                        <button className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                            <LogOut size={14} /> Sign Out
                        </button>
                    </Link>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 relative z-10 overflow-hidden">
                {/* Mobile Header (Visible only on small screens) */}
                <header className="md:hidden h-16 glass-panel border-b border-white/5 flex items-center justify-between px-4 sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <Activity className="text-rapid-blue w-6 h-6" />
                        <span className="font-bold font-exo text-lg">RAPID100</span>
                    </div>
                    <button className="p-2 text-slate-400"><Menu /></button>
                </header>

                <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
