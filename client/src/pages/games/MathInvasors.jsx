import React, { useEffect, useRef, useState } from "react";
import { P2Start } from '@/styles/fonts';
import Player from "@/pages/games/modules/MathInvasors/Player";
import Missile from "@/pages/games/modules/MathInvasors/Missile";
import { generateEnemies } from "@/pages/games/modules/MathInvasors/Enemy";
import { GetRandomOperation, GetRandomNumber } from "@/pages/games/modules/MathInvasors/MathUtils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import Lifes from "@/components/Lifes";
import {useRouter} from "next/router";
import ErrorReportModal from "@/components/ErrorModal";
import {useTranslation} from "react-i18next";
import CongratsModal from "@/components/CongratsModal";
import GameOverModal from "@/components/GameOverModal";
import saveGameData from "@/StorageServices/SaveDataFinishedGame";

function UnsetEvents(keyPressed, keyReleased) {
    window.removeEventListener("keydown", keyPressed);
    window.removeEventListener("keyup", keyReleased);
}

function SetEvents(keyPressed, keyReleased) {
    window.addEventListener("keydown", keyPressed);
    window.addEventListener("keyup", keyReleased);
}

const MaxRounds = 11;

const RightAnswerPoints = 5;
export default function MathInvasors() {
    const canvasRef = useRef(null);
    const playerRef = useRef(null);
    const missilesRef = useRef([]);
    const enemiesRef = useRef([]);
    const [Score, SetScore] = useState(0);
    const [Operation, SetOperation] = useState("");
    const CanvasWidth = 1150;
    const CanvasHeight = 630;
    let Result = useRef(0);
    const [Playing, SetPlaying] = useState(false);
    const [GameOver, SetGameOver] = useState(false);
    const [LifesAvailable, SetLifesAvailable] = useState(true);
    const [Win, SetWin] = useState(false);
    const animationFrameRef = useRef(null);
    const lifesRef = useRef(null);
    const router = useRouter();
    const [Difficulty, setDifficulty] = useState(0);
    const [Magnitude, setMagnitude] = useState(1);
    const [roundsCompleted, setRoundsCompleted] = useState(false);
    const {t} = useTranslation();
    let Round = 1

    useEffect(() => {
        if (!router.isReady) return;
        const age = router.query.Age;
        switch(age.toLowerCase()) {
            case "medium":
                setDifficulty(1);
                setMagnitude(Difficulty+1);
                break;
            case "hard":
                setDifficulty(2);
                setMagnitude(Difficulty+1);
        }
    }, [router.isReady]);

    useEffect(() => {
        if (roundsCompleted) {
            saveGameData(Score);
        }
    }, [roundsCompleted, Score, router.query.Age]);

    useEffect(() => {
        if (Playing) {
            Round = 1;
            enemiesRef.current = [];
            missilesRef.current = [];
        }
    }, [Playing]);

    const closeModal = () => {
        setTimeout(() => {
            router.back();
        }, 0);
    };

    function IfNotLivesGameOver(lifesRef, SetGameOver, SetPlaying, keyPressed, keyReleased, animationFrameRef, ctx, canvas) {
        if (!lifesRef.current) return;
        if (lifesRef.current.getRemainingLives() === 0) {
            SetGameOver(true);
            SetPlaying(false);
            UnsetEvents(keyPressed, keyReleased);
            cancelAnimationFrame(animationFrameRef.current);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            SetLifesAvailable(false);
        }
    }
    function IfAllEnemiesPassYouGameOver(keyPressed, keyReleased, ctx, canvas) {
        if (enemiesRef.current.length === 0) {
            SetGameOver(true);
            SetPlaying(false);
            UnsetEvents(keyPressed, keyReleased);
            cancelAnimationFrame(animationFrameRef.current);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    function IfAllRoundsDoneWin(keyPressed, keyReleased, ctx, canvas) {
        if (Round === MaxRounds) {
            SetWin(true);
            SetPlaying(false);
            setRoundsCompleted(true);
            UnsetEvents(keyPressed, keyReleased);
            cancelAnimationFrame(animationFrameRef.current);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    useEffect(() => {
        if (!Playing || GameOver) return;
        if (!LifesAvailable) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = CanvasWidth;
        canvas.height = CanvasHeight;
        playerRef.current = new Player(canvas.width, canvas.height);

        function SpawnWave(CanvasWidth) {
            const { operand1, operand2, operator, result } = GetRandomOperation(Difficulty);
            const newOperation = `${operand1} ${operator} ${operand2}`;
            SetOperation(newOperation)
            Result.current = result;
            const EnemiesWave = [GetRandomNumber(Magnitude), GetRandomNumber(Magnitude), result].sort(() => Math.random() - 0.5);
            enemiesRef.current = generateEnemies(CanvasWidth, EnemiesWave);
        }

        SpawnWave(canvas.width);

        const keyPressed = (e) => {
            if (!playerRef.current) return;
            if (e.key === "ArrowLeft") playerRef.current.MoveLeft();
            if (e.key === "ArrowRight") playerRef.current.MoveRight();
            if (e.key === " ") {
                e.preventDefault();
                const shootPosition = playerRef.current.Shoot();
                if (!shootPosition) return;
                const newMissile = new Missile(shootPosition.x, shootPosition.y);
                missilesRef.current.push(newMissile);
            }
        };

        const keyReleased = (e) => {
            if (!playerRef.current) return;
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                playerRef.current.Stop();
            }
        };

        SetEvents(keyPressed, keyReleased);

        const UpdateAndDrawPlayer = (ctx) => {
            if (!playerRef.current) return;
            playerRef.current.Update(canvas.width);
            playerRef.current.Draw(ctx);
        };

        const UpdateEnemies = () => {
            enemiesRef.current = enemiesRef.current.filter((enemy) => {
                enemy.Move();
                return enemy.Y <= canvas.height;
            });
        }

        const DrawEnemies = (ctx) => {
            enemiesRef.current.forEach((enemies) => enemies.Draw(ctx));
        }

        const UpdateMissiles = () => {
            missilesRef.current.forEach((missile) => missile.Move());
            missilesRef.current = missilesRef.current.filter(
                (missile) => missile.Y > 0
            );
        };

        const DrawMissiles = (ctx) => {
            missilesRef.current.forEach((missile) => missile.Draw(ctx));
        };

        function animateMissiles() {
            UpdateMissiles();
            DrawMissiles(ctx);
        }

        function animateEnemies() {
            UpdateEnemies();
            DrawEnemies(ctx);
        }

        const CheckCollisions = () => {
            let hitCorrectEnemy = false;
            let hit = false;
            missilesRef.current = missilesRef.current.filter((missile) => {
                enemiesRef.current = enemiesRef.current.filter((enemy) => {
                    function missileIsInEnemySquare() {
                        const HitboxOffset = 1.05;
                        return missile.X < enemy.X + (enemy.Width * HitboxOffset) &&
                            missile.X >= (enemy.X * 0.9) &&
                            missile.Y < enemy.Y + (enemy.Height * HitboxOffset) &&
                            missile.Y >= (enemy.Y * 0.9);
                    }
                    if (missileIsInEnemySquare()) {
                        hit = true;
                        if (enemy.Number === Result.current) {
                            SetScore((prevScore) => prevScore + RightAnswerPoints);
                            hitCorrectEnemy = true
                        }
                        return false;
                    }
                    return true;
                });
                return !hit;
            });
            if (hit && hitCorrectEnemy) {
                Round++;
                enemiesRef.current = [];
                SpawnWave(canvas.width);
            } else if (hit) {
                if (lifesRef.current) {
                    lifesRef.current.loseLife();
                    SetScore((prevScore) => prevScore - RightAnswerPoints);
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            UpdateAndDrawPlayer(ctx);
            animateMissiles();
            animateEnemies();
            CheckCollisions();
            animationFrameRef.current = requestAnimationFrame(animate);
            IfAllRoundsDoneWin(keyPressed, keyReleased, ctx, canvas);
            IfAllEnemiesPassYouGameOver(keyPressed, keyReleased, ctx, canvas);
            IfNotLivesGameOver(lifesRef, SetGameOver, SetPlaying, keyPressed, keyReleased, animationFrameRef, ctx, canvas);
        };
        animate();

        return () => {
            UnsetEvents(keyPressed, keyReleased);
        };
    }, [Playing]);

    return (
        <>
            <div id={""} className={"app flex flex-col h-screen bg-PS-main-purple"}>
                <Header></Header>
                <main className="flex flex-col flex-1 items-center justify-center bg-PS-main-purple">
                    <section className={"flex flex-col"}>
                        <h1 className={`text-center text-2xl ${P2Start.className} text-PS-dark-yellow`}>Math Invasors</h1>
                        <h2 className={`text-center text-3xl ${P2Start.className} text-PS-dark-yellow`}>{t('mathinvasors.score')}: {Score}</h2>
                        <h2 className={`text-center text-3xl ${P2Start.className} text-PS-dark-yellow`}><span>{t('mathinvasors.currentoperation')}:</span> {Operation}</h2>
                        <section id="life-section">
                            <Lifes ref={lifesRef}/>
                        </section>
                    </section>
                    <section className={"flex-1 flex items-center justify-center flex-col"}>
                        <section id={"top-menu-section"} className={"flex flex-row"}>
                            <div className="mt-4 mb-2 relative w-[1150px] flex justify-between">
                                <Button size="small" onClick={() => router.back()}> {t("backButton")} </Button>
                                <ErrorReportModal></ErrorReportModal>
                            </div>
                        </section>
                        <canvas
                            ref={canvasRef}
                            width={CanvasWidth}
                            height={CanvasHeight}
                            className="border-4 border-PS-dark-yellow bg-PS-light-yellow mb-4"
                        ></canvas>
                        {(Win) && (
                            <CongratsModal
                                points={Score}
                                onCloseMessage={closeModal}
                                onRestart={Start}
                            />
                        )}
                        {(!LifesAvailable || GameOver) && (
                            <GameOverModal
                                onCloseMessage={closeModal}
                                onRestart={Start}
                            />
                        )}
                    </section>
                    <section id={"button-menu-section"} className={"flex flex-row mb-5 space-x-5"}>
                        {!Playing &&  (
                            <Button id={"MainButton"} size={"large"} onClick={Start}>
                                {t('startButton')}
                            </Button>
                        )}
                    </section>
                </main>
                <Footer></Footer>
            </div>
        </>
    );

    function Start() {
        // Need to initialize full state here
        // Otherwise, some Restarts will not work
        // Due to some useEffect being executed
        // Before others
        lifesRef.current?.resetHearts();
        SetGameOver(false);
        SetWin(false);
        SetScore(0)
        SetLifesAvailable(true)
        SetPlaying(true);
        setRoundsCompleted(false);
    }
}