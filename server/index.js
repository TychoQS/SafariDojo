const express = require('express');
const app = express();
const PORT = 8080;
const cors = require('cors');
const { readFile, writeFile } = require('fs');
const {join} = require("node:path");


const dbFilePath = join(__dirname, '../database/jsondata/Users.json');
const connection = require('./database');

app.use(cors());
app.use(express.json());

app.get("/api/home", (req, res) => {
    res.json({message: "Hello World!"});
})

app.post("/api/signup", (req, res) => {
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
    const { name, email, password, profilePhoto } = req.body;
    console.log(email + name + profilePhoto);
    const query = 'INSERT INTO users (name, email, password, profilePhoto) VALUES (?, ?, ?, ?)';
    connection.query(query, [name, email, password, profilePhoto], (err, result) => {
        if (err) {
            console.error('Error al registrar el usuario:', err);
            return res.status(500).json({ message: 'Error al registrar el usuario' });
        }
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            name: name,
            email: email,
            profilePhoto: profilePhoto
        });
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})