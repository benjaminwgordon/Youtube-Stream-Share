const router = require('express').Router()
const mongoose = require("mongoose")
const db = require('../Models')

// INDEX
router.get('/', (req, res) => {

})

// SHOW
router.get('/:id', (req, res) => {
    
})

// Create
router.post('/', async (req, res) => {
    try{
        const room = await db.Room.create({owner: req.app.locals.currentUserId})
        console.log("room", room)
        res.render("index")
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