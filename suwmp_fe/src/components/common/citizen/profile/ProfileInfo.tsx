import { Camera, Edit2, Leaf, Phone, Mail, User } from "lucide-react";
import type { CitizenProfileGetResponse } from "@/types/citizenProfile";

interface ProfileInfoProps {
    profile: CitizenProfileGetResponse;
}

const ProfileInfo = ({ profile }: ProfileInfoProps) => {
    // Generate initial for avatar
    const initial = profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U';

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-[#4ade80] to-[#0f766e] rounded-3xl flex items-center justify-center text-white text-4xl font-semibold shadow-lg">
                            {initial}
                        </div>
                        <button className="absolute -bottom-2 -right-2 bg-white text-green-600 p-2 rounded-full shadow-md hover:bg-gray-50 border border-gray-100 transition-colors focus:outline-none">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile.fullName || "Unknown Citizen"}</h1>
                        <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-1.5">
                            <Leaf className="w-4 h-4 text-green-500" /> 
                            Joined in {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-sm font-medium text-gray-500">
                            <span className="text-gray-700 font-semibold">{profile.points?.toLocaleString() || 0}</span> Points
                        </p>
                    </div>
                </div>
                <button className="flex items-center px-4 py-2 border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1">
                    <Edit2 className="w-4 h-4 mr-2 text-gray-500" />
                    Edit Profile
                </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-6 max-w-2xl">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-md text-sm text-gray-900 bg-gray-50/50 focus:ring-green-500 focus:border-green-500 disabled:opacity-75 disabled:cursor-not-allowed"
                            value={profile.fullName || ""}
                            disabled
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-md text-sm text-gray-900 bg-gray-50/50 focus:ring-green-500 focus:border-green-500 disabled:opacity-75 disabled:cursor-not-allowed"
                            value={profile.phoneNumber || ""}
                            disabled
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-md text-sm text-gray-900 bg-gray-50/50 focus:ring-green-500 focus:border-green-500 disabled:opacity-75 disabled:cursor-not-allowed"
                            value={profile.email || ""}
                            disabled
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileInfo;
