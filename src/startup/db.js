const mongoose = require('mongoose');

module.exports = () => {
    mongoose
        .connect(process.env.MONGODB_URI || "mongodb://localhost/journal", {
            useNewUrlParser: true
        })
        .then(() => console.log("Connected to database..."))
        .catch(err => console.error("Could not connect to database.", err));
}