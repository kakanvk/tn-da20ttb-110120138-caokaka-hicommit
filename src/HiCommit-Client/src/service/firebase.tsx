// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GithubAuthProvider, signOut } from "firebase/auth";
import CryptoJS from 'crypto-js';
import { logout } from "./API/Auth";

const firebaseConfig = {
    apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY,
    authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: (import.meta as any).env.VITE_FIREBASE_APP_ID,
    measurementId: (import.meta as any).env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const GithubProvider = new GithubAuthProvider();

const signInWithGithub = async () => {
    GithubProvider.addScope('read:user');
    GithubProvider.addScope('repo');
    GithubProvider.addScope('workflow');

    try {
        const result = await signInWithPopup(auth, GithubProvider);
        const credential = await GithubAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken ?? '';

        // Mã hoá với Key là UID
        const encryptedToken = await CryptoJS.AES.encrypt(token, result.user.uid).toString();
        
        await localStorage.setItem('encryptedGithubAccessToken', encryptedToken);

    } catch (error) {
        console.error('SignIn Error', error);
    }
}

const handleLogout = async () => {
    try {
        await signOut(auth);
        await logout();
        localStorage.removeItem('encryptedGithubAccessToken');
    } catch (err) {
        console.error(err);
    }
}

export { auth, signInWithGithub, signOut, handleLogout }