import fs from 'fs/promises';
import path from 'path';

const usersFilePath = path.join(process.cwd(), '..', 'database', 'jsondata', 'Users.json');  // Ruta correcta al archivo JSON

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Lee el archivo JSON
            const fileContents = await fs.readFile(usersFilePath, 'utf8');
            const users = JSON.parse(fileContents);

            const { email, name } = req.body;

            if (!email || !name) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            // Encuentra el índice del usuario usando el email
            const userIndex = users.findIndex(user => user.email === email);
            if (userIndex === -1) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Actualiza el nombre del usuario
            users[userIndex] = { ...users[userIndex], name };

            // Guarda el archivo actualizado
            await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf8');

            return res.status(200).json({ message: 'Profile updated successfully' });
        } catch (error) {
            console.error("Error updating profile:", error);  // Esto imprimirá el error en la consola del servidor
            return res.status(500).json({ message: 'Error updating profile', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
