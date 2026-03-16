import authClient from "@/config/axios"

export const EnterpriseUserService = {
    getEnterpriseUserByUserId: async (userId: string) => {
        try {
            const response = await authClient.get("/enterprise-users/get-by-userId/" + userId)
            return response.data
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    getEnterpriseByUserId: async (id: string) => {
        try {
            const response = await authClient.get("/enterprise-users/enterprises/" + id)
            return response.data
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}