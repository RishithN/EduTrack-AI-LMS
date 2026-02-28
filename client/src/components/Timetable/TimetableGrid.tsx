import { ChevronLeft, ChevronRight, User, MapPin, Clock } from 'lucide-react';
import type { WeekSchedule, UserRole } from '../../types/timetable';

interface TimetableGridProps {
    schedule: WeekSchedule;
    role: UserRole;
    currentDate: Date;
    onDateChange: (date: Date) => void;
}

const TIME_SLOTS_HOURS = [9, 10, 11, 12, 13, 14, 15]; // Start hours

const TIME_SLOTS_LABELS = [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
];

const TimetableGrid = ({ schedule, role, currentDate, onDateChange }: TimetableGridProps) => {
    if (!schedule || !schedule.weekStartDate) {
        return <div className="text-white p-4">Loading schedule...</div>;
    }

    // Calculate start/end of the current week for display
    const weekStart = new Date(schedule.weekStartDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 5); // Friday

    const handlePrevWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 7);
        onDateChange(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 7);
        onDateChange(newDate);
    };

    const getStatusColor = (status: string | undefined, type: string) => {
        if (type === 'break') return 'bg-slate-800/50 border-slate-700/50';

        // Teacher doesn't see attendance colors
        if (role === 'teacher') {
            if (type === 'lab') return 'bg-blue-900/20 border-blue-500/30 text-blue-100';
            return 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600';
        }

        if (status === 'attended') return 'bg-emerald-900/60 border-emerald-500 shadow-[inset_0_0_15px_rgba(16,185,129,0.2)] text-white';
        if (status === 'absent') return 'bg-red-900/60 border-red-500 shadow-[inset_0_0_15px_rgba(239,68,68,0.2)] text-white';

        // Default / Upcoming
        if (type === 'lab') return 'bg-blue-900/30 border-blue-500/50 text-blue-100';
        return 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600';
    };

    if (!schedule.days || schedule.days.length === 0) {
        return <div className="text-red-500 p-4 font-bold">Error: No days in schedule!</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header & Navigation */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-4">
                    <button onClick={handlePrevWeek} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="text-center">
                        <h2 className="text-lg font-bold text-white">
                            {weekStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h2>
                        <p className="text-sm text-slate-400">
                            Week of {weekStart.getDate()} - {weekEnd.getDate()}
                        </p>
                    </div>
                    <button onClick={handleNextWeek} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>

                {role !== 'teacher' && (
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span> <span className="text-slate-300 font-medium">Attended</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span> <span className="text-slate-300 font-medium">Absent</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                            </div>
                            <span className="text-slate-300">Laptop Required</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Timetable Grid */}
            <div className="overflow-x-auto pb-4">
                <div className="min-w-[1000px] border border-slate-800 rounded-xl bg-slate-950">
                    {/* Header Row */}
                    <div className="grid grid-cols-8 border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10">
                        <div className="p-4 text-slate-400 font-medium text-sm flex items-center justify-center border-r border-slate-800">
                            Day / Time
                        </div>
                        {TIME_SLOTS_LABELS.map((slot, i) => (
                            <div key={i} className="p-4 text-slate-400 font-medium text-sm text-center border-r border-slate-800 last:border-r-0">
                                {slot}
                            </div>
                        ))}
                    </div>

                    {/* Days Rows */}
                    <div className="divide-y divide-slate-800">
                        {schedule.days.map((day) => {
                            // Highlight "Today" only if the schedule being viewed is for the current week
                            const isToday = new Date().toDateString() === new Date(day.date || '').toDateString();

                            // Map slots to columns
                            const renderedSlots: (React.ReactNode | null)[] = [];

                            for (let i = 0; i < 7; i++) {
                                const hour = TIME_SLOTS_HOURS[i];
                                const slot = day.slots.find(s => parseInt(s.startTime.split(':')[0]) === hour);

                                if (slot) {
                                    const isLabSession = slot.type === 'lab';
                                    const colSpanClass = isLabSession ? 'col-span-2' : 'col-span-1';

                                    renderedSlots.push(
                                        <div
                                            key={`${day.day}-${hour}`}
                                            className={`p-2 border-r border-slate-800 last:border-r-0 ${colSpanClass} h-[140px] transition-all`}
                                        >
                                            <div className={`h-full w-full rounded-lg border p-3 flex flex-col relative overflow-hidden transition-all hover:scale-[1.02] ${getStatusColor(slot.attendanceStatus, slot.type)}`}>

                                                {slot.isLaptopRequired && role !== 'teacher' && (
                                                    <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]" title="Laptop Required" />
                                                )}

                                                {slot.type === 'break' ? (
                                                    <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50">
                                                        <Clock size={16} className="mb-1" />
                                                        <span className="font-mono text-xs tracking-widest uppercase">Lunch</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <div className="text-xs font-mono text-slate-400/80 flex items-center gap-1">
                                                                    {slot.subjectCode}
                                                                    {isLabSession && <span className="bg-blue-500/20 text-blue-300 px-1 rounded text-[9px] uppercase tracking-wider font-bold">LAB</span>}
                                                                </div>
                                                            </div>
                                                            <div className="font-bold text-sm leading-tight text-inherit mb-2 line-clamp-2" title={slot.subjectName}>
                                                                {slot.subjectName}
                                                            </div>
                                                        </div>

                                                        <div className="border-t border-white/10 pt-2 space-y-1">
                                                            <div className="flex items-center gap-1.5 text-xs opacity-80 truncate">
                                                                <User size={12} className="shrink-0" />
                                                                <span className="truncate">
                                                                    {role === 'teacher'
                                                                        ? `Section ${slot.section || 'A'}`
                                                                        : slot.facultyName
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-xs opacity-70">
                                                                <MapPin size={12} className="shrink-0" />
                                                                <span>{slot.roomNumber}</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );

                                    if (isLabSession) {
                                        i++; // Skip next hour for 2-hour lab
                                    }
                                } else {
                                    // Render Empty Cell
                                    renderedSlots.push(
                                        <div
                                            key={`${day.day}-${hour}`}
                                            className="p-2 border-r border-slate-800 last:border-r-0 h-[140px] transition-all"
                                        >
                                            <div className="h-full w-full rounded-lg border border-slate-800/30 bg-slate-900/20 flex items-center justify-center opacity-30">
                                                {/* Optional: Add a subtle pattern or keep it clean */}
                                            </div>
                                        </div>
                                    );
                                }
                            }

                            return (
                                <div key={day.day} className={`grid grid-cols-8 group ${isToday ? 'bg-blue-500/5' : ''}`}>
                                    {/* Day Label */}
                                    <div className={`p-4 font-bold text-white flex items-center justify-center border-r border-slate-800 ${isToday ? 'text-blue-400' : ''}`}>
                                        {day.day}
                                        <div className="text-xs text-slate-500 font-normal mt-1">
                                            {new Date(day.date || '').getDate()}
                                        </div>
                                    </div>

                                    {/* Rendered Slots */}
                                    {renderedSlots}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimetableGrid;

