import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    profileId?: string;
}

interface Profile {
    studentId: string;
    department: string;
    semester: number;
    section: string;
    cgpa: number;
    skills: string[];
}

export const useUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                const token = localStorage.getItem('token');

                if (storedUser && token) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);

                    // Ideally fetch fresh profile data here using parsedUser.id
                    // For now, we simulate or use what we have. 
                    // In a real app: const res = await axios.get('/api/users/profile', ...);
                }
            } catch (err) {
                console.error("Failed to load user", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, profile, loading };
};
