const bcrypt = require('bcryptjs');

module.exports = async (password) => {
    const salt = await bcrypt.genSalt();
    const encrypted = await bcrypt.hash(password, salt);
    return encrypted;
}