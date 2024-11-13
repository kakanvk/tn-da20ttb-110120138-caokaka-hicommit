import { axiosInstance } from "./AxiosConfig";

// [ADMIN] role
const getUsers = async () => {
    try {
        const response = await axiosInstance.get('/admin/users/list');
        return response.data;
    } catch (error) {
        console.error('Error getting users:', error);
        throw error;
    }
}

const getProfileByUsername = async (username: string) => {
    try {
        const response = await axiosInstance.get(`/users/profile/${username}`);
        return response.data;
    } catch (error) {
        console.error('Error getting profile by username:', error);
        throw error;
    }
}

const toggleFavouriteCourse = async (courseId: string) => {
    try {
        const response = await axiosInstance.put(`/users/favourite_course/${courseId}`);
        return response.data;
    } catch (error) {
        console.error('Error toggling favourite course:', error);
        throw error;
    }
}

const updateRole = async (userId: string, role: string) => {
    try {
        const response = await axiosInstance.put(`/admin/users/${userId}/role`, { role });
        return response.data;
    } catch (error) {
        console.error('Error updating role:', error);
        throw error;
    }
}

const updateStatus = async (userId: string, status: string) => {
    try {
        const response = await axiosInstance.put(`/admin/users/${userId}/status`, { status });
        return response.data;
    } catch (error) {
        console.error('Error updating status:', error);
        throw error;
    }
}

export {
    toggleFavouriteCourse,
    getUsers,
    getProfileByUsername,
    updateRole,
    updateStatus
};