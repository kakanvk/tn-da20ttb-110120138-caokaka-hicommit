import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, handleLogout } from './firebase';
import { login } from './API/Auth';
import { Octokit } from 'octokit';
import CryptoJS from 'crypto-js';
import { getJoinedContest } from './API/Contest';

interface LoginContextProps {
    loading: boolean;
    user: any;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setUser: React.Dispatch<React.SetStateAction<any>>;
}

const LoginContext = createContext<LoginContextProps | undefined>(undefined);

export const LoginProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const handleGetJoinedContest = async () => {
        const response = await getJoinedContest();
        console.log(response);
    }

    useEffect(() => {
        setLoading(true);
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const encryptedToken = localStorage.getItem('encryptedGithubAccessToken');

                    console.log(encryptedToken);

                    const token = decryptToken(encryptedToken ?? "", user.uid);

                    console.log(token);

                    const octokit = new Octokit({ auth: token });

                    const myProfileData = await login(encryptedToken as string, user.email as string, user.uid as string);

                    // console.log(myProfileData);

                    setUser({
                        ...myProfileData,
                        accessToken: token,
                    });

                    setLoading(false);

                } catch (error) {
                    console.error('Error fetching repositories:', error);
                    await handleLogout();
                    setLoading(false);
                }
            } else {
                console.log("User is logged out");
                setLoading(false);
            }
        });
        // handleGetJoinedContest();
    }, []);

    const decryptToken = (encryptedToken: string, key: string) => {
        // Sử dụng AES để giải mã token với key chỉ định
        const bytes = CryptoJS.AES.decrypt(encryptedToken, key);
        const originalToken = bytes.toString(CryptoJS.enc.Utf8);
        return originalToken;
    }

    return (
        <LoginContext.Provider value={{ loading, setLoading, user, setUser }}>
            {children}
        </LoginContext.Provider>
    );
};

export const useLogin = () => {
    const context = useContext(LoginContext);
    if (context === undefined) {
        throw new Error('useLogin must be used within a LoginProvider');
    }
    return context;
};