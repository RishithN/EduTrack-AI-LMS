export type UserRole = 'student' | 'teacher' | 'parent';

export type AttendanceStatus = 'attended' | 'absent' | 'holiday' | 'upcoming' | 'neutral';

export interface TimetableEntry {
    id: string;
    subjectCode: string;
    subjectName: string;
    facultyName: string; // Visible to Student/Parent
    section?: string;    // Visible to Teacher
    roomNumber: string;
    startTime: string;   // e.g., "09:00"
    endTime: string;     // e.g., "10:00"
    type: 'theory' | 'lab' | 'break';
    isLaptopRequired?: boolean;
    attendanceStatus?: AttendanceStatus; // Optional, dynamically merged
}

export interface DaySchedule {
    day: string; // "Monday", "Tuesday", etc.
    date?: string; // ISO date string for specific week view
    slots: TimetableEntry[];
}

export interface WeekSchedule {
    weekStartDate: string; // Start of the week (Monday)
    days: DaySchedule[];
}
