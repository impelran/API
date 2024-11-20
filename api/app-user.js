const express = require('express');
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
});
const User = mongoose.model('User', userSchema);
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/users', async (req, res) => {
    try {
        const {username, password, name} = req.body;

        const existingUser = await User.findOne({username});
        if (existingUser) {
            return res.status(400).send('Username already exists');
        }

        const newUser = new User({username, password, name});
        await newUser.save();

        return res.status(200).json(newUser);
    } catch (err) {
        return res.status(500).send('Error creating user');
    }
});

app.put('/users/:username', async (req, res) => {
    try {
        const {name} = req.body;

        const user = await User.findOneAndUpdate(
            {username: req.params.username},
            {name},
            {new: true}
        );

        if (user) {
            return res.status(206).json(user);
        } else {
            return res.status(404).send('User not found');
        }
    } catch (err) {
        return res.status(500).send('Error updating user');
    }
});

module.exports = app;