import { createContext, useState, useContext } from 'react';

const GoalsContext = createContext();

export const useGoals = () => useContext(GoalsContext);

export const GoalsProvider = ({ children }) => {
    const [goals, setGoals] = useState({
        completed: [0, 0, 0, 0, 0, 0, 0],
        total: [0, 0, 0, 0, 0, 0, 0],
    });

    const setNewGoals = (newGoals) => {
        setGoals((prevGoals) => ({
            ...prevGoals,
            ...newGoals,
        }));
    };

    return (
        <GoalsContext.Provider value={{ goals, setNewGoals }}>
            {children}
        </GoalsContext.Provider>
    );
};
