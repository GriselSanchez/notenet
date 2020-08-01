const jwt = require("jsonwebtoken");
const cookie = require("cookie");

module.exports = function (req, res, next) {
  let cookies = cookie.parse(req.headers.cookie || "");
  let token = cookies.authToken;
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY || "secretPrivateKey");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send("Invalid token.");
  }
};