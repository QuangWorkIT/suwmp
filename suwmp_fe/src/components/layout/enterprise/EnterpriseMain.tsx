import { Outlet } from "react-router";
import EnterpriseSidebar from "./EnterpriseSidebar";
import EnterpriseHeader from "./EnterpriseHeader";

const EnterpriseMain = () => {
  return (
    <div className="flex">
      <EnterpriseSidebar />
      <div className="w-full">
        <EnterpriseHeader />
        <Outlet />
      </div>
    </div>
  );
};

export default EnterpriseMain;
