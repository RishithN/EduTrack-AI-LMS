import { useState, useMemo } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import TimetableGrid from '../../components/Timetable/TimetableGrid';
import { getStudentSchedule } from '../../data/mockTimetable';
import { Calendar } from 'lucide-react';

const Timetable = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const schedule = useMemo(() => getStudentSchedule(currentDate), [currentDate]);

    return (
        <DashboardLayout role="student">
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Calendar className="text-blue-500" />
                        Weekly Timetable
                    </h1>
                    <p className="text-slate-400">
                        View your class schedule, lab sessions, and attendance status.
                    </p>
                </div>

                <TimetableGrid
                    schedule={schedule}
                    role="student"
                    currentDate={currentDate}
                    onDateChange={setCurrentDate}
                />
            </div>
        </DashboardLayout>
    );
};

export default Timetable;
