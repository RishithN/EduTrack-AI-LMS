import { useState, useEffect } from 'react';
import { MessageSquare, Calendar, Check, X, Clock, Send } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { communicationStore } from '../../data/communicationStore';
import type { MeetingRequest, ChatMessage } from '../../data/communicationStore';

const TeacherCommunication = () => {
    const [activeTab, setActiveTab] = useState<'requests' | 'chat'>('requests');
    const [requests, setRequests] = useState<MeetingRequest[]>([]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<MeetingRequest | null>(null);

    useEffect(() => {
        // Load initial data
        setRequests(communicationStore.getMeetings());
        setChatMessages(communicationStore.getChat());

        // Simple polling to keep data roughly in sync without context/sockets
        const interval = setInterval(() => {
            setRequests(communicationStore.getMeetings());
            setChatMessages(communicationStore.getChat());
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleStatusUpdate = (id: number, status: 'approved' | 'rejected') => {
        const updated = communicationStore.updateMeetingStatus(id, status);
        setRequests(updated);
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        const updated = communicationStore.addMessage(newMessage, 'teacher');
        setChatMessages(updated);
        setNewMessage('');
    };

    return (
        <DashboardLayout role="teacher">
            <div className="h-[calc(100vh-100px)] flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        <MessageSquare className="text-purple-500" />
                        Parent Communication
                    </h1>
                    <p className="text-slate-400">Manage meeting requests and chat with parents.</p>
                </div>

                <div className="flex gap-4 border-b border-slate-800 pb-1">
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`pb-3 px-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'requests' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-white'}`}
                    >
                        Meeting Requests
                        {requests.filter(r => r.status === 'pending').length > 0 && (
                            <span className="ml-2 bg-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                {requests.filter(r => r.status === 'pending').length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('chat')}
                        className={`pb-3 px-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'chat' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-white'}`}
                    >
                        Chat
                    </button>
                </div>

                {activeTab === 'requests' ? (
                    <div className="grid gap-4">
                        {requests.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 border border-slate-800 rounded-xl border-dashed">
                                No meeting requests found.
                            </div>
                        ) : (
                            requests.map((req) => (
                                <div
                                    key={req.id}
                                    onClick={() => setSelectedRequest(req)}
                                    className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-blue-500/50 cursor-pointer transition-all group"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${req.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                    'bg-red-500/10 text-red-500 border-red-500/20'
                                                }`}>
                                                {req.status}
                                            </span>
                                            <span className="text-slate-500 text-xs flex items-center gap-1">
                                                <Clock size={12} />
                                                Requested {new Date(req.requestDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">{req.reason}</h3>
                                        <p className="text-slate-400 text-sm mt-1">
                                            With <span className="text-white font-medium">{req.parentName}</span> (Parent of {req.studentName})
                                        </p>
                                        <div className="flex items-center gap-4 mt-3 text-sm text-slate-300">
                                            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                                                <Calendar size={14} className="text-purple-400" />
                                                {req.date}
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                                                <Clock size={14} className="text-purple-400" />
                                                {req.time}
                                            </div>
                                        </div>
                                    </div>

                                    {req.status === 'pending' && (
                                        <div className="flex items-center gap-3 self-end md:self-center" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => handleStatusUpdate(req.id, 'rejected')}
                                                className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 transition-all group"
                                                title="Reject Request"
                                            >
                                                <X size={20} className="group-hover:scale-110 transition-transform" />
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(req.id, 'approved')}
                                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                                            >
                                                <Check size={18} />
                                                Approve Meeting
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                    MV
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Mr. Verma</h3>
                                    <p className="text-xs text-slate-400">Parent of Arjun</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {chatMessages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.sender === 'teacher' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] p-3 rounded-2xl ${msg.sender === 'teacher'
                                        ? 'bg-purple-600 text-white rounded-tr-none'
                                        : 'bg-slate-800 text-slate-200 rounded-tl-none'
                                        }`}>
                                        <p className="text-sm">{msg.text}</p>
                                        <span className="text-[10px] opacity-70 mt-1 block">{msg.timestamp}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-slate-900 border border-slate-800 rounded-full px-4 text-white focus:outline-none focus:border-purple-500 block"
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button
                                onClick={handleSendMessage}
                                className="p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {/* Meeting Details Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">Meeting Details</h2>
                                <p className="text-slate-400 text-sm">Request ID: #{selectedRequest.id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Subject</h3>
                                <p className="text-lg font-medium text-white">{selectedRequest.reason}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Calendar size={14} className="text-purple-400" />
                                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Date</span>
                                    </div>
                                    <p className="font-medium text-white">{selectedRequest.date}</p>
                                </div>
                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Clock size={14} className="text-purple-400" />
                                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Time</span>
                                    </div>
                                    <p className="font-medium text-white">{selectedRequest.time}</p>
                                </div>
                            </div>

                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-3">Participants</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                                            P
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{selectedRequest.parentName}</div>
                                            <div className="text-xs text-slate-500">Parent</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                                            S
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{selectedRequest.studentName}</div>
                                            <div className="text-xs text-slate-500">Student</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                                <div>
                                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Location</h3>
                                    <p className="text-white font-medium">Room 302, Main Block</p>
                                </div>
                                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                                    <MessageSquare size={20} className="text-slate-400" />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setSelectedRequest(null)}
                                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
                                >
                                    Close
                                </button>
                                {selectedRequest.status === 'pending' && (
                                    <button
                                        onClick={() => {
                                            handleStatusUpdate(selectedRequest.id, 'approved');
                                            setSelectedRequest(null);
                                        }}
                                        className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white rounded-xl font-bold transition-opacity"
                                    >
                                        Approve
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default TeacherCommunication;
