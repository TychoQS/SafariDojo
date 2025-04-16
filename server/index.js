const express = require('express');
const app = express();
const PORT = 8080;
const cors = require('cors');
const { readFile, writeFile } = require('fs');
const {join} = require("node:path");


const dbFilePath = join(__dirname, '../database/jsondata/Users.json');
const dbConnection = require('./database');
const {query} = require("express");

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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})