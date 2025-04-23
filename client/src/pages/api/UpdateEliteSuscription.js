import fs from 'fs/promises';
import path from 'path';

const usersFilePath = path.join(process.cwd(), '..', 'database', 'jsondata', 'Users.json');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { email, isPremium } = req.body;

    try {
        const fileData = await fs.readFile(usersFilePath, 'utf8');
        const users = JSON.parse(fileData);

        const userIndex = users.findIndex(user => user.email === email);
        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        users[userIndex].isPremium = isPremium;

        await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf8');

        res.status(200).json({ message: 'User updated successfully', user: users[userIndex] });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ message: 'Error updating user', error: err.message });
    }
}
