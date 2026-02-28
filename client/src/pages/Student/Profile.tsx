import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Mail, Phone, MapPin, Calendar, BookOpen, Award, X } from 'lucide-react';
import { useUser } from '../../hooks/useUser';

const Profile = () => {
    const { user, profile } = useUser();
    const [showEditModal, setShowEditModal] = useState(false);

    // Initialize profile data from localStorage or user data
    const [profileData, setProfileData] = useState(() => {
        const saved = localStorage.getItem('studentProfile');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            name: user?.name || '',
            email: user?.email || '',
            phone: '+91 XXXXX XXXXX',
            address: 'Campus Address'
        };
    });

    // Update profileData when user data changes (on first load)
    useEffect(() => {
        const saved = localStorage.getItem('studentProfile');
        if (!saved && user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: '+91 XXXXX XXXXX',
                address: 'Campus Address'
            });
        }
    }, [user]);

    const handleSaveProfile = () => {
        // Save to localStorage
        localStorage.setItem('studentProfile', JSON.stringify(profileData));
        alert('Profile updated successfully!');
        setShowEditModal(false);
    };

    return (
        <DashboardLayout role="student">
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">My Profile</h1>
                    <p className="text-slate-400">View and manage your account information</p>
                </div>

                {/* Profile Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
                    <div className="flex items-start gap-6 mb-6">
                        <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white">
                            {profileData.name?.charAt(0) || 'S'}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-white mb-1">{profileData.name || 'Student Name'}</h2>
                            <p className="text-slate-400 mb-3">{profile?.studentId || 'CSE-2024-XXX'}</p>
                            <div className="flex gap-2">
                                <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/20">
                                    {profile?.department || 'CSE'}
                                </span>
                                <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full text-sm font-medium border border-purple-500/20">
                                    Semester {profile?.semester || 1}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-slate-800">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-white mb-3">Contact Information</h3>
                            <div className="flex items-center gap-3 text-slate-300">
                                <Mail size={18} className="text-slate-500" />
                                <span>{profileData.email || 'student@example.com'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                                <Phone size={18} className="text-slate-500" />
                                <span>{profileData.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                                <MapPin size={18} className="text-slate-500" />
                                <span>{profileData.address}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-white mb-3">Academic Details</h3>
                            <div className="flex items-center gap-3 text-slate-300">
                                <BookOpen size={18} className="text-slate-500" />
                                <span>Section: {profile?.section || 'A'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                                <Calendar size={18} className="text-slate-500" />
                                <span>Enrolled: Fall 2026</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                                <Award size={18} className="text-slate-500" />
                                <span>CGPA: 9.2</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Button */}
                <div className="flex justify-end">
                    <button
                        onClick={() => setShowEditModal(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Edit Profile
                    </button>
                </div>

                {/* Edit Modal */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-white">Edit Profile</h3>
                                <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <form className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-2">Address</label>
                                        <input
                                            type="text"
                                            value={profileData.address}
                                            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSaveProfile}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Profile;
