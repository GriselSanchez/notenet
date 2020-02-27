const bodyParser = require("body-parser");
const journals = require("../routes/journals");
const users = require('../routes/users');

module.exports = function (app) {
    app.use(bodyParser.json({
        extended: true,
        limit: '50mb'
    }));
    app.use(bodyParser.urlencoded({
        extended: true,
        limit: '50mb'
    }));
    app.use('/', journals);
    app.use('/user', users);
}