import { ArrowUp, ArrowDown, Minus, Flame } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { LeaderboardUser } from '@/types/leaderboard';

interface LeaderboardTableProps {
    rankings: LeaderboardUser[];
}

function LeaderboardTable({ rankings }: LeaderboardTableProps) {
    const getRankMovementIcon = (movement: 'up' | 'down' | 'same') => {
        switch (movement) {
            case 'up':
                return <ArrowUp size={16} className="text-green-500" />;
            case 'down':
                return <ArrowDown size={16} className="text-red-500" />;
            case 'same':
            default:
                return <Minus size={16} className="text-gray-400" />;
        }
    };

    return (
        <Card className="bg-white shadow-md">
            <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-lg text-gray-900">Rankings</h2>
            </div>
            <div className="divide-y divide-gray-100">
                {rankings.map((user) => (
                    <div
                        key={user.id}
                        className={`flex items-center px-6 py-4 hover:bg-gray-50 transition-colors ${
                            user.isCurrentUser ? 'bg-yellow-50' : ''
                        }`}
                    >
                        {/* Rank */}
                        <div className="flex items-center gap-3 w-20">
                            <span className="text-lg font-semibold text-gray-700 w-6">{user.rank}</span>
                            {getRankMovementIcon(user.rankMovement)}
                        </div>

                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full ${user.avatarColor} flex items-center justify-center text-white font-semibold mr-4`}>
                            {user.avatarInitial}
                        </div>

                        {/* Name & Neighborhood */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">{user.name}</span>
                                {user.isCurrentUser && (
                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-medium">
                                        You
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500">{user.neighborhood}</p>
                        </div>

                        {/* Streak */}
                        <div className="flex items-center gap-1 bg-[#FFF4E5] text-[#FF8A00] px-3 py-1.5 rounded-full text-sm mr-6 font-bold">
                            <Flame size={14} fill="currentColor" />
                            <span>{user.streakDays}</span>
                        </div>

                        {/* Points */}
                        <div className="text-right min-w-[80px]">
                            <span className="text-lg font-bold text-gray-900">{user.points.toLocaleString()}</span>
                            <p className="text-xs text-gray-500">points</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

export default LeaderboardTable;
