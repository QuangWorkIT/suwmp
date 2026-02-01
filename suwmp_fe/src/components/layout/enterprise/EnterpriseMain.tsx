import { Outlet } from "react-router";
import EnterpriseSidebar from "./EnterpriseSidebar";

const EnterpriseMain = () => {
  

  return (
    <div className="flex min-h-screen">
      <EnterpriseSidebar />
        <div className="flex-1 pl-0 lg:pl-[250px]">
          <Outlet />
        </div>
    </div>
  );
};

export default EnterpriseMain;
