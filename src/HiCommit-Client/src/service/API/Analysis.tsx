import { axiosInstance } from "./AxiosConfig";

const getAnalysis = async () => {
    try {
        const response = await axiosInstance.get('/admin/analysis/overview');
        return response.data;
    } catch (error) {
        console.error('Error getting analysis:', error);
        throw error;
    }
}

const getLeaderboard = async () => {
    try {
        const response = await axiosInstance.get('/users/analysis/leaderboard');
        return response.data;
    } catch (error) {
        console.error('Error getting leaderboard:', error);
        throw error;
    }
}

const countSubmissions60daysAgo = async (problem_slug: string) => {
    try {
        const response = await axiosInstance.get(`/problems/${problem_slug}/analysis/submissions`);
        return response.data;
    } catch (error) {
        console.error('Error counting submissions:', error);
        throw error;
    }
}

const getCourseAnalysis = async (course_id: string) => {
    try {
        const response = await axiosInstance.get(`/courses/${course_id}/analysis`);
        return response.data;
    } catch (error) {
        console.error('Error getting course analysis:', error);
        throw error;
    }
}

const analysisSubmissionOfCourse = async (course_id: string) => {
    try {
        const response = await axiosInstance.get(`/courses/${course_id}/analysis/submissions`);
        return response.data;
    } catch (error) {
        console.error('Error getting course analysis:', error);
        throw error;
    }
}

const getProblemAnalysisOfCourse = async (course_id: string) => {
    try {
        const response = await axiosInstance.get(`/courses/${course_id}/analysis/problems`);
        return response.data;
    } catch (error) {
        console.error('Error getting course analysis:', error);
        throw error;
    }
}

export {
    getAnalysis,
    getLeaderboard,
    countSubmissions60daysAgo,
    getCourseAnalysis,
    analysisSubmissionOfCourse,
    getProblemAnalysisOfCourse
}