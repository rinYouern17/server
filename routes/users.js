import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const router = express.Router();

let users = [];

// Load existing users from users.json if it exists
if (fs.existsSync('data/users.json')) {
  const data = fs.readFileSync('data/users.json');
  users = JSON.parse(data);
}

// Save users to users.json
const saveUsersToFile = () => {
  const data = JSON.stringify(users, null, 2);
  fs.writeFile('data/users.json', data, (err) => {
    if (err) {
      console.error('Error writing to file', err);
    } else {
      console.log('Successfully wrote to users.json');
    }
  });
};

// All routes here start with /users
router.get('/', (req, res) => {
  res.send(users);
});

// Create new users here
router.post('/', (req, res) => {
  const user = req.body;
  users.push({ ...user, id: uuidv4() });
  saveUsersToFile();
  res.send(`User  added to the database!`);
});

// Get user by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const foundUser = users.find((user) => user.id === id);
  res.send(foundUser);
});

// Delete user by ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  users = users.filter((user) => user.id !== id);
  saveUsersToFile();
  res.send(`User with the id ${id} deleted from the database!`);
});

router.patch('/:id', (req, res) => {
    const { id } = req.params;
    const { firstName, lastName,age } = req.body;
  
    const user = users.find((user) => user.id === id);
  
    if (user) {
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if(age)user.age = age;
  
      saveUsersToFile();
      res.send(`User with the id ${id} has been updated.`);
    } else {
      res.status(404).send('User not found');
    }
  });
  
export default router;
