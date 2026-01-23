import EnterpriseHeader from "./EnterpriseHeader";
import EnterpriseSidebar from "./EnterpriseSidebar";

const EnterpriseMain = () => {
  return (
    <div className="flex">
      <EnterpriseSidebar />
      <EnterpriseHeader />
    </div>
  );
};

export default EnterpriseMain;
