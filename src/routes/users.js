const express = require('express');
const router = express.Router();

const multer = require("multer");
const upload = multer();
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const {
    User,
    validateUser
} = require('../models/user');


router.post("/register", upload.none(), async (req, res) => {
    let user = new User(
        _.pick(req.body, [
            "name",
            "username",
            "email",
            "gender",
            "password"
        ])
    );

    const {
        error
    } = validateUser(user.toObject());

    if (error) return res.status(400).send(error.details[0].message);

    let emailConfirmation = await User.findOne({
        email: req.body.email
    });
    if (emailConfirmation)
        return res.status(400).send("User already registered.");

    let usernameConfirmation = await User.findOne({
        username: req.body.username
    });
    if (usernameConfirmation)
        return res.status(400).send("Username already taken.");

    if (user.password !== req.body.passwordConfirmation)
        return res.send("Passwords don't match.");

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    user = await user.save();

    return res.status(200).send("Successful registration!");
});

router.post("/logging", upload.none(), async (req, res) => {
    let user = await User.findOne({
        username: req.body.username
    });

    if (!user) return res.status(400).send("Username is not registered.");

    let validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Invalid password.");

    const token = user.generateAuthToken();

    res.cookie("authToken", token);

    res.status(200).send("Successfully logged!");
});

router.get("/loggout", (req, res) => {
    res.clearCookie("authToken").send("Successful loggout");
});

module.exports = router;