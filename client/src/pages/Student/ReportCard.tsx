import { Download, Award, FileText } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const SEMESTER_RESULTS = [
    { subject: 'Data Structures', code: 'CS201', grade: 'O', points: 10 },
    { subject: 'OOPs', code: 'CS202', grade: 'A+', points: 9 },
    { subject: 'DBMS', code: 'CS203', grade: 'A', points: 8 },
    { subject: 'Computer Networks', code: 'CS204', grade: 'A+', points: 9 },
    { subject: 'Web Development', code: 'CS205', grade: 'O', points: 10 },
    { subject: 'Cyber Security Essentials', code: 'CS206', grade: 'A', points: 9 },
];

const ReportCard = () => {
    const handleDownloadPDF = () => {
        // Simple PDF generation simulation
        const content = `
EDUTRACK - SEMESTER REPORT CARD
================================
Student: CSE Student
Semester: 1
Department: Computer Science & Engineering

GRADES:
-------
${SEMESTER_RESULTS.map(r => `${r.code} - ${r.subject}: ${r.grade} (${r.points} points)`).join('\n')}

SGPA: 9.2
CGPA: 9.05
        `;

        const blob = new Blob([content], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'EduTrack_ReportCard_Sem1.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <DashboardLayout role="student">
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Semester 1 Report Card</h1>
                        <p className="text-slate-400">Computer Science & Engineering</p>
                    </div>
                    <button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        <Download size={18} /> Download PDF
                    </button>
                </div>

                {/* GPA Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
                            <Award size={32} />
                        </div>
                        <div>
                            <div className="text-slate-400 text-sm">SGPA</div>
                            <div className="text-3xl font-bold text-white">9.2</div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg">
                            <FileText size={32} />
                        </div>
                        <div>
                            <div className="text-slate-400 text-sm">CGPA</div>
                            <div className="text-3xl font-bold text-white">9.05</div>
                        </div>
                    </div>
                </div>

                {/* Detailed Marks Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                            <tr>
                                <th className="p-4 font-medium">Subject Code</th>
                                <th className="p-4 font-medium">Subject Name</th>
                                <th className="p-4 font-medium">Grade</th>
                                <th className="p-4 font-medium">Grade Points</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {SEMESTER_RESULTS.map((res) => (
                                <tr key={res.code} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4 font-mono text-slate-400 text-sm">{res.code}</td>
                                    <td className="p-4 text-slate-200 font-medium">{res.subject}</td>
                                    <td className="p-4">
                                        <span className={`font-bold px-2 py-1 rounded text-sm ${res.grade === 'O' ? 'bg-yellow-500/10 text-yellow-500' :
                                            res.grade === 'A+' ? 'bg-emerald-500/10 text-emerald-500' :
                                                'bg-blue-500/10 text-blue-500'
                                            }`}>
                                            {res.grade}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-300">{res.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ReportCard;
