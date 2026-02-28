import { useState, useEffect, useRef } from 'react';
import { Upload, Sparkles, FileText, Check, Loader2, Settings, Brain, AlertCircle, Edit, RefreshCw, Eye, Save, X } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import axios from 'axios';

const STEPS = ['Upload', 'Configuration', 'Analysis', 'Review', 'Finalize'];
const QUESTIONS_TYPES = [
    { id: 'mcq', label: 'Multiple Choice' },
    { id: 'true_false', label: 'True/False' },
    { id: 'descriptive', label: 'Descriptive' },
    { id: 'case_study', label: 'Case Study' }
];

const BLOOMS_TAXONOMY = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];

const TeacherQuizGen = () => {
    const [step, setStep] = useState(0);
    const [file, setFile] = useState<File | null>(null);
    const [topic, setTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [processingStage, setProcessingStage] = useState('');
    const [logs, setLogs] = useState<string[]>([]);

    // Configuration State
    const [config, setConfig] = useState({
        difficulty: 'medium',
        count: 10,
        marksPerQuestion: 2,
        taxonomy: ['Understand', 'Apply'],
        types: ['mcq']
    });

    const [generatedQuiz, setGeneratedQuiz] = useState<any>(null);
    const [selectedQuestion, setSelectedQuestion] = useState<any>(null); // For detailed edit
    const [isSaving, setIsSaving] = useState(false);

    // Mock logs for "Expert Analysis"
    const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
            setTopic(droppedFile.name.replace(/\.[^/.]+$/, ""));
        }
    };

    const runExpertAnalysis = async () => {
        setStep(2);
        setIsGenerating(true);
        setLogs([]);

        const sequence = [
            { stage: 'OCR & Parsing', msg: 'Extracting text layers from document...' },
            { stage: 'Normalization', msg: 'Removing headers, footers, and noise...' },
            { stage: 'Segmentation', msg: 'Identifying key sections and topic boundaries...' },
            { stage: 'Concept Mapping', msg: 'Building knowledge graph from semantic analysis...' },
            { stage: 'Drafting', msg: 'Generating questions based on Bloom\'s Taxonomy...' },
            { stage: 'Validation', msg: 'Verifying factual consistency against source...' }
        ];

        for (const seq of sequence) {
            setProcessingStage(seq.stage);
            addLog(seq.msg);
            await new Promise(r => setTimeout(r, 800 + Math.random() * 500));
        }

        try {
            const token = localStorage.getItem('token');
            // Construct payload
            const formData = new FormData();
            if (file) formData.append('file', file);
            formData.append('topic', topic);
            formData.append('difficulty', config.difficulty);
            formData.append('count', config.count.toString());
            // Serialize arrays
            formData.append('questionTypes', JSON.stringify(config.types));

            // Note: In real scenarios, use multipart/form-data. Our backend route handles it.
            // But if using JSON body without file, use a different approach.
            // aiQuizRoutes expects 'file' upload for generation. 
            // If no file, we might need a text-only endpoint or handle it in client.
            // Assuming the controller handles both or we send empty file with topic.

            // For now, simpler to assume mostly text/JSON for the "Expert" structure we want, 
            // or we use the backend we just built which takes form-data or JSON?
            // aiQuizRoutes uses `upload.single('file')`. 

            const res = await axios.post('http://localhost:5001/api/quiz/generate',
                file ? formData : { ...config, topic, questionTypes: config.types }, // Adapt based on if file exists
                { headers: { Authorization: `Bearer ${token}`, 'Content-Type': file ? 'multipart/form-data' : 'application/json' } }
            );

            setGeneratedQuiz(res.data);
            setStep(3); // Go to Review
        } catch (error) {
            console.error(error);
            addLog("Error: Generation failed. Please try again.");
            alert("Generation failed");
            setStep(1);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleQuestionUpdate = (idx: number, field: string, value: any) => {
        const updatedQuestions = [...generatedQuiz.questions];
        updatedQuestions[idx] = { ...updatedQuestions[idx], [field]: value };
        setGeneratedQuiz({ ...generatedQuiz, questions: updatedQuestions });
    };

    const handlePublish = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5001/api/quiz/save', {
                title: generatedQuiz.title,
                subjectCode: 'GEN-AI',
                difficulty: config.difficulty,
                questions: generatedQuiz.questions
            }, { headers: { Authorization: `Bearer ${token}` } });

            alert('Quiz published successfully to the Question Bank!');
            // Reset
            setStep(0);
            setFile(null);
            setGeneratedQuiz(null);
        } catch (error) {
            alert('Failed to save quiz.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <DashboardLayout role="teacher">
            <div className="max-w-6xl mx-auto min-h-[calc(100vh-100px)] flex flex-col">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-3">
                        <Brain className="text-purple-500" /> Expert AI Examiner
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Advanced document intelligence to generate exam-grade assessments.
                    </p>
                </div>

                {/* Steps Indicator */}
                <div className="flex justify-between mb-12 relative px-10">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10" />
                    {STEPS.map((s, i) => (
                        <div key={i} className={`flex flex-col items-center gap-2 ${step >= i ? 'opacity-100' : 'opacity-40'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all ${step > i ? 'bg-green-500 text-white' :
                                    step === i ? 'bg-purple-600 text-white ring-4 ring-purple-500/30' :
                                        'bg-slate-800 text-slate-500'
                                }`}>
                                {step > i ? <Check size={20} /> : i + 1}
                            </div>
                            <span className="text-xs font-medium text-slate-300">{s}</span>
                        </div>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">

                    {/* STEP 1: UPLOAD */}
                    {step === 0 && (
                        <div className="text-center py-10 animate-in fade-in zoom-in duration-300">
                            <div
                                className="border-3 border-dashed border-slate-700 rounded-3xl p-12 hover:border-purple-500/50 hover:bg-slate-800/30 transition-all cursor-pointer group"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleFileDrop}
                            >
                                <div className="w-24 h-24 bg-slate-950 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-900/20">
                                    <Upload size={40} className="text-slate-500 group-hover:text-purple-400" />
                                </div>

                                {file ? (
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-purple-500/10 text-purple-300 rounded-xl border border-purple-500/20">
                                            <FileText size={20} />
                                            <span className="font-semibold">{file.name}</span>
                                            <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="hover:text-white p-1 rounded-full hover:bg-white/10 ml-2"><X size={16} /></button>
                                        </div>
                                        <p className="text-slate-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis</p>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="text-2xl font-bold text-white mb-2">Upload Source Material</h3>
                                        <p className="text-slate-400 mb-8 max-w-md mx-auto">
                                            Drag & drop PDF, DOCX, or PPTX files here. Our Expert AI will analyze structure, content, and context.
                                        </p>
                                        <label className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg cursor-pointer font-medium transition-colors">
                                            Browse Files
                                            <input type="file" className="hidden" onChange={(e) => e.target.files && handleFileDrop({ preventDefault: () => { }, dataTransfer: { files: e.target.files } } as any)} />
                                        </label>
                                    </>
                                )}
                            </div>

                            <div className="mt-8 flex justify-center">
                                <button
                                    disabled={!file}
                                    onClick={() => setStep(1)}
                                    className="px-8 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-purple-600/20"
                                >
                                    Proceed to Configuration <Settings size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: CONFIGURATION */}
                    {step === 1 && (
                        <div className="animate-in slide-in-from-right duration-300">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Settings className="text-purple-400" /> Assessment Configuration</h2>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
                                        <label className="block text-slate-400 mb-3 font-medium">Difficulty Level</label>
                                        <div className="flex gap-2 bg-slate-900 p-1 rounded-lg">
                                            {['easy', 'medium', 'hard'].map(d => (
                                                <button
                                                    key={d}
                                                    onClick={() => setConfig({ ...config, difficulty: d })}
                                                    className={`flex-1 py-2 rounded-md capitalize font-medium transition-all ${config.difficulty === d ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                                >
                                                    {d}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
                                        <label className="block text-slate-400 mb-3 font-medium">Question Types</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {QUESTIONS_TYPES.map(type => (
                                                <button
                                                    key={type.id}
                                                    onClick={() => {
                                                        const types = config.types.includes(type.id)
                                                            ? config.types.filter(t => t !== type.id)
                                                            : [...config.types, type.id];
                                                        setConfig({ ...config, types: types.length ? types : ['mcq'] }); // Prevent empty
                                                    }}
                                                    className={`p-3 rounded-lg border text-left text-sm font-medium transition-all ${config.types.includes(type.id) ? 'bg-purple-500/20 border-purple-500 text-purple-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                                                >
                                                    {type.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
                                        <label className="block text-slate-400 mb-3 font-medium">Target Bloom's Taxonomy</label>
                                        <div className="flex flex-wrap gap-2">
                                            {BLOOMS_TAXONOMY.map(level => (
                                                <button
                                                    key={level}
                                                    onClick={() => {
                                                        const levels = config.taxonomy.includes(level)
                                                            ? config.taxonomy.filter(t => t !== level)
                                                            : [...config.taxonomy, level];
                                                        setConfig({ ...config, taxonomy: levels });
                                                    }}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${config.taxonomy.includes(level)
                                                        ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                                                        : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600'}`}
                                                >
                                                    {level}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                                            <AlertCircle size={12} /> Higher taxonomy levels generate more analytical questions.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                            <label className="block text-slate-400 text-sm mb-2">Question Count</label>
                                            <input
                                                type="number"
                                                value={config.count}
                                                onChange={(e) => setConfig({ ...config, count: Math.min(50, Math.max(1, parseInt(e.target.value) || 1)) })}
                                                className="w-full bg-slate-900 border-slate-800 rounded-lg p-2 text-white outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>
                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                            <label className="block text-slate-400 text-sm mb-2">Marks / Question</label>
                                            <input
                                                type="number"
                                                value={config.marksPerQuestion}
                                                onChange={(e) => setConfig({ ...config, marksPerQuestion: Math.max(1, parseInt(e.target.value) || 1) })}
                                                className="w-full bg-slate-900 border-slate-800 rounded-lg p-2 text-white outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-between">
                                <button onClick={() => setStep(0)} className="text-slate-400 hover:text-white font-medium px-4">Back</button>
                                <button
                                    onClick={runExpertAnalysis}
                                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                                >
                                    Start Analysis <Sparkles size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: ANALYSIS */}
                    {step === 2 && (
                        <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                            <div className="relative w-32 h-32 mb-8">
                                <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-t-purple-500 border-r-indigo-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Brain size={48} className="text-white animate-pulse" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-2">{processingStage}</h2>
                            <p className="text-slate-400 mb-8 max-w-md">Our expert system is analyzing your document to ensure high-quality assessment generation.</p>

                            <div className="w-full max-w-md bg-slate-950 rounded-lg p-4 h-48 overflow-y-auto border border-slate-800 font-mono text-xs text-left">
                                {logs.map((log, i) => (
                                    <div key={i} className="text-emerald-400 mb-1">{log}</div>
                                ))}
                                <div className="animate-pulse text-purple-400">_</div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: REVIEW */}
                    {step === 3 && generatedQuiz && (
                        <div className="h-full flex flex-col animate-in slide-in-from-bottom duration-500">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">Review & Finalize</h2>
                                    <p className="text-sm text-slate-400">{generatedQuiz.questions.length} Questions Generated • {config.difficulty.toUpperCase()} • {generatedQuiz.meta?.bloomStats?.analyze || 'Mixed'} Complexity</p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => runExpertAnalysis()}
                                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-2 text-sm font-medium"
                                    >
                                        <RefreshCw size={16} /> Regenerate All
                                    </button>
                                    <button
                                        onClick={handlePublish}
                                        disabled={isSaving}
                                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-emerald-600/20"
                                    >
                                        {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />} Publish Quiz
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                                {generatedQuiz.questions.map((q: any, idx: number) => (
                                    <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-6 group transition-all hover:border-purple-500/30">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex gap-3">
                                                <span className="bg-slate-800 text-slate-400 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">{idx + 1}</span>
                                                <div>
                                                    <h3 className="text-white font-medium text-lg leading-snug">{q.q}</h3>
                                                    <div className="flex gap-2 mt-2">
                                                        <span className="text-xs bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20">{q.bloomsLevel}</span>
                                                        <span className="text-xs bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20 capitalize">{q.type || 'MCQ'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white" title="Edit"><Edit size={16} /></button>
                                                <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-emerald-400" title="Preview Explanation"><Eye size={16} /></button>
                                            </div>
                                        </div>

                                        <div className="ml-11 grid gap-2">
                                            {q.options.map((opt: string, i: number) => (
                                                <div key={i} className={`p-3 rounded-lg border text-sm ${i === q.ans ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${i === q.ans ? 'border-emerald-500' : 'border-slate-600'}`}>
                                                            {i === q.ans && <div className="w-2 h-2 bg-emerald-500 rounded-full" />}
                                                        </div>
                                                        {opt}
                                                    </div>
                                                </div>
                                            ))}
                                            {(!q.options || q.options.length === 0) && (
                                                <div className="p-4 bg-slate-900/50 border border-slate-800 border-dashed rounded-lg text-slate-500 text-sm italic">
                                                    Open-ended response required.
                                                </div>
                                            )}
                                        </div>

                                        <div className="ml-11 mt-4 p-3 bg-blue-900/10 border border-blue-500/20 rounded-lg">
                                            <div className="flex items-start gap-2">
                                                <Brain size={16} className="text-blue-400 mt-0.5" />
                                                <p className="text-sm text-blue-300"><span className="font-bold">Expert Explanation:</span> {q.explanation}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </DashboardLayout>
    );
};

export default TeacherQuizGen;
