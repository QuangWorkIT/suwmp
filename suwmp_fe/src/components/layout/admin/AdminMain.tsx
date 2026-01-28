import AdminHeader from './AdminHeader'
import { Outlet, useLocation } from 'react-router'
import AdminSideBar from './AdminSideBar'

function AdminMain() {
    const location = useLocation();

    // Map routes to header content
    const getHeaderContent = () => {
        const path = location.pathname;

        if (path.includes('/users')) {
            return {
                title: 'User Management',
                description: 'Monitor and manage platform users across all roles',
                showAddButton: true,
                buttonText: 'Add User'
            };
        } else if (path.includes('/waste-categories')) {
            return {
                title: 'Waste Categories',
                description: 'Configure AI classification types and sorting standards',
                showAddButton: true,
                buttonText: 'New Category'
            };
        } else if (path.includes('/regions')) {
            return {
                title: 'Regions & Zones',
                description: 'Manage service boundaries and regional infrastructure',
                showAddButton: true,
                buttonText: 'Add Region'
            };
        } else if (path.includes('/policies')) {
            return {
                title: 'Platform Policies',
                description: 'Manage legal, operational and technical standards',
                showAddButton: true,
                buttonText: 'Add Policy'
            };
        } else if (path.includes('/complaints')) {
            return {
                title: 'Complaints & Disputes',
                description: 'Resolve issues between citizens, collectors and enterprises',
                showAddButton: false
            };
        } else if (path.includes('/audit-logs')) {
            return {
                title: 'Audit Logs',
                description: 'Comprehensive history of all administrative actions',
                showAddButton: false
            };
        } else if (path.includes('/analytics')) {
            return {
                title: 'Platform Analytics',
                description: 'High-level insights into the entire ecosystem',
                showAddButton: false
            };
        } else if (path.includes('/access-control')) {
            return {
                title: 'Access Control (RBAC)',
                description: 'Manage administrative roles and permission levels',
                showAddButton: true,
                buttonText: 'Add Role'
            };
        } else {
            // Default for dashboard
            return {
                title: 'System Administration',
                description: 'Manage users, policies, and system configuration',
                showAddButton: false
            };
        }
    };

    const headerContent = getHeaderContent();

    return (
        <div className='bg-gray-50 w-full h-screen overflow-hidden'>
            <AdminSideBar />

            <div className="ml-[250px] h-full flex flex-col">
                <AdminHeader {...headerContent} />
                <main className="flex-1 mt-[90px] overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminMain
