import { useState, useEffect } from 'react';
import { TrendingUp, Briefcase, DollarSign, Award, Calendar } from 'lucide-react';

interface CareerSimulationProps {
    studentId: string;
    roleId: string;
}

const CareerSimulation = ({ studentId, roleId }: CareerSimulationProps) => {
    const [simulation, setSimulation] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeYear, setActiveYear] = useState<1 | 3 | 5>(1);

    useEffect(() => {
        loadSimulation();
    }, [studentId, roleId]);

    const loadSimulation = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/career/simulation/${studentId}/${roleId}`);
            const data = await response.json();
            setSimulation(data.simulation);
            setLoading(false);
        } catch (error) {
            console.error('Error loading simulation:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-slate-600 dark:text-slate-400 mt-4">Simulating your career trajectory...</p>
            </div>
        );
    }

    if (!simulation) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-600 dark:text-slate-400">Unable to load career simulation.</p>
            </div>
        );
    }

    const yearData = {
        1: simulation.oneYear,
        3: simulation.threeYears,
        5: simulation.fiveYears
    };

    const currentData = yearData[activeYear];

    return (
        <div className="space-y-6">
            {/* Year Selector */}
            <div className="flex gap-4 justify-center">
                {[1, 3, 5].map((year) => (
                    <button
                        key={year}
                        onClick={() => setActiveYear(year as 1 | 3 | 5)}
                        className={`px-8 py-4 rounded-xl font-bold transition-all ${activeYear === year
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-slate-900 dark:text-white shadow-lg shadow-blue-500/25'
                                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:border-slate-300 dark:border-slate-700'
                            }`}
                    >
                        {year} Year{year > 1 ? 's' : ''}
                    </button>
                ))}
            </div>

            {/* Simulation Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-6">
                {/* Job Role */}
                <div className="text-center pb-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full mb-4 border border-blue-500/20">
                        <Calendar size={18} />
                        After {activeYear} Year{activeYear > 1 ? 's' : ''}
                    </div>
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{currentData.jobRole}</h2>
                    {currentData.roleTransition && (
                        <p className="text-slate-600 dark:text-slate-400">
                            → Next step: <span className="text-purple-400 font-semibold">{currentData.roleTransition}</span>
                        </p>
                    )}
                </div>

                {/* Salary Range */}
                {currentData.salaryRange && (
                    <div className="bg-slate-950/50 border border-slate-200 dark:border-slate-800 p-6 rounded-xl">
                        <div className="flex items-center gap-2 mb-3">
                            <DollarSign className="text-green-400" size={24} />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Expected Salary Range</h3>
                        </div>
                        <div className="text-3xl font-bold text-green-400">
                            ₹{currentData.salaryRange.minSalary?.toLocaleString()} - ₹{currentData.salaryRange.maxSalary?.toLocaleString()}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{currentData.salaryRange.experience}</p>
                    </div>
                )}

                {/* Skills Gained */}
                <div className="bg-slate-950/50 border border-slate-200 dark:border-slate-800 p-6 rounded-xl">
                    <div className="flex items-center gap-2 mb-4">
                        <Award className="text-blue-400" size={24} />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Skills You'll Have</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {currentData.skillsGained?.slice(0, 12).map((skill: string, idx: number) => (
                            <span
                                key={idx}
                                className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-sm border border-blue-500/20"
                            >
                                {skill}
                            </span>
                        ))}
                        {currentData.skillsGained?.length > 12 && (
                            <span className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-sm">
                                +{currentData.skillsGained.length - 12} more
                            </span>
                        )}
                    </div>
                </div>

                {/* Projects Completed */}
                <div className="bg-slate-950/50 border border-slate-200 dark:border-slate-800 p-6 rounded-xl">
                    <div className="flex items-center gap-2 mb-4">
                        <Briefcase className="text-purple-400" size={24} />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Projects & Experience</h3>
                    </div>
                    <div className="space-y-2">
                        {currentData.projectsCompleted?.slice(0, 6).map((project: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2">
                                <TrendingUp className="text-purple-400 shrink-0 mt-0.5" size={16} />
                                <span className="text-slate-700 dark:text-slate-300">{project}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Growth Indicators */}
                <div className="grid md:grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-400">{currentData.skillsGained?.length || 0}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Skills Mastered</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-400">{currentData.projectsCompleted?.length || 0}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Projects Completed</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-400">{activeYear === 1 ? 'Junior' : activeYear === 3 ? 'Mid' : 'Senior'}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Experience Level</div>
                    </div>
                </div>
            </div>

            {/* Timeline Visualization */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Career Progression Timeline</h3>
                <div className="relative">
                    <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-50 dark:bg-slate-800"></div>
                    <div className="flex justify-between relative">
                        {[
                            { year: 1, data: simulation.oneYear },
                            { year: 3, data: simulation.threeYears },
                            { year: 5, data: simulation.fiveYears }
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                                <div className={`w-12 h-12 rounded-full ${activeYear === item.year ? 'bg-blue-500' : 'bg-slate-50 dark:bg-slate-800'
                                    } border-4 border-slate-950 flex items-center justify-center text-slate-900 dark:text-white font-bold mb-2 cursor-pointer transition-all hover:scale-110`}
                                    onClick={() => setActiveYear(item.year as 1 | 3 | 5)}
                                >
                                    {item.year}
                                </div>
                                <div className="text-center">
                                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{item.data.jobRole}</div>
                                    <div className="text-xs text-slate-500">{item.year} year{item.year > 1 ? 's' : ''}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareerSimulation;
