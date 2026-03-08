import { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, CheckCircle, Target } from 'lucide-react';

interface SkillGapAnalysisProps {
    studentId: string;
    roleId: string;
}

const SkillGapAnalysis = ({ studentId, roleId }: SkillGapAnalysisProps) => {
    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalysis();
    }, [studentId, roleId]);

    const loadAnalysis = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/career/skill-gap/${studentId}/${roleId}`);
            const data = await response.json();
            setAnalysis(data.analysis);
            setLoading(false);
        } catch (error) {
            console.error('Error loading skill gap analysis:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-slate-600 dark:text-slate-400 mt-4">Analyzing skill gaps...</p>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-600 dark:text-slate-400">Unable to load skill gap analysis.</p>
            </div>
        );
    }

    const criticalGaps = analysis.skillGaps?.filter((g: any) => g.priority === 'Critical') || [];
    const highGaps = analysis.skillGaps?.filter((g: any) => g.priority === 'High') || [];
    const mediumGaps = analysis.skillGaps?.filter((g: any) => g.priority === 'Medium') || [];

    return (
        <div className="space-y-6">
            {/* Overview */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Skill Gap Overview</h2>
                <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-slate-950/50 border border-slate-200 dark:border-slate-800 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-blue-400">{Math.round(analysis.overallGapScore)}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Overall Gap Score</div>
                    </div>
                    <div className="bg-slate-950/50 border border-red-500/20 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-red-400">{analysis.criticalGaps}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Critical Gaps</div>
                    </div>
                    <div className="bg-slate-950/50 border border-yellow-500/20 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-yellow-400">{analysis.highPriorityGaps}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">High Priority</div>
                    </div>
                    <div className="bg-slate-950/50 border border-slate-200 dark:border-slate-800 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-slate-600 dark:text-slate-400">{analysis.totalGaps}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Total Gaps</div>
                    </div>
                </div>
            </div>

            {/* Critical Skills */}
            {criticalGaps.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border-2 border-red-500/30 p-6 rounded-xl">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="text-red-400" size={24} />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Critical Skills to Develop</h3>
                    </div>
                    <div className="space-y-4">
                        {criticalGaps.map((gap: any, idx: number) => (
                            <div key={idx} className="bg-slate-950/50 border border-slate-200 dark:border-slate-800 p-4 rounded-lg">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">{gap.skillName}</h4>
                                        <div className="text-sm text-slate-600 dark:text-slate-400">
                                            Current: <span className="text-red-400">{gap.currentLevel}</span> →
                                            Required: <span className="text-green-400"> {gap.requiredLevel}</span>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-xs font-bold border border-red-500/20">
                                        {gap.priority}
                                    </span>
                                </div>
                                <div className="mb-2">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-600 dark:text-slate-400">Gap Score</span>
                                        <span className="text-red-400 font-bold">{Math.round(gap.gapScore)}/100</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-red-500 transition-all"
                                            style={{ width: `${gap.gapScore}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="text-xs text-slate-500">
                                    ⏱️ Estimated time to close: {gap.estimatedTimeToClose} hours
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* High Priority Skills */}
            {highGaps.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-yellow-500/30 p-6 rounded-xl">
                    <div className="flex items-center gap-2 mb-4">
                        <Target className="text-yellow-400" size={24} />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">High Priority Skills</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        {highGaps.map((gap: any, idx: number) => (
                            <div key={idx} className="bg-slate-950/50 border border-slate-200 dark:border-slate-800 p-4 rounded-lg">
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-bold text-slate-900 dark:text-white">{gap.skillName}</h4>
                                    <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded text-xs font-bold">
                                        {gap.priority}
                                    </span>
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                    {gap.currentLevel} → {gap.requiredLevel}
                                </div>
                                <div className="w-full h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-500 transition-all"
                                        style={{ width: `${gap.gapScore}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Medium Priority Skills */}
            {mediumGaps.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="text-blue-400" size={24} />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Medium Priority Skills</h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3">
                        {mediumGaps.map((gap: any, idx: number) => (
                            <div key={idx} className="bg-slate-950/50 border border-slate-200 dark:border-slate-800 p-3 rounded-lg">
                                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{gap.skillName}</h4>
                                <div className="text-xs text-slate-600 dark:text-slate-400">{gap.currentLevel} → {gap.requiredLevel}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Improvement Roadmap */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-slate-300 dark:border-slate-700 p-6 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="text-green-400" size={24} />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recommended Action Plan</h3>
                </div>
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-slate-900 dark:text-white font-bold shrink-0">1</div>
                        <div>
                            <div className="font-semibold text-slate-900 dark:text-white">Focus on Critical Skills First</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">Address {criticalGaps.length} critical skill gaps to build a strong foundation</div>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-slate-900 dark:text-white font-bold shrink-0">2</div>
                        <div>
                            <div className="font-semibold text-slate-900 dark:text-white">Develop High Priority Skills</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">Work on {highGaps.length} high-priority skills to increase job readiness</div>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-slate-900 dark:text-white font-bold shrink-0">3</div>
                        <div>
                            <div className="font-semibold text-slate-900 dark:text-white">Build Medium Priority Skills</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">Enhance {mediumGaps.length} medium-priority skills for competitive advantage</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkillGapAnalysis;
