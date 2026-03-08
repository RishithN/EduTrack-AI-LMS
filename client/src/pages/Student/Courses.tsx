import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { Clock, Users, X, BookOpen } from 'lucide-react';

const COURSES = [
    { code: 'CS201', name: 'Data Structures & Algorithms', instructor: 'Dr. Smith', credits: 4, schedule: 'Mon, Wed 10:00 AM' },
    { code: 'CS202', name: 'Object Oriented Programming', instructor: 'Prof. Johnson', credits: 3, schedule: 'Tue, Thu 2:00 PM' },
    { code: 'CS203', name: 'Database Management Systems', instructor: 'Dr. Williams', credits: 4, schedule: 'Mon, Wed 2:00 PM' },
    { code: 'CS204', name: 'Computer Networks', instructor: 'Prof. Brown', credits: 3, schedule: 'Tue, Thu 10:00 AM' },
    { code: 'CS205', name: 'Web Development', instructor: 'Dr. Davis', credits: 3, schedule: 'Fri 9:00 AM' },
    { code: 'CS206', name: 'Cyber Security Essentials', instructor: 'Prof. Anderson', credits: 2, schedule: 'Wed 3:00 PM' },
];

const Courses = () => {
    const [selectedCourse, setSelectedCourse] = useState<typeof COURSES[0] | null>(null);

    return (
        <DashboardLayout role="student">
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Courses</h1>
                    <p className="text-slate-600 dark:text-slate-400">Current semester enrolled courses</p>
                </div>

                <div className="grid gap-4">
                    {COURSES.map((course) => (
                        <div
                            key={course.code}
                            onClick={() => setSelectedCourse(course)}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{course.name}</h3>
                                    <span className="text-sm font-mono text-slate-500">{course.code}</span>
                                </div>
                                <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/20">
                                    {course.credits} Credits
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                    <Users size={16} className="text-slate-500" />
                                    <span>{course.instructor}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                    <Clock size={16} className="text-slate-500" />
                                    <span>{course.schedule}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Course Detail Modal */}
                {selectedCourse && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 max-w-2xl w-full">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <BookOpen className="text-blue-400" size={32} />
                                        <span className="text-sm font-mono text-slate-500">{selectedCourse.code}</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{selectedCourse.name}</h2>
                                    <p className="text-slate-600 dark:text-slate-400">{selectedCourse.instructor}</p>
                                </div>
                                <button onClick={() => setSelectedCourse(null)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                                        <div className="text-slate-600 dark:text-slate-400 text-sm mb-1">Credits</div>
                                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{selectedCourse.credits}</div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                                        <div className="text-slate-600 dark:text-slate-400 text-sm mb-1">Schedule</div>
                                        <div className="text-sm font-medium text-slate-900 dark:text-white">{selectedCourse.schedule}</div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        onClick={() => setSelectedCourse(null)}
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Courses;
