import { useState, useEffect } from 'react';
import { CheckCircle, X, Loader } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import axios from 'axios';

interface Idea {
    _id: string;
    title: string;
    studentName: string;
    studentId: string;
    description: string;
    category?: string;
    status: 'pending' | 'approved' | 'rejected';
    votes?: number;
    feedback?: string;
    comments?: { user: string; text: string; date: string }[];
    createdAt: string;
}

const TeacherIdeaReview = () => {
    const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
    const [feedback, setFeedback] = useState('');
    const [commentText, setCommentText] = useState('');
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [loading, setLoading] = useState(true);

    // Load user-submitted ideas from localStorage (same as student dashboard)
    const getUserSubmittedIdeas = (): Idea[] => {
        const stored = localStorage.getItem('userSubmittedIdeas');
        return stored ? JSON.parse(stored) : [];
    };

    // Same default ideas as student Innovation Hub
    const DEFAULT_COMMUNITY_IDEAS: Idea[] = [
        {
            _id: 'mock-1',
            title: 'EduVR - Immersive History Lessons',
            studentName: 'Aarav Patel',
            studentId: 'student-1',
            category: 'Virtual Reality',
            status: 'approved',
            votes: 128,
            description: 'A VR platform that transports students back in time to witness historical events firsthand. \n\nTech Stack: Unity, C#, React 360, Node.js.\n\nWe are building a library of 50+ historical modules (e.g., French Revolution, Indus Valley Civilization) compatible with Oculus and Google Cardboard. Teachers can guide the tour while students explore freely.',
            comments: [
                { user: 'Sophia Li', text: 'This would have made history so much easier!', date: '2025-10-12T10:00:00Z' }
            ],
            createdAt: '2025-10-10T10:00:00Z'
        },
        {
            _id: 'mock-2',
            title: 'GreenCampus - Sustainability Tracker',
            studentName: 'Riya Sharma',
            studentId: 'student-2',
            category: 'Sustainability',
            status: 'pending',
            votes: 85,
            description: 'IoT-based system to monitor and optimize energy usage across campus buildings. \n\nTech Stack: Arduino, Python (Flask), React Native, MongoDB.\n\nFeatures include real-time power consumption graphs, gamified "energy saving" leaderboards for hostels, and automated alerts for water leakage.',
            comments: [],
            createdAt: '2025-10-15T10:00:00Z'
        },
        {
            _id: 'mock-3',
            title: 'CodeConnect - Peer Coding Platform',
            studentName: 'Ishaan Gupta',
            studentId: 'student-3',
            category: 'EdTech',
            status: 'approved',
            votes: 210,
            description: 'Real-time collaborative code editor with built-in video chat specifically designed for peer programming and mentorship within the college. \n\nTech Stack: React, Socket.io, WebRTC, Monaco Editor.\n\nUnlike VS Code Live Share, this matches seniors with juniors for specific debugging sessions based on skills.',
            comments: [
                { user: 'Admin', text: 'Great initiative! Let\'s discuss integration.', date: '2025-11-01T09:00:00Z' }
            ],
            createdAt: '2025-10-20T10:00:00Z'
        },
        {
            _id: 'mock-4',
            title: 'MediDrone - Campus First Aid',
            studentName: 'Karthik R',
            studentId: 'student-4',
            category: 'Robotics',
            status: 'rejected',
            votes: 45,
            description: 'Autonomous drones to deliver emergency first aid kits to any location on the extensive campus within 2 minutes. \n\nTech Stack: PX4 Autopilot, Raspberry Pi, Python (OpenCV).\n\n(Rejected due to regulatory constraints, but pivoting to ground rovers).',
            comments: [],
            createdAt: '2025-10-25T10:00:00Z'
        }
    ];

    useEffect(() => {
        fetchIdeas();
    }, []);

    const fetchIdeas = async () => {
        setLoading(true);
        try {
            // Get user-submitted ideas from localStorage
            const userSubmittedIdeas = getUserSubmittedIdeas();

            // Merge with default community ideas (same as student dashboard)
            const allIdeas = [...userSubmittedIdeas, ...DEFAULT_COMMUNITY_IDEAS];

            setIdeas(allIdeas);
        } catch (error) {
            console.error('Error fetching ideas:', error);
            // Fallback to just default ideas
            setIdeas(DEFAULT_COMMUNITY_IDEAS);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (status: 'approved' | 'rejected') => {
        if (!selectedIdea) return;

        if (status === 'rejected' && !feedback.trim()) {
            alert('Please provide feedback before rejecting.');
            return;
        }

        try {
            // Update the idea with new status and feedback
            const updatedIdea = {
                ...selectedIdea,
                status,
                feedback: feedback || selectedIdea.feedback
            };

            // Update in state
            const updatedIdeas = ideas.map(i => i._id === selectedIdea._id ? updatedIdea : i);
            setIdeas(updatedIdeas);

            // Update localStorage if it's a user-submitted idea (not a default mock)
            if (selectedIdea._id.startsWith('local-')) {
                const userSubmittedIdeas = getUserSubmittedIdeas();
                const updatedUserIdeas = userSubmittedIdeas.map(i =>
                    i._id === selectedIdea._id ? updatedIdea : i
                );
                localStorage.setItem('userSubmittedIdeas', JSON.stringify(updatedUserIdeas));
            }

            alert(`Idea ${status} successfully!`);
            setSelectedIdea(null);
            setFeedback('');

            // Try backend sync (optional)
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5001/api/innovation/${selectedIdea._id}/status`, {
                status,
                feedback: feedback
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Error updating status:', error);
            // Still works locally even if backend fails
        }
    };

    const handleAddComment = async () => {
        if (!selectedIdea || !commentText.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:5001/api/innovation/${selectedIdea._id}/comment`, {
                text: commentText
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local state
            const updatedIdea = response.data;
            setIdeas(ideas.map(i => i._id === selectedIdea._id ? updatedIdea : i));
            setSelectedIdea(updatedIdea); // Update selected idea to show new comment
            setCommentText('');
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment.');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/30';
            default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <DashboardLayout role="teacher">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Innovation Hub - Idea Review</h1>
                    <p className="text-slate-600 dark:text-slate-400">Review and provide feedback on student innovation projects</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm dark:shadow-none transition-colors">
                        <div className="text-slate-500 dark:text-slate-400 text-sm mb-1">Pending Review</div>
                        <div className="text-2xl font-bold text-yellow-500 dark:text-yellow-400">
                            {ideas.filter(i => i.status === 'pending').length}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm dark:shadow-none transition-colors">
                        <div className="text-slate-500 dark:text-slate-400 text-sm mb-1">Approved</div>
                        <div className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">
                            {ideas.filter(i => i.status === 'approved').length}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm dark:shadow-none transition-colors">
                        <div className="text-slate-500 dark:text-slate-400 text-sm mb-1">Total Submissions</div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{ideas.length}</div>
                    </div>
                </div>

                {/* Ideas Grid */}
                {loading ? (
                    <div className="flex justify-center py-12"><Loader className="animate-spin text-blue-500" size={32} /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {ideas.map((idea) => (
                            <div
                                key={idea._id}
                                onClick={() => setSelectedIdea(idea)}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-orange-500/50 dark:hover:border-orange-500/30 transition-all cursor-pointer group shadow-sm dark:shadow-none"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(idea.status)}`}>
                                        {idea.status.toUpperCase()}
                                    </span>
                                    <span className="text-xs text-slate-500">{formatDate(idea.createdAt)}</span>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                                    {idea.title}
                                </h3>

                                <div className="flex items-center gap-2 mb-3">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-slate-900 dark:text-white">
                                        {idea.studentName?.charAt(0) || 'S'}
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-700 dark:text-slate-300">{idea.studentName}</div>
                                    </div>
                                </div>

                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{idea.description}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Review Modal */}
                {selectedIdea && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transition-colors">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex-1">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedIdea.status)} inline-block mb-3`}>
                                        {selectedIdea.status.toUpperCase()}
                                    </span>
                                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{selectedIdea.title}</h2>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center font-bold text-slate-900 dark:text-white">
                                            {selectedIdea.studentName?.charAt(0) || 'S'}
                                        </div>
                                        <div>
                                            <div className="text-slate-900 dark:text-slate-300">{selectedIdea.studentName}</div>
                                            <div className="text-sm text-slate-500">Submitted on {formatDate(selectedIdea.createdAt)}</div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedIdea(null)}
                                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-900 dark:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Description</h3>
                                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{selectedIdea.description}</p>
                                </div>

                                {/* Comments Section */}
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Comments & Feedback</h3>

                                    {selectedIdea.comments && selectedIdea.comments.length > 0 ? (
                                        <div className="space-y-4 mb-6">
                                            {selectedIdea.comments.map((comment, idx) => (
                                                <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-bold text-sm text-slate-900 dark:text-white">{comment.user}</span>
                                                        <span className="text-xs text-slate-500">{new Date(comment.date).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-slate-700 dark:text-slate-300 text-sm">{comment.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-slate-500 text-sm mb-6 italic">No comments yet.</div>
                                    )}

                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            placeholder="Add a comment..."
                                            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                                        />
                                        <button
                                            onClick={handleAddComment}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Comment
                                        </button>
                                    </div>
                                </div>

                                {selectedIdea.status === 'pending' && (
                                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Review Action</h3>
                                        <div>
                                            <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">Official Feedback (Required for Rejection)</label>
                                            <textarea
                                                value={feedback}
                                                onChange={(e) => setFeedback(e.target.value)}
                                                placeholder="Provide official feedback for the student..."
                                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none h-24 transition-colors"
                                            />
                                        </div>

                                        <div className="flex gap-3 pt-4">
                                            <button
                                                onClick={() => handleUpdateStatus('rejected')}
                                                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-500 text-slate-900 dark:text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                <X size={18} />
                                                Reject Idea
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus('approved')}
                                                className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-900 dark:text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle size={18} />
                                                Approve Idea
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {selectedIdea.status !== 'pending' && (
                                    <div className="pt-4 space-y-4">
                                        {selectedIdea.feedback && (
                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Official Feedback:</h3>
                                                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                                                    {selectedIdea.feedback}
                                                </div>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => setSelectedIdea(null)}
                                            className="w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-medium transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default TeacherIdeaReview;
