const jwt = require('jsonwebtoken');
const { connection } = require('mongoose');
const db = require('./Models')

const websocketServer = (httpServer) => {
    let userId = null;
    var io = require('socket.io')(httpServer);
    io.use(function(socket, next){
        if (socket.handshake.query && socket.handshake.query.token){
            jwt.verify(socket.handshake.query.token, process.env.JWT_KEY, (err, decoded) => {
                if (err) {return (new Error('Authentication Error'))}
                socket.decoded = decoded
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
        let room = null
        db.User.findById(userId, (err, foundUser) => {
            if (err) {
                console.log(err)
            }
            db.Room.findById(foundUser.room, (err, foundRoom) => {
                if (err) {
                    console.log(err)
                    return next(err)
                }
                if (foundRoom){
                    isRoomOwner = (foundRoom.owner._id.toString() == foundUser._id.toString())
                    room = foundRoom._id.toString()
                    socket.join(room)
                    console.log(`Room ${room}: Connected User: ${foundUser.email}`)
                }
                else{
                    socket.emit('room connect error')
                }
            });

        })
        socket.on('disconnect', async () => {
            console.log(`Room: ${room}: user disconnected`);
            if (isRoomOwner){
                //shut the room down
                try{
                    const user = await db.User.findById(userId)
                    console.log("user", user)
                    const room = await db.Room.findById(user.room)  
                    console.log("room", room)
                    room.viewers.forEach(viewer => {viewer.room = null})
                    await db.Room.findByIdAndDelete(room._id)
                    socket.broadcast.emit('room closed'); 
                }
                catch(err){
                    console.log(err)
                    socket.emit('room connect error')
                }

                console.log(`Room ${room}: Shutting Down`)
                socket.broadcast.to(room).emit('room shutdown')
            }
            else{
                const foundUser = await db.User.findById(userId)
            }
        });
        socket.on('sync', async (time) =>{
            // LOGGING
            const user = await db.User.findById(userId)
            console.log("user: ", user)
            const room = await db.Room.findById(user.room)
            console.log("room: ", room)
            //END LOGGING 
            if (isRoomOwner){
                socket.broadcast.emit('sync', time)
            }
        })
        socket.on('chat message', (msg)=>{
            console.log("room", room)
            console.log(io.sockets.clients(room).map(client => {
                return client
            }))   

            console.log(`Room ${room}: ${msg}`)
            db.User.findById(userId, (err, foundUser) => {
                socket.broadcast.to(room).emit('chat message', `${foundUser.email}: ${msg}`)
            })
        })
        socket.on('pause', (msg) => {
            if (isRoomOwner){
                console.log(`Room ${room}: Pause Command Emitted`)
                socket.to(room).emit('pause', 'true')
            }
        })
        socket.on('resume', (msg) => {
            if (isRoomOwner){
                console.log(`Room ${room}: Resume Command Emitted`)
                socket.broadcast.to(room).emit('resume', 'true')
            }
        })
        socket.on('url change', (msg) =>{
            if (isRoomOwner){
                console.log(`Room ${room}: URL Change Command Emitted`)
                io.in(room).emit('url change', msg)
            }
        })
    })
}

module.exports = websocketServer