// ProfileLayout.jsx
import ProfileSidebar from "./ProfileSidebar";
import ProfileHeader from "./ProfileHeader";
import { Outlet } from "react-router";

function CitizenProfileMain() {
    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <ProfileHeader />

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <ProfileSidebar />

                    {/* Đây là chỗ render nội dung của từng tab */}
                    <div className="flex-1">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CitizenProfileMain;