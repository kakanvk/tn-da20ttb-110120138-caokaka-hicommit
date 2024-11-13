import { axiosInstance } from "./AxiosConfig";

const getMySubmissions = async () => {
    try {
        const response = await axiosInstance.get(`/submissions/me`);
        return response.data;
    } catch (error) {
        console.error('Error getting submissions:', error);
        throw error;
    }
}

const getSubmissionsByProblemSlug = async (slug: string) => {
    try {
        const response = await axiosInstance.get(`/submissions/problem/${slug}`);
        return response.data;
    } catch (error) {
        console.error('Error getting submissions:', error);
        throw error;
    }
}

const getMySubmissionsByProblemSlug = async (slug: string) => {
    try {
        const response = await axiosInstance.get(`/submissions/me/${slug}`);
        return response.data;
    } catch (error) {
        console.error('Error getting submissions:', error);
        throw error;
    }
}

const getSubmissionsByID = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/submissions/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error getting submissions:', error);
        throw error;
    }
}

const getMySubmited = async () => {
    try {
        const response = await axiosInstance.get(`submissions/me/submited`);
        return response.data;
    } catch (error) {
        console.error('Error getting submissions:', error);
        throw error;
    }
}

const togglePublicCode = async (id: string) => {
    try {
        const response = await axiosInstance.put(`/submissions/${id}/public`);
        return response.data;
    } catch (error) {
        console.error('Error toggling public code:', error);
        throw error;
    }
}

export { 
    getMySubmissions, 
    getSubmissionsByProblemSlug, 
    getMySubmissionsByProblemSlug,
    getSubmissionsByID,
    getMySubmited,
    togglePublicCode
};