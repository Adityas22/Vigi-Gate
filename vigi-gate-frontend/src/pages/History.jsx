import { useEffect, useState } from 'react';
import { visitorApi } from '../services/api';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { ShieldCheck, ShieldAlert, AlertTriangle, Search, CalendarDays, X } from 'lucide-react';

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

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await visitorApi.getHistory();
            const sorted = response.data.sort((a, b) => new Date(b.checkInTime) - new Date(a.checkInTime));
            setHistory(sorted);
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setDateFrom('');
        setDateTo('');
    };

    const filteredHistory = history.filter(v => {
        // Search filter
        const matchesSearch = 
            v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            v.nik.includes(searchTerm);

        // Date filter
        let matchesDate = true;
        if (dateFrom || dateTo) {
            const checkIn = new Date(v.checkInTime);
            if (dateFrom && dateTo) {
                matchesDate = isWithinInterval(checkIn, {
                    start: startOfDay(parseISO(dateFrom)),
                    end: endOfDay(parseISO(dateTo))
                });
            } else if (dateFrom) {
                matchesDate = checkIn >= startOfDay(parseISO(dateFrom));
            } else if (dateTo) {
                matchesDate = checkIn <= endOfDay(parseISO(dateTo));
            }
        }

        return matchesSearch && matchesDate;
    });

    const hasFilters = searchTerm || dateFrom || dateTo;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Visitor History</h1>
                    <p className="text-slate-500 mt-1">Complete log of all past and present visitor check-ins.</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    {/* Search */}
                    <div className="flex-1 w-full">
                        <label className="text-xs font-medium text-slate-500 mb-1 block">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search name or NIK..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Date From */}
                    <div className="w-full md:w-48">
                        <label className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                            <CalendarDays size={14} /> From
                        </label>
                        <input 
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                        />
                    </div>

                    {/* Date To */}
                    <div className="w-full md:w-48">
                        <label className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                            <CalendarDays size={14} /> To
                        </label>
                        <input 
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                        />
                    </div>

                    {/* Clear Button */}
                    {hasFilters && (
                        <button 
                            onClick={clearFilters}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors whitespace-nowrap"
                        >
                            <X size={16} />
                            Clear
                        </button>
                    )}
                </div>

                {hasFilters && (
                    <p className="text-xs text-slate-500 mt-3">
                        Menampilkan <span className="font-semibold text-slate-700">{filteredHistory.length}</span> dari {history.length} data
                    </p>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                                <th className="px-6 py-4 font-medium">Visitor</th>
                                <th className="px-6 py-4 font-medium">Purpose</th>
                                <th className="px-6 py-4 font-medium">Check In</th>
                                <th className="px-6 py-4 font-medium">Check Out</th>
                                <th className="px-6 py-4 font-medium">Risk Score</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400">Loading history...</td>
                                </tr>
                            ) : filteredHistory.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                                        {hasFilters ? 'Tidak ada data yang cocok dengan filter.' : 'No visitors found.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredHistory.map((visitor) => (
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
                                            {format(new Date(visitor.checkInTime), 'MMM dd, HH:mm')}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {visitor.checkOutTime ? format(new Date(visitor.checkOutTime), 'MMM dd, HH:mm') : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <RiskBadge score={visitor.riskScore} reason={visitor.riskReason} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                                                visitor.status === 'ACTIVE' 
                                                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                                : 'bg-slate-100 text-slate-600 border-slate-200'
                                            }`}>
                                                {visitor.status}
                                            </span>
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

export default History;
