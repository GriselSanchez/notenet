const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    gender: String,
    password: String,
    passwordConfirmation: String
});

function validateUser(user) {
    const schema = {
        name: Joi.string()
            .min(5)
            .max(50)
            .required(),
        username: Joi.string()
            .alphanum()
            .lowercase()
            .min(5)
            .max(50)
            .required()
            .trim(),
        email: Joi.string()
            .min(5)
            .max(255)
            .email()
            .required()
            .trim(),
        password: Joi.string()
            .min(5)
            .max(255)
            .required(),
        passwordConfirmation: Joi.string()
            .min(5)
            .max(255),
        _id: Joi.required()
    };

    return Joi.validate(user, schema, {
        abortEarly: false
    });
}

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({
            _id: this._id
        },
        "secretPrivateKey", //usar config.get('jwtPrivateKey')
        {
            expiresIn: "1h"
        }
    );
}

module.exports.User = mongoose.model("User", userSchema);
module.exports.validateUser = validateUser;