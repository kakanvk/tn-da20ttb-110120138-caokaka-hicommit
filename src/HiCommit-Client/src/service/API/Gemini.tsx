import { axiosInstance } from "./AxiosConfig";

const geminiChat = async (prompt: string) => {
    try {
        const response = await axiosInstance.post('/gemini/chat', { prompt });
        return response.data;
    } catch (error) {
        console.error('Error getting discussions:', error);
        throw error;
    }
}

export { geminiChat };

