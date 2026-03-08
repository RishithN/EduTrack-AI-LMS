import { useState } from 'react';
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const PENDING_ASSIGNMENTS = [
    { id: 1, subject: 'Data Structures', title: 'Binary Tree Implementation', dueDate: 'Tomorrow', status: 'Urgent' },
    { id: 2, subject: 'Web Development', title: 'React Hooks Project', dueDate: 'In 3 Days', status: 'Normal' },
    { id: 3, subject: 'Cybersecurity', title: 'Network Analysis Report', dueDate: 'Next Week', status: 'Normal' },
];

const SUBMITTED_ASSIGNMENTS = [
    { id: 4, subject: 'DBMS', title: 'Normalization Case Study', date: '2024-03-01', marks: '9/10', feedback: 'Great work on 3NF' },
    { id: 5, subject: 'OOPs', title: 'Java Inheritance Lab', date: '2024-02-25', marks: '10/10', feedback: 'Perfect execution' },
    { id: 6, subject: 'Computer Networks', title: 'Packet Tracer Simulation', date: '2024-02-20', marks: null, feedback: 'Pending Correction' },
];

const ParentAssignments = () => {
    const [activeTab, setActiveTab] = useState<'pending' | 'submitted'>('pending');

    return (
        <DashboardLayout role="parent">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Assignments</h1>
                    <p className="text-slate-600 dark:text-slate-400">Track pending work and view graded submissions.</p>
                </div>

                <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-1">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`pb-3 px-2 text-sm font-medium transition-colors relative ${activeTab === 'pending' ? 'text-yellow-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white'}`}
                    >
                        Pending Assignments
                        {activeTab === 'pending' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 rounded-t-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('submitted')}
                        className={`pb-3 px-2 text-sm font-medium transition-colors relative ${activeTab === 'submitted' ? 'text-emerald-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white'}`}
                    >
                        View Submissions
                        {activeTab === 'submitted' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 rounded-t-full" />}
                    </button>
                </div>

                <div className="grid gap-4">
                    {activeTab === 'pending' ? (
                        PENDING_ASSIGNMENTS.map((assign) => (
                            <div key={assign.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl flex items-center justify-between hover:border-yellow-500/30 transition-all">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${assign.status === 'Urgent' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                        <AlertCircle size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">{assign.title}</h3>
                                        <div className="text-slate-600 dark:text-slate-400 text-sm mt-1">{assign.subject}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-sm font-bold ${assign.status === 'Urgent' ? 'text-red-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                        Due {assign.dueDate}
                                    </div>
                                    <button className="mt-2 text-xs bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-1 rounded transition-colors border border-slate-300 dark:border-slate-700">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        SUBMITTED_ASSIGNMENTS.map((assign) => (
                            <div key={assign.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl flex items-center justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                                        <CheckCircle size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">{assign.title}</h3>
                                        <div className="text-slate-600 dark:text-slate-400 text-sm mt-1">{assign.subject} • Submitted on {assign.date}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {assign.marks ? (
                                        <>
                                            <div className="text-xl font-bold text-emerald-400">{assign.marks}</div>
                                            <div className="text-xs text-slate-500">{assign.feedback}</div>
                                        </>
                                    ) : (
                                        <div className="text-sm font-medium text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                                            Grading Pending
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ParentAssignments;
