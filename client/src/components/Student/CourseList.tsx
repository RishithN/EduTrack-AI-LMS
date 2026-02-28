import { useState } from 'react';
import { Code, Database, Cpu, Globe, Server, Shield, X, BookOpen } from 'lucide-react';

const COURSES = [
    { code: 'CS201', name: 'Data Structures & Algorithms', credits: 4, icon: Code, color: 'text-blue-400', completion: 65 },
    { code: 'CS202', name: 'Object Oriented Programming', credits: 3, icon: Cpu, color: 'text-purple-400', completion: 72 },
    { code: 'CS203', name: 'Database Management Systems', credits: 4, icon: Database, color: 'text-green-400', completion: 58 },
    { code: 'CS204', name: 'Computer Networks', credits: 3, icon: Server, color: 'text-orange-400', completion: 80 },
    { code: 'CS205', name: 'Web Development', credits: 3, icon: Globe, color: 'text-pink-400', completion: 45 },
    { code: 'CS206', name: 'Cyber Security Essentials', credits: 2, icon: Shield, color: 'text-red-400', completion: 90 },
];

const CourseList = () => {
    const [selectedCourse, setSelectedCourse] = useState<typeof COURSES[0] | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {COURSES.map((course) => (
                    <div
                        key={course.code}
                        onClick={() => setSelectedCourse(course)}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-slate-400 dark:hover:border-slate-600 transition-all cursor-pointer group shadow-sm dark:shadow-none"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-lg bg-slate-100 dark:bg-slate-950 ${course.color} group-hover:scale-110 transition-transform`}>
                                <course.icon size={24} />
                            </div>
                            <span className="text-xs font-mono text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded">
                                {course.code}
                            </span>
                        </div>

                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {course.name}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-500">
                            {course.credits} Credits • CSE Core
                        </p>

                        <div className="mt-4 h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 dark:bg-blue-500 rounded-full" style={{ width: `${course.completion}%` }} />
                        </div>
                        <div className="mt-2 text-xs text-right text-slate-400 dark:text-slate-400">{course.completion}% Completed</div>
                    </div>
                ))}
            </div>

            {/* Course Detail Modal */}
            {selectedCourse && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 max-w-2xl w-full shadow-2xl transition-colors">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`p-3 rounded-lg bg-slate-100 dark:bg-slate-950 ${selectedCourse.color}`}>
                                        <selectedCourse.icon size={32} />
                                    </div>
                                    <span className="text-sm font-mono text-slate-500">{selectedCourse.code}</span>
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{selectedCourse.name}</h2>
                                <p className="text-slate-500 dark:text-slate-400">CSE Core Course</p>
                            </div>
                            <button onClick={() => setSelectedCourse(null)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors">
                                    <div className="text-slate-500 dark:text-slate-400 text-sm mb-1">Credits</div>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{selectedCourse.credits}</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors">
                                    <div className="text-slate-500 dark:text-slate-400 text-sm mb-1">Progress</div>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{selectedCourse.completion}%</div>
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors">
                                <div className="text-slate-500 dark:text-slate-400 text-sm mb-2">Course Progress</div>
                                <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600 dark:bg-blue-500 rounded-full" style={{ width: `${selectedCourse.completion}%` }} />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={() => setSelectedCourse(null)}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CourseList;
