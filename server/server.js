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

var io = require('socket.io')(server);
io.use(function(socket, next){
    if (socket.handshake.query && socket.handshake.query.token){
        jwt.verify(socket.handshake.query.token, 'temporaryDevKey', (err, decoded) => {
            if (err) {return (new Error('Authentication Error'))}
            socket.decoded = decoded
            console.log(socket.decoded.email)
            db.User.findOne({email: socket.decoded.email}, (err, foundUser) => {
                if (err) {console.log(err)}
                userId = foundUser._id
                next()
            })
        })
    }
    else{
        next(new Error('Authentication Error'))
    }
}).on('connection', (socket) => {
    let isRoomOwner = false
    console.log("userid: " , userId)
    db.User.findById(userId, (err, foundUser) => {
        if (err) {
            console.log(err)
        }
        const room = db.Room.findById(foundUser.room, (err, room) => {
            if (err) {
                console.log(err)
                return next(err)
            }
            isRoomOwner = (room.owner == userId)
            console.log(typeof room._id)
            socket.join(room._id.toString())
            console.log(`User: ${userId} connected to Room: ${room._id}`)
        });

    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    socket.on('chat message', (msg)=>{
        console.log(msg)
        socket.broadcast.emit('chat message', msg)
    })
    socket.on('pause', (msg) => {
        console.log("pause")
        if (isRoomOwner){
            socket.emit('pause', 'true')
        }
    })
    socket.on('resume', (msg) => {
        console.log("resume")
        if (isRoomOwner){
            socket.broadcast.emit('resume', 'true')
        }
    })
    socket.on('url change', (msg) =>{
        console.log('changing url: ' + msg)
        if (isRoomOwner){
            socket.emit('url change', msg)
        }
    })
})

server.listen(3000, () => {
    console.log(`Listening on port: ${3000}`)
})