import { api } from "@/config/api";

const s3Service = {
    uploadImage: async (image: File) => {
        try {
            const formData = new FormData();
            formData.append("image", image);
            const response = await api.post("/s3/upload", formData);
            return response.data;
        } catch (error) {
            console.log("Error uploading image:", error);
            throw new Error("Failed to upload image");  
        }
    }
}

export default s3Service