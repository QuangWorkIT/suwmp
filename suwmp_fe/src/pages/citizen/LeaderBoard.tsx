import { useState } from 'react';
import { MapPin, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LeaderboardTopThree from '@/components/common/LeaderboardTopThree';
import LeaderboardTable from '@/components/common/LeaderboardTable';
import { mockLeaderboardData, getCurrentUserPosition, getPointsToNextRank } from '@/data/leaderboardData';
import { Link } from 'react-router';

type TimeFilter = 'week' | 'month' | 'all';
type ScopeFilter = 'neighborhood' | 'city';

function LeaderBoard() {
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');
    const [scopeFilter, setScopeFilter] = useState<ScopeFilter>('neighborhood');

    const topThree = mockLeaderboardData.slice(0, 3);
    const restRankings = mockLeaderboardData.slice(3);

    const userPosition = getCurrentUserPosition();
    const pointsToNext = getPointsToNextRank();

    return (
        <div className="px-6 pb-6">
            {/* Filters */}
            <div className="flex justify-between items-center mb-6">
                {/* Time Filter Tabs */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setTimeFilter('week')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            timeFilter === 'week'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        This Week
                    </button>
                    <button
                        onClick={() => setTimeFilter('month')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            timeFilter === 'month'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        This Month
                    </button>
                    <button
                        onClick={() => setTimeFilter('all')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            timeFilter === 'all'
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
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            scopeFilter === 'neighborhood'
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        <MapPin size={16} />
                        Neighborhood
                    </button>
                    <button
                        onClick={() => setScopeFilter('city')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            scopeFilter === 'city'
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
            <LeaderboardTopThree topThree={topThree} />

            {/* Rankings Table */}
            <div className="mt-6">
                <LeaderboardTable rankings={restRankings} />
            </div>

            {/* User Position Footer */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-4 flex justify-between items-center">
                <div>
                    <p className="font-semibold text-gray-900">Your Position: #{userPosition}</p>
                    <p className="text-sm text-gray-500">
                        You need {pointsToNext.toLocaleString()} more points to reach #{userPosition ? userPosition - 1 : ''}!
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
