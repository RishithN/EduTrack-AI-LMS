import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    FileText,
    User,
    LogOut,
    Menu,
    X,
    GraduationCap,
    Award,
    Lightbulb,
    HelpCircle,
    Trophy,
    BrainCircuit,
    BarChart3,

    MessageSquare,
    Calendar,
    Clock,

} from 'lucide-react';

interface SidebarItem {
    label: string;
    icon: any;
    path: string;
}

const studentItems: SidebarItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
    { label: 'Timetable', icon: Clock, path: '/student/timetable' },
    { label: 'My Courses', icon: BookOpen, path: '/student/courses' },
    { label: 'Course Materials', icon: FileText, path: '/student/course-materials' },
    { label: 'Calendar', icon: Calendar, path: '/student/calendar' },
    { label: 'Assignments', icon: FileText, path: '/student/assignments' },
    { label: 'Attendance', icon: User, path: '/student/attendance' },
    { label: 'Quizzes', icon: HelpCircle, path: '/student/quiz' },
    { label: 'Report Card', icon: Award, path: '/student/report-card' },
    { label: 'Career AI', icon: GraduationCap, path: '/student/career' },
    { label: 'Innovation Hub', icon: Lightbulb, path: '/student/innovation' },
    { label: 'Leaderboard', icon: Trophy, path: '/student/gamification' },
    { label: 'Profile', icon: User, path: '/student/profile' },
];

const teacherItems: SidebarItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/teacher/dashboard' },
    { label: 'Timetable', icon: Clock, path: '/teacher/timetable' },
    { label: 'Assignments', icon: FileText, path: '/teacher/assignments' },
    { label: 'Attendance', icon: User, path: '/teacher/attendance' },
    { label: 'Quiz Gen AI', icon: BrainCircuit, path: '/teacher/quiz-gen' },
    { label: 'Idea Review', icon: Lightbulb, path: '/teacher/idea-review' },
    { label: 'Analytics', icon: BarChart3, path: '/teacher/analytics' },
    { label: 'Communication', icon: MessageSquare, path: '/teacher/communication' },
    { label: 'Calendar', icon: Calendar, path: '/teacher/calendar' },
];

const parentItems: SidebarItem[] = [
    { label: 'Child Overview', icon: LayoutDashboard, path: '/parent/dashboard' },
    { label: 'Timetable', icon: Clock, path: '/parent/timetable' },
    { label: 'Performance', icon: Award, path: '/parent/performance' },
    { label: 'Assignments', icon: FileText, path: '/parent/assignments' },
    { label: 'Attendance', icon: User, path: '/parent/attendance' },
    { label: 'Communication', icon: MessageSquare, path: '/parent/communication' },
    { label: 'Calendar', icon: Calendar, path: '/parent/calendar' },
];

const DashboardLayout = ({ children, role = 'student' }: { children: React.ReactNode, role?: 'student' | 'teacher' | 'parent' }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Always use dark mode
    useEffect(() => {
        document.documentElement.classList.add('dark');
    }, []);

    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navItems = role === 'student' ? studentItems : role === 'teacher' ? teacherItems : parentItems;

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? 'w-64' : 'w-20'
                    } bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col z-20 shadow-sm dark:shadow-none`}
            >
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
                    {sidebarOpen && (
                        <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent truncate">
                            EduTrack
                        </span>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-400"
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-2 px-2">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${isActive
                                            ? 'bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-600/20 dark:border-blue-600/30'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                            }`}
                                    >
                                        <item.icon size={22} className={isActive ? 'text-blue-600 dark:text-blue-400' : ''} />
                                        {sidebarOpen && <span className="font-medium">{item.label}</span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors ${!sidebarOpen && 'justify-center'
                            }`}
                    >
                        <LogOut size={22} />
                        {sidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                <header className="h-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 flex items-center justify-between px-6 transition-colors duration-300">
                    <h2 className="font-semibold text-lg text-slate-800 dark:text-slate-200">
                        {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                    </h2>


                </header>

                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 max-w-7xl mx-auto space-y-6"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};

export default DashboardLayout;
