// ProfileHeader.jsx
import { ArrowLeft, User } from "lucide-react";
import { useNavigate } from "react-router";

function ProfileHeader() {
    const navigate = useNavigate();

    return (
        <header className="bg-white border-b h-16 flex items-center px-6 sticky top-0 z-10">
            <button
                onClick={() => navigate("/citizen/dashboard")}
                className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Back to Dashboard</span>
            </button>

            <div className="flex items-center ml-auto text-gray-700">
                <User className="w-4 h-4 mr-2" />
                <span className="text-sm font-semibold">My Profile</span>
            </div>
        </header>
    );
}

export default ProfileHeader;