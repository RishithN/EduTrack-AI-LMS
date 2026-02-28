import { useState, useEffect } from 'react';
import { Calendar, Video, Send, Clock } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { communicationStore } from '../../data/communicationStore';
import type { MeetingRequest, ChatMessage } from '../../data/communicationStore';

const ParentCommunication = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    // Meeting Request State
    const [meetingForm, setMeetingForm] = useState({
        reason: 'Academic Performance',
        date: '',
        time: ''
    });
    const [sentRequests, setSentRequests] = useState<MeetingRequest[]>([]);

    useEffect(() => {
        // Load initial data
        setMessages(communicationStore.getChat());
        setSentRequests(communicationStore.getMeetings());

        // Simple polling to keep data in sync
        const interval = setInterval(() => {
            setMessages(communicationStore.getChat());
            setSentRequests(communicationStore.getMeetings());
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleSend = () => {
        if (!message.trim()) return;
        const updated = communicationStore.addMessage(message, 'parent');
        setMessages(updated);
        setMessage('');
    };

    const handleScheduleMeeting = () => {
        if (!meetingForm.date || !meetingForm.time) {
            alert('Please select both date and time.');
            return;
        }

        communicationStore.addMeeting({
            reason: meetingForm.reason,
            date: meetingForm.date,
            time: meetingForm.time
        });

        // Update local list immediately
        setSentRequests(communicationStore.getMeetings());

        // Reset form
        setMeetingForm({ ...meetingForm, date: '', time: '' });
        alert('Meeting request sent successfully!');
    };

    return (
        <DashboardLayout role="parent">
            <div className="h-[calc(100vh-100px)] flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white">Communication</h1>
                    <p className="text-slate-400">Chat with teachers or schedule meetings.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 flex-1 min-h-0">
                    {/* Chat Section */}
                    <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                                    KP
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Prof. K. Priya</h3>
                                    <p className="text-xs text-slate-400">Class Mentor</p>
                                </div>
                            </div>
                            <button className="text-slate-400 hover:text-white">
                                <Video size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'parent' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] p-3 rounded-2xl ${msg.sender === 'parent'
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
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-slate-900 border border-slate-800 rounded-full px-4 text-white focus:outline-none focus:border-purple-500 block"
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button
                                onClick={handleSend}
                                className="p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Schedule Meeting & Sent Requests */}
                    <div className="flex flex-col gap-6 h-full overflow-hidden">
                        {/* Form */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit shrink-0">
                            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                                <Calendar className="text-purple-400" /> Request Meeting
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Reason</label>
                                    <select
                                        value={meetingForm.reason}
                                        onChange={(e) => setMeetingForm({ ...meetingForm, reason: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 text-sm focus:border-purple-500 outline-none"
                                    >
                                        <option>Academic Performance</option>
                                        <option>Attendance Issue</option>
                                        <option>Behavioral Concern</option>
                                        <option>General Update</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Preferred Date</label>
                                    <input
                                        type="date"
                                        value={meetingForm.date}
                                        onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 text-sm focus:border-purple-500 outline-none"
                                        style={{ colorScheme: 'dark' }}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Preferred Time</label>
                                    <input
                                        type="time"
                                        value={meetingForm.time}
                                        onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 text-sm focus:border-purple-500 outline-none"
                                        style={{ colorScheme: 'dark' }}
                                    />
                                </div>
                                <button
                                    onClick={handleScheduleMeeting}
                                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg mt-2 hover:opacity-90 transition-opacity"
                                >
                                    Send Request
                                </button>
                            </div>
                        </div>

                        {/* Recent Requests List */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex-1 overflow-y-auto min-h-[200px]">
                            <h4 className="text-sm font-bold text-white mb-3">Sent Requests</h4>
                            <div className="space-y-3">
                                {sentRequests.length === 0 ? (
                                    <p className="text-xs text-slate-500 text-center py-4">No requests sent yet.</p>
                                ) : (
                                    sentRequests.map((req) => (
                                        <div key={req.id} className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${req.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                                    req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                                                        'bg-red-500/10 text-red-500'
                                                    }`}>
                                                    {req.status}
                                                </div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Clock size={10} /> {new Date(req.requestDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="text-sm font-bold text-white mb-1">{req.reason}</div>
                                            <div className="text-xs text-slate-400 flex items-center gap-2">
                                                <span>{req.date}</span> • <span>{req.time}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ParentCommunication;
