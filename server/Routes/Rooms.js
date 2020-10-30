const router = require('express').Router()
const mongoose = require("mongoose")
const db = require('../Models')
const Room = require('../Models/Room')

// INDEX
router.get('/', async (req, res) => {
    try{
        const rooms = await db.Room.find({public:true})
        return res.render('roomList', {rooms: rooms.map(room => room._id)})
    }catch(err){
        console.log(err)
        return res.render('roomList', {rooms:[]})
    }
})

// SHOW
router.get('/:id', async (req, res) => {
    //check that user is allowed in this room
    try{
        const room = await db.Room.findById(req.params.id)
        const user = await db.User.findById(req.app.locals.currentUserId)
        if (room.owner == req.app.locals.currentUserId){
            user.room = room._id
            await user.save()
            return res.render('player', {room, isOwner: true})
        }
        else if (room.public || room.invited.includes(user._id)){
            user.room = room._id
            await user.save()
            room.viewers.push(user)
            await room.save()
            return res.render('player', {room, isOwner: false})
        }
        else{
            return res.redirect('rooms/')
        }
    }
    catch(err){
        console.log(err)
        res.redirect('/rooms')
    }
    
})

// Create
router.post('/', async (req, res) => {
    try{
        const room = await db.Room.create({
            owner: req.app.locals.currentUserId,
        })
        res.redirect(`/rooms/${room._id}`)
    } catch(err){
        console.log(err)
        res.redirect("/rooms")
    }
})

router.post('/:id/leave', async (req, res) => {
    try{
        const room = await db.Room.findById(req.params.id)  
        // remove current user from rooms viewer list
        room.viewers = room.viewers.filter((viewer) =>{
            return viewer._id !== req.app.locals.currentUserId
        })
        return res.redirect('/rooms')

    }
    catch(err){
        console.log(err)
        redirect("/rooms")
    }
})


module.exports = router