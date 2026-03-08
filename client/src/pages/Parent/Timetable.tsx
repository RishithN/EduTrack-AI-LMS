import { useState, useMemo } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import TimetableGrid from '../../components/Timetable/TimetableGrid';
import { getStudentSchedule } from '../../data/mockTimetable';
import { Calendar } from 'lucide-react';

const ParentTimetable = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const schedule = useMemo(() => getStudentSchedule(currentDate), [currentDate]);

    return (
        <DashboardLayout role="parent">
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Calendar className="text-emerald-500" />
                        Student Timetable
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        View your child's schedule and attendance.
                    </p>
                </div>

                <TimetableGrid
                    schedule={schedule}
                    role="parent"
                    currentDate={currentDate}
                    onDateChange={setCurrentDate}
                />
            </div>
        </DashboardLayout>
    );
};

export default ParentTimetable;
