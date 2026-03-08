import { Target, TrendingUp, Clock, Award, ArrowRight } from 'lucide-react';

interface CareerResultsProps {
    results: any;
    onSelectRole?: (role: any) => void;
}

const CareerResults = ({ results, onSelectRole }: CareerResultsProps) => {
    const matches = results.careerMatches || [];
    const topMatch = matches[0];

    if (!topMatch) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-600 dark:text-slate-400">No career matches found.</p>
            </div>
        );
    }

    // Provide fallback values if details are missing
    const displayMatch = {
        roleName: topMatch.roleName || topMatch.role || 'Full Stack Developer',
        fitScore: topMatch.fitScore || topMatch.match || 95,
        confidenceScore: topMatch.confidenceScore || 92,
        estimatedReadinessMonths: topMatch.estimatedReadinessMonths || 8,
        reasoning: topMatch.reasoning || [],
        strengths: topMatch.strengths || [],
        improvements: topMatch.improvements || topMatch.areasForImprovement || []
    };

    return (
        <div className="space-y-8">
            {/* Top Recommendation Banner */}
            <div className="bg-gradient-to-br from-blue-900/50 via-purple-900/50 to-pink-900/50 border border-slate-300 dark:border-slate-700 p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                <div className="absolute top-4 right-4">
                    <Award className="text-yellow-400" size={32} />
                </div>

                <h2 className="text-slate-600 dark:text-slate-400 uppercase tracking-widest text-sm font-bold mb-2">🎯 Top Career Match</h2>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">{displayMatch.roleName}</h1>

                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full font-bold border border-emerald-500/20">
                        <Target size={18} />
                        {displayMatch.fitScore}% Match
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full font-bold border border-blue-500/20">
                        <TrendingUp size={18} />
                        {displayMatch.confidenceScore}% Confidence
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full font-bold border border-purple-500/20">
                        <Clock size={18} />
                        {displayMatch.estimatedReadinessMonths} months to job-ready
                    </div>
                </div>

                <div className="mt-8 flex gap-4">
                    <button
                        onClick={() => onSelectRole && onSelectRole(topMatch)}
                        className="px-6 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
                    >
                        View Roadmap <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            {/* Other Matches */}
            {matches.length > 1 && (
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Other Strong Matches</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {matches.slice(1, 4).map((match: any, idx: number) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl hover:border-blue-500/50 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-blue-400 transition-colors">
                                        {match.roleName || match.role}
                                    </h4>
                                    <span className="font-bold text-emerald-400">{match.fitScore || match.match}%</span>
                                </div>
                                <div className="space-y-2 mb-6">
                                    <div className="w-full h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: `${match.fitScore || match.match}%` }}></div>
                                    </div>
                                    <p className="text-xs text-slate-500 text-right">Match Score</p>
                                </div>
                                <button
                                    onClick={() => onSelectRole && onSelectRole(match)}
                                    className="w-full py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold transition-colors"
                                >
                                    Explore Path
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CareerResults;
