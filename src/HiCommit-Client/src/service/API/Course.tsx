import { axiosInstance } from "./AxiosConfig";

const getCourses = async () => {
    try {
        const response = await axiosInstance.get(`/courses/list`);
        return response.data;
    } catch (error) {
        console.error('Error getting courses:', error);
        throw error;
    }
}

const createCourse = async (course: any) => {
    try {
        const response = await axiosInstance.post(`/courses/create`, course);
        return response.data;
    } catch (error) {
        console.error('Error creating course:', error);
        throw error;
    }
}

const getCreatedCourses = async () => {
    try {
        const response = await axiosInstance.get(`/courses/created`);
        return response.data;
    } catch (error) {
        console.error('Error getting my courses:', error);
        throw error;
    }
}

const getCourseById = async (courseId: string) => {
    try {
        const response = await axiosInstance.get(`/courses/${courseId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting course:', error);
        throw error;
    }
}

// For ADMIN
const getCourseByIDForAdmin = async (courseId: string) => {
    try {
        const response = await axiosInstance.get(`/courses/admin/${courseId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting course:', error);
        throw error;
    }
}

const getJoinedCourses = async () => {
    try {
        const response = await axiosInstance.get(`/courses/joined`);
        return response.data;
    } catch (error) {
        console.error('Error getting joined courses:', error);
        throw error;
    }
}

const addMemberToCourse = async (courseId: string, email: string) => {
    try {
        const response = await axiosInstance.post(`/courses/${courseId}/add-member`, { email });
        return response.data;
    } catch (error) {
        console.error('Error adding member to course:', error);
        throw error;
    }
}

const addMultipleMembersToCourse = async (courseId: string, emails: string[]) => {
    try {
        const response = await axiosInstance.post(`/courses/${courseId}/add-multiple-members`, { emails });
        return response.data;
    } catch (error) {
        console.error('Error adding multiple members to course:', error);
        throw error;
    }
}

const deleteMemberFromCourse = async (courseId: string, email: string) => {
    try {
        const response = await axiosInstance.delete(`/courses/${courseId}/delete-member`, { data: { email } });
        return response.data;
    } catch (error) {
        console.error('Error deleting member from course:', error);
        throw error;
    }
}

const joinToCourse = async (courseId: string, join_key: string) => {
    try {
        const response = await axiosInstance.post(`/courses/join/${courseId}`, { join_key });
        return response.data;
    } catch (error) {
        console.error('Error joining course:', error);
        throw error;
    }
}

const updateUnits = async (courseId: string, units: any) => {
    try {
        const response = await axiosInstance.put(`/courses/${courseId}/units`, units);
        return response.data;
    } catch (error) {
        // console.error('Error updating units:', error);
        throw error;
    }
}

const updateKey = async (courseId: string, key: any) => {
    try {
        const response = await axiosInstance.put(`/courses/${courseId}/key`, key);
        return response.data;
    } catch (error) {
        // console.error('Error updating units:', error);
        throw error;
    }
}

const togglePublishCourse = async (courseId: string) => {
    try {
        const response = await axiosInstance.put(`/courses/${courseId}/publish`);
        return response.data;
    } catch (error) {
        console.error('Error updating units:', error);
        throw error;
    }
}

const togglePublicCourse = async (courseId: string) => {
    try {
        const response = await axiosInstance.put(`/courses/${courseId}/public`);
        return response.data;
    } catch (error) {
        console.error('Error updating units:', error);
        throw error;
    }
}

const toggleAutoJoin = async (courseId: string) => {
    try {
        const response = await axiosInstance.put(`/courses/${courseId}/auto_join`);
        return response.data;
    } catch (error) {
        console.error('Error updating units:', error);
        throw error;
    }
}

const updateCourse = async (courseId: string, course: any) => {
    try {
        const response = await axiosInstance.put(`/courses/${courseId}`, course);
        return response.data;
    } catch (error) {
        console.error('Error updating course:', error);
        throw error;
    }
}

const deleteCourseByID = async (courseId: string) => {
    try {
        const response = await axiosInstance.delete(`/courses/${courseId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting course:', error);
        throw error;
    }
}

// For ADMIN
const getCoursesForAdmin = async () => {
    try {
        const response = await axiosInstance.get(`/admin/courses/list`);
        return response.data;
    } catch (error) {
        console.error('Error getting courses:', error);
        throw error;
    }
}

export {
    getCourses,
    createCourse,
    getCreatedCourses,
    getCourseById,
    joinToCourse,
    getJoinedCourses,
    getCourseByIDForAdmin,
    updateUnits,
    updateKey,
    togglePublishCourse,
    togglePublicCourse,
    toggleAutoJoin,
    updateCourse,
    deleteCourseByID,
    // For ADMIN
    getCoursesForAdmin,
    addMemberToCourse,
    addMultipleMembersToCourse,
    deleteMemberFromCourse
};