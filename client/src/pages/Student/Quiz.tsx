import { useState, useEffect } from 'react';
import { HelpCircle, CheckCircle, XCircle, Award, AlertTriangle, ArrowLeft, Loader } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import axios from 'axios';

const Quiz = () => {
    const [loading, setLoading] = useState(true);
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [selectedQuiz, setSelectedQuiz] = useState<any>(null);

    const [started, setStarted] = useState(false);
    const [currentQ, setCurrentQ] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [history, setHistory] = useState<any[]>([]); // Track answers
    const [warnings, setWarnings] = useState(0);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5001/api/quiz/student-quizzes', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQuizzes(res.data);
        } catch (error) {
            console.error("Error fetching quizzes", error);
        } finally {
            setLoading(false);
        }
    };

    // Enter Full Screen
    const enterFullScreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        }
    };

    // Exit Full Screen
    const exitFullScreen = () => {
        if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen().catch((err) => {
                console.error(`Error attempting to exit full-screen mode: ${err.message} (${err.name})`);
            });
        }
    };

    // Monitor Tab Switching
    useEffect(() => {
        if (!started || finished) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setWarnings(prev => {
                    const newCount = prev + 1;
                    if (newCount >= 3) {
                        setFinished(true); // Auto-submit
                        exitFullScreen();
                    }
                    return newCount;
                });
            }
        };

        const handleFullScreenChange = () => {
            if (!document.fullscreenElement && started && !finished) {
                setWarnings(prev => {
                    const newCount = prev + 1;
                    if (newCount >= 3) {
                        setFinished(true);
                    }
                    return newCount;
                });
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange);
        document.addEventListener("fullscreenchange", handleFullScreenChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            document.removeEventListener("fullscreenchange", handleFullScreenChange);
        };
    }, [started, finished]);

    const handleNext = () => {
        if (selectedOption === null) return;

        // Use selectedQuiz instead of DEMO_QUIZ
        const isCorrect = selectedOption === selectedQuiz.questions[currentQ].ans;
        if (isCorrect) setScore(score + selectedQuiz.questions[currentQ].marks);

        setHistory([...history, {
            qIndex: currentQ,
            selected: selectedOption,
            correct: isCorrect
        }]);

        setShowExplanation(true);
    };

    const handleContinue = () => {
        setSelectedOption(null);
        setShowExplanation(false);

        if (currentQ < selectedQuiz.questions.length - 1) {
            setCurrentQ(currentQ + 1);
        } else {
            setFinished(true);
        }
    };

    // Load history from local storage on mount
    const [quizHistory, setQuizHistory] = useState<any[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('edutrack_quiz_history');
        if (stored) {
            setQuizHistory(JSON.parse(stored));
        }
    }, []);

    const saveQuizResult = async (finalScore: number) => {
        try {
            const token = localStorage.getItem('token');
            const totalMarks = selectedQuiz.questions.reduce((acc: number, q: any) => acc + q.marks, 0);

            // Save to database
            await axios.post('http://localhost:5001/api/quiz/submit', {
                quizId: selectedQuiz._id,
                score: finalScore,
                total: totalMarks
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Also update local UI state immediately
            const newResult = {
                id: Date.now(),
                quizId: selectedQuiz._id,
                title: selectedQuiz.title,
                score: finalScore,
                total: totalMarks,
                date: new Date().toLocaleDateString()
            };
            const updatedHistory = [newResult, ...quizHistory];
            setQuizHistory(updatedHistory);
            localStorage.setItem('edutrack_quiz_history', JSON.stringify(updatedHistory));
        } catch (error) {
            console.error("Failed to save quiz result", error);
            // Optionally could still set local storage if offline
        }
    };

    return (
        <DashboardLayout role="student">
            <div className="max-w-4xl mx-auto">
                {/* Available Quizzes List */}
                {!selectedQuiz && (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <HelpCircle className="text-blue-500" /> My Quizzes
                        </h1>

                        {loading ? (
                            <div className="text-center py-12">
                                <Loader className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" />
                                <p className="text-slate-600 dark:text-slate-400">Loading your quizzes...</p>
                            </div>
                        ) : quizzes.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
                                <p className="text-slate-600 dark:text-slate-400 text-lg">No quizzes assigned yet.</p>
                            </div>
                        ) : (
                            <>
                                {/* Available quizzes — hide already-completed ones */}
                                {quizzes.filter((quiz) => !quizHistory.some((h: any) => h.quizId === quiz._id)).length === 0 ? (
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
                                        <CheckCircle className="mx-auto mb-3 text-emerald-500" size={40} />
                                        <p className="text-slate-700 dark:text-slate-300 text-lg font-semibold">All caught up!</p>
                                        <p className="text-slate-500 text-sm mt-1">You've completed all available quizzes.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {quizzes
                                            .filter((quiz) => !quizHistory.some((h: any) => h.quizId === quiz._id))
                                            .map((quiz) => (
                                                <div key={quiz._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all cursor-pointer group"
                                                    onClick={() => setSelectedQuiz(quiz)}>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold uppercase">
                                                            {quiz.difficulty}
                                                        </span>
                                                        <span className="text-slate-500 text-xs">{new Date(quiz.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-400 transition-colors">{quiz.title}</h3>
                                                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{quiz.questions.length} Questions • {quiz.subjectCode}</p>
                                                    <button className="w-full py-2 bg-slate-50 dark:bg-slate-800 group-hover:bg-blue-600 text-slate-900 dark:text-white rounded-lg font-medium transition-colors">
                                                        Start Quiz
                                                    </button>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Completed Quizzes History */}
                        {quizHistory.length > 0 && (
                            <div className="mt-12 space-y-4">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Award className="text-yellow-500" /> Completed Quizzes
                                </h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {quizHistory.map((item) => (
                                        <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold text-slate-800 dark:text-slate-200">{item.title}</h4>
                                                <p className="text-xs text-slate-500">Completed on {item.date}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-emerald-400">{item.score}/{item.total}</div>
                                                <div className="text-[10px] uppercase font-bold text-slate-500">Score</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}


                {/* Start Screen for Selected Quiz */}
                {selectedQuiz && !started && !finished && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <button
                            onClick={() => setSelectedQuiz(null)}
                            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white flex items-center gap-2 mb-4"
                        >
                            <ArrowLeft size={20} /> Back to All Quizzes
                        </button>

                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-6 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="inline-flex p-4 rounded-full bg-purple-500/10 text-purple-400 mb-2">
                                <HelpCircle size={48} />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white relative z-10">{selectedQuiz.title}</h1>
                            <p className="text-slate-600 dark:text-slate-400 relative z-10">
                                Subject: <span className="text-slate-700 dark:text-slate-300 font-medium">{selectedQuiz.subjectCode}</span> •
                                Questions: <span className="text-slate-700 dark:text-slate-300 font-medium">{selectedQuiz.questions.length}</span>
                            </p>
                            <div className="flex justify-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1"><AlertTriangle size={14} /> Full Screen Required</span>
                                <span className="flex items-center gap-1"><AlertTriangle size={14} /> No Tab Switching</span>
                            </div>
                            <button
                                onClick={() => {
                                    setStarted(true);
                                    enterFullScreen();
                                    setWarnings(0);
                                }}
                                className="relative z-10 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white font-bold rounded-lg transition-transform hover:scale-105 shadow-lg shadow-blue-600/20"
                            >
                                Start Quiz
                            </button>
                        </div>
                    </div>
                )}

                {/* Quiz Interface */}
                {started && !finished && selectedQuiz && (
                    <div className="space-y-6">
                        {/* Warning Banner */}
                        {warnings > 0 && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-center justify-between animate-pulse">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle />
                                    <span className="font-bold">Warning: Tab switching/Exiting Fullscreen detected!</span>
                                </div>
                                <div className="font-bold">Strike {warnings}/3</div>
                            </div>
                        )}

                        <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
                            <span>Question {currentQ + 1} / {selectedQuiz.questions.length}</span>
                            <span>Score: {score}</span>
                        </div>

                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                                {selectedQuiz.questions[currentQ].q}
                            </h2>

                            <div className="space-y-3">
                                {selectedQuiz.questions[currentQ].options.map((opt: string, idx: number) => {
                                    const isSelected = selectedOption === idx;
                                    const isCorrect = selectedQuiz.questions[currentQ].ans === idx;

                                    let btnClass = "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800";
                                    if (showExplanation) {
                                        if (isCorrect) btnClass = "bg-emerald-500/20 border-emerald-500 text-emerald-400";
                                        else if (isSelected) btnClass = "bg-red-500/20 border-red-500 text-red-400 opacity-50";
                                        else btnClass = "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 opacity-50";
                                    } else if (isSelected) {
                                        btnClass = "bg-blue-600/20 border-blue-500 text-blue-400";
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            disabled={showExplanation}
                                            onClick={() => setSelectedOption(idx)}
                                            className={`w-full p-4 text-left rounded-xl border transition-all font-medium ${btnClass}`}
                                        >
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Feedback Section */}
                            {showExplanation && (
                                <div className="mt-6 p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1">
                                            {selectedOption === selectedQuiz.questions[currentQ].ans
                                                ? <CheckCircle className="text-emerald-500" size={20} />
                                                : <XCircle className="text-red-500" size={20} />
                                            }
                                        </div>
                                        <div>
                                            <h4 className={`font-bold ${selectedOption === selectedQuiz.questions[currentQ].ans ? 'text-emerald-400' : 'text-red-400'
                                                }`}>
                                                {selectedOption === selectedQuiz.questions[currentQ].ans ? 'Correct Answer!' : 'Incorrect'}
                                            </h4>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                                                {selectedQuiz.questions[currentQ].explanation}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleContinue}
                                        className="mt-4 w-full py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-medium transition-colors"
                                    >
                                        {currentQ === selectedQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                                    </button>
                                </div>
                            )}

                            {/* Submit Action */}
                            {!showExplanation && (
                                <button
                                    disabled={selectedOption === null}
                                    onClick={handleNext}
                                    className="mt-8 w-full py-3 bg-blue-600 disabled:bg-slate-50 dark:bg-slate-800 disabled:text-slate-500 hover:bg-blue-500 text-slate-900 dark:text-white rounded-lg font-bold transition-all"
                                >
                                    Submit Answer
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Results Screen */}
                {finished && selectedQuiz && (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-6">
                        <Award className="mx-auto text-yellow-400" size={64} />
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Quiz Completed!</h2>

                        <div className="flex justify-center gap-8 my-6">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-slate-900 dark:text-white">{score} / {selectedQuiz.questions.reduce((acc: number, q: any) => acc + q.marks, 0)}</div>
                                <div className="text-sm text-slate-500 uppercase tracking-wider font-bold mt-1">Your Score</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-emerald-400">
                                    {/* Don't divide by zero if questions is 0, though unlikely */}
                                    {selectedQuiz.questions.length > 0 ? Math.round((score / selectedQuiz.questions.reduce((acc: number, q: any) => acc + q.marks, 0)) * 100) : 0}%
                                </div>
                                <div className="text-sm text-slate-500 uppercase tracking-wider font-bold mt-1">Accuracy</div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                            <h3 className="text-slate-700 dark:text-slate-300 font-medium mb-2">Performance Summary</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">
                                {warnings >= 3 ? <span className="text-red-400 font-bold block mb-1">Quiz Terminated due to security violations.</span> : null}
                                {score === selectedQuiz.questions.length ? "Perfect score! You have strong fundamentals." :
                                    score > (selectedQuiz.questions.length / 2) ? "Good job! Review the incorrect answers to improve." : "Keep practicing. Focus on basics."}
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                saveQuizResult(score);
                                setStarted(false);
                                setFinished(false);
                                setCurrentQ(0);
                                setScore(0);
                                setWarnings(0);
                                setSelectedQuiz(null); // Back to list
                                exitFullScreen();
                            }}
                            className="px-6 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg transition-colors"
                        >
                            Back to Quizzes
                        </button>
                    </div>
                )}

            </div>
        </DashboardLayout>
    );
};

export default Quiz;
