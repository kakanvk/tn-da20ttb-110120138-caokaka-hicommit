import { axiosInstance } from "./AxiosConfig";

const getPosts = async () => {
    try {
        const response = await axiosInstance.get(`/posts/list`);
        return response.data;
    } catch (error) {
        console.error('Error getting posts:', error);
        throw error;
    }
}

const getPostBySlug = async (slug: number) => {
    try {
        const response = await axiosInstance.get(`/posts/${slug}`);
        return response.data;
    } catch (error) {
        console.error('Error getting post:', error);
        throw error;
    }
}

const createPost = async (props: any) => {

    const {
        title,
        description,
        slug,
        tags,
        content,
        thumbnail
    } = props;

    try {
        const response = await axiosInstance.post(`/posts/create`, {
            title,
            description,
            slug,
            tags,
            content,
            thumbnail
        });
        return response.data;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
}

// ADMIN
const getPostsForAdmin = async () => {
    try {
        const response = await axiosInstance.get(`/admin/posts/list`);
        return response.data;
    } catch (error) {
        console.error('Error getting posts:', error);
        throw error;
    }
}

const getInActivePosts = async () => {
    try {
        const response = await axiosInstance.get(`/admin/posts/inactive`);
        return response.data;
    } catch (error) {
        console.error('Error getting inactive posts:', error);
        throw error;
    }
}

const togglePublish = async (id: string) => {
    try {
        const response = await axiosInstance.put(`/admin/posts/${id}/publish`);
        return response.data;
    } catch (error) {
        console.error('Error toggling publish:', error);
        throw error;
    }
}

const activePost = async (id: string) => {
    try {
        const response = await axiosInstance.put(`/admin/posts/${id}/active`);
        return response.data;
    } catch (error) {
        console.error('Error toggling publish:', error);
        throw error;
    }
}

const updatePost = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.put(`/admin/posts/${id}/edit`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating post:', error);
        throw error;
    }
}

const deletePostById = async (id: string) => { 
    try {
        const response = await axiosInstance.delete(`/admin/posts/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
}

export {
    getPosts,
    createPost,
    getPostBySlug,
    getPostsForAdmin,
    getInActivePosts,
    togglePublish,
    activePost,
    updatePost,
    deletePostById
};