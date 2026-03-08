import type { WeekSchedule, TimetableEntry } from '../types/timetable';

const SUBJECTS = {
    CS201: { code: 'CS201', name: 'Data Structures & Algorithms', faculty: 'Dr. Smith' },
    CS202: { code: 'CS202', name: 'Object Oriented Programming', faculty: 'Prof. Johnson' },
    CS203: { code: 'CS203', name: 'Database Management Systems', faculty: 'Dr. Williams' },
    CS204: { code: 'CS204', name: 'Computer Networks', faculty: 'Prof. Brown' },
    CS205: { code: 'CS205', name: 'Web Development', faculty: 'Dr. Davis' },
    CS206: { code: 'CS206', name: 'Cyber Security Essentials', faculty: 'Prof. Anderson' },
};

const BREAK: TimetableEntry = {
    id: 'break',
    subjectCode: 'LUNCH',
    subjectName: 'Lunch Break',
    facultyName: '',
    roomNumber: 'Cafeteria',
    startTime: '12:00',
    endTime: '13:00',
    type: 'break',
};

// Helper to get Monday of the current week for a given date
const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(date.setDate(diff));
};

const getDaysArray = (start: Date) => {
    const days = [];
    for (let i = 0; i < 5; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        days.push(d);
    }
    return days;
};

// Simple pseudo-random generator based on seed
const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

const createSlot = (
    id: string,
    subjectKey: keyof typeof SUBJECTS,
    startTime: string,
    endTime: string,
    date: Date,
    isLab = false,
    room = '301'
): TimetableEntry => {
    // Unique seed for this slot based on date and time
    const seed = date.getTime() + parseInt(startTime.replace(':', ''));
    const randomVal = seededRandom(seed);

    // Determine status based on date relative to today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const slotDate = new Date(date);
    slotDate.setHours(0, 0, 0, 0);

    let status: 'attended' | 'absent' | 'upcoming' = 'upcoming';

    if (slotDate < today) {
        // Past date: randomize attendance
        // 80% chance attended, 20% absent
        status = randomVal > 0.2 ? 'attended' : 'absent';
    } else if (slotDate.getTime() === today.getTime()) {
        // Today: partially attended/upcoming based on time? 
        // For simplicity, let's keep it 'upcoming' or 'attended' if early
        status = 'upcoming';
    }

    return {
        id: `${id}-${date.toISOString().split('T')[0]}`,
        subjectCode: SUBJECTS[subjectKey].code,
        subjectName: SUBJECTS[subjectKey].name,
        facultyName: SUBJECTS[subjectKey].faculty,
        roomNumber: isLab ? 'Lab 2' : room,
        startTime,
        endTime,
        type: isLab ? 'lab' : 'theory',
        // Laptop requirement removed
        attendanceStatus: status,
    };
};

export const getStudentSchedule = (currentDate: Date): WeekSchedule => {
    const monday = getMonday(currentDate);
    const weekDays = getDaysArray(monday);

    return {
        weekStartDate: monday.toISOString(),
        days: [
            {
                day: 'Monday',
                date: weekDays[0].toISOString(),
                slots: [
                    createSlot('mon-1', 'CS201', '09:00', '10:00', weekDays[0]),
                    createSlot('mon-2', 'CS204', '10:00', '11:00', weekDays[0]),
                    createSlot('mon-3', 'CS205', '11:00', '12:00', weekDays[0]),
                    BREAK,
                    createSlot('mon-lab', 'CS201', '14:00', '16:00', weekDays[0], true),
                    createSlot('mon-4', 'CS202', '13:00', '14:00', weekDays[0]),
                ].sort((a, b) => a.startTime.localeCompare(b.startTime)),
            },
            {
                day: 'Tuesday',
                date: weekDays[1].toISOString(),
                slots: [
                    createSlot('tue-1', 'CS202', '09:00', '10:00', weekDays[1]),
                    createSlot('tue-2', 'CS203', '10:00', '11:00', weekDays[1]),
                    createSlot('tue-3', 'CS206', '11:00', '12:00', weekDays[1]),
                    BREAK,
                    createSlot('tue-4', 'CS201', '13:00', '14:00', weekDays[1]),
                    createSlot('tue-5', 'CS204', '14:00', '15:00', weekDays[1]),
                    createSlot('tue-6', 'CS205', '15:00', '16:00', weekDays[1]),
                ],
            },
            {
                day: 'Wednesday',
                date: weekDays[2].toISOString(),
                slots: [
                    createSlot('wed-1', 'CS203', '09:00', '10:00', weekDays[2]),
                    createSlot('wed-2', 'CS201', '10:00', '11:00', weekDays[2]),
                    createSlot('wed-3', 'CS204', '11:00', '12:00', weekDays[2]),
                    BREAK,
                    createSlot('wed-4', 'CS206', '13:00', '14:00', weekDays[2]),
                    createSlot('wed-lab', 'CS202', '14:00', '16:00', weekDays[2], true),
                ].sort((a, b) => a.startTime.localeCompare(b.startTime)),
            },
            {
                day: 'Thursday',
                date: weekDays[3].toISOString(),
                slots: [
                    createSlot('thu-1', 'CS204', '09:00', '10:00', weekDays[3]),
                    createSlot('thu-2', 'CS205', '10:00', '11:00', weekDays[3]),
                    createSlot('thu-3', 'CS202', '11:00', '12:00', weekDays[3]),
                    BREAK,
                    createSlot('thu-4', 'CS203', '13:00', '14:00', weekDays[3]),
                    createSlot('thu-5', 'CS201', '14:00', '15:00', weekDays[3]),
                    createSlot('thu-6', 'CS206', '15:00', '16:00', weekDays[3]),
                ],
            },
            {
                day: 'Friday',
                date: weekDays[4].toISOString(),
                slots: [
                    createSlot('fri-1', 'CS205', '09:00', '10:00', weekDays[4]),
                    createSlot('fri-2', 'CS206', '10:00', '11:00', weekDays[4]),
                    createSlot('fri-3', 'CS202', '11:00', '12:00', weekDays[4]),
                    BREAK,
                    createSlot('fri-4', 'CS204', '13:00', '14:00', weekDays[4]),
                    createSlot('fri-lab', 'CS203', '14:00', '16:00', weekDays[4], true),
                ].sort((a, b) => a.startTime.localeCompare(b.startTime)),
            },
        ],
    };
};

export const getTeacherSchedule = (currentDate: Date): WeekSchedule => {
    const monday = getMonday(currentDate);
    const weekDays = getDaysArray(monday);



    return {
        weekStartDate: monday.toISOString(),
        days: [
            {
                day: 'Monday',
                date: weekDays[0].toISOString(),
                slots: [
                    createSlot('mon-1', 'CS201', '09:00', '10:00', weekDays[0]),
                    BREAK,
                    createSlot('mon-lab', 'CS201', '14:00', '16:00', weekDays[0], true),
                ].map(s => ({ ...s, attendanceStatus: undefined })).sort((a, b) => a.startTime.localeCompare(b.startTime)),
            },
            {
                day: 'Tuesday',
                date: weekDays[1].toISOString(),
                slots: [
                    createSlot('tue-1', 'CS202', '09:00', '10:00', weekDays[1]),
                    BREAK,
                    createSlot('tue-4', 'CS201', '13:00', '14:00', weekDays[1]),
                ].map(s => ({ ...s, attendanceStatus: undefined })).sort((a, b) => a.startTime.localeCompare(b.startTime)),
            },
            {
                day: 'Wednesday',
                date: weekDays[2].toISOString(),
                slots: [
                    createSlot('wed-2', 'CS201', '10:00', '11:00', weekDays[2]),
                    BREAK,
                    createSlot('wed-lab', 'CS202', '14:00', '16:00', weekDays[2], true),
                ].map(s => ({ ...s, attendanceStatus: undefined })).sort((a, b) => a.startTime.localeCompare(b.startTime)),
            },
            {
                day: 'Thursday',
                date: weekDays[3].toISOString(),
                slots: [
                    BREAK,
                    createSlot('thu-5', 'CS201', '14:00', '15:00', weekDays[3]),
                ].map(s => ({ ...s, attendanceStatus: undefined })),
            },
            {
                day: 'Friday',
                date: weekDays[4].toISOString(),
                slots: [
                    createSlot('fri-3', 'CS202', '11:00', '12:00', weekDays[4]),
                    BREAK,
                ].map(s => ({ ...s, attendanceStatus: undefined })).sort((a, b) => a.startTime.localeCompare(b.startTime)),
            },
        ],
    };
};
export const getOverallAttendance = () => {
    const startDate = new Date('2026-01-01T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendanceMap: Record<string, { subject: string, name: string, code: string, total: number, attended: number }> = {};

    for (const subject of Object.values(SUBJECTS)) {
        attendanceMap[subject.code] = { subject: subject.name, name: subject.name, code: subject.code, total: 0, attended: 0 };
    }

    let currentDate = new Date(startDate);

    while (currentDate < today) {
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
            const schedule = getStudentSchedule(currentDate);
            const daySchedule = schedule.days.find(d => new Date(d.date || '').toDateString() === currentDate.toDateString());
            if (daySchedule) {
                daySchedule.slots.forEach(slot => {
                    if (slot.type !== 'break' && attendanceMap[slot.subjectCode]) {
                        attendanceMap[slot.subjectCode].total += 1;
                        if (slot.attendanceStatus === 'attended') {
                            attendanceMap[slot.subjectCode].attended += 1;
                        }
                    }
                });
            }
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return Object.values(attendanceMap).map(data => ({
        ...data,
        percentage: data.total > 0 ? (data.attended / data.total) * 100 : 0
    }));
};
