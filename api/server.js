// BUILD YOUR SERVER HERE
const express = require('express');
const server = express();
const User = require('./users/model');

server.use(express.json());

server.get('/api/users', (req, res) => {
    User.find()
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
})

server.get('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if(!user) {
                res.status(404).json({
                    message: "The user with the specified ID does not exist"
                })
            }
            res.json(user)
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
})

server.post('/api/users', (req, res) => {
    const user = req.body;
    if(!user.name || !user.bio) {
        res.status(400).json({
            message: "Please provide name and bio for the user"
        })
    } else {
      User.insert(user)
        .then(createdUser => {
            // console.log(stuff)
            res.status(201).json(createdUser)
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
    }
})

server.delete('/api/users/:id', async (req, res) => {
    const possibleUser = await User.findById(req.params.id);
    // console.log(possibleUser);
    if(!possibleUser) {
        res.status(404).json({ message: "The user with the specified ID does not exist" })
    } else {
        const deletedUser = await User.remove(possibleUser.id);
        // console.log(deletedUser);
        res.status(200).json(deletedUser)
    }
})

server.use('*', (req, res) => {
    res.status(404).json({ message: 'not found' })
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
