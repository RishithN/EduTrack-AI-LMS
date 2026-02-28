import { useState, useEffect } from 'react';
import { ExternalLink, Filter, Star, Clock, DollarSign, BookOpen } from 'lucide-react';

interface ResourceIntelligenceProps {
    roleId: string;
}

const ResourceIntelligence = ({ roleId }: ResourceIntelligenceProps) => {
    const [resources, setResources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        difficultyLevel: '',
        learningFormat: '',
        isPaid: ''
    });

    useEffect(() => {
        loadResources();
    }, [roleId, filters]);

    const loadResources = async () => {
        try {
            const params = new URLSearchParams();
            if (filters.difficultyLevel) params.append('difficultyLevel', filters.difficultyLevel);
            if (filters.learningFormat) params.append('learningFormat', filters.learningFormat);
            if (filters.isPaid) params.append('isPaid', filters.isPaid);

            const response = await fetch(`http://localhost:5001/api/career/resources/${roleId}?${params}`);
            const data = await response.json();
            setResources(data.resources || []);
            setLoading(false);
        } catch (error) {
            console.error('Error loading resources:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-slate-400 mt-4">Loading curated resources...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                    <Filter size={20} className="text-blue-400" />
                    <h3 className="text-lg font-bold text-white">Filter Resources</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                    <select
                        value={filters.difficultyLevel}
                        onChange={(e) => setFilters({ ...filters, difficultyLevel: e.target.value })}
                        className="bg-slate-950 border border-slate-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                        <option value="">All Difficulty Levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>

                    <select
                        value={filters.learningFormat}
                        onChange={(e) => setFilters({ ...filters, learningFormat: e.target.value })}
                        className="bg-slate-950 border border-slate-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                        <option value="">All Formats</option>
                        <option value="video">Video</option>
                        <option value="text">Text</option>
                        <option value="interactive">Interactive</option>
                        <option value="hands-on">Hands-on</option>
                    </select>

                    <select
                        value={filters.isPaid}
                        onChange={(e) => setFilters({ ...filters, isPaid: e.target.value })}
                        className="bg-slate-950 border border-slate-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                        <option value="">All Resources</option>
                        <option value="false">Free Only</option>
                        <option value="true">Paid Only</option>
                    </select>
                </div>
            </div>

            {/* Resources Grid */}
            {resources.length === 0 ? (
                <div className="text-center py-20">
                    <BookOpen className="mx-auto text-slate-600 mb-4" size={48} />
                    <p className="text-slate-400">No resources found. Try adjusting your filters.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {resources.map((resource, idx) => (
                        <a
                            key={idx}
                            href={resource.url}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-blue-500/50 hover:bg-slate-800 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${resource.type === 'course' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                        resource.type === 'video' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                            resource.type === 'certification' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                'bg-slate-700 text-slate-400 border border-slate-600'
                                    }`}>
                                    {resource.type}
                                </span>
                                <ExternalLink className="text-slate-500 group-hover:text-blue-400 transition-colors" size={18} />
                            </div>

                            <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors mb-2">
                                {resource.title}
                            </h3>

                            <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                                {resource.description}
                            </p>

                            <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                                <span className="flex items-center gap-1">
                                    <Star size={12} className="text-yellow-400" />
                                    {resource.rating || 'N/A'}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={12} />
                                    {resource.estimatedDuration || 'Self-paced'}
                                </span>
                                <span className={`flex items-center gap-1 ${resource.isPaid ? 'text-yellow-400' : 'text-green-400'}`}>
                                    <DollarSign size={12} />
                                    {resource.isPaid ? 'Paid' : 'Free'}
                                </span>
                            </div>

                            <div className="mt-3 pt-3 border-t border-slate-800">
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 bg-slate-950 text-slate-400 rounded text-xs border border-slate-800">
                                        {resource.difficultyLevel}
                                    </span>
                                    <span className="px-2 py-1 bg-slate-950 text-slate-400 rounded text-xs border border-slate-800">
                                        {resource.provider}
                                    </span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ResourceIntelligence;
