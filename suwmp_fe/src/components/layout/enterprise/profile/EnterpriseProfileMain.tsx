import { Outlet } from "react-router";
import EnterpriseProfileHeader from "./EnterpriseProfileHeader";
import EnterpriseProfileSidebar from "./EnterpriseProfileSidebar";

function EnterpriseProfileMain() {
    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <EnterpriseProfileHeader />

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <EnterpriseProfileSidebar />

                    <div className="flex-1">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default EnterpriseProfileMain;