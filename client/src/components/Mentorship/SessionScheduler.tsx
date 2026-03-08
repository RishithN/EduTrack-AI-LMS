import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Edit3, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const SessionScheduler = () => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [notes, setNotes] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [actionItems, setActionItems] = useState<string[]>([]);

    // Sessions persistence
    const [sessions, setSessions] = useState<{ id: string, date: string, time: string, notes: string }[]>(() => {
        const stored = localStorage.getItem('mentorship_sessions');
        return stored ? JSON.parse(stored) : [];
    });

    const handleGenerateAI = () => {
        if (!notes.trim()) return;
        setIsGenerating(true);
        setTimeout(() => {
            // Mock API network request for generation
            setActionItems([
                "Review the state management documentation",
                "Start integrating the authentication context",
                "Prepare questions about JWT for next week"
            ]);
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <div className="bg-slate-100/70 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <CalendarIcon size={20} className="text-blue-400" />
                Session Manager
            </h3>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <CalendarIcon size={14} /> Next Session Date
                    </label>
                    <input
                        type="date"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:outline-none"
                        style={{ colorScheme: 'dark' }}
                        value={date} onChange={e => setDate(e.target.value)}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Clock size={14} /> Time
                    </label>
                    <input
                        type="time"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:outline-none"
                        style={{ colorScheme: 'dark' }}
                        value={time} onChange={e => setTime(e.target.value)}
                    />
                </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Edit3 size={16} className="text-purple-400" />
                    Post-Session Notes
                </h4>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter notes from the session..."
                    className="w-full h-24 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-800 dark:text-slate-200 focus:border-purple-500 focus:outline-none resize-none"
                />

                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            if (!date || !time) {
                                alert('Please select a date and time to schedule.');
                                return;
                            }
                            const newSession = {
                                id: Date.now().toString(),
                                date, time, notes
                            };
                            const updatedSessions = [newSession, ...sessions];
                            setSessions(updatedSessions);
                            localStorage.setItem('mentorship_sessions', JSON.stringify(updatedSessions));

                            alert('Session scheduled successfully!');
                            setDate('');
                            setTime('');
                            setNotes('');
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-slate-900 dark:text-white font-medium flex items-center justify-center gap-2 transition-all"
                    >
                        Schedule Session
                    </button>
                    <button
                        onClick={handleGenerateAI}
                        disabled={isGenerating || !notes.trim()}
                        className="py-2.5 px-4 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/50 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Generate Action Plan from Notes"
                    >
                        {isGenerating ? (
                            <div className="h-4 w-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Sparkles size={16} />
                        )}
                        AI Plan
                    </button>
                </div>
            </div>

            {actionItems.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 space-y-2 overflow-hidden"
                >
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">AI Generated Tasks</h4>
                    <ul className="space-y-2">
                        {actionItems.map((item, i) => (
                            <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}

            {sessions.length > 0 && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Upcoming Sessions</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {sessions.map(s => (
                            <div key={s.id} className="bg-slate-800/50 rounded-lg p-3 border border-slate-300 dark:border-slate-700 text-sm">
                                <div className="flex items-center justify-between text-slate-800 dark:text-slate-200 font-medium">
                                    <span className="flex items-center gap-2"><CalendarIcon size={14} className="text-blue-400" /> {s.date}</span>
                                    <span className="flex items-center gap-2"><Clock size={14} className="text-purple-400" /> {s.time}</span>
                                </div>
                                {s.notes && <p className="text-slate-600 dark:text-slate-400 mt-2 text-xs truncate">{s.notes}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SessionScheduler;
