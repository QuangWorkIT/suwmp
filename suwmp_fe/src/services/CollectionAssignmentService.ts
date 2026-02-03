import authClient from "@/config/axios";
import type { CreateCollectionAssignment } from "@/types/collectionAssignment";

export const collectionAssignmentService = {
    createAssignment: async (payload: CreateCollectionAssignment) => {
        try {
            const response = await authClient.post("/ca", payload)
            return response.data
        } catch (error) {
            console.log(error)
            throw new Error("Failed to create collection assignment")
        }
    }
}