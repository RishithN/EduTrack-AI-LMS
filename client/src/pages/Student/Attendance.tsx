import { AlertTriangle, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const ATTENDANCE_DATA = [
    { code: 'CS201', name: 'Data Structures', total: 40, attended: 35, percentage: 87.5 },
    { code: 'CS202', name: 'OOPs', total: 38, attended: 30, percentage: 78.9 },
    { code: 'CS203', name: 'DBMS', total: 42, attended: 28, percentage: 66.6 }, // Low
    { code: 'CS204', name: 'Networks', total: 35, attended: 32, percentage: 91.4 },
    { code: 'CS205', name: 'Web Dev', total: 36, attended: 33, percentage: 91.7 },
    { code: 'CS206', name: 'Cyber Security', total: 30, attended: 29, percentage: 96.7 },
];

const Attendance = () => {
    return (
        <DashboardLayout role="student">
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Attendance Tracker</h1>
                    <p className="text-slate-400">Monitor your class presence. <span className="text-red-400">Red indicates &lt; 75%</span>.</p>
                </div>

                {/* Chart (Visual Bar representation with axes) */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
                    <h3 className="text-lg font-semibold mb-6">Attendance Overview</h3>

                    {/* Chart Container with Axes */}
                    <div className="relative pl-12 pb-12">
                        {/* Y-Axis Labels */}
                        <div className="absolute left-0 top-0 bottom-12 flex flex-col justify-between text-xs text-slate-500 font-mono">
                            <span>100%</span>
                            <span>75%</span>
                            <span>50%</span>
                            <span>25%</span>
                            <span>0%</span>
                        </div>

                        {/* Y-Axis Line */}
                        <div className="absolute left-10 top-0 bottom-12 w-px bg-slate-700"></div>

                        {/* Chart Area */}
                        <div className="flex items-end justify-around h-64 border-l-2 border-b-2 border-slate-700 relative">
                            {ATTENDANCE_DATA.map((subject) => (
                                <div key={subject.code} className="flex flex-col items-center gap-3 group flex-1 max-w-[100px]">
                                    {/* Bar Container */}
                                    <div className="relative w-16 bg-slate-800/50 rounded-t-lg overflow-visible flex items-end" style={{ height: '240px' }}>
                                        {/* Actual Bar */}
                                        <div
                                            className={`w-full transition-all duration-1000 rounded-t-lg relative ${subject.percentage < 75 ? 'bg-red-500' : 'bg-emerald-500'
                                                }`}
                                            style={{ height: `${subject.percentage}%` }}
                                        >
                                            {/* Percentage Text on Bar */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-xs font-bold text-black">
                                                    {subject.percentage.toFixed(0)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* X-Axis Label (Subject Name) */}
                                    <span className="text-xs font-medium text-slate-400 text-center whitespace-nowrap">
                                        {subject.name}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* X-Axis Line (already part of border-b) */}
                    </div>
                </div>

                {/* Detailed List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ATTENDANCE_DATA.map((subject) => (
                        <div
                            key={subject.code}
                            className={`p-6 rounded-xl border ${subject.percentage < 75
                                ? 'bg-red-500/5 border-red-500/20'
                                : 'bg-slate-900 border-slate-800'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-lg text-slate-200">{subject.name}</h4>
                                    <span className="text-xs font-mono text-slate-500">{subject.code}</span>
                                </div>
                                {subject.percentage < 75 ? (
                                    <div className="flex items-center gap-1 text-red-400 text-sm font-bold bg-red-500/10 px-2 py-1 rounded">
                                        <AlertTriangle size={16} /> Low Attendance
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold bg-emerald-500/10 px-2 py-1 rounded">
                                        <CheckCircle size={16} /> Good
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between text-sm text-slate-400 mb-2">
                                <span>Total Classes: {subject.total}</span>
                                <span>Attended: {subject.attended}</span>
                            </div>

                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${subject.percentage < 75 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                    style={{ width: `${subject.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </DashboardLayout>
    );
};

export default Attendance;
