import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        const user = JSON.parse(localStorage.getItem('user_data'));

        if (token && user) {
            setIsLoggedIn(true);
            setUser(user);
        }
    }, []);

    const logIn = (token, userData) => {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(userData));
        setIsLoggedIn(true);
        setUser(userData);
    };

    const logOut = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        setIsLoggedIn(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, setUser, logIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
