import { useEffect } from 'react';
import useVisitorStore from '../store/useVisitorStore';
import { format } from 'date-fns';
import { ShieldCheck, ShieldAlert, AlertTriangle, LogOut } from 'lucide-react';

const RiskBadge = ({ score, reason }) => {
    const config = {
        GREEN: { icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200' },
        YELLOW: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200' },
        RED: { icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-100', border: 'border-rose-200' },
    }[score] || { icon: ShieldCheck, color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' };

    const Icon = config.icon;

    return (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${config.bg} ${config.color} ${config.border} text-sm font-medium`} title={reason}>
            <Icon size={16} />
            {score}
        </div>
    );
};

const Dashboard = () => {
    const { activeVisitors, fetchActiveVisitors, checkoutVisitor, loading } = useVisitorStore();

    useEffect(() => {
        fetchActiveVisitors();
        
        // Simple polling for real-time updates every 10 seconds
        const interval = setInterval(() => {
            fetchActiveVisitors();
        }, 10000);
        
        return () => clearInterval(interval);
    }, [fetchActiveVisitors]);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-slate-500 text-sm font-medium">Total Active Visitors</h3>
                    <p className="text-3xl font-bold text-slate-800 mt-2">{activeVisitors.length}</p>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-6 shadow-sm border border-emerald-100">
                    <h3 className="text-emerald-700 text-sm font-medium">Green Risks</h3>
                    <p className="text-3xl font-bold text-emerald-800 mt-2">
                        {activeVisitors.filter(v => v.riskScore === 'GREEN').length}
                    </p>
                </div>
                <div className="bg-amber-50 rounded-2xl p-6 shadow-sm border border-amber-100">
                    <h3 className="text-amber-700 text-sm font-medium">Yellow Risks</h3>
                    <p className="text-3xl font-bold text-amber-800 mt-2">
                        {activeVisitors.filter(v => v.riskScore === 'YELLOW').length}
                    </p>
                </div>
                <div className="bg-rose-50 rounded-2xl p-6 shadow-sm border border-rose-100">
                    <h3 className="text-rose-700 text-sm font-medium">Red Risks</h3>
                    <p className="text-3xl font-bold text-rose-800 mt-2">
                        {activeVisitors.filter(v => v.riskScore === 'RED').length}
                    </p>
                </div>
            </div>

            {/* Active Visitors Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-semibold text-slate-800 text-lg">Real-Time Active Visitors</h3>
                    {loading && <span className="text-sm text-slate-500 animate-pulse">Syncing...</span>}
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                                <th className="px-6 py-4 font-medium">Visitor</th>
                                <th className="px-6 py-4 font-medium">Purpose</th>
                                <th className="px-6 py-4 font-medium">Check In</th>
                                <th className="px-6 py-4 font-medium">Risk Score</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {activeVisitors.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                        No active visitors at the moment.
                                    </td>
                                </tr>
                            ) : (
                                activeVisitors.map((visitor) => (
                                    <tr key={visitor.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <img 
                                                    src={visitor.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${visitor.name}`} 
                                                    alt={visitor.name}
                                                    className="w-10 h-10 rounded-full bg-slate-200 object-cover"
                                                />
                                                <div>
                                                    <div className="font-medium text-slate-900">{visitor.name}</div>
                                                    <div className="text-xs text-slate-500">NIK: {visitor.nik}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{visitor.purpose}</td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {format(new Date(visitor.checkInTime), 'HH:mm - MMM dd')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <RiskBadge score={visitor.riskScore} reason={visitor.riskReason} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => checkoutVisitor(visitor.id)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium shadow-sm"
                                            >
                                                <LogOut size={16} />
                                                Check Out
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
