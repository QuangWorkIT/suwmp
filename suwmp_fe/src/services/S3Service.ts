import authClient from "@/config/axios";

const s3Service = {
    uploadImage: async (image: File) => {
        try {
            const formData = new FormData();
            formData.append("image", image);
            const response = await authClient.post("/s3/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.log("Error uploading image:", error);
            throw new Error("Failed to upload image");
        }
    }
}

export default s3Service