import Header from "@/components/Header";
import Title from "@/components/Title";
import AnimalIcon from "@/components/AnimalIcon";
import Button from "@/components/Button";
import Footer from "@/components/Footer";
import React, {useState} from "react";
import Link from "next/link";
import {useProfile} from "@/pages/context/ProfileContext";
import {useAuth} from "@/pages/context/AuthContext";

const animalNames = [
    "Giraffe", "Sheep", "Lion", "Tiger", "Monkey", "Pig", "Shark", "Seal", "Koala"
];

export default function ChangeIcon() {
    const {isLoggedIn} = useAuth();
    const {profile, updateProfile} = useProfile();
    const [selectedAnimal, setSelectedAnimal] = useState(profile.icon);

    const handleAnimalClick = (animalName) => {
        setSelectedAnimal(animalName);
    };

    const handleSave = () => {
        updateProfile({icon: selectedAnimal});
    };

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple">
            <Header/>
            <section
                className="grid grid-cols-2 grid-rows-[auto,auto,auto,auto, auto] border-4 rounded-lg m-auto flex-col items-center justify-start bg-PS-light-yellow border-PS-dark-yellow mb-[-5vh] pb-[12vh] px-[8vh] gap-6">
                <div className="col-span-2 flex justify-center items-center">
                    <Title>Choose an icon</Title>
                </div>

                <div className="col-start-2 flex flex-col items-end space-y-6">
                    <section
                        className="w-80 h-80 mx-auto p-4 bg-[#FCBD70] rounded-lg flex justify-center items-center shadow-lg">
                        <div className="grid grid-cols-3 gap-x-0 gap-y-8 w-full h-full">
                            {animalNames.map((animal) => (
                                <div key={animal} className="flex justify-center items-center cursor-pointer"
                                     onClick={() => handleAnimalClick(animal)}>
                                    <AnimalIcon
                                        animalName={animal}
                                        size="small"
                                        borderThickness={2}
                                        backgroundColor="#E4DDFB"
                                        style={{
                                            opacity: selectedAnimal === animal ? 0.3 : 1,
                                            transition: 'opacity 0.3s'
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="col-start-1 row-start-2 flex justify-center items-center mb-[20px]">
                    <AnimalIcon animalName={selectedAnimal} size="large" borderThickness={5}
                                backgroundColor={"#FBC078"}/>
                </div>

                <div className="col-start-1 col-span-2 row-start-4 flex justify-between items-center">
                    <Link href="/MyProfile"><Button size="large">cancel</Button></Link>
                    <Link href="/MyProfile">
                        <Button size="large" onClick={handleSave}>save</Button>
                    </Link>
                </div>
            </section>
            <Footer/>
        </div>
    );
}
