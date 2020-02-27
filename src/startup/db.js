const mongoose = require('mongoose');

module.exports = function () {
        mongoose
            .connect(process.env.MONGODB_URI), {
                useNewUrlParser: true
            })
    .then(() => console.log("Connected to database..."))
    .catch(err => console.error("Could not connect to database.", err));
}