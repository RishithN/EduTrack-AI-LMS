import { Users, FileText, CheckCircle, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useUser } from '../../hooks/useUser';

const TeacherDashboard = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    return (
        <DashboardLayout role="teacher">
            <div className="space-y-8">

                {/* Welcome */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Welcome Professor {user?.name.split(' ')[0] || ''} 👨🏫
                        </h1>
                        <p className="text-slate-400">
                            Track student performance, manage assignments, and generate quizzes.
                        </p>
                    </div>
                    <div className="text-right hidden md:block">
                        <div className="text-2xl font-bold text-slate-200">CSE Dept</div>
                        <div className="text-sm text-slate-500">Fall Semester 2026</div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-slate-500 text-sm mb-2 font-medium">Total Students</div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                                <Users size={24} />
                            </div>
                            <div className="text-2xl font-bold text-white">128</div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-slate-500 text-sm mb-2 font-medium">Assignments Pending</div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-500/10 text-yellow-400 rounded-lg">
                                <FileText size={24} />
                            </div>
                            <div className="text-2xl font-bold text-white">45</div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-slate-500 text-sm mb-2 font-medium">Avg Attendance</div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                                <CheckCircle size={24} />
                            </div>
                            <div className="text-2xl font-bold text-white">88%</div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-slate-500 text-sm mb-2 font-medium">At Risk Students</div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/10 text-red-400 rounded-lg">
                                <AlertTriangle size={24} />
                            </div>
                            <div className="text-2xl font-bold text-white">12</div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity / Quick Actions */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-white">Recent Submissions</h3>
                            <button
                                onClick={() => navigate('/teacher/assignments')}
                                className="text-sm text-blue-400 flex items-center gap-1 hover:underline"
                            >
                                View All <ArrowUpRight size={14} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white text-sm">
                                            S{i}
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-200">Data Structures Assignment {i}</div>
                                            <div className="text-xs text-slate-500">Submitted by Student ID: CSE-0{i}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate('/teacher/assignments')}
                                        className="px-3 py-1.5 bg-slate-900 text-slate-300 text-xs rounded border border-slate-700 hover:bg-slate-800"
                                    >
                                        Grade Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-linear-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-6">
                        <h3 className="font-bold text-lg text-white mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/teacher/assignments')}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                            >
                                Create Assignment
                            </button>
                            <button
                                onClick={() => navigate('/teacher/quiz-gen')}
                                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors"
                            >
                                Generate AI Quiz
                            </button>
                            <button
                                onClick={() => navigate('/teacher/attendance')}
                                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Mark Attendance
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default TeacherDashboard;
