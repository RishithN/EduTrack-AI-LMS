import { useState } from 'react';
import { TrendingDown, TrendingUp, AlertTriangle, BookOpen, Send, BarChart3, Users } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const CLASS_PERFORMANCE = {
    averageScore: 76.5,
    trend: 'up',
    totalStudents: 60,
    passingRate: 85,
    attendanceRate: 88
};

const WEAK_STUDENTS = [
    {
        id: 'CSE-003',
        name: 'Rohan Kumar',
        avgScore: 45,
        attendance: 66,
        weakTopics: ['DBMS Normalization', 'SQL Joins', 'Indexing'],
        lastAssignment: 38
    },
    {
        id: 'CSE-006',
        name: 'Ananya M',
        avgScore: 52,
        attendance: 72,
        weakTopics: ['Data Structures', 'Algorithms', 'Recursion'],
        lastAssignment: 48
    },
    {
        id: 'CSE-009',
        name: 'Karthik R',
        avgScore: 58,
        attendance: 78,
        weakTopics: ['Computer Networks', 'OSI Model', 'TCP/IP'],
        lastAssignment: 55
    }
];

const TOPIC_ANALYSIS = [
    { topic: 'Data Structures', avgScore: 82, needsRevision: false, studentsStruggling: 8 },
    { topic: 'DBMS Normalization', avgScore: 58, needsRevision: true, studentsStruggling: 25 },
    { topic: 'Algorithms', avgScore: 75, needsRevision: false, studentsStruggling: 12 },
    { topic: 'Computer Networks', avgScore: 62, needsRevision: true, studentsStruggling: 20 },
    { topic: 'OOP Concepts', avgScore: 88, needsRevision: false, studentsStruggling: 5 },
    { topic: 'Web Development', avgScore: 92, needsRevision: false, studentsStruggling: 2 }
];

const TeacherAnalytics = () => {
    const [selectedStudent, setSelectedStudent] = useState<typeof WEAK_STUDENTS[0] | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<typeof TOPIC_ANALYSIS[0] | null>(null);
    const [feedback, setFeedback] = useState('');

    const sendFeedback = () => {
        if (!selectedStudent || !feedback.trim()) {
            alert('Please enter feedback before sending.');
            return;
        }
        alert(`Feedback sent to ${selectedStudent.name}!`);
        setFeedback('');
        setSelectedStudent(null);
    };

    return (
        <DashboardLayout role="teacher">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-white">Class Analytics & Performance</h1>
                    <p className="text-slate-400">Analyze student performance and provide targeted feedback</p>
                </div>

                {/* Overall Performance Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                            <BarChart3 size={16} />
                            <span>Class Average</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-2xl font-bold text-white">{CLASS_PERFORMANCE.averageScore}%</div>
                            {CLASS_PERFORMANCE.trend === 'up' ? (
                                <TrendingUp size={20} className="text-emerald-400" />
                            ) : (
                                <TrendingDown size={20} className="text-red-400" />
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-slate-400 text-sm mb-2">Total Students</div>
                        <div className="text-2xl font-bold text-white">{CLASS_PERFORMANCE.totalStudents}</div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-slate-400 text-sm mb-2">Passing Rate</div>
                        <div className="text-2xl font-bold text-emerald-400">{CLASS_PERFORMANCE.passingRate}%</div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-slate-400 text-sm mb-2">Attendance</div>
                        <div className="text-2xl font-bold text-blue-400">{CLASS_PERFORMANCE.attendanceRate}%</div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-slate-400 text-sm mb-2">At Risk</div>
                        <div className="text-2xl font-bold text-red-400">{WEAK_STUDENTS.length}</div>
                    </div>
                </div>

                {/* Topics Needing Revision */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="text-orange-400" size={24} />
                        <h2 className="text-xl font-bold text-white">Topics Analysis</h2>
                    </div>
                    <div className="space-y-3">
                        {TOPIC_ANALYSIS.map((topic, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedTopic(topic)}
                                className="bg-slate-950 p-4 rounded-lg border border-slate-800 cursor-pointer hover:border-blue-500/30 transition-all"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-white font-medium">{topic.topic}</h3>
                                        {topic.needsRevision && (
                                            <span className="px-2 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/30 rounded text-xs font-medium">
                                                Needs Revision
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-lg font-bold ${topic.avgScore >= 75 ? 'text-emerald-400' : topic.avgScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                                            {topic.avgScore}%
                                        </div>
                                        <div className="text-xs text-slate-500">{topic.studentsStruggling} students struggling</div>
                                    </div>
                                </div>
                                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${topic.avgScore >= 75 ? 'bg-emerald-500' : topic.avgScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                        style={{ width: `${topic.avgScore}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Weak Students - Needs Attention */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="text-red-400" size={24} />
                        <h2 className="text-xl font-bold text-white">Students Needing Attention</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {WEAK_STUDENTS.map((student) => (
                            <div
                                key={student.id}
                                onClick={() => setSelectedStudent(student)}
                                className="bg-slate-950 p-4 rounded-lg border border-slate-800 hover:border-red-500/30 transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-red-500 to-orange-600 flex items-center justify-center font-bold text-white">
                                        {student.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-white font-medium group-hover:text-red-400 transition-colors">{student.name}</div>
                                        <div className="text-xs text-slate-500">{student.id}</div>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Average Score</span>
                                        <span className="text-red-400 font-bold">{student.avgScore}%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Attendance</span>
                                        <span className="text-yellow-400 font-bold">{student.attendance}%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Last Assignment</span>
                                        <span className="text-red-400 font-bold">{student.lastAssignment}%</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Weak Topics:</div>
                                    <div className="flex flex-wrap gap-1">
                                        {student.weakTopics.map((topic, idx) => (
                                            <span key={idx} className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded text-xs">
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Feedback Modal */}
                {selectedStudent && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-2xl w-full">
                            <h2 className="text-2xl font-bold text-white mb-4">Send Academic Feedback & Recommendations</h2>

                            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 mb-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-red-500 to-orange-600 flex items-center justify-center font-bold text-white">
                                        {selectedStudent.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">{selectedStudent.name}</div>
                                        <div className="text-sm text-slate-500">{selectedStudent.id}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 text-sm">
                                    <div>
                                        <div className="text-slate-400">Avg Score</div>
                                        <div className="text-red-400 font-bold">{selectedStudent.avgScore}%</div>
                                    </div>
                                    <div>
                                        <div className="text-slate-400">Attendance</div>
                                        <div className="text-yellow-400 font-bold">{selectedStudent.attendance}%</div>
                                    </div>
                                    <div>
                                        <div className="text-slate-400">Last Score</div>
                                        <div className="text-red-400 font-bold">{selectedStudent.lastAssignment}%</div>
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <div className="text-xs text-slate-500 mb-1">Topics to Focus:</div>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedStudent.weakTopics.map((topic, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs">
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-sm text-slate-400 mb-2 block">Feedback & Recommendations</label>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Provide personalized feedback and study recommendations..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none h-32"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setSelectedStudent(null);
                                        setFeedback('');
                                    }}
                                    className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={sendFeedback}
                                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <Send size={18} />
                                    Send Feedback
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Topic Details Modal */}
                {selectedTopic && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-lg w-full">
                            <h2 className="text-2xl font-bold text-white mb-2">{selectedTopic.topic}</h2>
                            <p className="text-slate-400 mb-6">Detailed performance analysis.</p>

                            <div className="space-y-4 mb-6">
                                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex justify-between items-center">
                                    <span className="text-slate-400">Average Score</span>
                                    <span className={`text-xl font-bold ${selectedTopic.avgScore >= 75 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                                        {selectedTopic.avgScore}%
                                    </span>
                                </div>
                                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex justify-between items-center">
                                    <span className="text-slate-400">Students Struggling</span>
                                    <span className="text-xl font-bold text-red-400">
                                        {selectedTopic.studentsStruggling}
                                    </span>
                                </div>
                                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                                    <div className="text-slate-400 mb-2">Status</div>
                                    <div className={`font-medium ${selectedTopic.needsRevision ? 'text-orange-400' : 'text-emerald-400'}`}>
                                        {selectedTopic.needsRevision ? 'Needs Revision' : 'On Track'}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedTopic(null)}
                                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default TeacherAnalytics;
