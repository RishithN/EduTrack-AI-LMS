import DashboardLayout from '../../components/DashboardLayout';
import ProfileCard from '../../components/Student/ProfileCard';
import CourseList from '../../components/Student/CourseList';
import { useUser } from '../../hooks/useUser';
import { Loader2 } from 'lucide-react';
import { getOverallAttendance } from '../../data/mockTimetable';

const StudentDashboard = () => {
    const { user, profile, loading } = useUser();

    const attendanceData = getOverallAttendance();
    const totalClasses = attendanceData.reduce((acc, curr) => acc + curr.total, 0);
    const attendedClasses = attendanceData.reduce((acc, curr) => acc + curr.attended, 0);
    const overallAttendance = totalClasses > 0 ? ((attendedClasses / totalClasses) * 100).toFixed(0) : '0';

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-blue-600 dark:text-blue-500">
                <Loader2 className="animate-spin h-8 w-8" />
            </div>
        );
    }

    return (
        <DashboardLayout role="student">
            <div className="space-y-8">

                {/* Welcome Section */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">
                        Welcome back, {user?.name.split(' ')[0]} 👋
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors">
                        Here is your academic overview for this semester.
                    </p>
                </div>

                {/* Profile Card */}
                <ProfileCard
                    name={user?.name || 'Student'}
                    studentId={profile?.studentId || 'CSE-202X-XXX'}
                    department={profile?.department || 'CSE'}
                    semester={profile?.semester || 1}
                    section={profile?.section || 'A'}
                />

                {/* Quick Stats Row (Placeholder for Attendance/Grades) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm dark:shadow-none transition-colors">
                        <div className="text-slate-500 dark:text-slate-400 text-sm mb-1">Attendance</div>
                        <div className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">{overallAttendance}%</div>
                        <div className="text-xs text-slate-500 mt-1">{parseInt(overallAttendance) > 75 ? 'Excellent' : 'Needs Improvement'}</div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm dark:shadow-none transition-colors">
                        <div className="text-slate-500 dark:text-slate-400 text-sm mb-1">CGPA</div>
                        <div className="text-2xl font-bold text-blue-500 dark:text-blue-400">9.2</div>
                        <div className="text-xs text-slate-500 mt-1">Top 5% of class</div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm dark:shadow-none transition-colors">
                        <div className="text-slate-500 dark:text-slate-400 text-sm mb-1">Assignments</div>
                        <div className="text-2xl font-bold text-purple-500 dark:text-purple-400">12/15</div>
                        <div className="text-xs text-slate-500 mt-1">3 Pending</div>
                    </div>
                </div>

                {/* Courses Grid */}
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 transition-colors">
                        Current Courses
                        <span className="text-xs font-normal text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-full border border-slate-200 dark:border-slate-800">
                            Semester {profile?.semester || 1}
                        </span>
                    </h2>
                    <CourseList />
                </div>

            </div>
        </DashboardLayout>
    );
};

export default StudentDashboard;
