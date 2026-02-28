import { useState } from 'react';
import { BookOpen, Trophy, FlaskConical } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const SEMESTER_RESULTS = [
    { subject: 'Data Structures', code: 'CS201', grade: 'O', points: 10 },
    { subject: 'OOPs', code: 'CS202', grade: 'A+', points: 9 },
    { subject: 'DBMS', code: 'CS203', grade: 'A', points: 8 },
    { subject: 'Computer Networks', code: 'CS204', grade: 'A+', points: 9 },
    { subject: 'Computer Networks', code: 'CS204', grade: 'A+', points: 9 },
    { subject: 'Web Development', code: 'CS205', grade: 'O', points: 10 },
    { subject: 'Cybersecurity Essentials', code: 'CS206', grade: 'A', points: 8 },
];

const QUIZ_RESULTS = [
    { topic: 'Data Structures - Trees', date: '2024-03-10', score: 18, total: 20 },
    { topic: 'DBMS - Normalization', date: '2024-03-05', score: 15, total: 20 },
    { topic: 'Web Dev - React Basics', date: '2024-02-28', score: 20, total: 20 },
    { topic: 'Cybersecurity - Threats', date: '2024-02-20', score: 17, total: 20 },
];

const LAB_RESULTS = [
    { subject: 'Data Structures Lab', code: 'CS201L', grade: 'O', status: 'Completed' },
    { subject: 'Web Development Lab', code: 'CS205L', grade: 'O', status: 'Completed' },
    { subject: 'DBMS Lab', code: 'CS203L', grade: 'A+', status: 'Completed' },
];

const SKILLS = [
    { name: "Problem Solving", level: 85 },
    { name: "Frontend Dev", level: 90 },
    { name: "Backend Dev", level: 75 },
    { name: "Database Design", level: 80 },
];

const ParentPerformance = () => {
    const [activeTab, setActiveTab] = useState<'exams' | 'quizzes' | 'labs'>('exams');

    return (
        <DashboardLayout role="parent">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Academic Performance</h1>
                    <p className="text-slate-400">Detailed breakdown of Arjun's grades and skills.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* GPA Card */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl md:col-span-1">
                        <h3 className="text-slate-400 font-bold uppercase tracking-wider text-sm mb-4">Overall CGPA</h3>
                        <div className="flex items-end gap-2">
                            <span className="text-5xl font-extrabold text-white">9.2</span>
                            <span className="text-slate-500 mb-2">/ 10.0</span>
                        </div>
                        <div className="mt-6 flex flex-col gap-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Semester 1</span>
                                <span className="text-white font-bold">8.9</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Semester 2</span>
                                <span className="text-white font-bold">9.0</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Semester 3</span>
                                <span className="text-emerald-400 font-bold">9.2</span>
                            </div>
                        </div>
                    </div>

                    {/* Skills Graph (Visual) */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl md:col-span-2">
                        <h3 className="text-slate-400 font-bold uppercase tracking-wider text-sm mb-6">Skill Proficiency</h3>
                        <div className="space-y-4">
                            {SKILLS.map((skill) => (
                                <div key={skill.name}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-300">{skill.name}</span>
                                        <span className="text-slate-500">{skill.level}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-600 rounded-full"
                                            style={{ width: `${skill.level}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>



                {/* Navigation Tabs */}
                <div className="flex gap-4 border-b border-slate-800 pb-1">
                    <button
                        onClick={() => setActiveTab('exams')}
                        className={`pb-3 px-2 text-sm font-medium transition-colors relative ${activeTab === 'exams' ? 'text-purple-400' : 'text-slate-400 hover:text-white'}`}
                    >
                        Exam Reports
                        {activeTab === 'exams' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-400 rounded-t-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('quizzes')}
                        className={`pb-3 px-2 text-sm font-medium transition-colors relative ${activeTab === 'quizzes' ? 'text-purple-400' : 'text-slate-400 hover:text-white'}`}
                    >
                        Quiz Performance
                        {activeTab === 'quizzes' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-400 rounded-t-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('labs')}
                        className={`pb-3 px-2 text-sm font-medium transition-colors relative ${activeTab === 'labs' ? 'text-purple-400' : 'text-slate-400 hover:text-white'}`}
                    >
                        Lab Performance
                        {activeTab === 'labs' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-400 rounded-t-full" />}
                    </button>
                </div>

                {/* Content Area */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden min-h-[400px]">

                    {activeTab === 'exams' && (
                        <>
                            <div className="p-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <BookOpen size={18} className="text-purple-400" /> Current Semester Grades
                                </h3>
                                <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                                    FALL 2024
                                </span>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                                    <tr>
                                        <th className="p-4 font-medium text-sm">Subject</th>
                                        <th className="p-4 font-medium text-sm">Code</th>
                                        <th className="p-4 font-medium text-sm">Grade</th>
                                        <th className="p-4 font-medium text-sm">Points</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {SEMESTER_RESULTS.map((res) => (
                                        <tr key={res.code} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="p-4 text-slate-200 font-medium">{res.subject}</td>
                                            <td className="p-4 font-mono text-slate-500 text-sm">{res.code}</td>
                                            <td className="p-4">
                                                <span className={`font-bold px-2 py-1 rounded text-sm ${res.grade === 'O' ? 'bg-yellow-500/10 text-yellow-500' :
                                                    res.grade === 'A+' ? 'bg-emerald-500/10 text-emerald-500' :
                                                        'bg-blue-500/10 text-blue-500'
                                                    }`}>
                                                    {res.grade}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-300">{res.points}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}

                    {activeTab === 'quizzes' && (
                        <div className="p-6">
                            <div className="grid gap-4">
                                {QUIZ_RESULTS.map((quiz, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-slate-950/50 border border-slate-800 p-4 rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg">
                                                <Trophy size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white">{quiz.topic}</h4>
                                                <p className="text-sm text-slate-500">{quiz.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-white">{quiz.score}/{quiz.total}</div>
                                            <div className="text-xs text-emerald-400">{Math.round((quiz.score / quiz.total) * 100)}%</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'labs' && (
                        <div className="p-6">
                            <div className="grid gap-4">
                                {LAB_RESULTS.map((lab, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-slate-950/50 border border-slate-800 p-4 rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
                                                <FlaskConical size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white">{lab.subject}</h4>
                                                <p className="text-sm text-slate-500 font-mono">{lab.code}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/20">
                                                {lab.status}
                                            </span>
                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white border border-slate-700">
                                                {lab.grade}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

            </div>
        </DashboardLayout >
    );
};

export default ParentPerformance;
