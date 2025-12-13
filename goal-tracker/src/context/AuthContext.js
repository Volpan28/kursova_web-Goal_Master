import React, { useContext, useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    // ВИПРАВЛЕНА функція Google входу
    async function loginWithGoogle() {
        try {
            // Очищаємо попередні помилки
            const result = await signInWithPopup(auth, googleProvider);
            console.log("Google login successful:", result.user.email);
            return result;
        } catch (error) {
            console.error("Google login error:", error.code, error.message);

            // Обробка конкретних помилок
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    throw new Error('Вікно входу було закрито');
                case 'auth/popup-blocked':
                    throw new Error('Popup заблоковано браузером. Дозвольте popup-вікна');
                case 'auth/cancelled-popup-request':
                    throw new Error('Запит скасовано');
                case 'auth/unauthorized-domain':
                    throw new Error('Домен не авторизований в Firebase Console');
                default:
                    throw new Error(error.message || 'Помилка входу через Google');
            }
        }
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
            if (user) {
                console.log("User logged in:", user.email);
            } else {
                console.log("User logged out");
            }
        });
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        loginWithGoogle,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}