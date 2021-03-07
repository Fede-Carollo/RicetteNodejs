const express = require('express');
const bodyParser = require("body-parser");
const path = require("path");
const AuthRoute = require("./routes/auth");
const RicetteRoute = require("./routes/ricette");
const app = express();
const mongoose = require('mongoose');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    mongoose.connect("mongodb://localhost:27017/ricette", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true, useCreateIndex: true})
    .then(() => next())
    .catch((err) => res.status(500).json({message: "Impossibile connettersi al DB"}));
})

app.use(express.static(path.join(__dirname,"../static")));

app.use("/api/auth", AuthRoute);
app.use("/api/ricette", RicetteRoute)

app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname,"../static/404notFound.html"))
})
module.exports = app;