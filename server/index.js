const express = require('express');
const app = express();
const PORT = 8080;
const cors = require('cors');
const { readFile, writeFile } = require('fs');
const {join} = require("node:path");
const path = require("node:path");


const dbConnection = require('./database');
const {query, response} = require("express");

app.use(cors());
app.use(express.json());
app.use('/sfx', express.static(path.join(__dirname, 'public/sfx')));

app.get("/api/home", (req, res) => {
    res.json({message: "Hello World!"});
})

app.post("/api/signup", (req, res) => { // DEPRECATED U SHOULD USE DB INSTEAD
    try {
        let userData = req.body;
        const dbFilePath = join(__dirname, '../database/jsondata/Users.json');
        readFile(dbFilePath, 'utf-8', (err, data) => {
            if (err) {
                console.error("Error al leer el archivo:", err);
            }
            const users = JSON.parse(data);
            users.push(userData);
            writeFile(dbFilePath, JSON.stringify(users, null, 2), (writeErr) => {
                if (writeErr) {
                    console.error("Error al escribir en el archivo:", writeErr);
                    return res.status(500).json({ message: "Error al guardar el usuario" });
                }
                res.status(201).json({ message: "Usuario registrado con éxito", userData });
            });
        });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

app.post('/api/register', (req, res) => {
    const { Name, Email, Password, ProfilePhoto } = req.body;
    const query = 'INSERT INTO Users (Name, Email, Password) VALUES (?, ?, ?)';
    dbConnection.query(query, [Name, Email, Password], (err, result) => {
        if (err) {
            console.error('Error while register:', err);
            return res.status(500).json({ message: 'Something went wrong' });
        }
        logIn(Email, Password, res);
    });
});

app.post('/api/login', (req, res) => {
    const {Email, Password} = req.body;
    logIn(Email, Password, res);
})

function logIn(Email, Password, res) {
    const Query = 'SELECT * FROM Users WHERE Email = ? AND Password = ?';
    dbConnection.query(Query, [Email, Password], (err, result) => {
        if (err) {
            return res.status(500).json({message: 'Something went wrong'});
        }
        if (result.length <= 0) {
            return res.status(401).json({message: 'Invalid credentials, please try again.'});
        } else {
            const User = result[0];
            res.status(200).json({
                userId: User.Id,
                name: User.Name,
                email: User.Email,
                profilePhoto: User.ProfileIcon,
                lifes: User.Lifes,
                isPremium: User.Premium
            });
        }
    })
}

app.post('/api/email', (req, res) => {
    const { Email } = req.body;
    const Query = 'SELECT * FROM Users WHERE Email = ?';
    dbConnection.query(Query, [Email], (err, result) => {
        if (result.length <= 0) return res.status(200).json({message: 'Available email'});
        else return res.status(409).json({ message: 'Email already registered, try to log in!' });
    })
})

app.post('/api/updateProfileImage', (req, res) => {
    const { email, profilePhoto } = req.body;
    const Query = 'UPDATE Users SET ProfileIcon = ? WHERE Email = ?';
    dbConnection.query(Query, [profilePhoto, email], (err, result) => {
        if (err) {
            return res.status(500).json({message: 'Something went wrong'});
        } else {
            return res.status(200).json({ message: 'Profile updated successfully' });
        }
    })
})

app.post('/api/updateProfileData', (req, res) => {
    const { email: Email, name: Name } = req.body;
    const Query = 'UPDATE Users SET Name = ? WHERE Email = ?';
    dbConnection.query(Query, [Name, Email], (err, result) => {
        if (err) {
            return res.status(500).json({message: 'Something went wrong'});
        } else {
            if (result.affectedRows === 0) {
                return res.status(404).json({ mensaje: "User not found" });
            }
            return res.status(200).json({ message: 'Profile updated successfully' });
        }
    })
})

app.get('/api/gameSelectionAssets', (req, res) => {
    const Subject = req.query.subject;
    const multimediaQuery = '\tSELECT DISTINCT \n' +
        '    s.Id AS SubjectId,\n' +
        '    m.Id AS MultimediaID,\n' +
        '    s.Name AS subjectName,\n' +
        '    s.Mascot AS animalName,\n' +
        '    CONCAT(\'#\', s.PrimaryColor) AS primaryColor,\n' +
        '    CONCAT(\'#\', s.SecondaryColor) AS secondaryColor,\n' +
        '    m.URL AS imageURL,\n' +
        '    m.Name AS imageName,\n' +
        '    m.Alt AS imageAlt\n' +
        'FROM \n' +
        '    Subjects s\n' +
        'LEFT JOIN MultimediaSubjects ms ON s.Id = ms.IdSubject\n' +
        'LEFT JOIN Multimedia m ON ms.IdMultimedia = m.Id\n' +
        'WHERE \n' +
        '    s.Name = ? ORDER BY length(imageName);';
    const gameQuery = 'SELECT QuizName\n' +
        'FROM AllSubjectQuizzes\n' +
        'WHERE SubjectName = ?\n' +
        'ORDER BY Priority;'
    const getMultimedia = () => {
        return new Promise((resolve, reject) => {
            dbConnection.query(multimediaQuery, [Subject], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            })
        })
    }

    const getGames = () => {
        return new Promise((resolve, reject) => {
            dbConnection.query(gameQuery, [Subject], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            })
        })
    }

    Promise.all([getMultimedia(), getGames()])
        .then(([multimediaResult, gamesResult]) => {
            if(multimediaResult.length === 0) return res.status(404).json({ message:  "Unrecognized subject" });

            const response = {
                subjectName: multimediaResult[0].subjectName,
                animalName: multimediaResult[0].animalName,
                primaryColor: multimediaResult[0].primaryColor,
                secondaryColor: multimediaResult[0].secondaryColor
            };

            multimediaResult.forEach(item => {
                if (item.imageName.includes('BaseIcon')) {
                    response.baseIcon = item.imageURL;
                } else if (item.imageName.includes('SelectGameIcon')) {
                    response.selectGameIcon = item.imageURL;
                } else if (item.imageName.includes('PreviewGameIcon')) {
                    response.PreviewGameImage = item.imageURL;
                }
            });

            gamesResult.forEach((game, index) => {
                if (index === 0) response.firstGame = game.QuizName;
                else if (index === 1) response.secondGame = game.QuizName;
                else if (index === 2) response.thirdGame = game.QuizName;
            });
            return res.status(200).json(response);
        });
})

app.post("/api/updatePremium", (req, res) => {
    const { Email, Premium } = req.body;

    const query = "UPDATE Users SET Premium = ? WHERE Email = ?";
    dbConnection.query(query, [Premium ? 1 : 0, Email], (err, result) => {
        if (err) {
            console.error("Error updating premium status:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Premium status updated successfully" });
    });
});

app.get('/api/popularGames', (req, res) => {
    const query = `
        SELECT DISTINCT
            sq.QuizId,
            q.QuizName,
            s.Name,
            SUM(sq.CompletedCount) AS CompletedCount
        FROM SubjectQuizzes sq
                 LEFT JOIN Quizzes q ON q.Id = sq.QuizId
                 LEFT JOIN Subjects s ON s.Id = sq.SubjectId
        GROUP BY sq.QuizId, q.QuizName, s.Name
        ORDER BY CompletedCount DESC
            LIMIT 5;
`;
    dbConnection.query(query, (err, result) => {
        if (err) {
            console.error("Error fetching popular games:", err);
            return res.status(500).json({ message: "Something went wrong while fetching popular games" });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "No popular games found" });
        }
        res.status(200).json({
            popularGames: result
        });
    });
});

app.get('/api/getQuizName', (req, res) => {
    const { quizId } = req.query;

    const query = 'SELECT QuizName FROM Quizzes WHERE Id = ?';

    dbConnection.query(query, [quizId], (err, result) => {
        if (err) {
            console.error("Error fetching quiz name:", err);
            return res.status(500).json({ message: "Something went wrong while fetching quiz name" });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        res.status(200).json({
            quizName: result[0].QuizName
        });
    });
});

app.get('/api/getPrimaryColor', (req, res) => {
    const { subjectName } = req.query;

    const query = 'SELECT PrimaryColor FROM Subjects WHERE Name = ?';

    dbConnection.query(query, [subjectName], (err, result) => {
        if (err) {
            console.error("Error fetching primary color:", err);
            return res.status(500).json({ message: "Something went wrong while fetching primary color" });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Subject not found" });
        }

        res.status(200).json({
            primaryColor: result[0].PrimaryColor
        });
    });
});

app.get('/api/searchGames', (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({
            message: 'You must type a term of searching games'
        });
    }

    const searchQuery = `
        SELECT DISTINCT
            sq.QuizId,
            q.QuizName,
            s.Name
        FROM SubjectQuizzes sq
        LEFT JOIN Quizzes q ON q.Id = sq.QuizId
        LEFT JOIN Subjects s ON s.Id = sq.SubjectId
        WHERE q.QuizName LIKE ? OR s.Name LIKE ?
        ORDER BY q.QuizName
        LIMIT 10;
    `;

    const searchTerm = `%${query}%`;

    dbConnection.query(searchQuery, [searchTerm, searchTerm], (err, result) => {
        if (err) {
            console.error("Error searching games:", err);
            return res.status(500).json({
                message: ""
            });
        }

        res.status(200).json({
            games: result
        });
    });
});

app.get('/api/getBestScore', (req, res) => {
    const { userId, quizId, difficulty } = req.query;

    if (!userId || !quizId || !difficulty) {
        return res.status(400).json({ message: 'Missing parameters: userId, quizId, and difficulty are required' });
    }


    let column = '';
    if (difficulty === 'easy') {
        column = 'BestScoreEasy';
    } else if (difficulty === 'medium') {
        column = 'BestScoreMedium';
    } else if (difficulty === 'hard') {
        column = 'BestScoreHard';
    } else {
        return res.status(400).json({ message: 'Invalid difficulty' });
    }

    const query = `SELECT ${column} FROM UserQuizzes uq, Quizzes q WHERE UserId = ? AND QuizName = ? AND uq.QuizId = q.Id`;
    dbConnection.query(query, [userId, quizId], (err, result) => {
        if (err) {
            console.error("Error fetching best score:", err);
            return res.status(500).json({ message: 'Something went wrong while fetching best score' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Best score not found for this user and quiz' });
        }
        const bestScore = result[0][column];
        res.status(200).json({ bestScore });
    });
});


app.post('/api/updateBestScore', (req, res) => {
    const { email, scores } = req.body;

    if (!email || !scores || typeof scores !== 'object') {
        return res.status(400).json({ message: "Invalid input" });
    }

    const getUserIdQuery = `SELECT Id FROM Users WHERE Email = ?`;
    dbConnection.query(getUserIdQuery, [email], (err, userResult) => {
        if (err || userResult.length === 0) {
            console.error("User lookup error:", err);
            return res.status(404).json({ message: "User not found" });
        }

        const userId = userResult[0].Id;

        const updateTasks = [];

        for (const quizName in scores) {
            updateTasks.push(new Promise((resolve, reject) => {
                const getQuizIdQuery = `SELECT Id FROM Quizzes WHERE QuizName = ?`;
                dbConnection.query(getQuizIdQuery, [quizName], (quizErr, quizResult) => {
                    if (quizErr || quizResult.length === 0) {
                        console.warn("Quiz not found or error:", quizName);
                        return resolve();
                    }

                    const quizId = quizResult[0].Id;

                    const scoreUpdates = Object.entries(scores[quizName]).map(([difficulty, score]) => {
                        const columnMap = {
                            easy: 'BestScoreEasy',
                            medium: 'BestScoreMedium',
                            hard: 'BestScoreHard'
                        };

                        const column = columnMap[difficulty];
                        if (!column) return Promise.resolve();

                        return new Promise((res2, rej2) => {
                            const selectQuery = `SELECT ${column} FROM UserQuizzes WHERE UserId = ? AND QuizId = ?`;
                            dbConnection.query(selectQuery, [userId, quizId], (selectErr, result) => {
                                if (selectErr || result.length === 0) {
                                    console.warn("No existing UserQuiz row or error:", selectErr);
                                    return res2();
                                }

                                const currentScore = result[0][column];

                                if (score > currentScore) {
                                    const updateQuery = `UPDATE UserQuizzes SET ${column} = ? WHERE UserId = ? AND QuizId = ?`;
                                    dbConnection.query(updateQuery, [score, userId, quizId], (updateErr) => {
                                        if (updateErr) {
                                            console.error("Update error:", updateErr);
                                        }
                                        res2();
                                    });
                                } else {
                                    res2();
                                }
                            });
                        });
                    });

                    Promise.all(scoreUpdates).then(resolve).catch(reject);
                });
            }));
        }

        Promise.all(updateTasks)
            .then(() => res.status(200).json({ message: "All scores processed" }))
            .catch(err => {
                console.error("Final processing error:", err);
                res.status(500).json({ message: "Error updating some scores" });
            });
    });
});

app.get('/api/isPremiumGame', (req, res) => {
    const { quizName } = req.query;

    if (!quizName) {
        return res.status(400).json({ message: "Missing required parameter: quizName" });
    }

    const query = 'SELECT Premium FROM Quizzes WHERE QuizName = ?';

    dbConnection.query(query, [quizName], (err, result) => {
        if (err) {
            console.error("Error checking premium status:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        res.status(200).json({ isPremium: !!result[0].Premium });
    });
});

app.get('/api/isRegisterGame', (req, res) => {
    const { quizName } = req.query;

    if (!quizName) {
        return res.status(400).json({ message: "Missing required parameter: quizName" });
    }

    const query = 'SELECT Register FROM Quizzes WHERE QuizName = ?';

    dbConnection.query(query, [quizName], (err, result) => {
        if (err) {
            console.error("Error checking register status:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        const isRegister = !!result[0].Register;

        res.status(200).json({ isRegister });
    });
});

app.get('/api/getMahjongData', (req, res) => {
    const difficulty = req.query.Age;

    if (!difficulty || !['easy', 'medium', 'hard'].includes(difficulty.toLowerCase())) {
        return res.status(400).json({ message: "Missing or invalid difficulty (Age) parameter" });
    }

    const query = 'SELECT form1, form2 FROM Mahjong WHERE Age = ?';

    dbConnection.query(query, [difficulty.toLowerCase()], (err, results) => {
        if (err) {
            console.error("Error fetching Mahjong data:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No Mahjong data found for this difficulty" });
        }
        res.status(200).json({ data: results });
    });
});

app.get("/api/cookTheBookStories", (req, res) => {
    const difficulty = req.query.difficulty;
    const Query = 'SELECT g.Id, p.Id AS PieceId, g.Title, p.PieceOrder, p.Text\n' +
        'FROM (\n' +
        '    SELECT Id, Title\n' +
        '    FROM CookTheBook_Stories\n' +
        '    ORDER BY RAND()\n' +
        '    LIMIT 3\n' +
        ') g, CookTheBook_StoryPieces p\n' +
        'WHERE g.Id = p.StoryId\n' +
        'AND Difficulty = ?\n' +
        'ORDER BY g.Id;'
    dbConnection.query(Query, [difficulty],  (err, result) => {
        if (err) return res.status(500).json({message: 'Something went wrong'});
        if (result.length === 0) return res.status(404).json({message: ''})
        else {
            const formattedStories = [];
            result.forEach(piece => {
                const storyIndex = formattedStories.findIndex(story => story.id === piece.Id);
                if (storyIndex === -1) {
                    formattedStories.push({
                        id: piece.Id,
                        title: piece.Title,
                        pieces: [{
                            id: piece.PieceId,
                            text: piece.Text,
                            order: piece.PieceOrder
                        }]
                    });
                } else {
                    formattedStories[storyIndex].pieces.push({
                        id: piece.PieceId,
                        text: piece.Text,
                        order: piece.PieceOrder
                    });
                }
            });
            return res.status(200).json({Stories: formattedStories})
        }
    })
})

app.get('/api/getTutorialVideo', (req, res) => {
    const quizName = req.query.quizName;

    if (!quizName) {
        return res.status(400).json({ message: "Missing quizName parameter" });
    }

    const query = 'SELECT Tutorial FROM Quizzes WHERE QuizName = ?';

    dbConnection.query(query, [quizName], (err, results) => {
        if (err) {
            console.error("Error fetching tutorial video:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (results.length === 0 || !results[0].Tutorial) {
            return res.status(404).json({ message: "No tutorial video found for this quiz" });
        }

        res.status(200).json({ tutorialVideo: results[0].Tutorial });
    });
});

app.get('/api/getLetterSoup', (req, res) => {
    const difficulty = req.query.Difficulty?.toLowerCase();

    if (!difficulty || !['easy', 'medium', 'hard'].includes(difficulty)) {
        console.warn("Invalid or missing difficulty parameter");
        return res.status(400).json({ message: "Missing or invalid 'Difficulty' parameter" });
    }

    const query = 'SELECT Grid, Words FROM LetterSoup WHERE Difficulty = ? ORDER BY RAND() LIMIT 1';

    dbConnection.query(query, [difficulty], (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No LetterSoup data found for this difficulty" });
        }

        let { Grid, Words } = results[0];

        try {
            Grid = typeof Grid === 'string' ? JSON.parse(Grid) : Grid;
            Words = typeof Words === 'string' ? JSON.parse(Words) : Words;

            if (!Array.isArray(Grid) || !Grid.every(row => Array.isArray(row))) {
                throw new Error("Invalid Grid format");
            }
            if (!Array.isArray(Words)) {
                throw new Error("Invalid Words format");
            }

            return res.status(200).json({
                grid: Grid,
                words: Words
            });
        } catch (error) {
            console.error("Data validation error:", error);
            return res.status(500).json({ message: "Data format error in database" });
        }
    });
});

app.get('/api/getUserMedals', (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ message: 'Missing parameter: userId is required' });
    }

    const query = `
        SELECT q.QuizName, uq.GoldMedal, uq.SilverMedal, uq.BronzeMedal
        FROM UserQuizzes uq
                 JOIN Quizzes q ON uq.QuizId = q.Id
        WHERE uq.UserId = ?
    `;

    dbConnection.query(query, [userId], (err, result) => {
        if (err) {
            console.error("Error fetching medals:", err);
            return res.status(500).json({ message: 'Something went wrong while fetching medals' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'No medals found for this user' });
        }

        const medals = result.map(quiz => ({
            quizName: quiz.QuizName,
            GoldMedal: quiz.GoldMedal,
            SilverMedal: quiz.SilverMedal,
            BronzeMedal: quiz.BronzeMedal
        }));

        res.status(200).json(medals);
    });
});


app.post("/api/updateMedals", async (req, res) => {
    console.log("=============================================");
    console.log("Inicio de updateMedals");
    console.log("=============================================");

    try {
        const { userId, medals } = req.body;

        console.log("Datos recibidos:");
        console.log("userId:", userId);
        //console.log("medals:", JSON.stringify(medals, null, 2));

        if (!userId || !Array.isArray(medals)) {
            console.log("Error: Datos inválidos recibidos");
            return res.status(400).json({ error: "Invalid data", details: "userId debe ser un número y medals debe ser un array" });
        }

        console.log(`Procesando actualización de medallas para usuario ID: ${userId}`);

        // Verificar la conexión a la base de datos
        dbConnection.query('SELECT 1 as connection_test', (error, results) => {
            if (error) {
                console.error('Error al verificar la conexión:', error);
                return;
            }
            console.log('Conexión a la base de datos verificada:', results);
        });

        // Procesar cada medalla
        for (const medal of medals) {
            console.log("------------------------------------------");
            console.log(`Procesando medalla para juego: ${medal.quizName}`);

            try {
                // Verificar si el quiz existe
                console.log(`Buscando quiz con nombre: "${medal.quizName}"`);
                dbConnection.query('SELECT Id FROM Quizzes WHERE QuizName = ?', [medal.quizName], (error, results) => {
                    if (error) {
                        console.error('Error when checking quiz existence:', error);
                        return;
                    }
                    quizResult = results;
                    console.log("Resultado de la búsqueda del quiz:", quizResult);

                    if (!quizResult || quizResult.length === 0) {
                        console.warn(`Quiz no encontrado: ${medal.quizName}`);
                        // Vamos a buscar todos los quizzes para depuración
                        dbConnection.query('SELECT Id, QuizName FROM Quizzes LIMIT 10', (error, results) => {
                            if (error) {
                                console.error('Error while reading 10 quizes:', error);
                                return;
                            }
                            console.log('Found quizzes', results);
                            allQuizzes = results;
                        });
                        console.log("Primeros 10 quizzes en la base de datos:", allQuizzes);
                        return;
                    }

                    const quizId = quizResult[0].Id;
                    console.log(`Quiz encontrado con Id: ${quizId}`);

                    // Updating registers
                    const updateQuery = `
                        UPDATE UserQuizzes
                        SET GoldMedal = ?, SilverMedal = ?, BronzeMedal = ?, Done = TRUE
                        WHERE UserId = ? AND QuizId = ?`;
                    const params = [
                        medal.GoldMedal ? 1 : 0,
                        medal.SilverMedal ? 1 : 0,
                        medal.BronzeMedal ? 1 : 0,
                        userId,
                        quizId
                    ];

                    console.log("Query de actualización:", updateQuery);
                    console.log("Parámetros:", params);

                    dbConnection.query(updateQuery, params, (error, results) => {
                        if (error) {
                            console.error('Error while updating register in UserQuizzes:', error);
                            return;
                        }
                        console.log('Register updated in UserQuizzes successfully', results);
                        updateResult = results;
                        console.log("Resultado de la actualización:", updateResult);
                        console.log(`Medallas actualizadas para quiz: ${medal.quizName} (Oro: ${medal.GoldMedal}, Plata: ${medal.SilverMedal}, Bronce: ${medal.BronzeMedal})`);
                    });
                });
            } catch (medalError) {
                console.error(`Error procesando medalla ${medal.quizName}:`, medalError);
                // Continuamos con la siguiente medalla
            }
        }

        console.log("Actualización de medallas completada para usuario:", userId);
        console.log("=============================================");
        return res.status(200).json({ message: "Medals updated successfully" });
    } catch (error) {
        console.error("Error general al actualizar medallas:", error);
        console.log("=============================================");
        return res.status(500).json({ error: "Error updating medals", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})