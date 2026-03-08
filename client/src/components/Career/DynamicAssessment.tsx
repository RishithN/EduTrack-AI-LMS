import { useState, useEffect } from 'react';
import { ArrowRight, Clock } from 'lucide-react';

interface DynamicAssessmentProps {
    domain: string;
    onComplete: (answers: any[], timeSpent: number) => void;
}

interface Question {
    questionId: string;
    questionText: string;
    questionType: string;
    options: string[];
}

const DynamicAssessment = ({ domain, onComplete }: DynamicAssessmentProps) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<any[]>([]);
    const [startTime] = useState(Date.now());
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadQuestions();
    }, [domain]);

    const loadQuestions = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/career/questions/${encodeURIComponent(domain)}`);
            const data = await response.json();
            setQuestions(data.questions);
            setLoading(false);
        } catch (error) {
            console.error('Error loading questions:', error);
            setLoading(false);
        }
    };

    const handleOptionSelect = (option: string, index: number) => {
        const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

        const newAnswer = {
            questionId: questions[currentQ].questionId,
            selectedOption: option,
            selectedIndex: index,
            timeSpent
        };

        const newAnswers = [...answers, newAnswer];
        setAnswers(newAnswers);

        if (currentQ < questions.length - 1) {
            setCurrentQ(currentQ + 1);
            setQuestionStartTime(Date.now());
        } else {
            // Assessment complete
            const totalTimeSpent = Math.floor((Date.now() - startTime) / 1000 / 60); // minutes
            onComplete(newAnswers, totalTimeSpent);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-slate-600 dark:text-slate-400 mt-4">Loading assessment...</p>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-600 dark:text-slate-400">No questions available for this domain.</p>
            </div>
        );
    }

    const progress = ((currentQ + 1) / questions.length) * 100;
    const currentQuestion = questions[currentQ];

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            {/* Progress Header */}
            <div className="bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <span className="text-sm font-mono text-blue-400 mb-1 block">
                            Question {currentQ + 1} of {questions.length}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock size={12} />
                            {currentQuestion.questionType.charAt(0).toUpperCase() + currentQuestion.questionType.slice(1)} Question
                        </span>
                    </div>
                    <button
                        onClick={() => {
                            if (window.confirm("Are you sure you want to quit? Your progress will be lost.")) {
                                window.location.reload();
                            }
                        }}
                        className="text-red-400 hover:text-red-300 flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                        Quit Assessment
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-2xl">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8 leading-relaxed">
                    {currentQuestion.questionText}
                </h2>

                <div className="space-y-4">
                    {currentQuestion.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleOptionSelect(option, idx)}
                            className="w-full p-5 text-left rounded-xl bg-slate-950/50 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-600/10 transition-all group flex items-center justify-between transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/10"
                        >
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 group-hover:border-blue-500 group-hover:bg-blue-600/20 flex items-center justify-center font-bold text-slate-600 dark:text-slate-400 group-hover:text-blue-400 transition-all shrink-0">
                                    {String.fromCharCode(65 + idx)}
                                </div>
                                <span className="text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:text-white font-medium transition-colors">
                                    {option}
                                </span>
                            </div>
                            <ArrowRight className="opacity-0 group-hover:opacity-100 text-blue-400 transition-all group-hover:translate-x-1" size={20} />
                        </button>
                    ))}
                </div>

                <div className="mt-8 flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => {
                            if (currentQ > 0) {
                                setCurrentQ(currentQ - 1);
                                setAnswers(answers.slice(0, -1));
                            }
                        }}
                        disabled={currentQ === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${currentQ === 0
                            ? 'text-slate-600 cursor-not-allowed'
                            : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-slate-50 dark:bg-slate-800'
                            }`}
                    >
                        <ArrowRight className="rotate-180" size={18} /> Previous
                    </button>

                    <div className="text-sm text-slate-500">
                        Select an option to proceed
                    </div>
                </div>
            </div>

            {/* Helper Text */}
            <div className="text-center">
                <p className="text-sm text-slate-500">
                    💡 Choose the option that best represents you. There are no right or wrong answers.
                </p>
            </div>
        </div>
    );
};

export default DynamicAssessment;
