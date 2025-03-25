/*
======================== USAGE ====================
Just call the component giving an array with completed goals and an
array with the goals to complete (Arrays must have the same size):

        <GoalsCard Progress={ProgressArray} Total={TotalArray}></GoalsCard>

======================== EXAMPLE ===================

        <GoalsCard Progress={[0, 3, 7]} Total={[7, 7, 7]}></GoalsCard>

 */

import {deliciousHandDrawn} from '@/styles/fonts';
import Title from "./Title";

const GetCompletedGoalsAsPercentage = ({Completed, Total}) => {
    return (Completed / Total) * 100;
};


const BuildDailyGoalsCardGoalListItem = ({Text, Completed, Total}) => {
    const progress = GetCompletedGoalsAsPercentage({Completed, Total});
    return (
        <li id="DailyGoalListItem">
            <h3 id={"DailyGoalListTitle"}
                className={`text-black font-bold text-4xl mb-2 ${deliciousHandDrawn.className}`}>{Text}</h3>
            <section id={"DailyGoalListItemBody"} className="flex items-center gap-4">
                <div id={"GrayProgressBar"} className="flex-grow w-full bg-PS-gray rounded-full h-4 overflow-hidden">
                    <div id={"YellowProgressBar"} className="bg-PS-dark-yellow h-full rounded-full"
                         style={{width: `${progress}%`}}></div>
                </div>
                <h3 id={"NumericProgress"}
                    className={`text-black text-6xl inline-flex items-center align-middle pb-4 pl-1 ${deliciousHandDrawn.className}`}>{Completed}/{Total}</h3>
            </section>
        </li>
    );
}

export default function GoalsCard({Progress, Total}) {
    return (
        <section
            id="DailyGoalsCard"
            className="bg-PS-light-yellow flex flex-col items-center border-6 border-PS-dark-yellow rounded-xl
                       w-full max-w-2xl h-auto pt-3 px-6 md:px-10">
            <Title level={1}>Daily Goals</Title>
            <div className="w-full max-w-lg h-px bg-black mt-4"></div>
            <ul id="DailyGoalsCardGoalList" className="w-full space-y-2 mt-6 pb-15">
                {Progress.map((completed, index) => (
                    <BuildDailyGoalsCardGoalListItem Text={"Complete Quizzes"} Completed={completed}
                                                     Total={Total[index]}/>
                ))}
            </ul>
        </section>
    );
}