// BUILD YOUR SERVER HERE
const express = require('express');
const server = express();
const User = require('./users/model');

server.use(express.json());

server.get('/api/users', (req, res) => {
    User.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.status(500).json({ message: "The users information could not be retrieved" });
        })
})

server.get('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if(!user) {
                res.status(404).json({ message: "The user with the specified ID does not exist" });
            }
            res.json(user);
        })
        .catch(err => {
            res.status(500).json({ message: "The user information could not be retrieved" });
        })
})

server.post('/api/users', (req, res) => {
    const user = req.body;
    if(!user.name || !user.bio) {
        res.status(400).json({ message: "Please provide name and bio for the user" });
    } else {
      User.insert(user)
        .then(createdUser => {
            // console.log(stuff)
            res.status(201).json(createdUser);
        })
        .catch(err => {
            res.status(500).json({ message: "There was an error while saving the user to the database" });
        })
    }
})

server.delete('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if(user == null) {
                res.status(404).json({ message: "The user with the specified ID does not exist" });
            } else {
                User.remove(req.params.id);
                res.status(200).json(user);
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The user could not be removed" });
        })
})

server.put('/api/users/:id', (req, res) => {
    const user = req.body;

    if(!req.body.name || !req.body.bio) {
        res.status(400).json({ message: "Please provide name and bio for the user" });
    } else {
        User.update(req.params.id, user)
            .then(user => {
                if(user == null) {
                    res.status(404).json({ message: "The user with the specified ID does not exist" });
                } else {
                    res.status(200).json(user);
                }
            })
            .catch(err => {
                res.status(500).json({ message: "The user information could not be modified" });
            })
    }
})

// this has to be last in order to work
server.use('*', (req, res) => {
    res.status(404).json({ message: 'not found' });
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
