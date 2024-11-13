import { axiosInstance } from "./AxiosConfig";

const login = async (access_token: string, email: string, uid: string) => {
    try {
        const response = await axiosInstance.post(`/auth/login`, {
            access_token,
            email,
            uid
        });
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}

const getMyProfile = async () => {
    try {
        const response = await axiosInstance.get(`/auth/me`);
        return response.data;
    } catch (error) {
        console.error('Error getting my profile:', error);
        throw error;
    }
}

const logout = async () => {
    try {
        const response = await axiosInstance.get(`/auth/logout`);
        return response.data;
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
}

export { login, getMyProfile, logout };
