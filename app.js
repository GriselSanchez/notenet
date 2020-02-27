const express = require("express");
const app = express();
const path = require("path");
const publicPath = path.join(__dirname, "src", "public");
app.use(express.static(publicPath));

require("./src/startup/routes")(app);
require("./src/startup/db")();
require("./src/startup/prod")(app);

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Listening on port " + port + "...");
});