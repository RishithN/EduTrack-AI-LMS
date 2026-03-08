import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { ShieldAlert, UploadCloud, FileText, CheckCircle, AlertTriangle, FileWarning, Search, X } from 'lucide-react';
import axios from 'axios';

interface PlagiarismMatch {
    source: string;
    similarity: number;
    matched_text: string[];
}

interface PlagiarismResult {
    overall_score: number;
    is_plagiarized: boolean;
    matches: PlagiarismMatch[];
}

export interface PlagiarismHistoryItem extends PlagiarismResult {
    id: string;
    fileName: string;
    date: string;
}

const TeacherPlagiarism = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<PlagiarismResult | null>(null);
    const [history, setHistory] = useState<PlagiarismHistoryItem[]>(() => {
        const stored = localStorage.getItem('edutrack_plagiarism_history');
        return stored ? JSON.parse(stored) : [];
    });
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (selectedFile: File) => {
        const validTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ];

        if (!validTypes.includes(selectedFile.type)) {
            setError("Invalid file type. Please upload PDF, DOCX, or TXT.");
            return;
        }

        setFile(selectedFile);
        setError(null);
        setResult(null); // Clear previous results
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setIsAnalyzing(true);
        setError(null);

        const formData = new FormData();
        formData.append('document', file);

        try {
            // Using backend API endpoint which correctly accesses the python microservice
            const response = await axios.post('http://localhost:5001/api/plagiarism/check', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const resultData = response.data.data;
            setResult(resultData);

            // Add to history
            const newHistoryItem: PlagiarismHistoryItem = {
                ...resultData,
                id: Date.now().toString(),
                fileName: file.name,
                date: new Date().toISOString()
            };
            const updatedHistory = [newHistoryItem, ...history];
            setHistory(updatedHistory);
            localStorage.setItem('edutrack_plagiarism_history', JSON.stringify(updatedHistory));

        } catch (err: any) {
            console.error('Plagiarism check failed:', err);
            setError(err.response?.data?.error || 'Failed to analyze document. Is the AI service running?');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score < 15) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
        if (score < 40) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
        return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
    };

    const getScoreGradient = (score: number) => {
        if (score < 15) return 'from-emerald-400 to-emerald-600';
        if (score < 40) return 'from-amber-400 to-orange-500';
        return 'from-rose-500 to-red-600';
    };

    return (
        <DashboardLayout role="teacher">
            <div className="space-y-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent flex items-center gap-3">
                            <ShieldAlert size={32} className="text-violet-500" />
                            Plagiarism Checker
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">Upload student submissions to detect academic dishonesty using AI-driven text analysis.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Upload Area */}
                    <div className="lg:col-span-1 space-y-6">
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all ${isDragging ? 'border-violet-500 bg-violet-500/10' :
                                file ? 'border-emerald-500/50 bg-emerald-500/5' :
                                    'border-slate-300 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-900/50 hover:border-slate-600'
                                }`}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".pdf,.docx,.txt"
                                onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                            />

                            {file ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full inline-block">
                                        <FileText size={40} className="text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px] mx-auto">{file.name}</p>
                                        <p className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => { setFile(null); setResult(null); setError(null); }}
                                            className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200"
                                        >
                                            Remove
                                        </button>
                                        <button
                                            onClick={handleAnalyze}
                                            disabled={isAnalyzing}
                                            className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-slate-900 dark:text-white rounded-lg transition-colors flex items-center justify-center gap-2 min-w-[120px]"
                                        >
                                            {isAnalyzing ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <Search size={16} /> Analyze
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full inline-block group-hover:bg-slate-100 dark:bg-slate-700 transition-colors">
                                        <UploadCloud size={40} className="text-violet-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800 dark:text-slate-200">Click to upload or drag & drop</p>
                                        <p className="text-xs text-slate-500 mt-2">PDF, DOCX, or TXT (Max: 10MB)</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-start gap-3 text-rose-400 text-sm">
                                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                                <p>{error}</p>
                            </div>
                        )}

                        {history.length > 0 && (
                            <div className="bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                                    <FileText size={18} className="text-blue-400" />
                                    Scan History
                                </h3>
                                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {history.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => setResult(item)}
                                            className="bg-slate-800/40 hover:bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-300 dark:border-slate-700/50 cursor-pointer transition-all flex flex-col gap-2"
                                        >
                                            <div className="flex justify-between items-start">
                                                <span className="text-slate-800 dark:text-slate-200 text-sm font-semibold truncate max-w-[150px]" title={item.fileName}>{item.fileName}</span>
                                                <span className={`text-xs px-2 py-1 rounded font-bold border ${getScoreColor(item.overall_score)}`}>{item.overall_score}%</span>
                                            </div>
                                            <div className="text-xs text-slate-500 flex justify-between">
                                                <span>{new Date(item.date).toLocaleDateString()}</span>
                                                <span>{item.is_plagiarized ? 'Flagged' : 'Clear'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Results Area */}
                    <div className="lg:col-span-2">
                        {isAnalyzing && (
                            <div className="h-full min-h-[400px] bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center space-y-4">
                                <div className="relative w-20 h-20 flex items-center justify-center">
                                    <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-800 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-violet-500 rounded-full border-t-transparent animate-spin"></div>
                                    <Search size={24} className="text-violet-400" />
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 animate-pulse">Running advanced text analysis...</p>
                            </div>
                        )}

                        {!isAnalyzing && !result && (
                            <div className="h-full min-h-[400px] bg-slate-900/30 border border-slate-200 dark:border-slate-800 border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-500 space-y-4 p-8 text-center">
                                <FileWarning size={48} className="opacity-50" />
                                <p>Upload a document and run the analysis to view the plagiarism report here.</p>
                            </div>
                        )}

                        <AnimatePresence>
                            {!isAnalyzing && result && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-slate-900/80 backdrop-blur-xl border border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden shadow-2xl"
                                >
                                    {/* Result Header */}
                                    <div className="border-b border-slate-200 dark:border-slate-800 p-6 flex items-center justify-between bg-slate-800/20">
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">Analysis Report</h2>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">Scan completed successfully.</p>
                                        </div>
                                        <div className={`px-4 py-2 rounded-xl flex items-center gap-3 border ${getScoreColor(result.overall_score)}`}>
                                            <div className="text-right">
                                                <p className="text-[10px] uppercase font-bold tracking-wider opacity-80">Similarity Score</p>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl font-black">{result.overall_score}%</span>
                                                </div>
                                            </div>
                                            {result.is_plagiarized ? <AlertTriangle size={28} /> : <CheckCircle size={28} />}
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="mb-6">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-slate-600 dark:text-slate-400">Original Content</span>
                                                <span className="text-slate-600 dark:text-slate-400">Matched Content</span>
                                            </div>
                                            <div className="h-3 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden flex">
                                                <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${100 - result.overall_score}%` }}></div>
                                                <div className={`h-full bg-gradient-to-r ${getScoreGradient(result.overall_score)} transition-all duration-1000`} style={{ width: `${result.overall_score}%` }}></div>
                                            </div>
                                        </div>

                                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4">
                                            <FileText size={18} className="text-blue-400" />
                                            Source Matches Found ({result.matches.length})
                                        </h3>

                                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                            {result.matches.length === 0 ? (
                                                <div className="text-center p-6 bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800">
                                                    <CheckCircle size={32} className="text-emerald-500 mx-auto mb-2" />
                                                    <p className="text-slate-700 dark:text-slate-300">No significant similarities found.</p>
                                                    <p className="text-sm text-slate-500">The document appears to be entirely original.</p>
                                                </div>
                                            ) : (
                                                result.matches.map((match, i) => (
                                                    <div key={i} className="bg-slate-800/40 border border-slate-300 dark:border-slate-700 rounded-xl p-4">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div>
                                                                <h4 className="font-medium text-slate-800 dark:text-slate-200">{match.source}</h4>
                                                            </div>
                                                            <span className="px-2 py-1 bg-rose-500/20 text-rose-400 text-xs font-bold rounded border border-rose-500/30">
                                                                {match.similarity}% Match
                                                            </span>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {match.matched_text.map((text, j) => (
                                                                <div key={j} className="text-sm bg-rose-500/5 border-l-2 border-rose-500 p-2 text-slate-700 dark:text-slate-300 rounded-r">
                                                                    "{text}"
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TeacherPlagiarism;
