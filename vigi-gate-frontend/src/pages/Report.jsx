import { useState } from 'react';
import { visitorApi } from '../services/api';
import { format } from 'date-fns';
import { FileBarChart, ShieldCheck, AlertTriangle, ShieldAlert, Users, LogIn, LogOut, Building, Brain, Loader2 } from 'lucide-react';

const Report = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await visitorApi.getDailySummary();
            setReport(response.data);
        } catch (err) {
            setError('Gagal men-generate laporan. Pastikan backend berjalan.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">AI Summary Report</h1>
                    <p className="text-slate-500 mt-1">Generate ringkasan kunjungan dan analisis keamanan hari ini.</p>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-medium shadow-lg shadow-purple-500/20 disabled:opacity-70"
                >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <FileBarChart size={20} />}
                    {loading ? 'Generating...' : 'Generate Summary Report'}
                </button>
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl">
                    {error}
                </div>
            )}

            {report && (
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <StatCard icon={Users} label="Total Visitor" value={report.totalVisitors} color="slate" />
                        <StatCard icon={Users} label="Unique Visitor" value={report.uniqueVisitors} color="indigo" />
                        <StatCard icon={LogIn} label="Total Check-In" value={report.totalVisitors} color="blue" />
                        <StatCard icon={LogOut} label="Total Check-Out" value={report.checkedOut} color="cyan" />
                        <StatCard icon={Building} label="Masih di Gedung" value={report.insideBuilding} color="violet" />
                    </div>

                    {/* Risk Distribution */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-semibold text-slate-800 text-lg mb-4">Distribusi Risk Level</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <RiskCard level="GREEN" count={report.riskDistribution?.GREEN ?? 0} total={report.totalVisitors} />
                            <RiskCard level="YELLOW" count={report.riskDistribution?.YELLOW ?? 0} total={report.totalVisitors} />
                            <RiskCard level="RED" count={report.riskDistribution?.RED ?? 0} total={report.totalVisitors} />
                        </div>
                    </div>

                    {/* High Risk Visitors Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 bg-rose-50/50">
                            <h3 className="font-semibold text-rose-800 text-lg flex items-center gap-2">
                                <ShieldAlert size={20} />
                                Daftar Visitor Berisiko Tinggi (RED)
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                                        <th className="px-6 py-3 font-medium">Full Name</th>
                                        <th className="px-6 py-3 font-medium">NIK</th>
                                        <th className="px-6 py-3 font-medium">Check In Time</th>
                                        <th className="px-6 py-3 font-medium">Risk Score</th>
                                        <th className="px-6 py-3 font-medium">Risk Level</th>
                                        <th className="px-6 py-3 font-medium">Reason</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {(!report.highRiskVisitors || report.highRiskVisitors.length === 0) ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                                                Tidak ada pengunjung berisiko tinggi hari ini. ✅
                                            </td>
                                        </tr>
                                    ) : (
                                        report.highRiskVisitors.map((v, i) => (
                                            <tr key={i} className="hover:bg-rose-50/30 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900">{v.fullName}</td>
                                                <td className="px-6 py-4 text-slate-600 font-mono text-sm">{v.nik}</td>
                                                <td className="px-6 py-4 text-slate-600">
                                                    {format(new Date(v.checkInTime), 'HH:mm - MMM dd')}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-rose-700">{v.riskScore}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 border border-rose-200 text-sm font-medium">
                                                        {v.riskLevel}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 text-sm">{v.riskReason}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* AI Insight */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-lg p-6 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                <Brain size={22} className="text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">AI Generated Insight</h3>
                                <p className="text-slate-400 text-sm">Security Analyst Report</p>
                            </div>
                        </div>
                        <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                            {report.aiInsight}
                        </p>
                    </div>
                </div>
            )}

            {!report && !loading && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 text-center">
                    <FileBarChart size={48} className="text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600">Belum Ada Laporan</h3>
                    <p className="text-slate-400 mt-2">Klik tombol "Generate Summary Report" untuk menghasilkan laporan hari ini.</p>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color }) => {
    const colors = {
        slate: 'bg-white border-slate-200 text-slate-800',
        indigo: 'bg-indigo-50 border-indigo-100 text-indigo-800',
        blue: 'bg-blue-50 border-blue-100 text-blue-800',
        cyan: 'bg-cyan-50 border-cyan-100 text-cyan-800',
        violet: 'bg-violet-50 border-violet-100 text-violet-800',
    };
    return (
        <div className={`rounded-2xl p-5 shadow-sm border ${colors[color]}`}>
            <Icon size={20} className="mb-2 opacity-60" />
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm opacity-70 mt-1">{label}</p>
        </div>
    );
};

const RiskCard = ({ level, count, total }) => {
    const config = {
        GREEN: { icon: ShieldCheck, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', bar: 'bg-emerald-500' },
        YELLOW: { icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', bar: 'bg-amber-500' },
        RED: { icon: ShieldAlert, bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800', bar: 'bg-rose-500' },
    }[level];
    const Icon = config.icon;
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;

    return (
        <div className={`rounded-xl p-5 border ${config.bg} ${config.border}`}>
            <div className="flex items-center justify-between mb-3">
                <div className={`flex items-center gap-2 font-semibold ${config.text}`}>
                    <Icon size={18} /> {level}
                </div>
                <span className={`text-2xl font-bold ${config.text}`}>{count}</span>
            </div>
            <div className="w-full bg-white/60 rounded-full h-2 overflow-hidden">
                <div className={`h-full rounded-full ${config.bar} transition-all duration-700`} style={{ width: `${pct}%` }}></div>
            </div>
            <p className={`text-xs mt-2 ${config.text} opacity-70`}>{pct}% dari total</p>
        </div>
    );
};

export default Report;
