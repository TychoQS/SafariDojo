import { createContext, useState, useContext } from 'react';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState({
        name: 'John Doe',
        email: 'john@doe.com',
        icon: 'Sheep',
    });

    const updateProfile = (newProfile) => {
        setProfile((prevProfile) => ({
            ...prevProfile,
            ...newProfile,
        }));
    };

    return (
        <ProfileContext.Provider value={{ profile, updateProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};
