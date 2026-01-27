import { LayoutDashboard } from "lucide-react";

const AdminDashboardPage = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col items-center justify-center py-20">
        <LayoutDashboard size={64} className="text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          System Administration
        </h3>
        <p className="text-gray-500">
          Manage users, policies, and system configuration
        </p>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
