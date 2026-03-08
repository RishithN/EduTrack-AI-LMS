import { useState } from 'react';
import { Plus, FileText, Calendar, Upload, Trash2, Edit } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const MOCK_ASSIGNMENTS = [
    { id: 1, title: 'Data Structures Implementation', subject: 'CS201', deadline: '2026-02-20', submissions: 45, total: 60 },
    { id: 2, title: 'Database Schema Design', subject: 'CS203', deadline: '2026-02-23', submissions: 12, total: 60 },
    { id: 3, title: 'React Frontend Project', subject: 'CS205', deadline: '2026-03-01', submissions: 0, total: 60 },
];

// Added assignmentId to link submissions to specific assignments
const generateMockSubmissions = () => {
    const baseSubmissions = [
        { id: 1, assignmentId: 1, studentName: 'Arjun Verma', studentId: 'CSE-001', submittedDate: '2026-02-18', status: 'submitted', grade: null, sampleWork: 'Implemented binary search tree with insert, delete, and search operations. Code includes proper error handling and edge cases.' },
        { id: 2, assignmentId: 2, studentName: 'Priya Sharma', studentId: 'CSE-002', submittedDate: '2026-02-21', status: 'submitted', grade: null, sampleWork: 'Created normalized database schema with 3NF compliance. Includes ER diagram and SQL DDL statements.' },
        { id: 3, assignmentId: 1, studentName: 'Rohan Kumar', studentId: 'CSE-003', submittedDate: '2026-02-19', status: 'graded', grade: 95, sampleWork: 'Built responsive React dashboard with state management using hooks. Clean component architecture.' },
        { id: 4, assignmentId: 1, studentName: 'Sneha Gupta', studentId: 'CSE-004', submittedDate: '2026-02-19', status: 'submitted', grade: null, sampleWork: 'Implemented AVL tree rotation logic correctly. Added unit tests for edge cases.' },
        { id: 5, assignmentId: 2, studentName: 'Karthik R', studentId: 'CSE-005', submittedDate: '2026-02-22', status: 'submitted', grade: null, sampleWork: 'Designed schema for e-commerce platform. Handled many-to-many relationships correctly.' },
    ];

    // Generate extra submissions for Assignment 1 (Data Structures) to reach 45
    for (let i = 1; i <= 42; i++) {
        baseSubmissions.push({
            id: 100 + i,
            assignmentId: 1,
            studentName: `Student DS-${i}`,
            studentId: `CSE-${200 + i}`,
            submittedDate: '2026-02-19',
            status: Math.random() > 0.3 ? 'submitted' : 'graded',
            grade: Math.random() > 0.3 ? null : Math.floor(Math.random() * 20) + 80,
            sampleWork: 'Standard implementation of the required data structures with basic test cases coverage.'
        });
    }

    // Generate extra submissions for Assignment 2 (DBMS) to reach 12
    for (let i = 1; i <= 10; i++) {
        baseSubmissions.push({
            id: 200 + i,
            assignmentId: 2,
            studentName: `Student DB-${i}`,
            studentId: `CSE-${300 + i}`,
            submittedDate: '2026-02-22',
            status: 'submitted',
            grade: null,
            sampleWork: 'Database schema design with ER diagrams and normalization steps document.'
        });
    }

    return baseSubmissions;
};

const MOCK_SUBMISSIONS = generateMockSubmissions();

const TeacherAssignments = () => {
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [assignments, setAssignments] = useState(MOCK_ASSIGNMENTS);
    const [selectedAssignment, setSelectedAssignment] = useState<typeof MOCK_ASSIGNMENTS[0] | null>(null);
    const [showGradingModal, setShowGradingModal] = useState(false);
    const [showAllSubmissions, setShowAllSubmissions] = useState(false);

    // Load submissions from localStorage or use defaults, checking for validity
    const [submissions, setSubmissions] = useState(() => {
        const saved = localStorage.getItem('teacherSubmissions');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Simple validation: check if first item has assignmentId. If not, discard old data.
                if (Array.isArray(parsed) && parsed.length > 0 && 'assignmentId' in parsed[0]) {
                    return parsed;
                }
            } catch (e) {
                console.error("Failed to parse saved submissions", e);
            }
        }
        return MOCK_SUBMISSIONS;
    });

    const [currentGrade, setCurrentGrade] = useState('');
    const [selectedSubmission, setSelectedSubmission] = useState<typeof MOCK_SUBMISSIONS[0] | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        subject: 'CS201',
        deadline: '',
        points: 10,
        description: ''
    });

    // Filter submissions for the selected assignment
    const currentAssignmentSubmissions = selectedAssignment
        ? submissions.filter((sub: any) => sub.assignmentId === selectedAssignment.id)
        : [];

    const handleEdit = (assignment: typeof MOCK_ASSIGNMENTS[0]) => {
        setFormData({
            title: assignment.title,
            subject: assignment.subject,
            deadline: assignment.deadline,
            points: 100, // Assuming default or needs to be in assignment object
            description: 'Assignment description...' // Placeholder as it's not in mock data
        });
        setIsEditing(true);
        setEditId(assignment.id);
        setShowForm(true);
    };

    const handlePublish = () => {
        if (isEditing && editId) {
            setAssignments(assignments.map(a =>
                a.id === editId
                    ? { ...a, title: formData.title, subject: formData.subject, deadline: formData.deadline }
                    : a
            ));
            alert(`Assignment "${formData.title}" updated successfully!`);
        } else {
            const newId = Math.max(...assignments.map(a => a.id)) + 1;
            setAssignments([...assignments, {
                id: newId,
                title: formData.title,
                subject: formData.subject,
                deadline: formData.deadline,
                submissions: 0,
                total: 60
            }]);
            alert(`Assignment "${formData.title}" created successfully!`);
        }

        setShowForm(false);
        setIsEditing(false);
        setEditId(null);
        setFormData({ title: '', subject: 'CS201', deadline: '', points: 10, description: '' });
    };

    const handleGradeSubmission = () => {
        if (!currentGrade || !selectedSubmission) return;
        const updatedSubmissions = submissions.map((sub: any) =>
            sub.id === selectedSubmission.id ? { ...sub, grade: parseInt(currentGrade), status: 'graded' } : sub
        );
        setSubmissions(updatedSubmissions);
        localStorage.setItem('teacherSubmissions', JSON.stringify(updatedSubmissions));
        alert(`Grade ${currentGrade} awarded to ${selectedSubmission.studentName}`);

        // Update assignment submission count if needed (though visual only in this mock)

        setShowGradingModal(false);
        setCurrentGrade('');
        setSelectedSubmission(null);
    };

    return (
        <DashboardLayout role="teacher">
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Assignment Management</h1>
                        <p className="text-slate-600 dark:text-slate-400">Create, edit and grade student assignments.</p>
                    </div>
                    <button
                        onClick={() => {
                            setShowForm(true);
                            setIsEditing(false);
                            setFormData({ title: '', subject: 'CS201', deadline: '', points: 10, description: '' });
                        }}
                        className="bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
                    >
                        <Plus size={20} /> Create Assignment
                    </button>
                </div>

                {/* Create/Edit Form */}
                {showForm && (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl animate-in fade-in slide-in-from-top-4">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{isEditing ? 'Edit Assignment' : 'Create New Assignment'}</h3>
                        <form className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-slate-600 dark:text-slate-400">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="e.g. Binary Trees"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-slate-600 dark:text-slate-400">Subject Code</label>
                                    <select
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option>CS201 - Data Structures</option>
                                        <option>CS203 - DBMS</option>
                                        <option>CS205 - Web Development</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-slate-600 dark:text-slate-400">Deadline</label>
                                    <input
                                        type="date"
                                        value={formData.deadline}
                                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-slate-600 dark:text-slate-400">Points</label>
                                    <input
                                        type="number"
                                        value={formData.points}
                                        onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-slate-600 dark:text-slate-400">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none h-24"
                                    placeholder="Assignment details..."
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <button type="button" className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:border-slate-500 transition-colors">
                                    <Upload size={18} /> Attach File (PDF/Doc)
                                </button>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
                                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white">Cancel</button>
                                <button
                                    type="button"
                                    onClick={handlePublish}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white rounded-lg font-medium"
                                >
                                    {isEditing ? 'Update Assignment' : 'Publish Assignment'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Assignments List */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="p-4 font-medium">Assignment</th>
                                <th className="p-4 font-medium">Subject</th>
                                <th className="p-4 font-medium">Deadline</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {assignments.map((assign) => (
                                <tr
                                    key={assign.id}
                                    onClick={() => setSelectedAssignment(assign)}
                                    className="hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                                >
                                    <td className="p-4">
                                        <div className="font-medium text-slate-900 dark:text-white">{assign.title}</div>
                                    </td>
                                    <td className="p-4 text-slate-600 dark:text-slate-400 font-mono">{assign.subject}</td>
                                    <td className="p-4 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <Calendar size={16} className="text-slate-500" /> {assign.deadline}
                                    </td>
                                    <td className="p-4">
                                        <div className="w-32 h-2 bg-slate-50 dark:bg-slate-950 rounded-full overflow-hidden mb-1">
                                            <div
                                                className="h-full bg-blue-500"
                                                style={{ width: `${(assign.submissions / assign.total) * 100}%` }}
                                            />
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {assign.submissions}/{assign.total} Submitted
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedAssignment(assign); }}
                                                className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                                                title="Grade Submissions"
                                            >
                                                <FileText size={18} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleEdit(assign); }}
                                                className="p-2 hover:bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Assignment Detail Modal */}
                {selectedAssignment && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{selectedAssignment.title}</h2>
                                    <p className="text-slate-600 dark:text-slate-400">{selectedAssignment.subject}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedAssignment(null)}
                                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white"
                                >
                                    <Plus size={24} className="rotate-45" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                                        <div className="text-slate-600 dark:text-slate-400 text-sm mb-1">Deadline</div>
                                        <div className="text-xl font-bold text-slate-900 dark:text-white">{selectedAssignment.deadline}</div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                                        <div className="text-slate-600 dark:text-slate-400 text-sm mb-1">Submissions</div>
                                        <div className="text-xl font-bold text-slate-900 dark:text-white">{currentAssignmentSubmissions.length}/{selectedAssignment.total}</div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            {showAllSubmissions ? 'All Submissions' : `Recent Submissions (Showing 3 of ${currentAssignmentSubmissions.length})`}
                                        </h3>
                                        {showAllSubmissions && (
                                            <button
                                                onClick={() => setShowAllSubmissions(false)}
                                                className="text-sm text-blue-400 hover:text-blue-300"
                                            >
                                                Show Less
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        {currentAssignmentSubmissions.length > 0 ? (
                                            currentAssignmentSubmissions.slice(0, showAllSubmissions ? undefined : 3).map((sub: any) => (
                                                <div key={sub.id} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center font-bold text-slate-900 dark:text-white">
                                                            {sub.studentName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="text-slate-900 dark:text-white font-medium">{sub.studentName}</div>
                                                            <div className="text-xs text-slate-500">{sub.studentId} • Submitted: {sub.submittedDate}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        {sub.status === 'graded' ? (
                                                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-sm font-medium">
                                                                Grade: {sub.grade}/100
                                                            </span>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedSubmission(sub);
                                                                    setShowGradingModal(true);
                                                                }}
                                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
                                                            >
                                                                Grade Now
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-slate-500 text-center py-6">No submissions yet for this assignment.</div>
                                        )}
                                        {!showAllSubmissions && currentAssignmentSubmissions.length > 3 && (
                                            <div className="text-center pt-2">
                                                <button
                                                    onClick={() => setShowAllSubmissions(true)}
                                                    className="text-sm text-blue-400 hover:text-blue-300"
                                                >
                                                    View All Submissions
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
                                    <button
                                        onClick={() => setSelectedAssignment(null)}
                                        className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Grading Modal */}
                {showGradingModal && selectedSubmission && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Grade Submission</h2>
                            <div className="mb-4">
                                <div className="text-slate-600 dark:text-slate-400 mb-2">Student: <span className="text-slate-900 dark:text-white font-medium">{selectedSubmission.studentName}</span></div>
                                <div className="text-slate-600 dark:text-slate-400 mb-4">ID: <span className="text-slate-900 dark:text-white font-medium">{selectedSubmission.studentId}</span></div>
                            </div>

                            {/* Sample Submission */}
                            <div className="mb-6 bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Submitted Work Sample:</h3>
                                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{selectedSubmission.sampleWork}</p>
                            </div>

                            <div className="mb-6">
                                <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">Grade (out of 100)</label>
                                <input
                                    type="number"
                                    value={currentGrade}
                                    onChange={(e) => setCurrentGrade(e.target.value)}
                                    min="0"
                                    max="100"
                                    placeholder="Enter grade..."
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowGradingModal(false);
                                        setCurrentGrade('');
                                        setSelectedSubmission(null);
                                    }}
                                    className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleGradeSubmission}
                                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white rounded-lg font-medium transition-colors"
                                >
                                    Submit Grade
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </DashboardLayout>
    );
};

export default TeacherAssignments;
