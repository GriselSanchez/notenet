const jwt = require("jsonwebtoken");
const cookie = require("cookie");

module.exports = function(req, res, next) {
  //parseo las cookies con la librería cookie
  let cookies = cookie.parse(req.headers.cookie || "");
  let token = cookies.authToken;
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, "secretPrivateKey");
    req.user = decoded; //puedo asignarle un objeto a mi request en un middleware y que queda permanente ahí
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};
