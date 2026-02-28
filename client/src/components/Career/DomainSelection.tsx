import { Code, ArrowRight, Sparkles } from 'lucide-react';

interface DomainSelectionProps {
    onSelectDomain: (domain: string) => void;
}

const DOMAINS = [
    {
        id: 'Tech Roles',
        name: 'Tech Roles',
        icon: Code,
        color: 'from-blue-600 to-cyan-600',
        description: 'Build, deploy, and scale software systems',
        roles: ['Full Stack Developer', 'Data Scientist', 'AI/ML Engineer', 'Cloud Engineer', 'Cyber Security Analyst'],
        gradient: 'bg-gradient-to-br from-blue-600/20 to-cyan-600/20',
        border: 'border-blue-500/50',
        iconColor: 'text-blue-400'
    }
];

const DomainSelection = ({ onSelectDomain }: DomainSelectionProps) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold text-white">Choose Your Career Domain</h2>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                    Select the domain that excites you most. We'll tailor your assessment and recommendations accordingly.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {DOMAINS.map((domain, index) => (
                    <button
                        key={domain.id}
                        onClick={() => onSelectDomain(domain.id)}
                        className={`${domain.gradient} border ${domain.border} p-8 rounded-2xl text-left transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-${domain.color}/20 group relative overflow-hidden`}
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {/* Background Glow Effect */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${domain.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>

                        {/* Content */}
                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-4 rounded-xl ${domain.gradient} border ${domain.border}`}>
                                    <domain.icon className={domain.iconColor} size={32} />
                                </div>
                                <ArrowRight className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" size={24} />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-slate-300 transition-all">
                                {domain.name}
                            </h3>

                            <p className="text-slate-400 mb-4 group-hover:text-slate-300 transition-colors">
                                {domain.description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {domain.roles.map((role) => (
                                    <span
                                        key={`${role}-${index}`}
                                        className="px-3 py-1 bg-slate-900/50 text-slate-300 rounded-full text-sm border border-slate-800 group-hover:border-slate-700 transition-colors"
                                    >
                                        {role}
                                    </span>
                                ))}
                            </div>

                            {/* Hover Sparkle Effect */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Sparkles className={domain.iconColor} size={20} />
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            <div className="text-center">
                <p className="text-sm text-slate-500">
                    💡 Don't worry, you can explore other domains later
                </p>
            </div>
        </div>
    );
};

export default DomainSelection;
