import { Outlet } from "react-router";
import EnterpriseHeader from "../../components/layout/enterprise/EnterpriseHeader";
import EnterpriseSidebar from "../../components/layout/enterprise/EnterpriseSidebar";

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
