import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { Target, MessageSquare, BookOpen, Star, Sparkles, Calendar, X } from 'lucide-react';
import ChatBox from '../../components/Mentorship/ChatBox';
import SessionScheduler from '../../components/Mentorship/SessionScheduler';

const StudentMentorship = () => {
    const [activeModal, setActiveModal] = useState<'chat' | 'schedule' | 'goal' | null>(null);
    const [selectedGoal, setSelectedGoal] = useState<{ title: string, status: string, progress: number, color: string, desc: string } | null>(null);
    return (
        <DashboardLayout role="student">
            <div className="space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
                            My Mentorship
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">Your structured academic goals and AI guidance</p>
                    </div>
                </div>

                {/* Mentor Info & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-6"
                    >
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                            <div className="w-full h-full rounded-full border-4 border-slate-900 bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                <span className="text-2xl font-bold text-slate-900 dark:text-white">DR</span>
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dr. Robert Chen</h2>
                            <p className="text-blue-400 font-medium">Assigned Mentor &bull; All Subjects</p>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 max-w-md">
                                "Hi Rishith! Your recent progress in algorithms is great. Let's focus on the React patterns next week."
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
                            <button
                                onClick={() => setActiveModal('chat')}
                                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-slate-900 dark:text-white rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                                <MessageSquare size={18} />
                                Message
                            </button>
                            <button
                                onClick={() => setActiveModal('schedule')}
                                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl transition-all">
                                <Calendar size={18} />
                                Schedule
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-6 rounded-2xl shadow-xl space-y-4"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="text-emerald-400" />
                            <h3 className="font-semibold text-slate-800 dark:text-slate-200">AI Recommendations</h3>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 bg-slate-100/70 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-800/50">
                                <Star size={16} className="text-amber-400 shrink-0 mt-0.5" />
                                Review the Advanced Hooks module before your next meeting.
                            </li>
                            <li className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 bg-slate-100/70 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-800/50">
                                <Star size={16} className="text-amber-400 shrink-0 mt-0.5" />
                                Your engagement score dropped by 5%. Try participating in forum discussions.
                            </li>
                        </ul>
                    </motion.div>
                </div>

                {/* Goals Tracker */}
                <div>
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4">
                        <Target className="text-rose-400" />
                        Active Goals
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { title: 'Master React Context API', status: 'In Progress', progress: 65, color: 'bg-blue-500', desc: 'Read the official docs and build a small shopping cart.' },
                            { title: 'Complete Backend Auth Assignment', status: 'Pending', progress: 10, color: 'bg-rose-500', desc: 'Implement JWT authentication on the express server.' },
                            { title: 'Review Database Indexing', status: 'Completed', progress: 100, color: 'bg-emerald-500', desc: 'Analyzed MongoDB performance with complex queries.' }
                        ].map((goal, i) => (
                            <motion.div
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    setSelectedGoal(goal);
                                    setActiveModal('goal');
                                }}
                                key={i}
                                className="cursor-pointer bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-5 rounded-xl flex flex-col justify-between hover:border-slate-300 dark:border-slate-700 transition-colors"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-slate-800 dark:text-slate-200 leading-snug">{goal.title}</h4>
                                        <span className={`text-xs px-2 py-1 rounded-md font-medium bg-slate-50 dark:bg-slate-800 ${goal.status === 'Completed' ? 'text-emerald-400' :
                                            goal.status === 'In Progress' ? 'text-blue-400' : 'text-slate-600 dark:text-slate-400'
                                            }`}>
                                            {goal.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{goal.desc}</p>
                                </div>
                                <div className="mt-6">
                                    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                                        <span>Progress</span>
                                        <span>{goal.progress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className={`h-full ${goal.color}`} style={{ width: `${goal.progress}%` }} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Modals */}
                <AnimatePresence>
                    {activeModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className={`w-full ${activeModal === 'chat' ? 'max-w-2xl' : activeModal === 'schedule' ? 'max-w-3xl' : 'max-w-md'} bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col`}
                            >
                                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/50">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                        {activeModal === 'chat' && 'Live Chat with Dr. Robert Chen'}
                                        {activeModal === 'schedule' && 'Schedule Mentorship Session'}
                                        {activeModal === 'goal' && 'Goal Details'}
                                    </h3>
                                    <button
                                        onClick={() => setActiveModal(null)}
                                        className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="p-4 sm:p-6 overflow-y-auto max-h-[80vh]">
                                    {activeModal === 'chat' && (
                                        <ChatBox mentorshipId="m1" currentUserRole="student" />
                                    )}
                                    {activeModal === 'schedule' && (
                                        <SessionScheduler />
                                    )}
                                    {activeModal === 'goal' && selectedGoal && (
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{selectedGoal.title}</h4>
                                                <span className={`text-xs px-2.5 py-1 rounded-md font-medium bg-slate-50 dark:bg-slate-800 ${selectedGoal.status === 'Completed' ? 'text-emerald-400' :
                                                    selectedGoal.status === 'In Progress' ? 'text-blue-400' : 'text-slate-600 dark:text-slate-400'
                                                    }`}>
                                                    {selectedGoal.status}
                                                </span>
                                            </div>
                                            <div className="bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                                                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{selectedGoal.desc}</p>
                                            </div>
                                            <div className="pt-2">
                                                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                                                    <span>Progress Tracker</span>
                                                    <span className="font-bold">{selectedGoal.progress}%</span>
                                                </div>
                                                <div className="w-full h-3 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div className={`h-full ${selectedGoal.color} transition-all duration-1000`} style={{ width: `${selectedGoal.progress}%` }} />
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setActiveModal(null)}
                                                className="w-full py-2.5 mt-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl transition-colors font-medium border border-slate-300 dark:border-slate-700"
                                            >
                                                Close Details
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </DashboardLayout>
    );
};

export default StudentMentorship;
