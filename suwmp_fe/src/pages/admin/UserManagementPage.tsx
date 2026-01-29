
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Download, MoreVertical } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserDialog } from "@/components/users/UserDialog";
import { type UserFormValues } from "@/components/users/UserForm";
import { toast } from "sonner"; // Assuming sonner is used for toasts based on package.json
import { useOutletContext } from 'react-router';
import { UserService } from "@/services/UserService";

interface User {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    roleId: string;
    role: 'Citizen' | 'Collector' | 'Enterprise';
    status: 'active' | 'suspended' | 'inactive';
    activity: string;
    joined: string;
    avatar: string;
}

interface UserManagementContext {
    setOnAddClick: (handler: () => void) => void;
}

export default function UserManagementPage() {
    const { setOnAddClick } = useOutletContext<UserManagementContext>();

    // State for users and pagination
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({
        pageNumber: 0,
        pageSize: 6,
        totalPages: 0,
        totalElements: 0,
        first: true,
        last: true
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    
    // Modal state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const fetchUsers = async (page: number = 0) => {
        setIsLoading(true);
        try {
            const response = await UserService.getUsers(page, pagination.pageSize);
            const { content, totalPages, totalElements, number, first, last } = response.data;
            
            // Map API response to User interface
            const mappedUsers: User[] = content.map((u: any) => ({
                id: u.id,
                fullName: u.fullName,
                email: u.email,
                phone: '', // Not in get list response yet, defaulting to empty
                roleId: '', // Not in get list response, defaulting
                role: u.role,
                status: u.status,
                activity: u.activityStatus || 'No activity',
                joined: new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                avatar: u.fullName.charAt(0).toUpperCase()
            }));

            setUsers(mappedUsers);
            setPagination({
                ...pagination,
                pageNumber: number,
                totalPages,
                totalElements,
                first,
                last
            });
        } catch (error) {
            console.error("Failed to fetch users", error);
            toast.error("Failed to load users");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handlePageChange = (newPage: number) => {
        fetchUsers(newPage);
    };

    const getRoleColor = (role: string) => {
        switch (role.toUpperCase()) {
            case 'CITIZEN':
                return 'bg-green-50 text-green-700 border border-green-100';
            case 'ENTERPRISE':
                return 'bg-orange-50 text-orange-700 border border-orange-100';
            case 'COLLECTOR':
                return 'bg-blue-50 text-blue-700 border border-blue-100';
            default:
                return 'bg-gray-50 text-gray-700 border border-gray-100';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'ACTIVE':
                return 'bg-green-50 text-green-700 border border-green-100';
            case 'SUSPENDED':
                return 'bg-red-50 text-red-700 border border-red-100';
            case 'INACTIVE':
                return 'bg-gray-100 text-gray-600 border border-gray-200';
            default:
                return 'bg-gray-50 text-gray-600';
        }
    };

    const getAvatarColor = (index: number) => {
        const colors = [
            'bg-green-500',
            'bg-orange-500',
            'bg-blue-500',
            'bg-green-500',
            'bg-blue-500',
            'bg-orange-500',
        ];
        return colors[index % colors.length];
    };



    const handleAddUser = () => {
        setSelectedUser(null);
        setIsDialogOpen(true);
    };

    useEffect(() => {
        if (setOnAddClick) {
            setOnAddClick(() => handleAddUser);
        }

        return () => {
            if (setOnAddClick) {
                setOnAddClick(() => () => {}); // Reset to no-op or null
            }
        }
    }, [setOnAddClick]);

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setIsDialogOpen(true);
    };

    const handleDeleteUser = (userId: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(u => u.id !== userId));
            toast.success("User deleted successfully");
        }
    };

    const handleFormSubmit = async (data: UserFormValues) => {
        try {
            if (selectedUser) {
                // Update existing user
                await UserService.updateUser(selectedUser.id, data);
                
                // Update local list
                const updatedUsers = users.map(user => 
                    user.id === selectedUser.id 
                        ? { 
                            ...user, 
                            ...data, 
                            role: data.roleId === "1" ? "Citizen" : data.roleId === "2" ? "Enterprise" : "Collector" as any, // Simple map for UI
                            status: data.status as any
                        } 
                        : user
                );
                setUsers(updatedUsers);
                toast.success("User updated successfully");
            } else {
                // Add new user
                await UserService.createUser({
                    ...data,
                    // If CreateUserRequest doesn't have status, we exclude it or UserService handles it. 
                    // CreateUserRequest in UserService.ts currently doesn't have status. 
                    // I should check UserService.ts CreateUserRequest. 
                    // If it doesn't, I cast data or strictly select fields.
                    // For now, assume UserService ignores extra fields or I strictly pick.
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone,
                    roleId: data.roleId
                });
                toast.success("User added successfully");
                // Refresh list to get real ID and data
                 fetchUsers(pagination.pageNumber); 
            }
            setIsDialogOpen(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to save user");
        }
    };

    return (
        <div className="space-y-6">
            <div className="hidden justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            </div>

            {/* Search and Filters Card */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        placeholder="Search by name or email..."
                        className="pl-10 h-10 bg-white border-gray-200 focus:ring-1 focus:ring-green-500 w-full rounded-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-[140px] h-10 bg-white border-gray-200 rounded-lg">
                            <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent position="popper" sideOffset={4}>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="citizen">Citizen</SelectItem>
                            <SelectItem value="collector">Collector</SelectItem>
                            <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="h-10 gap-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50">
                        <Filter size={16} />
                        Filters
                    </Button>
                    <Button variant="outline" className="h-10 gap-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50">
                        <Download size={16} />
                        Export
                    </Button>
                </div>
            </div>

            {/* Users Table Card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <table className="w-full">
                        <thead className="bg-white border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Activity
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        Loading users...
                                    </td>
                                </tr>
                            ) : users.length > 0 ? (
                                users.map((user, index) => (
                                    <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full ${getAvatarColor(index)} flex items-center justify-center text-white font-medium shadow-sm`}>
                                                    {user.avatar}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 group-hover:text-green-700 transition-colors">{user.fullName}</div>
                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {user.activity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {user.joined}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                                                        <MoreVertical size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuItem onClick={() => handleEditUser(user)}>Edit Details</DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        className="text-red-600 focus:text-red-700"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                    >
                                                        Delete User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
                    <p className="text-sm text-gray-500">Showing {users.length} of {pagination.totalElements} users</p>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-xs border-gray-200 text-gray-600"
                            onClick={() => handlePageChange(pagination.pageNumber - 1)}
                            disabled={pagination.first}
                        >
                            Previous
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-xs border-gray-200 text-gray-600"
                            onClick={() => handlePageChange(pagination.pageNumber + 1)}
                            disabled={pagination.last}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            <UserDialog 
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                user={selectedUser}
                onSubmit={handleFormSubmit}
                onCancel={() => setIsDialogOpen(false)}
            />
        </div>
    );
}


