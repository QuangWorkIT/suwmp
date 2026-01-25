import { Outlet, useLocation } from "react-router";
import EnterpriseHeader from "./EnterpriseHeader";
import EnterpriseSidebar from "./EnterpriseSidebar";

const EnterpriseMain = () => {
  const location = useLocation();
  
  // Determine header title and subtitle based on route
  const getHeaderContent = () => {
    if (location.pathname.includes("/collectors")) {
      return {
        title: "Collector Management",
        subtitle: "Manage your collection team",
      };
    }
    return {
      title: "Operations Dashboard",
      subtitle: "Real-time overview of waste processing operations",
    };
  };

  const { title, subtitle } = getHeaderContent();
  const isCollectorsPage = location.pathname.includes("/collectors");

  return (
    <div className="flex h-screen overflow-hidden">
      <EnterpriseSidebar />
      <div className="w-full flex flex-col overflow-hidden">
        <EnterpriseHeader 
          title={isCollectorsPage ? undefined : title} 
          subtitle={isCollectorsPage ? undefined : subtitle} 
        />
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EnterpriseMain;
