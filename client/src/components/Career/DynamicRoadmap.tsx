import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Circle, Clock, TrendingUp } from 'lucide-react';

interface DynamicRoadmapProps {
    studentId: string;
    roleId: string;
}

const DynamicRoadmap = ({ studentId, roleId }: DynamicRoadmapProps) => {
    const [roadmap, setRoadmap] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRoadmap();
    }, [studentId, roleId]);

    const loadRoadmap = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/career/roadmap/${studentId}/${roleId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentSkillLevel: 'Beginner',
                    availableStudyTime: 10
                })
            });
            const data = await response.json();
            setRoadmap(data.roadmap);
            setLoading(false);
        } catch (error) {
            console.error('Error loading roadmap:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-slate-400 mt-4">Generating your personalized roadmap...</p>
            </div>
        );
    }

    if (!roadmap) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-400">Unable to load roadmap.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Roadmap Header */}
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-slate-700 p-6 rounded-xl">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Your Learning Roadmap</h2>
                        <p className="text-slate-300">Personalized path to become a {roadmap.roleName}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-blue-400">{roadmap.overallProgress}%</div>
                        <div className="text-sm text-slate-400">Complete</div>
                    </div>
                </div>
                <div className="mt-4 w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${roadmap.overallProgress}%` }}
                    />
                </div>
            </div>

            {/* Roadmap Phases */}
            <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:h-full before:w-0.5 before:bg-slate-800">
                {roadmap.phases?.map((phase: any, phaseIdx: number) => (
                    <div key={phaseIdx} className="relative">
                        {/* Phase Header */}
                        <div className="flex gap-4">
                            <div className={`w-10 h-10 rounded-full ${phase.status === 'completed' ? 'bg-green-500' :
                                    phase.status === 'in-progress' ? 'bg-blue-500' :
                                        'bg-slate-800'
                                } border-4 border-slate-950 flex items-center justify-center shrink-0 z-10 text-white font-bold`}>
                                {phase.status === 'completed' ? <CheckCircle size={20} /> : phaseIdx + 1}
                            </div>

                            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">{phase.phaseName}</h3>
                                        <div className="flex items-center gap-4 text-sm text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {phase.duration}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <TrendingUp size={14} />
                                                {phase.progress}% Complete
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${phase.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                            phase.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                'bg-slate-800 text-slate-400 border border-slate-700'
                                        }`}>
                                        {phase.status.replace('-', ' ').toUpperCase()}
                                    </span>
                                </div>

                                {/* Skills */}
                                <div className="space-y-3">
                                    <h4 className="font-bold text-slate-300 text-sm">Skills to Master:</h4>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        {phase.skills?.slice(0, 4).map((skill: any, skillIdx: number) => (
                                            <div key={skillIdx} className="bg-slate-950/50 border border-slate-800 p-3 rounded-lg">
                                                <div className="flex items-start justify-between mb-2">
                                                    <span className="text-white font-medium text-sm">{skill.skillName}</span>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${skill.priority === 'High' ? 'bg-red-500/10 text-red-400' :
                                                            skill.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                                                                'bg-slate-700 text-slate-400'
                                                        }`}>
                                                        {skill.priority}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-slate-400 mb-2">
                                                    {skill.currentLevel} → {skill.targetLevel}
                                                </div>
                                                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 transition-all"
                                                        style={{ width: `${skill.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Milestones */}
                                {phase.milestones && phase.milestones.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-slate-800">
                                        <h4 className="font-bold text-slate-300 text-sm mb-2">Milestones:</h4>
                                        <div className="space-y-2">
                                            {phase.milestones.map((milestone: any, mIdx: number) => (
                                                <div key={mIdx} className="flex items-center gap-2 text-sm">
                                                    {milestone.completed ? (
                                                        <CheckCircle className="text-green-400" size={16} />
                                                    ) : (
                                                        <Circle className="text-slate-600" size={16} />
                                                    )}
                                                    <span className={milestone.completed ? 'text-slate-400 line-through' : 'text-slate-300'}>
                                                        {milestone.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Timeline Summary */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-white mb-4">Timeline Estimate</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-400">{roadmap.estimatedTotalMonths}</div>
                        <div className="text-sm text-slate-400">Total Months</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-400">{roadmap.totalPhases}</div>
                        <div className="text-sm text-slate-400">Learning Phases</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-400">{roadmap.completedPhases}</div>
                        <div className="text-sm text-slate-400">Completed</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DynamicRoadmap;
