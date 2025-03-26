import React from "react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Footer from "@/components/Footer";
import GoalsCard from "@/components/GoalsCard";
import Link from "next/link";
import {useGoals} from "@/pages/context/GoalContext";

function Goals() {
    const { goals } = useGoals();
    return (
        <>
            <div className="app min-h-screen flex flex-col bg-PS-main-purple">
                <Header/>
                <section className="flex-grow flex flex-col relative mt-5 mb-5 justify-center items-center align-middle">
                    <GoalsCard Progress={goals.completed} Total={goals.total}/>
                    <div>
                        <Link href="/SetGoals">
                            <Button size="large">set goals</Button>
                        </Link>
                    </div>
                </section>
                <Footer/>
            </div>
        </>
    );
}
export default Goals;