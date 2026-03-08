import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import {
    Users, TrendingUp, AlertTriangle,
    Clock, MessageSquare, Target, Activity, Calendar
} from 'lucide-react';
import ChatBox from '../../components/Mentorship/ChatBox';
import SessionScheduler from '../../components/Mentorship/SessionScheduler';

const MOCK_MENTEES = [
    {
        id: 'm1',
        name: 'Rishith',
        riskLevel: 'Green',
        attendance: 92,
        engagement: 88,
        performanceTrend: '+5%',
        goalsCompleted: 3,
        goalsTotal: 4,
        recentNote: 'Needs to focus on advanced React patterns.',
    },
    {
        id: 'm2',
        name: 'Abhishek',
        riskLevel: 'Yellow',
        attendance: 78,
        engagement: 65,
        performanceTrend: '-2%',
        goalsCompleted: 1,
        goalsTotal: 3,
        recentNote: 'Struggling with backend integration. Scheduled extra review.',
    },
    {
        id: 'm3',
        name: 'Priya',
        riskLevel: 'Red',
        attendance: 55,
        engagement: 40,
        performanceTrend: '-12%',
        goalsCompleted: 0,
        goalsTotal: 2,
        recentNote: 'Missed last 3 lectures. AI flagged high dropout risk.',
    }
];

const MentorshipDashboard = () => {
    const [selectedMentee, setSelectedMentee] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'sessions'>('overview');

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'Green': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'Yellow': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'Red': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
            default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
        }
    };

    return (
        <DashboardLayout role="teacher">
            <div className="space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Mentorship Hub
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">AI-driven structured academic mentorship</p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Mentees', value: MOCK_MENTEES.length, icon: Users, color: 'text-blue-400' },
                        { label: 'At Risk (Red)', value: 1, icon: AlertTriangle, color: 'text-rose-500' },
                        { label: 'Avg Engagement', value: '64%', icon: Activity, color: 'text-purple-400' },
                        { label: 'Goals Met', value: '4/9', icon: Target, color: 'text-emerald-400' }
                    ].map((stat, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={i}
                            className="bg-slate-100/70 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-xl"
                        >
                            <div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-lg bg-slate-800/80 ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Mentee List */}
                    <div className="lg:col-span-1 space-y-4">
                        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <Users size={20} className="text-blue-400" />
                            Assigned Students
                        </h3>

                        <div className="space-y-3">
                            {MOCK_MENTEES.map((mentee) => (
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedMentee(mentee.id)}
                                    key={mentee.id}
                                    className={`cursor-pointer p-4 rounded-xl border backdrop-blur-md transition-all duration-300 ${selectedMentee === mentee.id
                                        ? 'bg-blue-600/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                        : 'bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium text-slate-800 dark:text-slate-200">{mentee.name}</h4>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Attendance: {mentee.attendance}%</p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getRiskColor(mentee.riskLevel)}`}>
                                            {mentee.riskLevel} Risk
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Mentee Details & Chat (Placeholder Layout) */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <TrendingUp size={20} className="text-purple-400" />
                            Mentorship Insights
                        </h3>

                        <AnimatePresence mode="wait">
                            {selectedMentee ? (
                                <motion.div
                                    key={selectedMentee}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 min-h-[400px] flex flex-col"
                                >
                                    {/* Selected Mentee Details UI */}
                                    <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                                {MOCK_MENTEES.find(m => m.id === selectedMentee)?.name}
                                            </h2>
                                            <div className="flex gap-4 mt-3">
                                                <button
                                                    onClick={() => setActiveTab('overview')}
                                                    className={`text-sm font-medium pb-2 border-b-2 transition-colors ${activeTab === 'overview' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300'}`}
                                                >Overview</button>
                                                <button
                                                    onClick={() => setActiveTab('chat')}
                                                    className={`text-sm font-medium pb-2 border-b-2 transition-colors ${activeTab === 'chat' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300'}`}
                                                >Chat</button>
                                                <button
                                                    onClick={() => setActiveTab('sessions')}
                                                    className={`text-sm font-medium pb-2 border-b-2 transition-colors ${activeTab === 'sessions' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300'}`}
                                                >Sessions</button>
                                            </div>
                                        </div>
                                    </div>

                                    {activeTab === 'overview' && (
                                        <>
                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-300 dark:border-slate-700/50">
                                                    <h4 className="text-sm text-slate-600 dark:text-slate-400 mb-1">Goal Progress</h4>
                                                    <div className="flex items-end gap-2">
                                                        <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                                                            {MOCK_MENTEES.find(m => m.id === selectedMentee)?.goalsCompleted}
                                                        </span>
                                                        <span className="text-slate-500 mb-1">/ {MOCK_MENTEES.find(m => m.id === selectedMentee)?.goalsTotal}</span>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-300 dark:border-slate-700/50">
                                                    <h4 className="text-sm text-slate-600 dark:text-slate-400 mb-1">Engagement</h4>
                                                    <div className="flex items-end gap-2">
                                                        <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                                                            {MOCK_MENTEES.find(m => m.id === selectedMentee)?.engagement}/100
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-1 bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                                                <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                                    <AlertTriangle size={16} className="text-amber-400" />
                                                    Recent AI Notes & Alerts
                                                </h4>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                                    {MOCK_MENTEES.find(m => m.id === selectedMentee)?.recentNote}
                                                </p>
                                            </div>
                                        </>
                                    )}

                                    {activeTab === 'chat' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            <ChatBox mentorshipId={selectedMentee} currentUserRole="teacher" />
                                        </motion.div>
                                    )}

                                    {activeTab === 'sessions' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            <SessionScheduler />
                                        </motion.div>
                                    )}

                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-slate-900/30 border border-slate-200 dark:border-slate-800 border-dashed rounded-2xl h-[400px] flex flex-col items-center justify-center text-slate-500"
                                >
                                    <Users size={48} className="mb-4 opacity-50" />
                                    <p>Select a student to view mentorship insights</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MentorshipDashboard;
