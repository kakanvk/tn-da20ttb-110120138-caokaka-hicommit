import axios from 'axios';

// Hàm khởi tạo các API service với accessToken
const createGitHubAPI = (accessToken: any) => {

    const githubAPI = axios.create({
        baseURL: 'https://api.github.com',
        headers: {
            Authorization: `token ${accessToken}`,
            Accept: 'application/vnd.github.v3+json',
        },
    });

    const getRepoInfo = async (owner: any, repo: any) => {
        try {
            const response = await githubAPI.get(`/repos/${owner}/${repo}`, {
                params: {
                    t: new Date().getTime(),
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error getting repo info:', error);
            throw error;
        }
    };

    const getRepoBranchInfo = async (owner: any, repo: any, branch: any) => {
        try {
            const response = await githubAPI.get(`/repos/${owner}/${repo}/contents`, {
                params: {
                    t: new Date().getTime(),
                    ref: branch,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error getting repo info:', error);
            throw error;
        }
    };

    const createRepo = async (repoName: any, description: any) => {
        try {
            const response = await githubAPI.post('/user/repos', {
                name: repoName,
                description: description,
            });
            return response.data;
        } catch (error) {
            console.error('Error creating repo:', error);
            throw error;
        }
    }

    // Hàm để lấy thông tin SHA của nhánh trong repo template
    const getBranchSha = async (owner: any, repo: any, branch: any) => {
        try {
            const response = await githubAPI.get(`/repos/${owner}/${repo}/git/refs/heads/${branch}`);
            return response.data.object.sha;
        } catch (error) {
            console.error('Error getting branch SHA:', error);
            throw error;
        }
    };

    // Hàm để tạo một nhánh mới cho repository
    const createBranchForRepo = async (owner: any, repo: any, branch: any, sha: any) => {
        try {
            const response = await githubAPI.post(`/repos/${owner}/${repo}/git/refs`, {
                ref: `refs/heads/${branch}`,
                sha: sha,
            });
            return response.data;
        } catch (error) {
            console.error('Error creating branch:', error);
            throw error;
        }
    };

    // Hàm để lấy thông tin SHA của file
    const getFileSha = async (owner: any, repo: any, branch: any, path: any) => {
        try {
            const response = await githubAPI.get(`/repos/${owner}/${repo}/contents/${path}`, {
                params: {
                    ref: branch,
                    t: new Date().getTime(),
                }
            });
            return response.data.sha;
        } catch (error) {
            console.error('Error getting file SHA:', error);
            throw error;
        }
    };

    // Hàm để commit một file mới hoặc cập nhật file hiện có
    const commitFile = async (owner: any, repo: any, branch: any, path: any, content: any, message: any) => {
        try {
            const fileSha = await getFileSha(owner, repo, branch, path).catch(() => null); // Nếu file chưa tồn tại, bỏ qua lỗi

            const response = await githubAPI.put(`/repos/${owner}/${repo}/contents/${path}`, {
                message,
                content: btoa(content),
                sha: fileSha,
                branch: branch
            });

            return response.data;
        } catch (error) {
            console.error('Error committing file:', error);
            throw error;
        }
    };

    const getFileContent = async (owner: any, repo: any, branch: any, path: any) => {
        try {
            const response = await githubAPI.get(`/repos/${owner}/${repo}/contents/${path}`, {
                params: { ref: branch }
            });
            return Buffer.from(response.data.content, 'base64').toString('utf8'); // Giải mã nội dung base64
        } catch (error) {
            console.error('Error getting file content:', error);
            throw error;
        }
    };

    // Note: Hàm tạo một repo từ repo template
    const createRepoFromTemplate = async () => {
        try {
            const response = await githubAPI.post(`/repos/hicommit/templates/generate`, {
                name: "hicommit-problems",
                include_all_branches: true,
            });
            return response.data;
        } catch (error) {
            console.error('Error creating repo from template:', error);
            throw error;
        }
    }

    // Note: Hàm fork một repo từ repo template
    const forkRepoFromTemplate = async () => {
        try {
            const response = await githubAPI.post(`/repos/hicommit/templates/forks`,  {
                name: "hicommit-problems",
                default_branch_only: false,
            });
            return response.data;
        } catch (error) {
            console.error('Error forking repo from template:', error);
            throw error;
        }
    }

    // Note: Hoạt động tốt, chỉ hoạt động với repo được fork từ template
    const syncBranchFromTemplate = async (owner: any, repo: any, branch: any) => {
        try {
            const response = await githubAPI.post(`/repos/${owner}/${repo}/merge-upstream`, {
                branch: branch,
            });

            return response;
        } catch (error) {
            console.error('Error creating repo or branch from template:', error);
            throw error;
        }
    }

    // Note: Hàm tạo một branch bài tập từ 1 branch template (cùng repo)
    const createBranchFromBranch = async (owner: any, repo: any, branch: any, baseBranch: any) => {
        try {
            const baseBranchSha = await getBranchSha(owner, repo, baseBranch);
            const response = await createBranchForRepo(owner, repo, branch, baseBranchSha);

            return response;
        } catch (error) {
            console.error('Error creating branch from branch:', error);
            throw error;
        }
    }

    // Hàm để lấy thông tin của một action cụ thể
    const getActionInfo = async (owner: any, repo: any, runId: any) => {
        try {
            const response = await githubAPI.get(`/repos/${owner}/${repo}/actions/runs/${runId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting action info:', error);
            throw error;
        }
    };

    // Hàm để lấy danh sách các actions trong một repository trên một nhánh nhất định
    const getActionsByBranch = async (owner: any, repo: any, branch: any) => {
        try {
            const response = await githubAPI.get(`/repos/${owner}/${repo}/actions/runs`, {
                params: {
                    branch: branch,
                    t: new Date().getTime(),
                },
            });
            return response.data.workflow_runs;
        } catch (error) {
            console.error('Error getting actions by branch:', error);
            throw error;
        }
    };

    return {
        getFileSha,
        getFileContent,
        getBranchSha,
        createBranchForRepo,
        commitFile,
        getRepoInfo,
        getRepoBranchInfo,
        createRepo,
        getActionInfo,
        getActionsByBranch,
        createRepoFromTemplate,
        forkRepoFromTemplate,
        syncBranchFromTemplate,
        createBranchFromBranch
    };
};

export default createGitHubAPI;
