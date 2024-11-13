
import { axiosInstance } from "./AxiosConfig";

const getContests = async () => {
    try {
        const response = await axiosInstance.get(`/contests/list`);
        return response.data;
    } catch (error) {
        console.error('Error getting contests:', error);
        throw error;
    }
}

const getContestByID = async (contestID: string) => {
    try {
        const response = await axiosInstance.get(`/contests/${contestID}`);
        return response.data;
    } catch (error) {
        console.error('Error getting contests:', error);
        throw error;
    }
}

const getContestDescriptionByID = async (contestID: string) => {
    try {
        const response = await axiosInstance.get(`/contests/${contestID}/description`);
        return response.data;
    } catch (error) {
        console.error('Error getting contests:', error);
        throw error;
    }
}

const joinContest = async (contestID: string, join_key: string) => {
    try {
        const response = await axiosInstance.post(`/contests/${contestID}/join`, { join_key });
        return response.data;
    } catch (error) {
        console.error('Error getting contests:', error);
        throw error;
    }
}

const exitContest = async (contestID: string) => {
    try {
        const response = await axiosInstance.post(`/contests/${contestID}/exit`);
        return response.data;
    } catch (error) {
        console.error('Error getting contests:', error);
        throw error;
    }
}

const getJoinedContest = async () => {
    try {
        const response = await axiosInstance.get(`/contests/joined`);
        return response.data;
    } catch (error) {
        console.error('Error getting contests:', error);
        throw error;
    }
}

const getMembersByContestID = async (contestID: string) => {
    try {
        const response = await axiosInstance.get(`/contests/${contestID}/members`);
        return response.data;
    } catch (error) {
        console.error('Error getting contests:', error);
        throw error;
    }
}

const getSubmissionsByContestID = async (contestID: string) => {
    try {
        const response = await axiosInstance.get(`/contests/${contestID}/submissions`);
        return response.data;
    } catch (error) {
        console.error('Error getting contests:', error);
        throw error;
    }
}

// ADMIN
const getContestsForAdmin = async () => {
    try {
        const response = await axiosInstance.get(`/admin/contests/list`);
        return response.data;
    } catch (error) {
        console.error('Error getting contests:', error);
        throw error;
    }
}

const getContestByIDForAdmin = async (contestID: string) => {
    try {
        const response = await axiosInstance.get(`/admin/contests/${contestID}`);
        return response.data;
    } catch (error) {
        console.error('Error getting contests:', error);
        throw error;
    }
}

const getProblemsByContestID = async (contestID: string) => {
    try {
        const response = await axiosInstance.get(`/contests/${contestID}/problems`);
        return response.data;
    } catch (error) {
        console.error('Error getting contests:', error);
        throw error;
    }
}

const createContest = async (contest: any) => {
    try {
        const response = await axiosInstance.post(`/admin/contests/create`, contest);
        return response.data;
    } catch (error) {
        console.error('Error getting contests:', error);
        throw error;
    }
}

const togglePublishContestByID = async (contestID: string) => {
    try {
        const response = await axiosInstance.put(`/admin/contests/${contestID}/publish`);
        return response.data;
    } catch (error) {
        console.error('Error getting contests:', error);
        throw error;
    }
}

const togglePinnedContestByID = async (contestID: string) => {
    try {
        const response = await axiosInstance.put(`/admin/contests/${contestID}/pinned`);
        return response.data;
    } catch (error) {
        console.error('Error getting contests:', error);
        throw error;
    }
}

const updatePublicContestByID = async (contestID: string, status: any) => {
    try {
        const response = await axiosInstance.put(`/admin/contests/${contestID}/public`, { public: status });
        return response.data;
    } catch (error) {
        console.error('Error getting contests:', error);
        throw error;
    }
}

const updateContestByID = async (contestID: string, contest: any) => {
    try {
        const response = await axiosInstance.put(`/admin/contests/${contestID}/update`, contest);
        return response.data;
    } catch (error) {
        console.error('Error getting contests:', error);
        throw error;
    }
}

const updateProblemsByID = async (contestID: string, problems: any) => {
    try {
        const response = await axiosInstance.put(`/admin/contests/${contestID}/problems`, { problems });
        return response.data;
    } catch (error) {
        // console.error('Error getting contests:', error);
        // throw error;
    }
}

const updateStatusUserContest = async (_id: string, status: string) => {
    try {
        const response = await axiosInstance.put(`/admin/contests/members/${_id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error('Error getting contests:', error);
        throw error;
    }
}

const deleteProblemInContestByID = async (contestID: string, problemID: string) => {
    try {
        const response = await axiosInstance.delete(`/admin/contests/${contestID}/problems/${problemID}`);
        return response.data;
    } catch (error) {
        console.error('Error getting contests:', error);
        throw error;
    }
}

const deleteContestByID = async (contestID: string) => {
    try {
        const response = await axiosInstance.delete(`/admin/contests/${contestID}/delete`);
        return response.data;
    } catch (error) {
        console.error('Error getting contests:', error);
        throw error;
    }
}

export {
    getContests,
    getContestByID,
    getContestDescriptionByID,
    joinContest,
    exitContest,
    getJoinedContest,
    getProblemsByContestID,
    getMembersByContestID,
    getSubmissionsByContestID,
    // ADMIN
    createContest,
    getContestsForAdmin,
    getContestByIDForAdmin,
    togglePublishContestByID,
    togglePinnedContestByID,
    updatePublicContestByID,
    updateProblemsByID,
    updateContestByID,
    updateStatusUserContest,
    deleteContestByID,
    deleteProblemInContestByID
};