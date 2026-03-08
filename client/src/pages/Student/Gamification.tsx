import { useState } from 'react';
import { Trophy, Medal, Crown, Zap } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const MOCK_LEADERBOARD = [
    { rank: 1, name: "Arjun Verma", points: 2450, badge: "Grandmaster" },
    { rank: 2, name: "Priya Sharma", points: 2310, badge: "Master" },
    { rank: 3, name: "R Rohan", points: 2180, badge: "Expert" },
    { rank: 4, name: "Sneha Gupta", points: 1950, badge: "Advanced" },
    { rank: 5, name: "Rishith (You)", points: 1250, badge: "Intermediate" },
];

const BADGES = [
    { name: "Bug Hunter", icon: "🐞", desc: "Fixed 10+ bugs in submissions" },
    { name: "Quiz Wizard", icon: "🧙‍♂️", desc: "Scored 100% in 5 quizzes" },
    { name: "Night Owl", icon: "🦉", desc: "Submitted assignment after 2 AM" },
    { name: "Fast Tracker", icon: "⚡", desc: "Completed course 2 weeks early" },
];

const LOCKED_BADGES = [
    { name: "Code Ninja", icon: "🥷", desc: "Solve 50 Hard Problems" },
    { name: "Team Player", icon: "🤝", desc: "Collaborate on 3 Projects" },
    { name: "AI Visionary", icon: "🤖", desc: "Use AI Tools 100 times" },
];

const Gamification = () => {
    const [showLocked, setShowLocked] = useState(false);

    return (
        <DashboardLayout role="student">
            <div className="space-y-8">

                {/* Header Section */}
                <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Trophy size={180} />
                    </div>

                    <div className="relative z-10 flex items-center gap-6">
                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-4 border-slate-900 shadow-xl flex items-center justify-center text-4xl font-bold text-slate-900 dark:text-white">
                            5
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-yellow-400 uppercase tracking-widest mb-1">Current Level</h2>
                            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Intermediate Coder</h1>
                            <p className="text-slate-700 dark:text-slate-300 mt-2 flex items-center gap-2">
                                <Zap className="text-yellow-400" size={16} /> 1,250 XP / 2,000 XP to next level
                            </p>
                            <div className="w-full max-w-sm h-2 bg-slate-50 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                                <div className="h-full bg-yellow-500 w-[65%]" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">

                    {/* Badges Collection */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Medal className="text-purple-400" /> My Badges
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {BADGES.map((badge, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center gap-4 hover:border-purple-500/50 transition-colors">
                                    <div className="text-3xl">{badge.icon}</div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 dark:text-slate-200">{badge.name}</h4>
                                        <p className="text-xs text-slate-500">{badge.desc}</p>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setShowLocked(!showLocked)}
                                className="border border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-900/50 rounded-xl flex flex-col items-center justify-center text-slate-500 p-4 gap-2 hover:bg-slate-50 dark:bg-slate-800 transition-all group"
                            >
                                <div className="h-10 w-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    {showLocked ? '⬆️' : '?'}
                                </div>
                                <span className="text-xs font-bold">{showLocked ? 'Show Less' : 'More to unlock!'}</span>
                            </button>
                        </div>

                        {/* Locked Badges Section */}
                        {showLocked && (
                            <div className="mt-6 mb-2 animate-in slide-in-from-top-4 fade-in duration-300">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 pl-1">Locked Badges</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {LOCKED_BADGES.map((badge, idx) => (
                                        <div key={idx} className="bg-slate-950/50 border border-slate-200 dark:border-slate-800/50 p-4 rounded-xl flex items-center gap-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-not-allowed">
                                            <div className="text-3xl filter blur-[2px] hover:blur-none transition-all">{badge.icon}</div>
                                            <div>
                                                <h4 className="font-bold text-slate-600 dark:text-slate-400">{badge.name}</h4>
                                                <p className="text-xs text-slate-600">{badge.desc}</p>
                                            </div>
                                            <div className="ml-auto">
                                                <div className="bg-slate-50 dark:bg-slate-800 p-1.5 rounded-full">
                                                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Leaderboard */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Crown className="text-yellow-400" /> Class Leaderboard
                        </h2>
                        <div className="space-y-4">
                            {MOCK_LEADERBOARD.map((user, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-center justify-between p-3 rounded-lg ${user.rank === 5 ? 'bg-blue-600/10 border border-blue-600/30' : 'hover:bg-slate-50 dark:bg-slate-800'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className={`w-8 h-8 flex items-center justify-center font-bold rounded-full ${user.rank === 1 ? 'bg-yellow-500 text-slate-900' :
                                            user.rank === 2 ? 'bg-slate-400 text-slate-900' :
                                                user.rank === 3 ? 'bg-orange-700 text-slate-900 dark:text-white' :
                                                    'text-slate-500 bg-slate-50 dark:bg-slate-950'
                                            }`}>
                                            {user.rank}
                                        </span>
                                        <span className={user.rank === 5 ? 'text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-300 font-medium'}>
                                            {user.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500 text-sm hidden md:block">{user.badge}</span>
                                        <span className="text-yellow-400 font-bold font-mono">{user.points} XP</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </DashboardLayout>
    );
};

export default Gamification;
