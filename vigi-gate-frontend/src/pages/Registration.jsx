import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { visitorApi } from '../services/api';
import { Camera, UserPlus, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

const Registration = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [riskResult, setRiskResult] = useState(null);
    const [formData, setFormData] = useState({
        nik: '',
        name: '',
        purpose: '',
        photoUrl: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Mock a photo if none provided
            const submitData = {
                ...formData,
                photoUrl: formData.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name}`
            };
            
            const response = await visitorApi.register(submitData);
            setRiskResult({
                score: response.data.riskScore,
                reason: response.data.riskReason
            });
            setSuccess(true);
        } catch (error) {
            console.error(error);
            alert('Failed to register visitor');
        } finally {
            setLoading(false);
        }
    };

    if (success && riskResult) {
        return (
            <div className="max-w-2xl mx-auto mt-10">
                <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-200 text-center animate-fade-in">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Registration Successful!</h2>
                    <p className="text-slate-500 mb-8">The visitor has been checked in and logged to the system.</p>
                    
                    <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left border border-slate-100">
                        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                            <ShieldAlert size={18} />
                            Risk Assessment Result
                        </h3>
                        <div className="flex items-center gap-4">
                            <div className={`px-4 py-2 rounded-lg font-bold text-lg ${
                                riskResult.score === 'GREEN' ? 'bg-emerald-100 text-emerald-700' :
                                riskResult.score === 'YELLOW' ? 'bg-amber-100 text-amber-700' :
                                'bg-rose-100 text-rose-700'
                            }`}>
                                {riskResult.score}
                            </div>
                            <div className="text-slate-600">
                                {riskResult.reason}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button 
                            onClick={() => {
                                setSuccess(false);
                                setFormData({nik: '', name: '', purpose: '', photoUrl: ''});
                            }}
                            className="px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                        >
                            Register Another
                        </button>
                        <button 
                            onClick={() => navigate('/')}
                            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium shadow-md shadow-purple-500/20"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">New Visitor Registration</h1>
                <p className="text-slate-500 mt-2">Fill in the visitor details for automatic risk profiling.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <FileText size={16} className="text-slate-400" />
                                NIK (National ID)
                            </label>
                            <input 
                                required
                                type="text" 
                                value={formData.nik}
                                onChange={e => setFormData({...formData, nik: e.target.value})}
                                placeholder="Enter 16-digit NIK"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <UserPlus size={16} className="text-slate-400" />
                                Full Name
                            </label>
                            <input 
                                required
                                type="text" 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                placeholder="Visitor's full name"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Purpose of Visit</label>
                        <textarea 
                            required
                            value={formData.purpose}
                            onChange={e => setFormData({...formData, purpose: e.target.value})}
                            placeholder="State the detailed reason for visiting..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Camera size={16} className="text-slate-400" />
                            Photo URL (Optional)
                        </label>
                        <input 
                            type="url" 
                            value={formData.photoUrl}
                            onChange={e => setFormData({...formData, photoUrl: e.target.value})}
                            placeholder="https://example.com/photo.jpg"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                        <p className="text-xs text-slate-500">If left blank, an avatar will be generated based on the name.</p>
                    </div>
                </div>

                <div className="px-8 py-5 bg-slate-50 border-t border-slate-200 flex justify-end">
                    <button 
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium shadow-lg shadow-slate-900/20 disabled:opacity-70 flex items-center gap-2"
                    >
                        {loading ? 'Processing...' : 'Register & Check-In'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Registration;
