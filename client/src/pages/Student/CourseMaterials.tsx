import { useState, useRef, useEffect } from 'react';
import { Book, ChevronRight, PlayCircle, FileText, Download, Bot, Send, X, Sparkles, Loader2 } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

// Mock Data
const SUBJECTS = [
    {
        id: 'cs201',
        name: 'Data Structures',
        code: 'CS201',
        modules: [
            { title: 'Introduction to Algorithms', type: 'video', duration: '45 mins' },
            { title: 'Arrays & Linked Lists', type: 'doc', pages: 12 },
            { title: 'Stack & Queues Implementation', type: 'video', duration: '50 mins' },
            { title: 'Trees & Graphs', type: 'doc', pages: 24 }
        ]
    },
    {
        id: 'cs202',
        name: 'OOPs with Java',
        code: 'CS202',
        modules: [
            { title: 'Classes & Objects', type: 'video', duration: '40 mins' },
            { title: 'Inheritance & Polymorphism', type: 'doc', pages: 18 },
            { title: 'Exception Handling', type: 'video', duration: '35 mins' }
        ]
    },
    {
        id: 'cs203', name: 'DBMS', code: 'CS203', modules: [
            { title: 'Introduction to Databases', type: 'video', duration: '55 mins' },
            { title: 'Entity-Relationship Model', type: 'doc', pages: 15 },
            { title: 'Relational Algebra & SQL', type: 'video', duration: '60 mins' },
            { title: 'Normalization', type: 'doc', pages: 20 }
        ]
    },
    {
        id: 'cs204', name: 'Computer Networks', code: 'CS204', modules: [
            { title: 'OSI Model Deep Dive', type: 'video', duration: '45 mins' },
            { title: 'TCP/IP Protocol Suite', type: 'doc', pages: 25 },
            { title: 'Routing Algorithms', type: 'video', duration: '50 mins' }
        ]
    },
    {
        id: 'cs205', name: 'Web Development', code: 'CS205', modules: [
            { title: 'HTML5 & CSS3 Basics', type: 'video', duration: '40 mins' },
            { title: 'JavaScript Fundamentals', type: 'video', duration: '60 mins' },
            { title: 'React JS Introduction', type: 'doc', pages: 30 },
            { title: 'Building a Full Stack App', type: 'video', duration: '90 mins' }
        ]
    },
    {
        id: 'cs206', name: 'Cybersecurity', code: 'CS206', modules: [
            { title: 'Introduction to Cryptography', type: 'video', duration: '50 mins' },
            { title: 'Network Security Principles', type: 'doc', pages: 18 },
            { title: 'Ethical Hacking Basics', type: 'video', duration: '75 mins' }
        ]
    },
];

const CourseMaterials = () => {
    const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
    const [isAiOpen, setIsAiOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: "Hi! I'm your AI Study Buddy. I can help you summarize notes, explain complex topics, or quiz you on this module. What are we studying today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isAiOpen]);

    const getMockResponse = (text: string) => {
        const lowerMsg = text.toLowerCase();

        // 1. KNOWLEDGE BASE (Simplified for Frontend Fallback)
        const KNOWLEDGE_BASE: Record<string, string> = {
            "html": "**HTML (HyperText Markup Language)** is the standard markup language for documents designed to be displayed in a web browser. It defines the structure of web content.",
            "css": "**CSS (Cascading Style Sheets)** describes how HTML elements are to be displayed on screen, paper, or in other media. It saves a lot of work and can control the layout of multiple web pages all at once.",
            "javascript": "**JavaScript** is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS. It enables interactive web pages and is an essential part of web applications.",
            "react": "**React** is a free and open-source front-end JavaScript library for building user interfaces based on components. It is maintained by Meta and a community of individual developers and companies.",
            "node": "**Node.js** is a cross-platform, open-source server environment that can run on Windows, Linux, Unix, macOS, and more. Node.js runs on the V8 JavaScript engine, and executes JavaScript code outside a web browser.",
            "stack": "A **Stack** is a linear data structure which follows a particular order in which the operations are performed. The order may be LIFO (Last In First Out) or FILO (First In Last Out).",
            "queue": "A **Queue** is a linear structure which follows a particular order in which the operations are performed. The order is First In First Out (FIFO).",
            "array": "An **Array** is a collection of items, stored at contiguous memory locations. The idea is to store multiple items of the same type together.",
            "career": "I can help you with career advice! We have a dedicated **Career AI** module where you can explore roadmaps for Full Stack Development, Data Science, and more.",
            "salary": "Salaries in tech vary by role and experience. For example, a Junior Full Stack Developer in India typically starts between ₹5L - ₹128L LPA.",
            "security": "Cybersecurity involves protecting systems, networks, and programs from digital attacks. Key concepts include the CIA Triad (Confidentiality, Integrity, Availability).",
            "cloud": "Cloud computing is the on-demand availability of computer system resources, especially data storage and computing power, without direct active management by the user.",
            "ai": "Artificial Intelligence (AI) is intelligence demonstrated by machines, as opposed to the natural intelligence displayed by humans or animals."
        };

        for (const [key, value] of Object.entries(KNOWLEDGE_BASE)) {
            if (lowerMsg.includes(key)) return value;
        }

        return "That's an interesting topic! While I'm operating in offline mode right now, I'd recommend checking the 'Resources' tab for detailed documentation on this. Is there anything specific about the current module you'd like to discuss?";
    };

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = { id: Date.now(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Prepare history for the backend (exclude current message)
            const history = messages.filter(m => m.id !== 1).map(m => ({
                sender: m.sender,
                text: m.text
            }));

            // Get token for auth
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:5001/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: userMsg.text,
                    history: history,
                    context: `Current Subject: ${selectedSubject.name}, Module: ${selectedSubject.modules[0]?.title || 'General'}`
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get response');
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: data.text }]);
        } catch (error) {
            console.warn('Backend AI failed, using local fallback:', error);
            // Fallback to local smart mock
            const fallbackResponse = getMockResponse(userMsg.text);

            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    sender: 'ai',
                    text: fallbackResponse
                }]);
            }, 500); // Small delay to simulate thinking
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenMaterial = (title: string, type: string) => {
        // Mock opening material
        if (type === 'video') {
            window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' tutorial')}`, '_blank');
        } else {
            // Create a dummy PDF blob and open it
            const content = `Course Material: ${title}\n\nThis is a placeholder document for demonstration purposes.`;
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        }
    };

    const handleDownload = (e: any, title: string) => {
        e.stopPropagation();

        // Create dummy content
        const content = `This is the downloaded content for: ${title}\n\nThank you for using EduTrack!`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        // Create temporary link and trigger click
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <DashboardLayout role="student">
            <div className="flex h-[calc(100vh-100px)] gap-6 overflow-hidden">

                {/* Main Content Area */}
                <div className={`flex-1 flex flex-col transition-all duration-300 ${isAiOpen ? 'w-2/3' : 'w-full'}`}>
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Course Materials</h1>
                        <p className="text-slate-600 dark:text-slate-400">Access your study resources and get AI assistance.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
                        {/* Subjects List */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white">
                                Subjects
                            </div>
                            <div className="overflow-y-auto flex-1 p-2 space-y-1">
                                {SUBJECTS.map(sub => (
                                    <button
                                        key={sub.id}
                                        onClick={() => setSelectedSubject(sub)}
                                        className={`w-full text-left p-3 rounded-xl flex items-center justify-between transition-colors ${selectedSubject.id === sub.id
                                            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-800 hover:text-slate-900 dark:text-white'
                                            }`}
                                    >
                                        <span className="font-medium">{sub.name}</span>
                                        <ChevronRight size={16} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Modules List */}
                        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                                <div>
                                    <h2 className="font-bold text-slate-900 dark:text-white">{selectedSubject.name}</h2>
                                    <span className="text-xs text-slate-500 font-mono">{selectedSubject.code}</span>
                                </div>
                                <button
                                    onClick={() => setIsAiOpen(!isAiOpen)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${isAiOpen ? 'bg-purple-600 text-slate-900 dark:text-white shadow-lg shadow-purple-500/25' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white'
                                        }`}
                                >
                                    <Sparkles size={16} />
                                    {isAiOpen ? 'Close AI Buddy' : 'Open AI Buddy'}
                                </button>
                            </div>

                            <div className="overflow-y-auto flex-1 p-6 space-y-4">
                                {selectedSubject.modules.length > 0 ? selectedSubject.modules.map((mod, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => handleOpenMaterial(mod.title, mod.type)}
                                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center gap-4 hover:border-blue-500/50 hover:bg-white dark:bg-slate-900 transition-all group cursor-pointer"
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${mod.type === 'video' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
                                            }`}>
                                            {mod.type === 'video' ? <PlayCircle size={24} /> : <FileText size={24} />}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:text-white transition-colors">{mod.title}</h3>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {mod.type === 'video' ? `Video • ${mod.duration}` : `Document • ${mod.pages} pages`}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => handleDownload(e, mod.title)}
                                            className="p-2 text-slate-500 hover:text-blue-400 transition-colors z-10"
                                        >
                                            <Download size={20} />
                                        </button>
                                    </div>
                                )) : (
                                    <div className="text-center py-12 text-slate-500">
                                        <Book size={48} className="mx-auto mb-4 opacity-20" />
                                        <p>No materials uploaded for this subject yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Sidebar */}
                {isAiOpen && (
                    <div className="w-[350px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-300 absolute right-0 top-0 h-full shadow-2xl z-20 md:relative md:h-auto md:shadow-none md:border-l-0 md:border md:rounded-2xl">
                        <div className="p-4 bg-gradient-to-r from-purple-900/50 to-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                                <Bot className="text-purple-400" /> AI Study Buddy
                            </div>
                            <button onClick={() => setIsAiOpen(false)} className="md:hidden text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/30">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                        ? 'bg-blue-600 text-slate-900 dark:text-white rounded-br-none'
                                        : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-300 dark:border-slate-700'
                                        }`}>
                                        {msg.sender === 'ai' ? (
                                            <div className="whitespace-pre-wrap">{msg.text}</div>
                                        ) : (
                                            msg.text
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 p-3 rounded-2xl rounded-bl-none border border-slate-300 dark:border-slate-700">
                                        <Loader2 className="animate-spin" size={16} />
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask anything..."
                                    disabled={isLoading}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full pl-4 pr-10 py-2.5 text-sm text-slate-900 dark:text-white focus:border-purple-500 outline-none disabled:opacity-50"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={isLoading}
                                    className="absolute right-1 top-1 p-1.5 bg-purple-600 hover:bg-purple-500 text-slate-900 dark:text-white rounded-full transition-colors disabled:opacity-50"
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout >
    );
};

export default CourseMaterials;
