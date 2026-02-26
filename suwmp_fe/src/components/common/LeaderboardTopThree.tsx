import { Trophy, Flame } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { LeaderboardUser } from '@/data/leaderboardData';

interface LeaderboardTopThreeProps {
    topThree: LeaderboardUser[];
}

function LeaderboardTopThree({ topThree }: LeaderboardTopThreeProps) {
    // Reorder: 2nd, 1st, 3rd for podium display
    const orderedPodium = topThree.length >= 3
        ? [topThree[1], topThree[0], topThree[2]]
        : topThree;

    const getTrophyColor = (rank: number) => {
        switch (rank) {
            case 1: return 'text-amber-500';
            case 2: return 'text-gray-400';
            case 3: return 'text-amber-700';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="flex justify-center items-start gap-6 py-6 w-full max-w-5xl mx-auto">
            {orderedPodium.map((user) => (
                <div key={user.id} className={`flex-1 flex flex-col items-center transition-all duration-500 ${user.rank === 1 ? 'mt-0' : 'mt-12'}`}>
                    <Card className="bg-white w-full py-10 flex flex-col items-center gap-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100 rounded-3xl">
                        {/* Avatar */}
                        <div className="relative">
                            <div className={`w-20 h-20 rounded-full ${user.avatarColor} flex items-center justify-center text-white text-3xl font-bold shadow-xl ring-4 ring-white`}>
                                {user.avatarInitial}
                            </div>
                            {/* Trophy badge */}
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-lg border border-gray-100">
                                <Trophy size={18} className={getTrophyColor(user.rank)} fill="currentColor" />
                            </div>
                        </div>

                        {/* Name */}
                        <div className="text-center mt-2 space-y-1">
                            <h3 className="font-bold text-gray-900 text-lg">{user.name}</h3>
                            <p className="text-sm text-muted-foreground font-medium">{user.neighborhood}</p>
                        </div>

                        {/* Points */}
                        <div className="text-center space-y-1">
                            <span className="text-3xl font-extrabold text-primary">{user.points.toLocaleString()}</span>
                            <p className="text-sm text-muted-foreground font-medium">points</p>
                        </div>

                        {/* Streak */}
                        <div className="flex items-center gap-2 bg-[#FFF4E5] text-[#FF8A00] px-5 py-1.5 rounded-full text-sm font-bold">
                            <Flame size={14} fill="currentColor" />
                            <span>{user.streakDays} day streak</span>
                        </div>
                    </Card>
                </div>
            ))}
        </div>
    );
}

export default LeaderboardTopThree;
