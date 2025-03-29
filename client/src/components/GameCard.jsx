/*
======================== USAGE ====================
        <GameCard
              Title={"Game name"}
              Description={"Game description Game description Game description Game description Game description"}
              Completed={true}
              Subject={"Art"}
              Score={"0"}>
        </GameCard>
*/

import Button from "@/components/Button";
import React from "react";

export default function GameCard(props) {
    const { Title, Description, Completed, Subject, Score } = props;

    const getBackgroundStyle = () => {
        if (Completed) {
            const backgroundImages = {
                "Art": "url(../images/platypus.png)",
                "Science": "url(../images/platypus.png)",
                "English": "url(../images/platypus.png)",
                "Geography": "url(../images/platypus.png)",
                "Math": "url(../images/platypus.png)"
            };

            return {
                backgroundImage: backgroundImages[Subject] || "url(../images/platypus.png)",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                position: "relative",
            };
        }
        return {};
    };

    function getGameFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const game = urlParams.get("Game");

        {/* Decode the URL Game param */}
        if (game) {
            const decodedGame = decodeURIComponent(game);
            return decodedGame.replace(/(?:^|\s)\w/g, (match) => match.toUpperCase())
                .replace(/\s+/g, '');
        } return null;
    }

    function startGame() {
        const game = getGameFromURL();
        console.log(game);
        if (game) window.location.href = "/games/" + game;
        else console.log("The param 'Game' is not in the URL.")
    }

    return (
        <section
            className="w-75 h-90 flex flex-col m-auto items-center justify-evenly border-4 rounded-lg bg-PS-light-yellow border-PS-dark-yellow text-black p-4 shadow-lg relative"
            style={getBackgroundStyle()}>
            <div className="text-2xl font-black text-center">{Title}</div>
            <div className="text-sm text-center font-medium p-2 rounded-md">{Description}</div>
            <Button size="small"
            onClick={startGame}>start</Button>
            <div className="text-lg font-semibold">Previous Score: {Score ?? "N/A"}</div>
        </section>
    );
}
