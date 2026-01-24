import { Bell, Download } from "lucide-react";

const EnterpriseHeader = () => {
  return (
    <header className="p-6 flex self-start w-full justify-between items-center mb-6 shadow-xl">
      <div>
        <h2 className="text-2xl font-bold">Operations Dashboard</h2>
        <p className="text-gray-500">
          Real-time overview of waste processing operations
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg">
          <Download size={16} />
          Export
        </button>
        <Bell className="cursor-pointer" />
      </div>
    </header>
  );
};

export default EnterpriseHeader;
