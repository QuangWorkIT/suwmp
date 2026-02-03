export interface LeaderboardUser {
    id: string;
    name: string;
    neighborhood: string;
    avatarInitial: string;
    avatarColor: string;
    points: number;
    rank: number;
    streakDays: number;
    reportsCount: number;
    rankMovement: 'up' | 'down' | 'same';
    isCurrentUser?: boolean;
}

export const mockLeaderboardData: LeaderboardUser[] = [
    {
        id: '1',
        name: 'Sarah Green',
        neighborhood: 'Downtown',
        avatarInitial: 'S',
        avatarColor: 'bg-orange-500',
        points: 4850,
        rank: 1,
        streakDays: 21,
        reportsCount: 15,
        rankMovement: 'same',
    },
    {
        id: '2',
        name: 'Mike Rivers',
        neighborhood: 'Westside',
        avatarInitial: 'M',
        avatarColor: 'bg-emerald-600',
        points: 4280,
        rank: 2,
        streakDays: 14,
        reportsCount: 12,
        rankMovement: 'up',
    },
    {
        id: '3',
        name: 'Anna Forest',
        neighborhood: 'Eastside',
        avatarInitial: 'A',
        avatarColor: 'bg-amber-500',
        points: 3950,
        rank: 3,
        streakDays: 18,
        reportsCount: 10,
        rankMovement: 'down',
    },
    {
        id: '4',
        name: 'You',
        neighborhood: 'Central',
        avatarInitial: 'J',
        avatarColor: 'bg-yellow-500',
        points: 1890,
        rank: 4,
        streakDays: 7,
        reportsCount: 7,
        rankMovement: 'up',
        isCurrentUser: true,
    },
    {
        id: '5',
        name: 'Tom Woods',
        neighborhood: 'Northside',
        avatarInitial: 'T',
        avatarColor: 'bg-teal-500',
        points: 1750,
        rank: 5,
        streakDays: 5,
        reportsCount: 5,
        rankMovement: 'up',
    },
    {
        id: '6',
        name: 'Lisa Park',
        neighborhood: 'Southside',
        avatarInitial: 'L',
        avatarColor: 'bg-blue-500',
        points: 1620,
        rank: 6,
        streakDays: 9,
        reportsCount: 9,
        rankMovement: 'same',
    },
    {
        id: '7',
        name: 'David Chen',
        neighborhood: 'Downtown',
        avatarInitial: 'D',
        avatarColor: 'bg-indigo-500',
        points: 1540,
        rank: 7,
        streakDays: 12,
        reportsCount: 12,
        rankMovement: 'up',
    },
    {
        id: '8',
        name: 'Emma Wilson',
        neighborhood: 'Westside',
        avatarInitial: 'E',
        avatarColor: 'bg-pink-500',
        points: 1480,
        rank: 8,
        streakDays: 4,
        reportsCount: 4,
        rankMovement: 'down',
    },
    {
        id: '9',
        name: 'James Lee',
        neighborhood: 'Central',
        avatarInitial: 'J',
        avatarColor: 'bg-purple-500',
        points: 1350,
        rank: 9,
        streakDays: 8,
        reportsCount: 8,
        rankMovement: 'up',
    },
    {
        id: '10',
        name: 'Olivia Brown',
        neighborhood: 'Eastside',
        avatarInitial: 'O',
        avatarColor: 'bg-rose-500',
        points: 1290,
        rank: 10,
        streakDays: 6,
        reportsCount: 6,
        rankMovement: 'down',
    },
];

export const getCurrentUserPosition = () => {
    const currentUser = mockLeaderboardData.find(user => user.isCurrentUser);
    return currentUser ? currentUser.rank : null;
};

export const getPointsToNextRank = () => {
    const currentUser = mockLeaderboardData.find(user => user.isCurrentUser);
    if (!currentUser || currentUser.rank === 1) return 0;

    const userAbove = mockLeaderboardData.find(user => user.rank === currentUser.rank - 1);
    return userAbove ? userAbove.points - currentUser.points : 0;
};
