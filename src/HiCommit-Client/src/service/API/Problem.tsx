import { da } from "date-fns/locale";
import { axiosInstance } from "./AxiosConfig";

const getProblems = async () => {
    try {
        const response = await axiosInstance.get(`/problems/list`);
        return response.data;
    } catch (error) {
        console.error('Error getting problems:', error);
        throw error;
    }
}

const getAllTags = async () => {
    try {
        const response = await axiosInstance.get(`/problems/tags`);
        return response.data;
    } catch (error) {
        console.error('Error getting tags:', error);
        throw error;
    }
}

const getProblemByIDorSlug = async (slug: string) => {
    try {
        const response = await axiosInstance.get(`/problems/${slug}`);
        return response.data;
    } catch (error) {
        console.error('Error getting problem:', error);
        throw error;
    }
}

const getProblemByIDForAdmin = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/problems/admin/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error getting problem:', error);
        throw error;
    }
}

const createProblem = async (data: any) => {
    try {
        const response = await axiosInstance.post(`/problems/create`, data);
        return response.data;
    } catch (error) {
        console.error('Error creating problem:', error);
        throw error;
    }
}

const updateProblem = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.put(`/problems/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating problem:', error);
        throw error;
    }
}

const deleteProblemByID = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`/problems/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting problem:', error);
        throw error;
    }
}

// ADMIN
const getProblemsForAdmin = async () => {
    try {
        const response = await axiosInstance.get(`/admin/problems/list`);
        return response.data;
    } catch (error) {
        console.error('Error getting problems:', error);
        throw error;
    }
}

const updateLevel = async (id: string, level: any) => {
    try {
        const response = await axiosInstance.put(`/admin/problems/${id}/level`, { level});
        return response.data;
    } catch (error) {
        console.error('Error updating problem:', error);
        throw error;
    }
}

const updateProblemForAdmin = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.put(`/admin/problems/${id}/update`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating problem:', error);
        throw error;
    }
}

const checkAvailableLanguageChangeByProblemID = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/admin/problems/${id}/check-language`);
        return response.data;
    } catch (error) {
        console.error('Error getting available languages:', error);
        throw error;
    }
}

export {
    getProblems,
    getAllTags,
    createProblem,
    getProblemByIDorSlug,
    updateProblem,
    deleteProblemByID,
    getProblemByIDForAdmin,
    getProblemsForAdmin,
    updateLevel,
    updateProblemForAdmin,
    checkAvailableLanguageChangeByProblemID
};