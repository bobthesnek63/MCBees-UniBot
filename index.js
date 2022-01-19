const express = require("express");
const http = require("http");
require("./discordStuff");
require("./mongoDB/index");
const app = express();

var PORT = process.env.PORT || 5050;
const server = http.Server(app).listen(PORT);

app.get("/", (req, res) => {
  res.sendStatus(200);
});
