import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import api from '../api/axios';

const Register = () => {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState<'student' | 'teacher' | 'parent'>('student');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        studentId: '',
        semester: '1',
        section: 'A',
    });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                ...formData,
                role,
                department: 'CSE', // Enforced
                semester: Number(formData.semester),
            };

            const res = await api.post('/auth/register', payload);

            // Save token
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            // Redirect based on role
            if (res.data.user.role === 'student') navigate('/student/dashboard');
            else if (res.data.user.role === 'teacher') navigate('/teacher/dashboard');
            else if (res.data.user.role === 'parent') navigate('/parent/dashboard');
            else navigate('/');

        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Create Account
                        </h1>
                        <p className="text-slate-400 mt-2">Join EduTrack: The CSE Exclusive LMS</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Role Selection Step */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <label className="text-slate-300 font-medium block">Select your role:</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['student', 'teacher', 'parent'].map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setRole(r as any)}
                                        className={`p-4 rounded-xl border capitalize text-sm font-medium transition-all ${role === r
                                            ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                                            }`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                            >
                                Continue <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    {/* Details Form Step */}
                    {step === 2 && (
                        <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                                    <input
                                        required
                                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                                    <input
                                        required
                                        type="email"
                                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                                    <input
                                        required
                                        type="password"
                                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {role === 'student' && (
                                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800 mt-4">
                                    <div className="col-span-2 text-xs text-blue-400 font-semibold uppercase tracking-wider">
                                        Student Details (CSE Only)
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-400">Student ID</label>
                                        <input
                                            required
                                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={formData.studentId}
                                            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                            placeholder="CSE-2024-001"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-400">Semester</label>
                                        <select
                                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={formData.semester}
                                            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                                        </select>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-6 text-center text-sm text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
