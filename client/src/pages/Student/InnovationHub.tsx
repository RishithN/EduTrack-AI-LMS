import { useState, useEffect } from 'react';
import { Rocket, Plus, MessageSquare, Lightbulb, Loader, X, ThumbsUp, ThumbsDown } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../api/axios';

interface Idea {
    _id: string;
    title: string;
    studentName: string;
    description: string;
    category?: string;
    status: 'pending' | 'approved' | 'rejected';
    votes: number;
    comments: { user: string; text: string; date: string }[];
    feedback?: string;
    votedBy?: string[];
}

const InnovationHub = () => {
    const [viewMode, setViewMode] = useState<'my-ideas' | 'community'>('my-ideas');
    const [showForm, setShowForm] = useState(false);
    const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down' | null>>({});

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Artificial Intelligence',
        techStack: ''
    });

    // Load user-submitted ideas from localStorage
    const getUserSubmittedIdeas = (): Idea[] => {
        const stored = localStorage.getItem('userSubmittedIdeas');
        return stored ? JSON.parse(stored) : [];
    };

    // Save user-submitted ideas to localStorage
    const saveUserSubmittedIdeas = (ideas: Idea[]) => {
        localStorage.setItem('userSubmittedIdeas', JSON.stringify(ideas));
    };

    // Default Community Ideas (Mock Data for Demo)
    const DEFAULT_COMMUNITY_IDEAS: Idea[] = [
        {
            _id: 'mock-1',
            title: 'EduVR - Immersive History Lessons',
            studentName: 'Aarav Patel',
            category: 'Virtual Reality',
            status: 'approved',
            votes: 128,
            description: 'A VR platform that transports students back in time to witness historical events firsthand. \n\nTech Stack: Unity, C#, React 360, Node.js.\n\nWe are building a library of 50+ historical modules (e.g., French Revolution, Indus Valley Civilization) compatible with Oculus and Google Cardboard. Teachers can guide the tour while students explore freely.',
            comments: [
                { user: 'Sophia Li', text: 'This would have made history so much easier!', date: '2025-10-12T10:00:00Z' }
            ]
        },
        {
            _id: 'mock-2',
            title: 'GreenCampus - Sustainability Tracker',
            studentName: 'Riya Sharma',
            category: 'Sustainability',
            status: 'pending',
            votes: 85,
            description: 'IoT-based system to monitor and optimize energy usage across campus buildings. \n\nTech Stack: Arduino, Python (Flask), React Native, MongoDB.\n\nFeatures include real-time power consumption graphs, gamified "energy saving" leaderboards for hostels, and automated alerts for water leakage.',
            comments: []
        },
        {
            _id: 'mock-3',
            title: 'CodeConnect - Peer Coding Platform',
            studentName: 'Ishaan Gupta',
            category: 'EdTech',
            status: 'approved',
            votes: 210,
            description: 'Real-time collaborative code editor with built-in video chat specifically designed for peer programming and mentorship within the college. \n\nTech Stack: React, Socket.io, WebRTC, Monaco Editor.\n\nUnlike VS Code Live Share, this matches seniors with juniors for specific debugging sessions based on skills.',
            comments: [
                { user: 'Admin', text: 'Great initiative! Let\'s discuss integration.', date: '2025-11-01T09:00:00Z' }
            ]
        },
        {
            _id: 'mock-4',
            title: 'MediDrone - Campus First Aid',
            studentName: 'Karthik R',
            category: 'Robotics',
            status: 'rejected',
            votes: 45,
            description: 'Autonomous drones to deliver emergency first aid kits to any location on the extensive campus within 2 minutes. \n\nTech Stack: PX4 Autopilot, Raspberry Pi, Python (OpenCV).\n\n(Rejected due to regulatory constraints, but pivoting to ground rovers).',
            comments: []
        }
    ];

    useEffect(() => {
        const userSubmittedIdeas = getUserSubmittedIdeas();

        if (viewMode === 'community') {
            // For community view, show user-submitted ideas + default mock ideas
            const mergedIdeas = [...userSubmittedIdeas, ...DEFAULT_COMMUNITY_IDEAS];
            setIdeas(mergedIdeas);
            setLoading(false);
        } else {
            // For my-ideas view, show only user-submitted ideas
            setIdeas(userSubmittedIdeas);
            setLoading(false);
        }
    }, [viewMode]);

    const fetchIdeas = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const endpoint = '/innovation/my-ideas'; // Only fetch my ideas from backend

            const response = await api.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIdeas(response.data);
        } catch (error) {
            console.error('Error fetching ideas:', error);
            // Fallback for demo if backend fails
            if (viewMode === 'my-ideas') setIdeas([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        const newIdea: Idea = {
            _id: `local-${Date.now()}`,
            title: formData.title,
            studentName: 'You',
            description: `${formData.description}\n\nCategory: ${formData.category}\nTech Stack: ${formData.techStack}`,
            category: formData.category,
            status: 'pending',
            votes: 0,
            comments: []
        };

        // Save to localStorage first
        const existingIdeas = getUserSubmittedIdeas();
        const updatedIdeas = [newIdea, ...existingIdeas];
        saveUserSubmittedIdeas(updatedIdeas);

        // Update UI immediately
        setIdeas(prev => [newIdea, ...prev]);
        setShowForm(false);
        setFormData({ title: '', description: '', category: 'Artificial Intelligence', techStack: '' });

        // Try to submit to backend (optional)
        try {
            const token = localStorage.getItem('token');
            await api.post('/innovation/submit', {
                title: formData.title,
                description: `${formData.description}\n\nCategory: ${formData.category}\nTech Stack: ${formData.techStack}`,
                category: formData.category
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Idea submitted successfully!');
        } catch (error) {
            console.error('Error submitting to backend:', error);
            alert('Idea submitted successfully (Saved Locally)!');
        }
    };

    const handleUpvote = async (e: React.MouseEvent, ideaId: string) => {
        e.stopPropagation();

        // Check if already voted
        if (userVotes[ideaId]) {
            return; // Already voted, do nothing
        }

        // Mark as voted
        setUserVotes(prev => ({ ...prev, [ideaId]: 'up' }));

        // Optimistic UI Update for Demo
        const updateLocalIdeas = (list: Idea[]) => {
            return list.map(idea =>
                idea._id === ideaId ? { ...idea, votes: (idea.votes || 0) + 1 } : idea
            );
        };

        setIdeas(prev => updateLocalIdeas(prev));
        if (selectedIdea && selectedIdea._id === ideaId) {
            setSelectedIdea(prev => prev ? { ...prev, votes: (prev.votes || 0) + 1 } : null);
        }

        // Attempt backend sync (silent fail is ok for demo)
        try {
            const token = localStorage.getItem('token');
            await api.put(`/innovation/${ideaId}/upvote`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.log('Backend upvote failed (expected for mock data)');
        }
    };

    const handleDownvote = async (e: React.MouseEvent, ideaId: string) => {
        e.stopPropagation();

        // Check if already voted
        if (userVotes[ideaId]) {
            return; // Already voted, do nothing
        }

        // Mark as voted
        setUserVotes(prev => ({ ...prev, [ideaId]: 'down' }));

        // Optimistic UI Update for Demo
        const updateLocalIdeas = (list: Idea[]) => {
            return list.map(idea =>
                idea._id === ideaId ? { ...idea, votes: Math.max(0, (idea.votes || 0) - 1) } : idea
            );
        };

        setIdeas(prev => updateLocalIdeas(prev));
        if (selectedIdea && selectedIdea._id === ideaId) {
            setSelectedIdea(prev => prev ? { ...prev, votes: Math.max(0, (prev.votes || 0) - 1) } : null);
        }

        // Attempt backend sync (silent fail is ok for demo)
        try {
            const token = localStorage.getItem('token');
            await api.put(`/innovation/${ideaId}/downvote`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.log('Backend downvote failed (expected for mock data)');
        }
    };

    const handleComment = async () => {
        if (!selectedIdea || !commentText.trim()) return;

        const newComment = {
            user: 'Me',
            text: commentText,
            date: new Date().toISOString()
        };

        // Update Local State
        const updatedIdea = {
            ...selectedIdea,
            comments: [...(selectedIdea.comments || []), newComment]
        };

        setSelectedIdea(updatedIdea);
        setIdeas(prev => prev.map(i => i._id === selectedIdea._id ? updatedIdea : i));
        setCommentText('');

        try {
            const token = localStorage.getItem('token');
            await api.post(`/innovation/${selectedIdea._id}/comment`, {
                text: commentText
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.log('Backend comment failed (expected for mock data)');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
            case 'rejected': return 'text-red-400 border-red-500/30 bg-red-500/10';
            default: return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
        }
    };

    return (
        <DashboardLayout role="student">
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold font-display bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent flex items-center gap-3">
                            <Rocket className="text-orange-500" size={40} />
                            Innovation Hub
                        </h1>
                        <p className="text-slate-400 mt-2 text-lg">Where brilliant ideas take flight. Pitch, vote, and collaborate.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex bg-slate-900/50 backdrop-blur-md rounded-full p-1 border border-slate-700/50">
                            <button
                                onClick={() => setViewMode('my-ideas')}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${viewMode === 'my-ideas'
                                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/25'
                                    : 'text-slate-400 hover:text-white'}`}
                            >
                                My Ideas
                            </button>
                            <button
                                onClick={() => setViewMode('community')}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${viewMode === 'community'
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                                    : 'text-slate-400 hover:text-white'}`}
                            >
                                Community Feed
                            </button>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-white text-black hover:bg-slate-200 px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-xl shadow-white/10"
                        >
                            <Plus size={20} /> New Idea
                        </button>
                    </div>
                </div>

                {/* Submit Form Overlay/Area */}
                {showForm && (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl animate-in fade-in slide-in-from-top-4 shadow-sm dark:shadow-none">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">New Project Idea</h3>
                        <form className="space-y-4">
                            <div>
                                <label className="text-sm text-slate-600 dark:text-slate-400">Project Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-colors"
                                    placeholder="e.g. AI Traffic Light"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-600 dark:text-slate-400">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none h-24 transition-colors"
                                    placeholder="Briefly describe your innovation..."
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-slate-600 dark:text-slate-400">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-colors"
                                    >
                                        <option>Artificial Intelligence</option>
                                        <option>Web & App Dev</option>
                                        <option>IoT & Robotics</option>
                                        <option>Blockchain</option>
                                        <option>Cyber Security</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm text-slate-600 dark:text-slate-400">Tech Stack (comma separated)</label>
                                    <input
                                        type="text"
                                        value={formData.techStack}
                                        onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-colors"
                                        placeholder="React, Python, AWS"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Cancel</button>
                                <button type="button" onClick={handleSubmit} className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-500">Post Idea</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Ideas Grid */}
                {loading ? (
                    <div className="flex justify-center py-12"><Loader className="animate-spin text-orange-500" size={32} /></div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ideas.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">
                                {viewMode === 'my-ideas' ? "You haven't submitted any ideas yet." : "No community ideas yet."}
                            </div>
                        ) : (
                            ideas.map((idea) => (
                                <div
                                    key={idea._id}
                                    onClick={() => setSelectedIdea(idea)}
                                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-orange-500/30 hover:shadow-lg transition-all group relative overflow-hidden cursor-pointer shadow-sm dark:shadow-none"
                                >
                                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Lightbulb size={100} className="text-slate-900 dark:text-white" />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded border ${getStatusColor(idea.status)}`}>
                                                {idea.status.toUpperCase()}
                                            </span>
                                            {viewMode === 'community' && (
                                                <span className="text-xs text-slate-500 dark:text-slate-400">by {idea.studentName}</span>
                                            )}
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                                            {idea.title}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3">
                                            {idea.description}
                                        </p>

                                        <div className="flex items-center gap-4 mt-4">
                                            <button
                                                onClick={(e) => handleUpvote(e, idea._id)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${userVotes[idea._id] === 'up'
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                    : 'bg-slate-800/50 text-slate-400 hover:bg-green-500/10 hover:text-green-400 border border-slate-700'
                                                    }`}
                                                disabled={!!userVotes[idea._id]}
                                            >
                                                <ThumbsUp size={18} />
                                                <span className="font-bold">{idea.votes}</span>
                                            </button>
                                            <button
                                                onClick={(e) => handleDownvote(e, idea._id)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${userVotes[idea._id] === 'down'
                                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                    : 'bg-slate-800/50 text-slate-400 hover:bg-red-500/10 hover:text-red-400 border border-slate-700'
                                                    }`}
                                                disabled={!!userVotes[idea._id]}
                                            >
                                                <ThumbsDown size={18} />
                                            </button>
                                            <button className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
                                                <MessageSquare size={18} />
                                                <span>{idea.comments?.length || 0}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Idea Detail Modal */}
                {selectedIdea && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transition-colors">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`text-xs font-bold px-2 py-1 rounded border ${getStatusColor(selectedIdea.status)}`}>
                                            {selectedIdea.status.toUpperCase()}
                                        </span>
                                        <span className="text-sm text-slate-500 dark:text-slate-400">Posted by {selectedIdea.studentName}</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-3 mb-2">{selectedIdea.title}</h2>
                                </div>
                                <button onClick={() => setSelectedIdea(null)} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Description</h3>
                                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{selectedIdea.description}</p>
                                </div>

                                {selectedIdea.feedback && viewMode === 'my-ideas' && (
                                    <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Teacher Feedback</h3>
                                        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                                            {selectedIdea.feedback}
                                        </div>
                                    </div>
                                )}

                                {/* Comments Section */}
                                <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Comments</h3>
                                    <div className="space-y-4 mb-4">
                                        {selectedIdea.comments?.length > 0 ? (
                                            selectedIdea.comments.map((comment: any, idx: number) => (
                                                <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                                                    <div className="flex justify-between mb-1">
                                                        <span className="font-bold text-slate-900 dark:text-slate-200 text-sm">{comment.user}</span>
                                                        <span className="text-xs text-slate-500">{new Date(comment.date).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-slate-700 dark:text-slate-400 text-sm">{comment.text}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-slate-500 text-sm italic">No comments yet.</p>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <input
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            placeholder="Add a comment..."
                                            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                                            onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                                        />
                                        <button
                                            onClick={handleComment}
                                            className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                                        >
                                            Post
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default InnovationHub;
