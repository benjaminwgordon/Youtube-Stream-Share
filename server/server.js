const jwt = require("jsonwebtoken");
const express = require("express");
const http = require("http");
const uuid = require("uuid");
const WebSocket = require("ws");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();
app.set("view engine", "ejs");

const map = new Map();

// serve public folder
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.urlencoded({extended: true}))

const authenticate = require("./middleware/authenticate")(app);

app.use("/users", require("./Routes/Users"));
app.use("/rooms", authenticate, require("./Routes/Rooms"))

app.use("/", authenticate, (req, res) => {
    res.render("index")
})

const server = http.createServer(app)
// const wss = new WebSocket.Server({clientTracking: false, noServer: true})

// server.on('upgrade', function(req, socket, head){
//     console.log("")
// })

server.listen(3000, () => {
    console.log(`Listening on port: ${3000}`)
})