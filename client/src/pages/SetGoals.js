import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Input from "@/components/Input";
import Title from "@/components/Title";
import Button from "@/components/Button";
import AnimalIcon from "@/components/AnimalIcon";
import Link from "next/link";
import { useGoals } from "@/pages/context/GoalContext";
import { useAuth } from "@/pages/context/AuthContext";

export default function SetGoals() {
    const { isLoggedIn } = useAuth();
    const { goals, setNewGoals } = useGoals();

    const [medals, setMedals] = useState(0);
    const [quizzes, setQuizzes] = useState(0);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (selectedSubject) {
            const subjectIndex = getSubjectIndex(selectedSubject);
            setQuizzes(goals.total[subjectIndex + 2]);
        } else {
            setQuizzes(goals.total[0]);
            setMedals(goals.total[1]);
        }
    }, [selectedSubject, goals.total]);

    const handleSave = () => {
        if (Object.values(errors).some(error => error)) return;

        const updatedGoals = [...goals.total];

        if (selectedSubject) {
            const subjectIndex = getSubjectIndex(selectedSubject);
            updatedGoals[subjectIndex + 2] = quizzes;
        } else {
            updatedGoals[0] = quizzes;
        }
        updatedGoals[1] = medals;

        setNewGoals({
            completed: Array(7).fill(0),
            total: updatedGoals,
        });
    };

    const handleSelectSubject = (subject) => {
        setSelectedSubject(selectedSubject === subject ? null : subject);
    };

    const getSubjectIndex = (subject) => {
        const subjects = ["Maths", "Art", "Geography", "English", "Science"];
        return subjects.indexOf(subject);
    };

    const handleNumberInput = (setter, field) => (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setter(value);
            setErrors(prev => ({ ...prev, [field]: "" }));
        } else {
            setErrors(prev => ({ ...prev, [field]: "Only numbers are allowed" }));
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-PS-main-purple">
            <Header />
            <section className="grid-rows-[auto,auto,auto,auto] m-auto flex-col items-center justify-start gap-6">
                <section className="flex flex-row justify-center items-center gap-10 m-auto p-6">
                    <div className="flex flex-col items-center">
                        <section className="w-80 h-80 p-4 flex justify-center items-center">
                            <div className="flex gap-x-30">
                                <div className="grid grid-rows-3 gap-y-30">
                                    {["English", "Art", "Geography"].map((subject) => (
                                        <div
                                            key={subject}
                                            className={`flex justify-center items-center ${selectedSubject === subject ? 'opacity-50' : ''}`}
                                            onClick={() => handleSelectSubject(subject)}
                                        >
                                            <AnimalIcon subject={subject} size="small" borderThickness={4} backgroundColor="#E4DDFB" />
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-rows-2 gap-y-30 self-center">
                                    {["Maths", "Science"].map((subject) => (
                                        <div
                                            key={subject}
                                            className={`flex justify-center items-center ${selectedSubject === subject ? 'opacity-50' : ''}`}
                                            onClick={() => handleSelectSubject(subject)}
                                        >
                                            <AnimalIcon subject={subject} size="small" borderThickness={4} backgroundColor="#E4DDFB" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                    <div className="flex flex-col items-center space-y-6">
                        <Title>Set Goals</Title>
                        <section className="w-80 p-4 bg-PS-light-yellow rounded-lg flex flex-col items-center space-y-4 shadow-lg">
                            <Input
                                size="medium"
                                id="SetGoalsQuizzes"
                                label="Number of quizzes"
                                value={quizzes}
                                onChange={handleNumberInput(setQuizzes, "quizzes")}
                                onError={() => errors.quizzes}
                            />
                            {errors.quizzes && <p className="text-red-500 text-sm">{errors.quizzes}</p>}
                            {!selectedSubject && (
                                <>
                                    <Input
                                        size="medium"
                                        id="SetGoalsMedals"
                                        label="Number of medals"
                                        value={medals}
                                        onChange={handleNumberInput(setMedals, "medals")}
                                        onError={() => errors.medals}
                                    />
                                    {errors.medals && <p className="text-red-500 text-sm">{errors.medals}</p>}
                                </>
                            )}
                        </section>
                    </div>
                </section>
                <div className="col-start-1 col-span-2 row-start-4 flex justify-center items-center gap-x-5">
                    <Link href="/Goals">
                        <Button size="large">cancel</Button>
                    </Link>
                    <Link href="/Goals">
                        <Button size="large" onClick={handleSave} disabled={Object.values(errors).some(error => error)}>save</Button>
                    </Link>
                </div>
            </section>
            <Footer />
        </div>
    );
}