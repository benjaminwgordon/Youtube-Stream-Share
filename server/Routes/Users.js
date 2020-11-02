const router = require("express").Router()
const db = require('../Models')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const jwtKey = process.env.JWT_KEY
const jwtExpiry = 1 * 60 * 60 * 24 * 7 // one week valid token;


router.get('/login', (req,res) => {
    res.render('signup')
})


// LOGIN
router.post('/login', async (req, res) => {
    try{
        const {email, password} = req.body
        const foundUser = await db.User.findOne({email:email})
        if (!email || !password){
            return res.redirect("/login")
        }
        else {
            const isValidPassword = await bcrypt.compare(password, foundUser.password)
            if (!isValidPassword){
                return res.sendStatus(401)
            }
            const token = jwt.sign({ email }, jwtKey, {
                algorithm: "HS256",
                expiresIn: jwtExpiry,
            })
            res.cookie("token", token, {maxAge: jwtExpiry * 1000})

            res.redirect("/rooms")
        }
    }
    catch(err){
        console.log(err)
        res.json({message: "Error logging in"})
    }
})



// REGISTER
router.post("/register", async (req, res) => {
    try{
        const {username, password, email} = req.body
        if (!password || !email){
            res.sendStatus(400);
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt, null)
        const user = {
            password: hashedPassword,
            email
        }
        const newUser = await db.User.create(user)
        res.render("signup")
    }
    catch (err){
        console.log(err)
        res.render("signup")
    }
})

module.exports = router