import { useState } from 'react';
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

interface User {
    id: string;
    name: string;
    email: string;
    role: 'Citizen' | 'Collector' | 'Enterprise';
    status: 'active' | 'suspended' | 'inactive';
    activity: string;
    joined: string;
    avatar: string;
}


export default function UserManagementPage() {
    // Mock data - replace with actual API call
    const [users] = useState<User[]>([
        {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'Citizen',
            status: 'active',
            activity: '12 Reports',
            joined: 'Jan 5, 2026',
            avatar: 'J'
        },
        {
            id: '2',
            name: 'GreenCycle Inc.',
            email: 'contact@greencycle.com',
            role: 'Enterprise',
            status: 'active',
            activity: '45 Requests',
            joined: 'Dec 12, 2025',
            avatar: 'G'
        },
        {
            id: '3',
            name: 'Alex Chen',
            email: 'alex@collector.com',
            role: 'Collector',
            status: 'active',
            activity: '245 Tasks',
            joined: 'Jan 8, 2026',
            avatar: 'A'
        },
        {
            id: '4',
            name: 'Sarah Mills',
            email: 'sarah@example.com',
            role: 'Citizen',
            status: 'suspended',
            activity: '4 Reports',
            joined: 'Nov 20, 2025',
            avatar: 'S'
        },
        {
            id: '5',
            name: 'Maria Santos',
            email: 'maria@collector.com',
            role: 'Collector',
            status: 'active',
            activity: '312 Tasks',
            joined: 'Jan 10, 2026',
            avatar: 'M'
        },
        {
            id: '6',
            name: 'EcoEnterprise',
            email: 'info@ecoent.com',
            role: 'Enterprise',
            status: 'inactive',
            activity: '0 Requests',
            joined: 'Oct 15, 2025',
            avatar: 'E'
        },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'Citizen':
                return 'bg-green-50 text-green-700 border border-green-100'; // Green pill
            case 'Enterprise':
                return 'bg-orange-50 text-orange-700 border border-orange-100'; // Orange pill
            case 'Collector':
                return 'bg-blue-50 text-blue-700 border border-blue-100'; // Blue pill
            default:
                return 'bg-gray-50 text-gray-700 border border-gray-100';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-50 text-green-700 border border-green-100';
            case 'suspended':
                return 'bg-red-50 text-red-700 border border-red-100';
            case 'inactive':
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

    return (
        <div className="space-y-6">
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
                            {users.map((user, index) => (
                                <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full ${getAvatarColor(index)} flex items-center justify-center text-white font-medium shadow-sm`}>
                                                {user.avatar}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 group-hover:text-green-700 transition-colors">{user.name}</div>
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
                                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                                <DropdownMenuItem className="text-amber-600 focus:text-amber-700">Suspend User</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600 focus:text-red-700">Delete User</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
                    <p className="text-sm text-gray-500">Showing 6 of 52,400 users</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 text-xs border-gray-200 text-gray-600">Previous</Button>
                        <Button variant="outline" size="sm" className="h-8 text-xs border-gray-200 text-gray-600">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

