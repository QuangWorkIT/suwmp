import authClient from "@/config/axios";

const s3Service = {
    uploadImage: async (image: File) => {
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("image", image);
            const response = await authClient.post("/s3/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": "Bearer " + token
                },
            });
            return response.data;
        } catch (error) {
            console.log("Error uploading image");
            throw new Error("Failed to upload image");
        }
    },
    getImage: async (key: string) => {
        try {
            const response = await authClient.get(`/s3/download`,
                { params: { key: key } }
            );
            return response.data;
        } catch (error) {
            console.log("Error getting image");
            throw new Error("Failed to get image");
        }
    }
}

export default s3Service