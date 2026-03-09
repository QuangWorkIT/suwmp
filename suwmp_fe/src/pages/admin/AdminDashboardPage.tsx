import React, { useEffect, useState } from "react";
import { Users, UserCheck, AlertCircle, ShieldCheck } from "lucide-react";
import { AdminDashboardService } from "../../services/AdminDashboardService";
import type { DashboardStats, DashboardUser, DashboardComplaint } from "../../services/AdminDashboardService";
import StatCard from "../../components/StatCard";
import UserManagementSection from "../../components/UserManagementSection";
import OpenComplaintsSidebar from "../../components/OpenComplaintsSidebar";


const AdminDashboardPage: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [users, setUsers] = useState<DashboardUser[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [complaints, setComplaints] = useState<DashboardComplaint[]>([]);


    const [loading, setLoading] = useState({
        stats: true,
        users: true,
        complaints: true,

    });

    const [errors, setErrors] = useState<{ [key: string]: string | null }>({
        stats: null,
        users: null,
        complaints: null,

    });

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading({ stats: true, users: true, complaints: true });

            // Using separate promises but initiating them at the same time
            // Individual catch/finally to prevent one failure from stopping the others
            
            // Stats
            AdminDashboardService.getStats()
                .then(res => res.success ? setStats(res.data) : setErrors(p => ({...p, stats: res.message})))
                .catch(err => setErrors(p => ({...p, stats: err.message})))
                .finally(() => setLoading(p => ({...p, stats: false})));

            // Users
            AdminDashboardService.getUsers(0, 4)
                .then(res => {
                    if (res.success) {
                        setUsers(res.data.content);
                        setTotalUsers(res.data.totalElements);
                    } else setErrors(p => ({...p, users: res.message}));
                })
                .catch(err => setErrors(p => ({...p, users: err.message})))
                .finally(() => setLoading(p => ({...p, users: false})));

            // Complaints
            AdminDashboardService.getOpenComplaints(3)
                .then(res => res.success ? setComplaints(res.data) : setErrors(p => ({...p, complaints: res.message})))
                .catch(err => setErrors(p => ({...p, complaints: err.message})))
                .finally(() => setLoading(p => ({...p, complaints: false})));


        };

        fetchAllData();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                    title="Total Users"
                    value={stats?.totalUsers ?? "—"}
                    delta={stats?.userGrowth ?? undefined}
                    icon={Users}
                    iconBgColor="bg-purple-100/50"
                    iconColor="text-purple-600"
                    loading={loading.stats}
                    error={errors.stats}
                />
                <StatCard
                    title="Active Today"
                    value={stats?.activeToday ?? "—"}
                    delta={stats?.activeTodayGrowth ?? undefined}
                    deltaType="percentage"
                    icon={UserCheck}
                    iconBgColor="bg-green-100/50"
                    iconColor="text-green-600"
                    loading={loading.stats}
                    error={errors.stats}
                />
                <StatCard
                    title="Open Complaints"
                    value={stats?.openComplaints ?? "—"}
                    delta={stats?.openComplaintsDelta ?? undefined}
                    icon={AlertCircle}
                    iconBgColor="bg-orange-100/50"
                    iconColor="text-orange-600"
                    loading={loading.stats}
                    error={errors.stats}
                />
                <StatCard
                    title="System Health"
                    value={stats?.systemHealthPercent !== null && stats?.systemHealthPercent !== undefined ? `${stats.systemHealthPercent}%` : "—"}
                    statusText={stats?.systemHealthStatus || ""}
                    icon={ShieldCheck}
                    iconBgColor="bg-blue-100/50"
                    iconColor="text-blue-600"
                    loading={loading.stats}
                    error={errors.stats}
                />

            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Side: User Management */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <UserManagementSection
                        users={users}
                        totalUsers={totalUsers}
                        loading={loading.users}
                        error={errors.users}
                    />
                    
                    {/* Analytics Chart Placeholder */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-[400px] flex flex-col items-center justify-center text-center">
                        <div className="mb-4 p-4 rounded-2xl bg-gray-50 text-gray-400">
                            <Users size={48} />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Platform Analytics</h4>
                        <p className="text-sm text-gray-500 max-w-xs">
                            Detailed visual trends and collection metrics will appear here.
                        </p>
                    </div>
                </div>

                {/* Right Side: Sidebars */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <OpenComplaintsSidebar
                        complaints={complaints}
                        loading={loading.complaints}
                        error={errors.complaints}
                    />

                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
