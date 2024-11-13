import { axiosInstance } from "./AxiosConfig";

const getDiscussions = async (problem_slug: string) => {
    try {
        const response = await axiosInstance.get(`/discussions/${problem_slug}`);
        return response.data;
    } catch (error) {
        console.error('Error getting discussions:', error);
        throw error;
    }
}

const getDiscussionById = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/discussions/p/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error getting discussion by id:', error);
        throw error;
    }
}

const createDiscussion = async (problem_slug: string, data: any) => {
    try {
        const response = await axiosInstance.post(`/discussions/${problem_slug}`, data);
        return response.data;
    } catch (error) {
        console.error('Error creating discussion:', error);
        throw error;
    }
}

const updateDiscussion = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.put(`/discussions/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating discussion:', error);
        throw error;
    }
}

const updateDiscussionStatus = async (id: string) => {
    try {
        const response = await axiosInstance.put(`/discussions/${id}/status`);
        return response.data;
    } catch (error) {
        console.error('Error updating discussion status:', error);
        throw error;
    }
}

const deleteDiscussion = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`/discussions/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting discussion:', error);
        throw error;
    }
}

export {
    getDiscussions,
    getDiscussionById,
    createDiscussion,
    updateDiscussion,
    updateDiscussionStatus,
    deleteDiscussion
}