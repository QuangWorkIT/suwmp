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
