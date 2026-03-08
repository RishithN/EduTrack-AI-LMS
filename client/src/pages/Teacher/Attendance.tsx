import { useState } from 'react';
import { Calendar, Check, Search, User } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const MOCK_STUDENTS = [
    { id: 'CSE001', name: 'Arjun Verma', roll: '101' },
    { id: 'CSE002', name: 'Priya Sharma', roll: '102' },
    { id: 'CSE003', name: 'R Rohan', roll: '103' },
    { id: 'CSE004', name: 'Sneha Gupta', roll: '104' },
    { id: 'CSE005', name: 'Karthik R', roll: '105' },
    { id: 'CSE006', name: 'Ananya M', roll: '106' },
];

const TeacherAttendance = () => {
    const [selectedSubject, setSelectedSubject] = useState('CS201');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchQuery, setSearchQuery] = useState('');

    // State structure: { [date]: { [subject]: { [studentId]: 'present' | 'absent' | null } } }
    const [attendanceData, setAttendanceData] = useState<Record<string, Record<string, Record<string, 'present' | 'absent' | null>>>>(() => {
        const saved = localStorage.getItem('teacherAttendanceData');
        return saved ? JSON.parse(saved) : {};
    });

    const getStudentStatus = (id: string) => {
        return attendanceData[date]?.[selectedSubject]?.[id] || null;
    };

    const toggleStatus = (id: string) => {
        const currentStatus = getStudentStatus(id);
        const newStatus = currentStatus === 'present' ? 'absent' : 'present';

        setAttendanceData(prev => ({
            ...prev,
            [date]: {
                ...(prev[date] || {}),
                [selectedSubject]: {
                    ...(prev[date]?.[selectedSubject] || {}),
                    [id]: newStatus
                }
            }
        }));
    };

    const markAll = (status: 'present' | 'absent') => {
        const newSubjectData: Record<string, 'present' | 'absent'> = {};
        MOCK_STUDENTS.forEach(s => {
            newSubjectData[s.id] = status;
        });

        setAttendanceData(prev => ({
            ...prev,
            [date]: {
                ...(prev[date] || {}),
                [selectedSubject]: newSubjectData
            }
        }));
    };

    const saveAttendance = () => {
        localStorage.setItem('teacherAttendanceData', JSON.stringify(attendanceData));
        alert(`Attendance saved successfully for ${selectedSubject} on ${date}`);
    };

    const filteredStudents = MOCK_STUDENTS.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout role="teacher">
            <div className="max-w-5xl mx-auto space-y-6">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Attendance Management</h1>
                        <p className="text-slate-600 dark:text-slate-400">Mark daily attendance for your classes.</p>
                    </div>

                    <div className="relative flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm group">
                        <Calendar size={20} className="text-slate-500 ml-2 pointer-events-none" />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="bg-transparent text-slate-800 dark:text-white outline-none cursor-pointer z-10"
                            onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                        />
                    </div>
                </div>

                {/* Filters & Actions */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="CS201">CS201 - Data Structures</option>
                            <option value="CS203">CS203 - DBMS</option>
                            <option value="CS205">CS205 - Web Development</option>
                        </select>

                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search student..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 pl-10 pr-4 py-2.5 rounded-lg text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <button onClick={() => markAll('present')} className="flex-1 md:flex-none px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors text-sm font-medium">
                            Mark All Present
                        </button>
                        <button onClick={() => markAll('absent')} className="flex-1 md:flex-none px-4 py-2 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium">
                            Mark All Absent
                        </button>
                    </div>
                </div>

                {/* Student List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStudents.map((student) => {
                        const status = getStudentStatus(student.id);
                        return (
                            <div
                                key={student.id}
                                onClick={() => toggleStatus(student.id)}
                                className={`cursor-pointer p-4 rounded-xl border transition-all flex items-center justify-between group ${status === 'present'
                                    ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-500/30 hover:border-emerald-500'
                                    : status === 'absent'
                                        ? 'bg-red-50/50 dark:bg-red-900/10 border-red-500/30 hover:border-red-500'
                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-500/50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold transition-colors ${status === 'present'
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                                        : status === 'absent'
                                            ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                        }`}>
                                        {student.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800 dark:text-white">{student.name}</div>
                                        <div className="text-xs text-slate-500 flex items-center gap-1">
                                            <User size={12} /> {student.roll} • {student.id}
                                        </div>
                                    </div>
                                </div>

                                <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${status === 'present'
                                    ? 'bg-emerald-500 text-slate-900 dark:text-white'
                                    : status === 'absent'
                                        ? 'bg-red-500 text-slate-900 dark:text-white'
                                        : 'bg-slate-100 text-slate-700 dark:text-slate-300 dark:bg-slate-800 dark:text-slate-600 group-hover:bg-slate-200 dark:group-hover:bg-slate-100 dark:bg-slate-700'
                                    }`}>
                                    <Check size={18} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        onClick={saveAttendance}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white font-bold rounded-lg shadow-lg shadow-blue-600/20 transition-all transform hover:scale-105"
                    >
                        Save Attendance
                    </button>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default TeacherAttendance;
