import { axiosInstance } from "./AxiosConfig";

const getUnits = async (course_id: string) => {
    try {
        const response = await axiosInstance.get(`course/${course_id}/units/list`);
        return response.data;
    } catch (error) {
        console.error('Error getting units:', error);
        throw error;
    }
}

const createUnit = async (course_id: string, unit: any) => {
    try {
        const response = await axiosInstance.post(`courses/${course_id}/units/create`, unit);
        return response.data;
    } catch (error) {
        console.error('Error creating unit:', error);
        throw error;
    }
}

const getUnitById = async (unit_id: string) => {
    try {
        const response = await axiosInstance.get(`units/${unit_id}`);
        return response.data;
    } catch (error) {
        console.error('Error getting unit:', error);
        throw error;
    }
}

const updateUnitById = async (course_id: string, unit_id: any, unit: any) => {
    try {
        const response = await axiosInstance.put(`courses/${course_id}/units/${unit_id}`, unit);
        return response.data;
    } catch (error) {
        console.error('Error updating unit:', error);
        throw error;
    }
}

const deleteUnitById = async (course_id: string, unit_id: any) => {
    try {
        const response = await axiosInstance.delete(`courses/${course_id}/units/${unit_id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting unit:', error);
        throw error;
    }
}

export { getUnits, createUnit, getUnitById, updateUnitById, deleteUnitById };