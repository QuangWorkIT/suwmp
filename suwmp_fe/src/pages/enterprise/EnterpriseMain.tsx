import { Outlet } from "react-router";
import EnterpriseHeader from "./EnterpriseHeader";
import EnterpriseSidebar from "./EnterpriseSidebar";

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
