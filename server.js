// External Imports
require('dotenv').config();
const express = require("express");
const WebSocket = require("ws");
const cookieParser = require("cookie-parser");
const helmet = require('helmet');


// Server Initialization
const app = express();
const server = require("http").createServer(app);

// Middleware
const authenticate = require("./middleware/authenticate")(app);
app.use(helmet);
app.use(cookieParser());
app.use(express.urlencoded({extended: true}))


// Configs
app.set("view engine", "ejs");
const PORT = process.env.PORT || 3000

// serve public folder
app.use(express.static('public'));

// HTTP Routes
app.use("/users", require("./Routes/Users"));
app.use("/rooms", authenticate, require("./Routes/Rooms"))
app.use("/", (req, res) => {
    res.redirect("/rooms")
})

// Mount a websocket server onto the http server
require('./websocketServer')(server)

server.listen(PORT, () => {
    console.log(`Listening on port: ${3000}`)
})