const bcrypt = require('bcryptjs');

module.exports = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const encrypted = await bcrypt.hash(password, salt);
    return encrypted;
}