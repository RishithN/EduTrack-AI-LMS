import DashboardLayout from '../../components/DashboardLayout';
import { getOverallAttendance } from '../../data/mockTimetable';

const ParentAttendance = () => {
    const ATTENDANCE_DATA = getOverallAttendance();
    return (
        <DashboardLayout role="parent">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Attendance Record</h1>
                    <p className="text-slate-600 dark:text-slate-400">Track Arjun's daily class attendance.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ATTENDANCE_DATA.map((subject) => {
                        const isLow = subject.percentage < 75;
                        return (
                            <div key={subject.code} className={`bg-white dark:bg-slate-900 border rounded-2xl p-6 relative overflow-hidden ${isLow ? 'border-red-500/50' : 'border-slate-200 dark:border-slate-800'
                                }`}>
                                {isLow && (
                                    <div className="absolute top-0 right-0 bg-red-500 text-slate-900 dark:text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                                        LOW ATTENDANCE
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate w-40" title={subject.subject}>{subject.subject}</h3>
                                        <div className="text-xs text-slate-500 font-mono">{subject.code}</div>
                                    </div>
                                    <div className={`text-xl font-bold ${isLow ? 'text-red-400' : 'text-emerald-400'}`}>
                                        {subject.percentage.toFixed(2)}%
                                    </div>
                                </div>

                                <div className="w-full bg-slate-50 dark:bg-slate-950 h-2 rounded-full overflow-hidden mb-4">
                                    <div
                                        className={`h-full rounded-full ${isLow ? 'bg-red-500' : 'bg-emerald-500'}`}
                                        style={{ width: `${subject.percentage}%` }}
                                    />
                                </div>

                                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                    <span>Total Classes: <strong className="text-slate-800 dark:text-slate-200">{subject.total}</strong></span>
                                    <span>Attended: <strong className="text-slate-800 dark:text-slate-200">{subject.attended}</strong></span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ParentAttendance;
