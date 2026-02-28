import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const ACADEMIC_EVENTS = [
    { title: 'Semester Begins', date: '2024-01-20', type: 'academic', status: 'Completed' },
    { title: 'Mid-Sem Exams', date: '2024-03-15', type: 'exam', status: 'Upcoming' },
    { title: 'Lab Internal Exams', date: '2024-04-20', type: 'exam', status: 'Upcoming' },
    { title: 'Last Working Day', date: '2024-05-10', type: 'academic', status: 'Upcoming' },
    { title: 'End Semester Exams', date: '2024-05-15', type: 'exam', status: 'Upcoming' },
];

const StudentCalendar = () => {
    return (
        <DashboardLayout role="student">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Academic Calendar</h1>
                    <p className="text-slate-400">Important dates and schedules for the semester.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Events List */}
                    <div className="lg:col-span-2 space-y-4">
                        {ACADEMIC_EVENTS.map((event, idx) => (
                            <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center gap-6 group hover:border-purple-500/30 transition-all">
                                <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center shrink-0 border ${event.status === 'Completed'
                                    ? 'bg-slate-800 border-slate-700 text-slate-400'
                                    : 'bg-purple-900/20 border-purple-500/30 text-purple-400'
                                    }`}>
                                    <span className="text-xs font-bold uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                    <span className="text-2xl font-bold">{new Date(event.date).getDate()}</span>
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className={`text-lg font-bold ${event.status === 'Completed' ? 'text-slate-500 line-through' : 'text-white'}`}>
                                                {event.title}
                                            </h3>
                                            <span className={`text-xs px-2 py-0.5 rounded-full border ${event.type === 'exam'
                                                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                }`}>
                                                {event.type === 'exam' ? 'Examination' : 'Academic Event'}
                                            </span>
                                        </div>
                                        <div className={`text-sm font-medium ${event.status === 'Upcoming' ? 'text-emerald-400' : 'text-slate-500'
                                            }`}>
                                            {event.status}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Card */}
                    <div className="bg-gradient-to-br from-purple-900/20 to-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
                        <h3 className="font-bold text-white mb-4">Semester Summary</h3>
                        <div className="space-y-6">
                            <div>
                                <div className="text-slate-400 text-sm mb-1">Current Semester</div>
                                <div className="text-2xl font-bold text-white">Fall 2026</div>
                            </div>
                            <div className="flex gap-4">
                                <div>
                                    <div className="text-slate-400 text-sm mb-1">Working Days</div>
                                    <div className="text-xl font-bold text-white">90</div>
                                </div>
                                <div>
                                    <div className="text-slate-400 text-sm mb-1">Holidays</div>
                                    <div className="text-xl font-bold text-white">12</div>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-slate-800/50">
                                <div className="flex items-center gap-3 text-sm text-slate-300 mb-2">
                                    <Clock size={16} className="text-purple-400" /> College Timings
                                </div>
                                <div className="pl-7 font-mono text-slate-400 text-sm">09:00 AM - 04:00 PM</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentCalendar;
