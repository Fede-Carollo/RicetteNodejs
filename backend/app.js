const express = require('express');
const bodyParser = require("body-parser");
const path = require("path");
const AuthRoute = require("./routes/auth");
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname,"../static")));

//app.use("/api/auth", AuthRoute);
module.exports = app;