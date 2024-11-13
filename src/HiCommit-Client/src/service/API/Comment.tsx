import { axiosInstance } from "./AxiosConfig";

const getCommentsByDiscussionID = async (discussionID: string) => {
    try {
        const response = await axiosInstance.get(`/discussions/p/${discussionID}/comments`);
        return response.data;
    } catch (error) {
        console.error('Error getting comments by discussion ID:', error);
        throw error;
    }
}

const createComment = async (discussionID: string, description: string) => {
    try {
        const response = await axiosInstance.post(`/discussions/p/${discussionID}/comments`, { description });
        return response.data;
    } catch (error) {
        console.error('Error creating comment:', error);
        throw error;
    }
}

const togleLikeComment = async (commentID: string) => {
    try {
        const response = await axiosInstance.put(`/discussions/comments/${commentID}/like`);
        return response.data;
    } catch (error) {
        console.error('Error toggling like comment:', error);
        throw error;
    }
}

const updateComment = async (commentID: string, description: string) => {
    try {
        const response = await axiosInstance.put(`/discussions/comments/${commentID}`, { description });
        return response.data;
    } catch (error) {
        console.error('Error updating comment:', error);
        throw error;
    }
}

const deleteComment = async (commentID: string) => {
    try {
        const response = await axiosInstance.delete(`/discussions/comments/${commentID}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
    }
}

export {
    getCommentsByDiscussionID,
    createComment,
    togleLikeComment,
    updateComment,
    deleteComment
}

