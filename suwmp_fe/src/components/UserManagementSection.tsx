import React from "react";
import { Eye, Edit, Trash2, Filter, Plus } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import type { DashboardUser } from "../services/AdminDashboardService";

interface UserManagementSectionProps {
  users: DashboardUser[];
  totalUsers: number;
  loading: boolean;
  error: string | null;
}

const UserManagementSection: React.FC<UserManagementSectionProps> = ({
  users,
  totalUsers,
  loading,
  error,
}) => {
  const getRoleBadgeColor = (role: string) => {
    switch (role.toUpperCase()) {
      case "CITIZEN":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "ENTERPRISE":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "COLLECTOR":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "bg-green-100 text-green-700 border-green-200";
      case "SUSPENDED":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 flex items-center justify-between border-b border-gray-50">
        <h3 className="text-lg font-bold text-gray-900">User Management</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-2 text-gray-600 border-gray-200" disabled aria-label="Filter users">
            <Filter size={16} />
            Filter
          </Button>
          <Button size="sm" className="h-9 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-none" disabled aria-label="Add new user">
            <Plus size={16} />
            Add User
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </td>
                  <td className="px-6 py-4"><Skeleton className="h-5 w-20 rounded-full" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-5 w-20 rounded-full" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-24 ml-auto" /></td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-red-500 font-medium">
                  {error}
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">{user.fullName}</span>
                      <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={`px-2 py-0 h-6 text-[10px] uppercase font-bold ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={`px-2 py-0 h-6 text-[10px] uppercase font-bold ${getStatusBadgeColor(user.status)}`}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 text-gray-400">
                      <button className="hover:text-blue-600 transition-colors disabled:opacity-50" disabled aria-label="View user details"><Eye size={18} /></button>
                      <button className="hover:text-emerald-600 transition-colors disabled:opacity-50" disabled aria-label="Edit user"><Edit size={18} /></button>
                      <button className="hover:text-rose-600 transition-colors disabled:opacity-50" disabled aria-label="Delete user"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-6 flex items-center justify-between border-t border-gray-50">
        <p className="text-sm text-gray-500">
           Showing <span className="font-semibold text-gray-900">{users.length}</span> of <span className="font-semibold text-gray-900">{totalUsers.toLocaleString()}</span> users
        </p>
        <Link to="/admin/users" className="text-sm font-bold text-gray-900 hover:text-blue-600 flex items-center gap-1">
          View All Users
          <span className="text-lg">→</span>
        </Link>
      </div>
    </div>
  );
};

export default UserManagementSection;
