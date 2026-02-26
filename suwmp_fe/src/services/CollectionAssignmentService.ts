import authClient from "@/config/axios";
import type { AssignCollectionAssignment } from "@/types/collectionAssignment";

export const collectionAssignmentService = {
    assignCollection: async (payload: AssignCollectionAssignment) => {
        try {
            const response = await authClient.post("/ca/assignments", payload)
            return response.data
        } catch (error) {
            console.log(error)
            throw new Error("Failed to assign collection")
        }
    }
}