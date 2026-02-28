import { useState, useEffect } from 'react';
import {
    Sparkles, BrainCircuit, Target, BookOpen, Lightbulb,
    TrendingUp, ExternalLink, Award
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import DomainSelection from '../../components/Career/DomainSelection';
import DynamicAssessment from '../../components/Career/DynamicAssessment';
import CareerResults from '../../components/Career/CareerResults';


type ViewState = 'intro' | 'domain-selection' | 'assessment' | 'analyzing' | 'results';
type ResultTab = 'overview' | 'roadmap' | 'resources' | 'simulation' | 'history';



const CareerAI = () => {
    const [currentView, setCurrentView] = useState<ViewState>('intro');
    const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
    const [assessmentData, setAssessmentData] = useState<any>(null);
    const [careerResults, setCareerResults] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<ResultTab>('overview');
    const [selectedRole, setSelectedRole] = useState<any>(null);
    const [roadmap, setRoadmap] = useState<any>(null);
    const [resources, setResources] = useState<any[]>([]);
    const [simulation, setSimulation] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [loadingTab, setLoadingTab] = useState(false);

    // Get student ID from auth context
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const studentId = user ? user.id : '';

    useEffect(() => {
        loadCareerProfile();
    }, []);

    useEffect(() => {
        if (selectedRole && activeTab === 'roadmap') fetchRoadmap();
        if (selectedRole && activeTab === 'resources') fetchResources();
        if (selectedRole && activeTab === 'simulation') fetchSimulation();
    }, [selectedRole, activeTab]);

    const loadCareerProfile = async () => {
        if (!studentId) return;
        try {
            const response = await fetch(`http://localhost:5001/api/career/profile/${studentId}`);
            if (response.ok) {
                const data = await response.json();
                if (data.profile) {
                    setCareerResults(data.profile);
                    setHistory(data.profile.assessmentHistory || []);

                    // Only set to results view if we're still on intro and have matches
                    if (currentView === 'intro' && data.profile.careerMatches?.length > 0) {
                        setCurrentView('results');
                        const firstMatch = data.profile.careerMatches[0];
                        // Normalize the object to be safe
                        const normalizedRole = {
                            ...firstMatch,
                            role: firstMatch.roleName || firstMatch.role || "Full Stack Developer",
                            roleId: firstMatch.roleId
                        };
                        setSelectedRole(normalizedRole);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading career profile:', error);
        }
    };

    const fetchRoadmap = async () => {
        if (!selectedRole?.roleId) return;
        setLoadingTab(true);
        try {
            const response = await fetch(`http://localhost:5001/api/career/roadmap/${studentId}/${selectedRole.roleId}`, {
                method: 'POST', // Generating if not exists
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentSkillLevel: 'Beginner', availableStudyTime: 10 })
            });
            const data = await response.json();
            setRoadmap(data.roadmap);
        } catch (error) {
            console.error('Error fetching roadmap:', error);
        } finally {
            setLoadingTab(false);
        }
    };

    const fetchResources = async () => {
        if (!selectedRole?.roleId) return;
        setLoadingTab(true);
        try {
            // Using a mock response for now as we might not have seeded resources yet
            // In a real app, you'd fetch from /api/career/resources/${selectedRole.roleId}
            const response = await fetch(`http://localhost:5001/api/career/resources/${selectedRole.roleId}`);
            if (response.ok) {
                const data = await response.json();
                setResources(data.resources || []);
            }
        } catch (error) {
            console.error('Error fetching resources:', error);
        } finally {
            setLoadingTab(false);
        }
    };

    const fetchSimulation = async () => {
        if (!selectedRole?.roleId) return;
        setLoadingTab(true);
        try {
            const response = await fetch(`http://localhost:5001/api/career/simulation/${studentId}/${selectedRole.roleId}`);
            const data = await response.json();
            setSimulation(data.simulation);
        } catch (error) {
            console.error('Error fetching simulation:', error);
        } finally {
            setLoadingTab(false);
        }
    };

    const handleDomainSelect = async (domain: string) => {
        setSelectedDomain(domain);
        try {
            await fetch('http://localhost:5001/api/career/select-domain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId, domain })
            });
            setCurrentView('assessment');
        } catch (error) {
            console.error('Error selecting domain:', error);
        }
    };

    const handleAssessmentComplete = async (answers: any[], timeSpent: number) => {
        setCurrentView('analyzing');
        setAssessmentData({ answers, timeSpent });

        try {
            const response = await fetch('http://localhost:5001/api/career/submit-assessment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId,
                    domain: selectedDomain,
                    answers,
                    timeSpent
                })
            });

            const data = await response.json();

            setTimeout(() => {
                setCareerResults({ ...careerResults, careerMatches: data.careerMatches });
                // Normalize result
                const firstMatch = data.careerMatches[0];
                const normalizedRole = {
                    ...firstMatch,
                    role: firstMatch.roleName,
                    roleId: firstMatch.roleId
                };
                setSelectedRole(normalizedRole);
                setCurrentView('results');
                loadCareerProfile(); // Reload to get full profile update
            }, 2500);
        } catch (error) {
            console.error('Error submitting assessment:', error);
        }
    };

    const handleStartNew = () => {
        setSelectedDomain(null);
        setAssessmentData(null);
        // Don't clear careerResults entirely, just view state
        setActiveTab('overview');
        setCurrentView('domain-selection');
    };

    const handleHistoryClick = async (assessmentId: string) => {
        try {
            const response = await fetch(`http://localhost:5001/api/career/assessment/${assessmentId}`);
            if (response.ok) {
                const data = await response.json();
                if (data.assessment && data.assessment.careerMatches) {
                    setCareerResults({
                        ...careerResults, // Keep other profile data if needed
                        careerMatches: data.assessment.careerMatches,
                        selectedDomain: data.assessment.domain
                    });

                    // Select the top match
                    if (data.assessment.careerMatches.length > 0) {
                        const firstMatch = data.assessment.careerMatches[0];
                        const normalizedRole = {
                            ...firstMatch,
                            role: firstMatch.roleName || firstMatch.role,
                            roleId: firstMatch.roleId
                        };
                        setSelectedRole(normalizedRole);
                    }

                    setCurrentView('results');
                    setActiveTab('overview');
                }
            }
        } catch (error) {
            console.error('Error fetching assessment history:', error);
        }
    };

    return (
        <DashboardLayout role="student">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Intro Screen */}
                {currentView === 'intro' && (
                    <div className="space-y-12">
                        <div className="text-center space-y-6 py-16">
                            <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 text-blue-400 mb-4 animate-pulse">
                                <BrainCircuit size={80} />
                            </div>
                            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                AI Career Intelligence Platform
                            </h1>
                            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                                Discover your perfect career path with our adaptive multi-career intelligence system.
                                We analyze your personality, skills, academic performance, and learning behavior to create
                                a personalized roadmap.
                            </p>

                            <button
                                onClick={() => setCurrentView('domain-selection')}
                                className="mt-8 px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-full text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-600/25 flex items-center gap-3 mx-auto"
                            >
                                Start Your Career Journey <Sparkles size={24} />
                            </button>
                        </div>

                        {/* History Section */}
                        {history.length > 0 && (
                            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                                <h3 className="text-xl font-bold text-white mb-4">Your Assessment History</h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {history.map((item: any, idx: number) => (
                                        <div key={idx} className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex justify-between items-center">
                                            <div>
                                                <div className="font-bold text-white">{item.domain || "Assessment"}</div>
                                                <div className="text-xs text-slate-500">{new Date(item.completedAt).toLocaleDateString()}</div>
                                            </div>
                                            <button
                                                onClick={() => handleHistoryClick(item.assessmentId)}
                                                className="text-sm text-blue-400 hover:underline"
                                            >
                                                View Results
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Domain Selection */}
                {currentView === 'domain-selection' && (
                    <DomainSelection onSelectDomain={handleDomainSelect} />
                )}

                {/* Dynamic Assessment */}
                {currentView === 'assessment' && selectedDomain && (
                    <DynamicAssessment
                        domain={selectedDomain}
                        onComplete={handleAssessmentComplete}
                    />
                )}

                {/* Analyzing State */}
                {currentView === 'analyzing' && (
                    <div className="text-center py-24 space-y-8">
                        <div className="relative">
                            <BrainCircuit className="animate-spin mx-auto text-purple-500" size={80} />
                            <div className="absolute inset-0 animate-ping">
                                <BrainCircuit className="mx-auto text-purple-500/30" size={80} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-white">Analyzing Your Career DNA...</h2>
                        <p className="text-slate-400">Comparing your profile against industry standards...</p>
                    </div>
                )}

                {/* Results View */}
                {currentView === 'results' && careerResults && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">Your Career Intelligence Report</h1>
                                <p className="text-slate-400">Based on your assessment for: <span className="text-blue-400">{selectedDomain || "Tech Roles"}</span></p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setCurrentView('intro')}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
                                >
                                    Back to Home
                                </button>
                                <button
                                    onClick={handleStartNew}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-lg shadow-blue-600/20"
                                >
                                    New Assessment
                                </button>
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex gap-2 bg-slate-900/50 p-2 rounded-xl border border-slate-800 overflow-x-auto">
                            {[
                                { id: 'overview', label: 'Career Matches', icon: Target },
                                { id: 'roadmap', label: 'Learning Roadmap', icon: BookOpen },
                                { id: 'resources', label: 'Resources', icon: Lightbulb },
                                { id: 'simulation', label: 'Career Simulation', icon: TrendingUp },
                                { id: 'history', label: 'History', icon: Award }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as ResultTab)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold capitalize transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                        }`}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'overview' && (
                            <CareerResults
                                results={careerResults}
                                onSelectRole={(role: any) => {
                                    const normalized = {
                                        ...role,
                                        role: role.roleName || role.role,
                                        roleId: role.roleId || role._id
                                    };
                                    setSelectedRole(normalized);
                                    setActiveTab('roadmap'); // Auto-switch to roadmap on selection
                                }}
                            />
                        )}

                        {loadingTab && (
                            <div className="py-20 text-center">
                                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                                <p className="text-slate-400">Loading personalized data...</p>
                            </div>
                        )}

                        {!loadingTab && activeTab === 'roadmap' && selectedRole && (
                            roadmap ? <DynamicRoadmap roadmap={roadmap} roleName={selectedRole.role} /> :
                                <div className="text-center py-12 text-slate-500">No roadmap generated yet. Select a role first.</div>
                        )}

                        {!loadingTab && activeTab === 'resources' && selectedRole && (
                            <ResourcesView resources={resources} roleName={selectedRole.role} />
                        )}


                        {!loadingTab && activeTab === 'simulation' && selectedRole && (
                            simulation ? <DynamicSimulation simulation={simulation} roleName={selectedRole.role} /> :
                                <div className="text-center py-12 text-slate-500">Simulation data unavailable.</div>
                        )}

                        {!loadingTab && activeTab === 'history' && (
                            <HistoryView history={history} onSelect={handleHistoryClick} />
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

const ResourcesView = ({ resources, roleName }: any) => (
    <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="text-yellow-400" />
                Recommended Resources for {roleName}
            </h3>
            {resources.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                    {resources.map((res: any, idx: number) => (
                        <ResourceCard
                            key={idx}
                            title={res.title}
                            type={res.type}
                            link={res.url || res.link}
                            desc={res.description || res.desc}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-950 rounded-lg border border-slate-800 border-dashed">
                    <BookOpen className="mx-auto text-slate-600 mb-2" size={32} />
                    <p className="text-slate-400">No specific resources found for this role yet.</p>
                </div>
            )}
        </div>
    </div>
);

const ResourceCard = ({ title, type, link, desc }: any) => (
    <div
        onClick={() => link && window.open(link, '_blank')}
        className="bg-slate-950 border border-slate-800 p-4 rounded-lg hover:border-blue-500/50 transition-colors group cursor-pointer"
    >
        <div className="flex justify-between items-start mb-2">
            <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">{type || 'Resource'}</span>
            {link && <ExternalLink size={16} className="text-slate-500 group-hover:text-white transition-colors" />}
        </div>
        <h4 className="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{title}</h4>
        <p className="text-sm text-slate-400 line-clamp-2">{desc}</p>
    </div>
);

const DynamicRoadmap = ({ roadmap, roleName }: any) => {
    if (!roadmap || !roadmap.phases) return null;

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <BookOpen className="text-purple-400" />
                    Personalized Learning Roadmap: {roleName}
                </h3>
                <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-bold uppercase border border-blue-600/30">
                    {roadmap.phases.length} Phases
                </span>
            </div>

            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                {roadmap.phases.map((phase: any, idx: number) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 z-10 transition-all duration-300 shadow-xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2
                            ${phase.status === 'completed' ? 'bg-slate-900 border-emerald-500 text-emerald-500' :
                                phase.status === 'in-progress' ? 'bg-slate-900 border-blue-500 text-blue-400 scale-125' :
                                    'bg-slate-900 border-slate-700 text-slate-600'}`}>
                            {phase.status === 'completed' ? <Award size={18} /> :
                                phase.status === 'in-progress' ? <Target size={18} /> :
                                    <span className="font-bold text-sm">{idx + 1}</span>}
                        </div>
                        <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border transition-all duration-300
                            ${phase.status === 'in-progress' ? 'bg-blue-900/10 border-blue-500/50 shadow-lg shadow-blue-500/10' :
                                'bg-slate-950 border-slate-800 hover:border-slate-700'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded
                                    ${phase.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                        phase.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400' :
                                            'bg-slate-800 text-slate-500'}`}>
                                    {phase.status || 'Locked'}
                                </span>
                                <span className="text-xs text-slate-500">{phase.duration}</span>
                            </div>
                            <div className={`font-bold text-lg mb-2 ${phase.status === 'in-progress' ? 'text-white' : 'text-slate-300'}`}>
                                {phase.phaseName}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {phase.skills.map((skill: any, i: number) => (
                                    <span key={i} className="px-2 py-1 bg-slate-900 rounded text-xs text-slate-400 border border-slate-800">
                                        {skill.skillName}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DynamicSimulation = ({ simulation, roleName }: any) => {
    const [selectedStage, setSelectedStage] = useState(0);
    const stages = [
        { label: 'One Year', data: simulation.oneYear },
        { label: 'Three Years', data: simulation.threeYears },
        { label: 'Five Years', data: simulation.fiveYears }
    ];

    const currentData = stages[selectedStage].data;

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <TrendingUp className="text-emerald-400" />
                Career Trajectory Simulation: {roleName}
            </h3>

            {/* Visual Timeline */}
            <div className="relative mb-12 px-4">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 rounded-full"></div>
                <div className="flex justify-between relative z-10">
                    {stages.map((stage: any, idx: number) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedStage(idx)}
                            className={`flex flex-col items-center gap-3 group transition-all duration-300 ${selectedStage === idx ? 'scale-110' : 'opacity-70 hover:opacity-100'}`}
                        >
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 shadow-xl transition-all
                                ${selectedStage === idx
                                    ? 'bg-slate-900 border-blue-500 text-blue-400 shadow-blue-500/20'
                                    : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                                <span className="font-bold text-lg">{idx + 1}</span>
                            </div>
                            <div className={`text-sm font-bold bg-slate-950 px-3 py-1 rounded-full border border-slate-800
                                ${selectedStage === idx ? 'text-white border-blue-500/50' : 'text-slate-500'}`}>
                                {stage.label}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Detailed Stage View */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <TrendingUp size={120} />
                </div>

                <div className="grid md:grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-4">
                        <div>
                            <div className="text-slate-500 text-sm uppercase tracking-wider font-bold mb-1">Estimated Role</div>
                            <h4 className="text-3xl font-bold text-white">{currentData.jobRole}</h4>
                        </div>

                        <div>
                            <div className="text-slate-500 text-sm uppercase tracking-wider font-bold mb-1">Salary Potential</div>
                            <div className="text-4xl font-bold text-emerald-400 flex items-center gap-2">
                                {currentData.salaryRange ? `₹${(currentData.salaryRange.minSalary / 100000).toFixed(1)}L - ₹${(currentData.salaryRange.maxSalary / 100000).toFixed(1)}L` : 'TBD'}
                                <span className="text-sm font-normal text-slate-500 bg-slate-900 px-2 py-1 rounded">per year</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 border-l border-slate-800 pl-8">
                        <div>
                            <div className="text-slate-500 text-sm uppercase tracking-wider font-bold mb-2">Top Skills Gained</div>
                            <div className="flex flex-wrap gap-2">
                                {/* Slice to max 6 skills to avoid overflow */}
                                {currentData.skillsGained && currentData.skillsGained.slice(0, 6).map((skill: string, i: number) => (
                                    <span key={i} className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs border border-slate-700">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {currentData.roleTransition && (
                            <div>
                                <div className="text-slate-500 text-sm uppercase tracking-wider font-bold mb-2">Next Transition</div>
                                <div className="text-blue-400 font-bold">{currentData.roleTransition}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const HistoryView = ({ history, onSelect }: any) => {
    if (!history || history.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-950 rounded-lg border border-slate-800 border-dashed">
                <Award className="mx-auto text-slate-600 mb-2" size={32} />
                <p className="text-slate-400">No assessment history found.</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Award className="text-purple-400" />
                Assessment History
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.map((item: any, idx: number) => (
                    <div key={idx} className="bg-slate-950 p-4 rounded-lg border border-slate-800 hover:border-blue-500/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <div className="font-bold text-white text-lg">{item.domain || "Assessment"}</div>
                            <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                                {new Date(item.completedAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <div className="text-sm text-slate-400">
                                {item.totalQuestions} Questions
                            </div>
                            <button
                                onClick={() => onSelect(item.assessmentId)}
                                className="text-sm px-3 py-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded transition-colors"
                            >
                                View Results
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CareerAI;
