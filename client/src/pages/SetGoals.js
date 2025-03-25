import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Input from "@/components/Input";
import Title from "@/components/Title";
import Button from "@/components/Button";
import AnimalIcon from "@/components/AnimalIcon";
import Link from "next/link";

export default function EditProfile() {
    return (
        <div className="min-h-screen flex flex-col bg-PS-main-purple">
            <Header mode="loggedIn"/>
            <section
                className=" grid-rows-[auto,auto,auto,auto] m-auto flex-col items-center justify-start gap-6">

                <section className="flex flex-row justify-center items-center gap-10 m-auto p-6">
                    <div className="flex flex-col items-center">
                        <section className="w-80 h-80 p-4 flex justify-center items-center">
                            <div className="flex gap-x-30">
                                <div className="grid grid-rows-3 gap-y-30">
                                    {["English", "Art", "Geography"].map((subject) => (
                                        <div key={subject} className="flex justify-center items-center">
                                            <AnimalIcon subject={subject} size="small" borderThickness={4}
                                                        backgroundColor="#E4DDFB"/>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-rows-2 gap-y-30 self-center">
                                    {["Maths", "Science"].map((subject) => (
                                        <div key={subject} className="flex justify-center items-center">
                                            <AnimalIcon subject={subject} size="small" borderThickness={4}
                                                        backgroundColor="#E4DDFB"/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                    <div className="flex flex-col items-center space-y-6">
                        <Title>Set Goals</Title>
                        <section
                            className="w-80 p-4 bg-PS-light-yellow rounded-lg flex flex-col items-center space-y-4 shadow-lg">
                            <Input size="medium" id="SetGoalsMedals" label="Number of medals"/>
                            <Input size="medium" id="SetGoalsGames" label="Number of games"/>
                        </section>
                    </div>
                </section>

                <div className="col-start-1 col-span-2 row-start-4 flex justify-center items-center gap-x-5">
                    <Link href="/MyProfile">
                        <Button size="large">cancel</Button>
                    </Link>
                    <Link href="/Goals">
                        <Button size="large">save</Button>
                    </Link>
                </div>
            </section>
            <Footer/>
        </div>
    );
}
