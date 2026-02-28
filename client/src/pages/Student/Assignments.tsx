import { useState } from 'react';
import { FileText, Upload, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const ASSIGNMENTS = [
    { id: 1, subject: 'Data Structures', title: 'Implement AVL Tree', deadline: '2024-10-15', status: 'Pending', color: 'text-yellow-400' },
    { id: 2, subject: 'DBMS', title: 'Normalization Case Study', deadline: '2024-10-10', status: 'Submitted', color: 'text-green-400' },
    { id: 3, subject: 'Web Dev', title: 'React Portfolio', deadline: '2024-09-30', status: 'Late', color: 'text-red-400' },
];


const SUBMITTED_ASSIGNMENTS = [
    { id: 101, subject: 'DBMS', title: 'Normalization Case Study', submittedDate: '2024-10-09', marks: '9/10', feedback: 'Excellent analysis of 3NF.' },
    { id: 102, subject: 'Web Dev', title: 'HTML5 Semantic Layout', submittedDate: '2024-09-15', marks: '8.5/10', feedback: 'Good structure, fix indentation.' },
    { id: 103, subject: 'Python', title: 'Data Scraping Script', submittedDate: '2024-09-01', marks: '9/10', feedback: 'Efficient code.' },
];

const Assignments = () => {
    const [activeTab, setActiveTab] = useState<'pending' | 'submitted'>('pending');
    const [uploadModal, setUploadModal] = useState<number | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            alert(`File "${selectedFile.name}" uploaded successfully!`);
            setUploadModal(null);
            setSelectedFile(null);
        }
    };

    return (
        <DashboardLayout role="student">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Assignments</h1>
                        <p className="text-slate-400">Manage your submissions and deadlines.</p>
                    </div>
                    {/* Tab Switcher */}
                    <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1">
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'pending' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Assigned
                        </button>
                        <button
                            onClick={() => setActiveTab('submitted')}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'submitted' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Submissions & Grades
                        </button>
                    </div>
                </div>

                {activeTab === 'pending' ? (
                    <div className="grid gap-4">
                        {ASSIGNMENTS.filter(a => a.status !== 'Submitted').length === 0 && (
                            <p className="text-center text-slate-500 py-8">No pending assignments!</p>
                        )}
                        {ASSIGNMENTS.filter(a => a.status !== 'Submitted').map((item) => (
                            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center justify-between hover:border-slate-700 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-800 rounded-lg text-blue-400">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-slate-100">{item.title}</h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                            <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{item.subject}</span>
                                            <span>• Due: {item.deadline}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className={`flex items-center gap-2 font-medium ${item.color}`}>
                                        {item.status === 'Pending' && <Clock size={18} />}
                                        {item.status === 'Late' && <AlertCircle size={18} />}
                                        {item.status}
                                    </div>

                                    <button
                                        onClick={() => setUploadModal(item.id)}
                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <Upload size={16} /> Upload
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {SUBMITTED_ASSIGNMENTS.map((item) => (
                            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center justify-between hover:border-slate-700 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                                        <CheckCircle size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-slate-100">{item.title}</h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                            <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{item.subject}</span>
                                            <span>• Submitted: {item.submittedDate}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Feedback: "{item.feedback}"</p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-1">
                                    <div className="text-sm text-slate-400 font-bold uppercase tracking-wider">Marks</div>
                                    <div className="text-2xl font-bold text-emerald-400">{item.marks}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Upload Modal */}
                {uploadModal !== null && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-white">Upload Assignment</h3>
                                <button onClick={() => setUploadModal(null)} className="text-slate-400 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Select File</label>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept=".pdf,.doc,.docx,.zip"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-500"
                                    />
                                    {selectedFile && (
                                        <p className="text-sm text-green-400 mt-2">Selected: {selectedFile.name}</p>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => setUploadModal(null)}
                                        className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpload}
                                        disabled={!selectedFile}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Upload
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Assignments;
