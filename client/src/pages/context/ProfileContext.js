import { createContext, useState, useContext, useEffect } from 'react';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState({
        name: 'John Doe',
        email: 'john@doe.com',
        icon: 'Sheep',
        isPremium: false,
    });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user_data'));
        if (storedUser) {
            setProfile(storedUser);
        }
    }, []);

    const updateProfile = (newProfile) => {
        const updated = {
            ...profile,
            ...newProfile,
        };
        setProfile(updated);
        localStorage.setItem('user_data', JSON.stringify(updated));
    };

    return (
        <ProfileContext.Provider value={{ profile, updateProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};

