import { TrendingUp, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';

const ParentDashboard = () => {
    const navigate = useNavigate();
    // Mock Data for Child
    const child = {
        name: "Arjun Verma",
        id: "CSE-2024-001",
        dept: "Computer Science",
        cgpa: 9.2,
        attendance: 88,
        pendingAssignments: 3
    };

    return (
        <DashboardLayout role="parent">
            <div className="space-y-8">

                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome, Parent 👋</h1>
                        <p className="text-slate-400">Here is the latest academic update for <span className="text-white font-bold">{child.name}</span>.</p>
                    </div>
                    <div className="text-right">
                        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-sm text-slate-300">
                            Student ID: {child.id}
                        </div>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4 relative overflow-hidden">
                        <div className="absolute right-0 top-0 p-6 opacity-5">
                            <TrendingUp size={100} />
                        </div>
                        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                            <TrendingUp size={32} />
                        </div>
                        <div>
                            <div className="text-slate-400 text-sm font-medium">Current CGPA</div>
                            <div className="text-3xl font-bold text-white">{child.cgpa}</div>
                            <div className="text-xs text-emerald-400 mt-1">+0.2 from last semester</div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4 relative overflow-hidden">
                        <div className="absolute right-0 top-0 p-6 opacity-5">
                            <CheckCircle size={100} />
                        </div>
                        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                            <CheckCircle size={32} />
                        </div>
                        <div>
                            <div className="text-slate-400 text-sm font-medium">Attendance</div>
                            <div className="text-3xl font-bold text-white">{child.attendance}%</div>
                            <div className="text-xs text-slate-500 mt-1">Total Classes: 145</div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4 relative overflow-hidden">
                        <div className="absolute right-0 top-0 p-6 opacity-5">
                            <AlertTriangle size={100} />
                        </div>
                        <div className="p-3 bg-yellow-500/10 text-yellow-400 rounded-xl">
                            <FileText size={32} />
                        </div>
                        <div>
                            <div className="text-slate-400 text-sm font-medium">Assignments Due</div>
                            <div className="text-3xl font-bold text-white">{child.pendingAssignments}</div>
                            <div className="text-xs text-yellow-400 mt-1">Upcoming Deadline: Tomorrow</div>
                        </div>
                    </div>
                </div>

                {/* Detailed Views Preview */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <h3 className="font-bold text-lg text-white mb-4">Recent Activities</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-800 last:border-0 last:pb-0">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shrink-0" />
                                    <div>
                                        <div className="text-slate-300 text-sm">Submitted "Data Structures Lab {i}"</div>
                                        <div className="text-xs text-slate-500">2 hours ago</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                        <div className="p-4 bg-slate-800/50 rounded-full mb-4">
                            <FileText className="text-slate-400" size={32} />
                        </div>
                        <h3 className="font-bold text-lg text-white mb-2">View Full Report Card</h3>
                        <p className="text-sm text-slate-400 mb-6">Download detailed marksheet for Semester 3.</p>
                        <button
                            onClick={() => navigate('/parent/performance')}
                            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors border border-slate-700"
                        >
                            Open Report
                        </button>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default ParentDashboard;
