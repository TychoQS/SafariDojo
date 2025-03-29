import fs from 'fs/promises';
import path from 'path';

const usersFilePath = path.join(process.cwd(), '..', 'database', 'jsondata', 'Users.json');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const fileContents = await fs.readFile(usersFilePath, 'utf8');
            const users = JSON.parse(fileContents);

            const {email, profilePhoto} = req.body;

            const userIndex = users.findIndex(user => user.email === email);
            if (userIndex === -1) {
                return res.status(404).json({message: 'User not found'});
            }

            users[userIndex] = {...users[userIndex], profilePhoto};
            await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf8');

            return res.status(200).json({message: 'Profile updated successfully'});
        } catch (error) {
            console.error("Error updating profile:", error);
            return res.status(500).json({message: 'Error updating profile', error: error.message});
        }
    } else {
        res.status(405).json({message: 'Method not allowed'});
    }
}
