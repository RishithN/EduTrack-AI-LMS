import { useState, useMemo } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import TimetableGrid from '../../components/Timetable/TimetableGrid';
import { getTeacherSchedule } from '../../data/mockTimetable';
import { Calendar } from 'lucide-react';

const TeacherTimetable = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const schedule = useMemo(() => getTeacherSchedule(currentDate), [currentDate]);

    return (
        <DashboardLayout role="teacher">
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Calendar className="text-purple-500" />
                        Weekly Schedule
                    </h1>
                    <p className="text-slate-400">
                        Manage your classes and view assigned sections.
                    </p>
                </div>

                <TimetableGrid
                    schedule={schedule}
                    role="teacher"
                    currentDate={currentDate}
                    onDateChange={setCurrentDate}
                />
            </div>
        </DashboardLayout>
    );
};

export default TeacherTimetable;
