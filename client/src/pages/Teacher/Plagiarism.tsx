import { useState } from 'react';
import { Upload, FileText, Search, X } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const SAMPLE_SUBMISSIONS = [
    {
        id: 1,
        studentName: 'Arjun Verma',
        studentId: 'CSE-001',
        assignment: 'Data Structures Implementation',
        submittedDate: '2024-10-14',
        plagiarismScore: 12,
        status: 'safe',
        matchedSources: ['Stack Overflow (8%)', 'GitHub (4%)']
    },
    {
        id: 2,
        studentName: 'Priya Sharma',
        studentId: 'CSE-002',
        assignment: 'Database Schema Design',
        submittedDate: '2024-10-14',
        plagiarismScore: 68,
        status: 'high',
        matchedSources: ['GeeksforGeeks (45%)', 'Tutorial Point (23%)']
    },
    {
        id: 3,
        studentName: 'Rohan Kumar',
        studentId: 'CSE-003',
        assignment: 'React Frontend Project',
        submittedDate: '2024-10-13',
        plagiarismScore: 35,
        status: 'moderate',
        matchedSources: ['React Docs (20%)', 'Medium Article (15%)']
    }
];

const TeacherPlagiarism = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [submissions] = useState(SAMPLE_SUBMISSIONS);
    const [selectedSubmission, setSelectedSubmission] = useState<typeof SAMPLE_SUBMISSIONS[0] | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const checkPlagiarism = () => {
        if (!file) return;
        setIsChecking(true);

        // Simulate plagiarism check
        setTimeout(() => {
            setIsChecking(false);
            const score = Math.floor(Math.random() * 100);
            setResults({
                fileName: file.name,
                plagiarismScore: score,
                status: score < 20 ? 'safe' : score < 50 ? 'moderate' : 'high',
                matchedSources: [
                    `Source 1 (${Math.floor(Math.random() * 30)}%)`,
                    `Source 2 (${Math.floor(Math.random() * 20)}%)`,
                    `Source 3 (${Math.floor(Math.random() * 15)}%)`
                ],
                checkedDate: new Date().toLocaleDateString()
            });

            // Show warning if plagiarism is above 20%
            if (score > 20) {
                alert(`⚠️ High Plagiarism Detected (${score}%)!\n\nPlease inform the student to resubmit the assignment with original work.`);
            }
        }, 2500);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'safe': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            case 'moderate': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
            case 'high': return 'bg-red-500/10 text-red-400 border-red-500/30';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
        }
    };

    const getScoreColor = (score: number) => {
        if (score < 20) return 'text-emerald-400';
        if (score < 50) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <DashboardLayout role="teacher">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-white">Plagiarism Checker</h1>
                    <p className="text-slate-400">Check student submissions for plagiarism and originality</p>
                </div>

                {/* Upload Section */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-white mb-4">Upload Document to Check</h2>

                    <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-purple-500/50 transition-colors">
                        <Upload size={48} className="mx-auto text-slate-500 mb-4" />

                        {file ? (
                            <div className="mb-4">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg border border-purple-500/30">
                                    <FileText size={16} />
                                    {file.name}
                                </div>
                                <button
                                    onClick={() => setFile(null)}
                                    className="block mx-auto mt-2 text-sm text-red-400 hover:text-red-300"
                                >
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-lg font-medium text-white mb-2">Upload Student Submission</h3>
                                <p className="text-slate-500 mb-4">Supported formats: PDF, DOCX, TXT</p>
                            </>
                        )}

                        <input
                            type="file"
                            onChange={handleFileUpload}
                            accept=".pdf,.docx,.txt"
                            className="hidden"
                            id="plagiarism-upload"
                        />

                        {!file && (
                            <label
                                htmlFor="plagiarism-upload"
                                className="inline-block px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium cursor-pointer transition-colors"
                            >
                                Browse Files
                            </label>
                        )}
                    </div>

                    {file && (
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={checkPlagiarism}
                                disabled={isChecking}
                                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg shadow-purple-600/20 transition-all flex items-center gap-2"
                            >
                                <Search size={18} />
                                {isChecking ? 'Checking...' : 'Check Plagiarism'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Results Section */}
                {results && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-xl font-bold text-white mb-4">Plagiarism Check Results</h2>

                        <div className="bg-slate-950 p-6 rounded-lg border border-slate-800 mb-4">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="text-slate-400 text-sm">Document</div>
                                    <div className="text-white font-medium">{results.fileName}</div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(results.status)}`}>
                                    {results.status.toUpperCase()}
                                </span>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-slate-400 text-sm">Plagiarism Score</span>
                                    <span className={`text-3xl font-bold ${getScoreColor(results.plagiarismScore)}`}>
                                        {results.plagiarismScore}%
                                    </span>
                                </div>
                                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${results.plagiarismScore < 20 ? 'bg-emerald-500' : results.plagiarismScore < 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                        style={{ width: `${results.plagiarismScore}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="text-slate-400 text-sm mb-2">Matched Sources:</div>
                                <div className="space-y-1">
                                    {results.matchedSources.map((source: string, idx: number) => (
                                        <div key={idx} className="text-slate-300 text-sm flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                                            {source}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setResults(null);
                                setFile(null);
                            }}
                            className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Check Another Document
                        </button>
                    </div>
                )}

                {/* Previous Submissions */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Recent Plagiarism Checks</h2>
                    <div className="space-y-3">
                        {submissions.map((sub) => (
                            <div
                                key={sub.id}
                                onClick={() => setSelectedSubmission(sub)}
                                className="bg-slate-950 p-4 rounded-lg border border-slate-800 hover:border-purple-500/30 transition-all cursor-pointer"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-600 flex items-center justify-center font-bold text-white">
                                            {sub.studentName.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-white font-medium">{sub.studentName}</div>
                                            <div className="text-xs text-slate-500">{sub.studentId} • {sub.assignment}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className={`text-2xl font-bold ${getScoreColor(sub.plagiarismScore)}`}>
                                                {sub.plagiarismScore}%
                                            </div>
                                            <div className="text-xs text-slate-500">{sub.submittedDate}</div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(sub.status)}`}>
                                            {sub.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detail Modal */}
                {selectedSubmission && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-2xl w-full">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Plagiarism Report</h2>
                                    <p className="text-slate-400">{selectedSubmission.assignment}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedSubmission(null)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 mb-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-600 flex items-center justify-center font-bold text-white">
                                        {selectedSubmission.studentName.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">{selectedSubmission.studentName}</div>
                                        <div className="text-sm text-slate-500">{selectedSubmission.studentId}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div>
                                        <div className="text-slate-400 text-sm">Plagiarism Score</div>
                                        <div className={`text-2xl font-bold ${getScoreColor(selectedSubmission.plagiarismScore)}`}>
                                            {selectedSubmission.plagiarismScore}%
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-slate-400 text-sm">Status</div>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedSubmission.status)} mt-1`}>
                                            {selectedSubmission.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-slate-400 text-sm mb-2">Matched Sources:</div>
                                    <div className="space-y-1">
                                        {selectedSubmission.matchedSources.map((source, idx) => (
                                            <div key={idx} className="text-slate-300 text-sm flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                                                {source}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedSubmission(null)}
                                className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default TeacherPlagiarism;
