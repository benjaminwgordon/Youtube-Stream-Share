const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const uuid = require("uuid");
const WebSocket = require("ws");
const path = require("path");
const cookieParser = require("cookie-parser");



app.set("view engine", "ejs");

// serve public folder
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.urlencoded({extended: true}))

const authenticate = require("./middleware/authenticate")(app);

const db = require('./Models')

app.use("/users", require("./Routes/Users"));
app.use("/rooms", authenticate, require("./Routes/Rooms"))
app.use("/", (req, res) => {
    res.redirect("/rooms")
})


let userId = null;

var io = require('./websocketServer')(app, server)

server.listen(3000, () => {
    console.log(`Listening on port: ${3000}`)
})