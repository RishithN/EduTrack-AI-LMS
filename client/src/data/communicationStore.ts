export interface MeetingRequest {
    id: number;
    parentName: string;
    studentName: string;
    reason: string;
    date: string;
    time: string;
    status: 'pending' | 'approved' | 'rejected';
    requestDate: string;
}

export interface ChatMessage {
    id: number;
    sender: 'teacher' | 'parent'; // 'parent' means sent BY parent
    text: string;
    timestamp: string;
}

const STORAGE_KEYS = {
    MEETINGS: 'edutrack_meetings',
    CHAT: 'edutrack_chat'
};

// Initial Mock Data to populate if empty
const INITIAL_MEETINGS: MeetingRequest[] = [
    {
        id: 1700000000000,
        parentName: 'Mr. Verma',
        studentName: 'Arjun Verma',
        reason: 'Academic Performance',
        date: '2024-03-20',
        time: '10:00',
        status: 'pending',
        requestDate: new Date().toISOString()
    }
];

const INITIAL_CHAT: ChatMessage[] = [
    { id: 1, sender: 'teacher', text: 'Hello Mr. Verma, Arjun is doing great in Data Structures!', timestamp: 'Yesterday, 10:30 AM' },
    { id: 2, sender: 'parent', text: 'Thank you! I was concerned about his DBMS project.', timestamp: 'Yesterday, 11:00 AM' },
];

export const communicationStore = {
    getMeetings: (): MeetingRequest[] => {
        const stored = localStorage.getItem(STORAGE_KEYS.MEETINGS);
        if (!stored) {
            localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(INITIAL_MEETINGS));
            return INITIAL_MEETINGS;
        }
        return JSON.parse(stored);
    },

    addMeeting: (req: Omit<MeetingRequest, 'id' | 'status' | 'requestDate' | 'parentName' | 'studentName'>) => {
        const meetings = communicationStore.getMeetings();
        const newMeeting: MeetingRequest = {
            ...req,
            id: Date.now(),
            status: 'pending',
            requestDate: new Date().toISOString(),
            parentName: 'Mr. Verma', // Mock logged in parent
            studentName: 'Arjun Verma'
        };
        const updated = [newMeeting, ...meetings];
        localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(updated));
        return newMeeting;
    },

    updateMeetingStatus: (id: number, status: 'approved' | 'rejected') => {
        const meetings = communicationStore.getMeetings();
        const updated = meetings.map(m => m.id === id ? { ...m, status } : m);
        localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(updated));
        return updated;
    },

    getChat: (): ChatMessage[] => {
        const stored = localStorage.getItem(STORAGE_KEYS.CHAT);
        if (!stored) {
            localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(INITIAL_CHAT));
            return INITIAL_CHAT;
        }
        return JSON.parse(stored);
    },

    addMessage: (text: string, sender: 'teacher' | 'parent') => {
        const chat = communicationStore.getChat();
        const newMessage: ChatMessage = {
            id: Date.now(),
            sender,
            text,
            timestamp: 'Just now' // In real app use ISO sting
        };
        const updated = [...chat, newMessage];
        localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(updated));
        return updated;
    }
};
