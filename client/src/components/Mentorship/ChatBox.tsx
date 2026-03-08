import { useState, useEffect, useRef } from 'react';
import { Send, User } from 'lucide-react';

// Replace with actual Socket implementation later, this is UI + mock setup
// import { io } from 'socket.io-client';

interface ChatBoxProps {
    mentorshipId: string;
    currentUserRole: 'student' | 'teacher';
}

const ChatBox = ({ mentorshipId, currentUserRole }: ChatBoxProps) => {
    const [messages, setMessages] = useState<any[]>(() => {
        const stored = localStorage.getItem(`chat_${mentorshipId}`);
        if (stored) return JSON.parse(stored).map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
        return [
            { id: '1', text: 'Hi! How is the React project going?', senderId: 'teacher', timestamp: new Date(Date.now() - 3600000) },
            { id: '2', text: 'It\'s going well, but I need help with State Management.', senderId: 'student', timestamp: new Date(Date.now() - 1800000) }
        ];
    });
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const newMessage = {
            id: Date.now().toString(),
            text: input,
            senderId: currentUserRole,
            timestamp: new Date()
        };

        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        localStorage.setItem(`chat_${mentorshipId}`, JSON.stringify(newMessages));
        setInput('');
    };

    // Auto-refresh for syncing between tabs/roles
    useEffect(() => {
        const interval = setInterval(() => {
            const stored = localStorage.getItem(`chat_${mentorshipId}`);
            if (stored) {
                const parsed = JSON.parse(stored).map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
                if (parsed.length !== messages.length) {
                    setMessages(parsed);
                }
            }
        }, 1500);
        return () => clearInterval(interval);
    }, [mentorshipId, messages.length]);

    return (
        <div className="flex flex-col h-[400px] bg-slate-100/70 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="bg-white dark:bg-slate-900 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Live Mentorship Chat</span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Live"></span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUserRole;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${isMe ? 'bg-blue-600' : 'bg-purple-600'
                                    }`}>
                                    <User size={14} className="text-slate-900 dark:text-white" />
                                </div>
                                <div className={`px-4 py-2 rounded-2xl ${isMe
                                    ? 'bg-blue-600 text-slate-900 dark:text-white rounded-tr-none'
                                    : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-300 dark:border-slate-700'
                                    }`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <p className={`text-[10px] mt-1 ${isMe ? 'text-blue-200' : 'text-slate-500'}`}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                    onClick={handleSend}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-slate-900 dark:text-white rounded-xl transition-colors"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
