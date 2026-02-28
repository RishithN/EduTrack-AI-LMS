import { User, Layers, Hash, BookOpen } from 'lucide-react';

interface ProfileCardProps {
    name: string;
    studentId: string;
    department: string;
    semester: number;
    section: string;
}

const ProfileCard = ({ name, studentId, department, semester, section }: ProfileCardProps) => {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-blue-500/50 dark:hover:border-blue-500/30 transition-all duration-500 shadow-sm dark:shadow-none">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Layers size={120} className="text-slate-900 dark:text-white" />
            </div>

            <div className="flex items-start gap-5 relative z-10">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-500/20">
                    {name.charAt(0)}
                </div>

                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {name}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-sm">
                        <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors">
                            <Hash size={12} /> {studentId}
                        </span>
                        <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20 flex items-center gap-1.5 transition-colors">
                            <Layers size={14} /> {department} Only
                        </span>
                        <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors">
                            <BookOpen size={14} /> Sem {semester} - {section}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
