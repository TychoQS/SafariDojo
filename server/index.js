const express = require('express');
const app = express();
const PORT = 8080;
const cors = require('cors');
const { readFile, writeFile } = require('fs');
const {join} = require("node:path");


const dbConnection = require('./database');
const {query, response} = require("express");

app.use(cors());
app.use(express.json());

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
    const gameQuery = 'SELECT DISTINCT QuizName\n' +
        'FROM SubjectQuizzes sq\n' +
        'LEFT JOIN Quizzes q ON q.Id = sq.QuizId\n' +
        'LEFT JOIN Subjects s on s.Id = SubjectId\n' +
        'WHERE s.Name = ?\n' +
        'ORDER BY QuizName;'
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
        column = 'BestScoreDifficult';
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
    const { UserId, QuizId, Difficulty, Score } = req.body;

    let column = '';
    if (Difficulty === 'easy') {
        column = 'BestScoreEasy';
    } else if (Difficulty === 'medium') {
        column = 'BestScoreMedium';
    } else if (Difficulty === 'difficult') {
        column = 'BestScoreDifficult';
    } else {
        return res.status(400).json({ message: "Invalid difficulty" });
    }

    const selectQuery = `SELECT ${column} FROM UserQuizzes WHERE UserId = ? AND QuizId = ?`;

    dbConnection.query(selectQuery, [UserId, QuizId], (err, result) => {
        if (err) {
            console.error("Error fetching current best score:", err);
            return res.status(500).json({ message: "Something went wrong while fetching best score" });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Quiz not found for the user" });
        }

        const currentBestScore = result[0][column];

        if (Score > currentBestScore) {
            const updateQuery = `UPDATE UserQuizzes SET ${column} = ? WHERE UserId = ? AND QuizId = ?`;

            dbConnection.query(updateQuery, [Score, UserId, QuizId], (updateErr, updateResult) => {
                if (updateErr) {
                    console.error("Error updating best score:", updateErr);
                    return res.status(500).json({ message: "Error updating best score" });
                }

                return res.status(200).json({ message: "Best score updated successfully" });
            });
        } else {
            return res.status(200).json({ message: "New score is not higher than the current best score" });
        }
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})