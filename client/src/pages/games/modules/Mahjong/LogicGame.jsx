import {useEffect, useState} from "react";

export default function useMahjongGame(dataSets, initialPairCount = 12) {
    const [tiles, setTiles] = useState([]);
    const [board, setBoard] = useState([]);
    const [gamePairs, setGamePairs] = useState([]);
    const [pairMistakes, setPairMistakes] = useState({});
    const [selectedTiles, setSelectedTiles] = useState([]);
    const [removedTiles, setRemovedTiles] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [message, setMessage] = useState("");
    const [moves, setMoves] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [pairAttempts, setPairAttempts] = useState({});
    const [score, setScore] = useState(0);
    const [availableMoves, setAvailableMoves] = useState([]);

    const groupTilesByPairAndType = (tiles) => {
        const pairGroups = {};
        tiles.forEach(pos => {
            const {matchGroup: pair, type} = pos.tile;
            pairGroups[pair] = pairGroups[pair] || {};
            pairGroups[pair][type] = pairGroups[pair][type] || [];
            pairGroups[pair][type].push(pos);
        });
        return pairGroups;
    };

    const isBlocked = (position, gameBoard, removedTileIds) => {
        if (position.layer === 2) return false;

        const tilesAbove = gameBoard.filter(pos =>
            !removedTileIds.includes(pos.tile.id) &&
            pos.layer > position.layer &&
            Math.abs(pos.row - position.row) <= 1 &&
            Math.abs(pos.col - position.col) <= 1
        );

        return tilesAbove.length > 0;
    };

    const isTileBlocked = (position) => {
        return isBlocked(position, board, removedTiles);
    };

    const simulateGameplay = (gameBoard) => {
        let simulatedBoard = [...gameBoard];
        let simulatedRemovedTiles = [];
        let movesAvailable = true;
        let iterations = 0;
        const maxIterations = 12;

        while (movesAvailable && iterations < maxIterations) {
            const availableTiles = simulatedBoard.filter(
                pos => !simulatedRemovedTiles.includes(pos.tile.id) &&
                    !isBlocked(pos, simulatedBoard, simulatedRemovedTiles)
            );

            const pairGroups = groupTilesByPairAndType(availableTiles);

            let completeSetFound = false;
            for (const pair in pairGroups) {
                if (Object.keys(pairGroups[pair]).length === 2) {
                    for (const type in pairGroups[pair]) {
                        simulatedRemovedTiles.push(pairGroups[pair][type][0].tile.id);
                    }
                    completeSetFound = true;
                    iterations++;
                    break;
                }
            }

            if (!completeSetFound) movesAvailable = false;
        }

        return {
            isValid: iterations === maxIterations,
            completedSets: iterations
        };
    };

    const generateValidMahjongBoard = (gameTiles) => {
        const boardPositions = [
            {layer: 0, row: 0, col: 1}, {layer: 0, row: 0, col: 3}, {layer: 0, row: 0, col: 5},
            {layer: 0, row: 1, col: 0}, {layer: 0, row: 1, col: 2}, {layer: 0, row: 1, col: 4},
            {layer: 0, row: 1, col: 6}, {layer: 0, row: 2, col: 1}, {layer: 0, row: 2, col: 3},
            {layer: 0, row: 2, col: 5}, {layer: 0, row: 3, col: 0}, {layer: 0, row: 3, col: 2},
            {layer: 0, row: 3, col: 4}, {layer: 0, row: 3, col: 6}, {layer: 0, row: 4, col: 1},
            {layer: 0, row: 4, col: 3}, {layer: 0, row: 4, col: 5}, {layer: 1, row: 1, col: 1},
            {layer: 1, row: 1, col: 3}, {layer: 1, row: 1, col: 5}, {layer: 1, row: 3, col: 1},
            {layer: 1, row: 3, col: 3}, {layer: 1, row: 3, col: 5}, {layer: 2, row: 2, col: 3}
        ];

        let attempts = 0;
        let validBoardFound = false;
        let newBoard = [];

        const placeTilesInPositions = (tiles, positions, board, availablePositions) => {
            while (tiles.length > 0 && positions.length > 0) {
                const posIndex = Math.floor(Math.random() * positions.length);
                const position = positions.splice(posIndex, 1)[0];
                availablePositions = availablePositions.filter(p =>
                    !(p.layer === position.layer && p.row === position.row && p.col === position.col)
                );

                const tile = tiles.shift();
                tile.position = position;
                tile.top = position.row * 100;
                tile.left = position.col * 100;

                board.push({...position, tile});
            }
            return {board, availablePositions};
        };

        while (!validBoardFound && attempts < 100) {
            attempts++;

            const tilesByPair = {};
            gameTiles.forEach(tile => {
                if (!tilesByPair[tile.matchGroup]) tilesByPair[tile.matchGroup] = [];
                tilesByPair[tile.matchGroup].push({...tile});
            });

            let availablePositions = [...boardPositions];
            newBoard = [];
            let pairsInTopLayer = 0;
            const pairsNeededInTopLayer = 1;

            for (const pair in tilesByPair) {
                if (pairsInTopLayer >= pairsNeededInTopLayer) break;

                const topLayerPositions = availablePositions.filter(p => p.layer === 2);
                if (topLayerPositions.length >= 2) {
                    const tiles = tilesByPair[pair].splice(0, 2);
                    const result = placeTilesInPositions(tiles, topLayerPositions, newBoard, availablePositions);
                    newBoard = result.board;
                    availablePositions = result.availablePositions;

                    delete tilesByPair[pair];
                    pairsInTopLayer++;
                }
            }

            for (const pair in tilesByPair) {
                const tiles = tilesByPair[pair];
                const midLayerPositions = availablePositions.filter(p => p.layer === 1);
                const baseLayerPositions = availablePositions.filter(p => p.layer === 0);

                if (midLayerPositions.length >= 2) {
                    const result = placeTilesInPositions(tiles.splice(0, 2), midLayerPositions, newBoard, availablePositions);
                    newBoard = result.board;
                    availablePositions = result.availablePositions;
                }

                const result = placeTilesInPositions(tiles, baseLayerPositions, newBoard, availablePositions);
                newBoard = result.board;
                availablePositions = result.availablePositions;
            }

            const remainingTiles = Object.values(tilesByPair).flat();
            const allResult = placeTilesInPositions(remainingTiles, availablePositions, newBoard, availablePositions);
            newBoard = allResult.board;

            if (newBoard.length === gameTiles.length) {
                const simulation = simulateGameplay(newBoard);
                if (simulation.isValid) validBoardFound = true;
            }
        }

        setBoard(newBoard);
    };

    const checkAvailableMoves = () => {
        const unlockedTiles = board.filter(
            pos => !removedTiles.includes(pos.tile.id) && !isBlocked(pos, board, removedTiles)
        );

        const pairGroups = groupTilesByPairAndType(unlockedTiles);

        const availableSets = [];
        for (const pair in pairGroups) {
            if (Object.keys(pairGroups[pair]).length === 2) {
                availableSets.push({pair, forms: pairGroups[pair]});
            }
        }

        setAvailableMoves(availableSets);

        if (availableSets.length === 0 && removedTiles.length < tiles.length && !gameWon) {
            const remainingPairsComplete = gamePairs.filter(p => {
                const pairTiles = tiles.filter(t => t.matchGroup === p.form1);
                const removedPairTiles = pairTiles.filter(t => removedTiles.includes(t.id));
                return removedPairTiles.length < 2;
            });

            if (remainingPairsComplete.length > 0) {
                setMessage("No moves available. Rearranging the board...");
                setTimeout(reorganizeBoard, 1500);
            }
        }
    };

    const reorganizeBoard = () => {
        const boardPositions = [
            {layer: 0, row: 0, col: 1}, {layer: 0, row: 0, col: 3}, {layer: 0, row: 0, col: 5},
            {layer: 0, row: 1, col: 0}, {layer: 0, row: 1, col: 2}, {layer: 0, row: 1, col: 4},
            {layer: 0, row: 1, col: 6}, {layer: 0, row: 2, col: 1}, {layer: 0, row: 2, col: 3},
            {layer: 0, row: 2, col: 5}, {layer: 0, row: 3, col: 0}, {layer: 0, row: 3, col: 2},
            {layer: 0, row: 3, col: 4}, {layer: 0, row: 3, col: 6}, {layer: 0, row: 4, col: 1},
            {layer: 0, row: 4, col: 3}, {layer: 0, row: 4, col: 5}, {layer: 1, row: 1, col: 1},
            {layer: 1, row: 1, col: 3}, {layer: 1, row: 1, col: 5}, {layer: 1, row: 3, col: 1},
            {layer: 1, row: 3, col: 3}, {layer: 1, row: 3, col: 5}, {layer: 2, row: 2, col: 3}
        ];

        const remainingTiles = board
            .filter(pos => !removedTiles.includes(pos.tile.id))
            .map(pos => pos.tile);

        const availablePositions = boardPositions.slice(0, remainingTiles.length);

        const tilesByPair = {};
        remainingTiles.forEach(tile => {
            if (!tilesByPair[tile.matchGroup]) {
                tilesByPair[tile.matchGroup] = [];
            }
            tilesByPair[tile.matchGroup].push({...tile});
        });

        const pairsWithTwoForms = Object.keys(tilesByPair)
            .filter(pair => tilesByPair[pair].length === 2);

        let newBoard = [...board.filter(pos => removedTiles.includes(pos.tile.id))];
        let positionsRemaining = [...availablePositions];

        if (pairsWithTwoForms.length > 0) {
            const priorityPair = pairsWithTwoForms[0];
            const topLayerPositions = positionsRemaining.filter(pos => pos.layer === 2);

            if (topLayerPositions.length > 0) {
                for (let i = 0; i < Math.min(tilesByPair[priorityPair].length, topLayerPositions.length); i++) {
                    const position = topLayerPositions[i];
                    const tile = tilesByPair[priorityPair][i];

                    tile.position = position;
                    tile.top = position.row * 100;
                    tile.left = position.col * 100;

                    newBoard.push({
                        ...position,
                        tile: tile
                    });

                    positionsRemaining = positionsRemaining.filter(p =>
                        !(p.layer === position.layer && p.row === position.row && p.col === position.col));
                }

                tilesByPair[priorityPair] = tilesByPair[priorityPair].slice(topLayerPositions.length);
                if (tilesByPair[priorityPair].length === 0) {
                    delete tilesByPair[priorityPair];
                }
            }
        }

        const remainingTilesFlat = Object.values(tilesByPair).flat();
        remainingTilesFlat.sort(() => Math.random() - 0.5);

        while (remainingTilesFlat.length > 0 && positionsRemaining.length > 0) {
            const position = positionsRemaining.shift();
            const tile = remainingTilesFlat.shift();

            tile.position = position;
            tile.top = position.row * 100;
            tile.left = position.col * 100;

            newBoard.push({
                ...position,
                tile: tile
            });
        }

        setBoard(newBoard);
        setMessage("Board rearranged. Continue playing!");
    };

    const initializeGame = () => {
        if (!dataSets || dataSets.length === 0) {
            console.error("dataSets is empty, cannot initialize the game!");
            return;
        }

        const gamePairs = [...dataSets]
            .sort(() => Math.random() - 0.5)
            .slice(0, initialPairCount);

        const uniquePairs = [];
        const seenPairs = new Set();

        gamePairs.forEach(pair => {
            if (!seenPairs.has(pair.form1)) {
                seenPairs.add(pair.form1);
                uniquePairs.push(pair);
            }
        });

        setGamePairs(uniquePairs);

        let gameTiles = [];
        let tileId = 0;

        uniquePairs.forEach(pair => {
            gameTiles.push({
                id: tileId++,
                type: "form1",
                pairId: pair.form1,
                value: pair.form1,
                matchGroup: pair.form1
            });

            gameTiles.push({
                id: tileId++,
                type: "form2",
                pairId: pair.form1,
                value: pair.form2,
                matchGroup: pair.form1
            });
        });

        setTiles(gameTiles);
        generateValidMahjongBoard(gameTiles);
        setSelectedTiles([]);
        setRemovedTiles([]);
        setGameStarted(true);
        setGameWon(false);
        setMoves(0);
        setMistakes(0);
        setScore(0);
        setPairMistakes({});
    };

    const handleTileClick = (position) => {
        if (gameWon || mistakes >= 5 || Object.values(pairMistakes).some(v => v > 3)) return;

        if (isTileBlocked(position)) {
            setMessage("This tile is locked.");
            return;
        }

        if (selectedTiles.some(t => t.tile.id === position.tile.id)) {
            setSelectedTiles(selectedTiles.filter(t => t.tile.id !== position.tile.id));
            return;
        }

        const newSelectedTiles = [...selectedTiles, position];
        setSelectedTiles(newSelectedTiles);

        if (newSelectedTiles.length === 2) {
            const [first, second] = newSelectedTiles;
            setMoves(moves + 1);

            const samePair = first.tile.matchGroup === second.tile.matchGroup;
            const differentTypes = first.tile.type !== second.tile.type;

            const pairId = first.tile.pairId;

            if (samePair && differentTypes) {
                const isFirstAttempt = pairMistakes[pairId] === undefined || pairMistakes[pairId] === 0;

                let pointsToAdd = isFirstAttempt ? 5 : 1;
                setScore(prevScore => prevScore + pointsToAdd);
                setPairMistakes(prev => ({
                    ...prev,
                    [pairId]: (prev[pairId] || 0) + 1
                }));

                const newRemovedTiles = [...removedTiles, first.tile.id, second.tile.id];
                setRemovedTiles(newRemovedTiles);
                setMessage(`Well done! "${pairId}"`);

                if (newRemovedTiles.length === tiles.length) {
                    setGameWon(true);
                    setMessage(`Congratulations! You have completed the game with ${score + pointsToAdd} points.`);
                }
            } else {
                const newMistakes = mistakes + 1;
                setMistakes(newMistakes);
                setMessage("They do not match.");

                const newPairMistakes = {...pairMistakes, [pairId]: (pairMistakes[pairId] || 0) + 1};
                setPairMistakes(newPairMistakes);

                if (newPairMistakes[pairId] > 3 || newMistakes === 5) {
                    setGameWon(false);
                    setMessage("Game over! You have reached the maximum number of errors.");
                }
            }

            setTimeout(() => {
                setSelectedTiles([]);
            }, 1500);
        }
    };

    useEffect(() => {
        initializeGame();
    }, []);

    useEffect(() => {
        if (gameStarted && !gameWon) {
            checkAvailableMoves();
        }
    }, [removedTiles, board]);

    return {
        tiles, board, gamePairs, pairMistakes,
        selectedTiles, removedTiles, gameStarted, gameWon,
        message, moves, mistakes, score, availableMoves,
        handleTileClick, initializeGame, isTileBlocked
    };
};
