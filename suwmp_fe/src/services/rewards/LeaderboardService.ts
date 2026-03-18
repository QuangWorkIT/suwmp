import authClient from "../../config/axios";
import type { LeaderboardUser } from "../../types/leaderboard";

export interface ApiLeaderboardUser {
    rank: number;
    userId: string;
    name: string;
    points: number;
    streak: number;
    isMe?: boolean;
}

export interface ApiLeaderboardResponse {
    data: ApiLeaderboardUser[];
    message: string;
    success: boolean;
}

export interface ApiMyRankResponse {
    rank: number;
    points: number;
    streak: number;
}

// Helpers to generate consistent random-looking data for missing fields
const neighborhoods = ['Downtown', 'Westside', 'Eastside', 'Central', 'Northside', 'Southside'];
const avatarColors = [
    'bg-orange-500', 'bg-emerald-600', 'bg-amber-500', 'bg-yellow-500',
    'bg-teal-500', 'bg-blue-500', 'bg-indigo-500', 'bg-pink-500',
    'bg-purple-500', 'bg-rose-500'
];

const getConsistentNeighborhood = (userId: string) => {
    const charCode = userId.charCodeAt(0) || 0;
    return neighborhoods[charCode % neighborhoods.length];
};

const getConsistentColor = (userId: string) => {
    const charCode = userId.charCodeAt(userId.length - 1) || 0;
    return avatarColors[charCode % avatarColors.length];
};

const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
};

const transformUser = (apiUser: ApiLeaderboardUser): LeaderboardUser => {
    return {
        id: apiUser.userId,
        name: apiUser.name,
        neighborhood: getConsistentNeighborhood(apiUser.userId),
        avatarInitial: getInitial(apiUser.name),
        avatarColor: getConsistentColor(apiUser.userId),
        points: apiUser.points,
        rank: apiUser.rank,
        streakDays: apiUser.streak,
        reportsCount: Math.floor(Math.random() * 20) + 1, // Random reports count for now
        rankMovement: ['up', 'down', 'same'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'same',
        isCurrentUser: apiUser.isMe,
    };
};

export const LeaderboardService = {
    getRankings: async (date?: string, page: number = 0, size: number = 5): Promise<LeaderboardUser[]> => {
        try {
            const params = { date, page, size };
            const response = await authClient.get<ApiLeaderboardResponse>('/leaderboard', { params });
            return response.data.data.map(transformUser);
        } catch (error) {
            console.error("Error fetching leaderboard rankings:", error);
            throw error;
        }
    },

    getPodium: async (): Promise<LeaderboardUser[]> => {
        try {
            const response = await authClient.get<ApiLeaderboardResponse>('/leaderboard/podium');
            return response.data.data.map(transformUser);
        } catch (error) {
            console.error("Error fetching leaderboard podium:", error);
            throw error;
        }
    }
};
