const router = require('express').Router()
const mongoose = require("mongoose")
const db = require('../Models')

// INDEX
router.get('/', async (req, res) => {
    try{
        const rooms = await db.find({public:true})
        return res.render('roomList', {rooms})
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
        if (room.owner == app.locals.currentUserId){
            return res.render('player', {room, isOwner: true})
        }
        else if (room.invited.contains(app.locals.currentUserId)){
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
        const room = await db.Room.create({owner: req.app.locals.currentUserId})
        console.log("room", room)
        res.redirect(`/rooms/${room._id}`)
    } catch(err){
        console.log("err", err)
        res.render("index")
    }
})

// EDIT
router.get('/:id/edit', (req, res) => {

})

// UPDATE
router.put('/:id', (req, res) => {

})
// DELETE
router.delete('/:id', (req,res) => {

})

module.exports = router