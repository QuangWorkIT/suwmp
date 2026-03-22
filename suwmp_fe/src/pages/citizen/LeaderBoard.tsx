import { useState, useEffect } from 'react';
import { MapPin, Building2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LeaderboardTopThree from '@/components/common/LeaderboardTopThree';
import LeaderboardTable from '@/components/common/LeaderboardTable';
import { LeaderboardService } from '@/services/rewards/LeaderboardService';
import type { LeaderboardUser } from '@/types/leaderboard';
import { Link } from 'react-router';

type TimeFilter = 'today' | 'week' | 'month' | 'all';
type ScopeFilter = 'neighborhood' | 'city';

function LeaderBoard() {
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('today');
    const [scopeFilter, setScopeFilter] = useState<ScopeFilter>('neighborhood');

    // Data states
    const [podium, setPodium] = useState<LeaderboardUser[]>([]);
    const [rankings, setRankings] = useState<LeaderboardUser[]>([]);
    const [myRank, setMyRank] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Map frontend filter to backend period
                const periodMap: Record<TimeFilter, string> = {
                    today: 'DAILY',
                    week: 'WEEKLY',
                    month: 'MONTHLY',
                    all: 'ALL_TIME'
                };
                
                // Use local date for DAILY snapshot queries to avoid UTC issues
                const localDate = new Date();
                const dateStr = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;

                // Fetch all data in parallel
                // If it's "all time", we can still pass DAILY to podium if we want, 
                // but let's match the selected filter.
                const period = periodMap[timeFilter] || 'WEEKLY';

                const [podiumData, rankingsData] = await Promise.all([
                    LeaderboardService.getPodium(period),
                    LeaderboardService.getRankings(period, dateStr, 0, 50)
                ]);

                setPodium(podiumData);
                setRankings(rankingsData);

                // Extract current user rank from rankings
                const currentUser = rankingsData.find(r => r.isCurrentUser);
                if (currentUser) {
                    setMyRank(currentUser.rank);
                } else {
                    setMyRank(null);
                }
            } catch (error) {
                console.error("Failed to fetch leaderboard data", error);
                setPodium([]);
                setRankings([]);
                setMyRank(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [timeFilter, scopeFilter]);

    const restRankings = rankings.slice(3);

    const getPointsToNextRank = () => {
        if (!myRank || myRank === 1) return 0;

        // Find current user stats
        const currentUser = rankings.find(r => r.rank === myRank);
        if (!currentUser) return 0;

        // Find user above
        const userAbove = rankings.find(r => r.rank === myRank - 1);
        return userAbove ? userAbove.points - currentUser.points : 0;
    };

    const pointsToNext = getPointsToNextRank();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="px-6 pb-6">
            {/* Filters */}
            <div className="flex justify-between items-center mb-6">
                {/* Time Filter Tabs */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setTimeFilter('today')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            timeFilter === 'today'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Today
                    </button>
                    <button
                        onClick={() => setTimeFilter('week')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${timeFilter === 'week'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        This Week
                    </button>
                    <button
                        onClick={() => setTimeFilter('month')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${timeFilter === 'month'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        This Month
                    </button>
                    <button
                        onClick={() => setTimeFilter('all')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${timeFilter === 'all'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        All Time
                    </button>
                </div>

                {/* Scope Toggle */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setScopeFilter('neighborhood')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${scopeFilter === 'neighborhood'
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        <MapPin size={16} />
                        Neighborhood
                    </button>
                    <button
                        onClick={() => setScopeFilter('city')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${scopeFilter === 'city'
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        <Building2 size={16} />
                        City
                    </button>
                </div>
            </div>

            {/* Top 3 Podium */}
            <LeaderboardTopThree topThree={podium} />

            {/* Rankings Table */}
            <div className="mt-6">
                <LeaderboardTable rankings={restRankings} />
            </div>

            {/* User Position Footer */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-4 flex justify-between items-center">
                <div>
                    <p className="font-semibold text-gray-900">Your Position: #{myRank}</p>
                    <p className="text-sm text-gray-500">
                        {pointsToNext > 0
                            ? `You need ${pointsToNext.toLocaleString()} more points to reach #${myRank ? myRank - 1 : ''}!`
                            : "You are currently at the top!"}
                    </p>
                </div>
                <Link to="/citizen/new-report">
                    <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium">
                        Submit Report
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default LeaderBoard;
