const router = require("express").Router()
const db = require('../Models')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const { body, validationResult } = require('express-validator');
const jwtKey = process.env.JWT_KEY
const jwtExpiry = 1 * 60 * 60 * 24 * 7 // one week valid token;


router.get('/login', (req,res) => {
    res.render('signup')
})


// LOGIN
router.post('/login', [
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({min:8}).escape()
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            console.log(errors)
            return res.render("signup", {message: "Error in email or password"})
        }
        try{
            console.log(req.body)
            const {email, password} = req.body
            const foundUser = await db.User.findOne({email:email})
            if (!email || !password){
                return res.render("signup", {message: "missing email or password"})
            }
            else {
                const isValidPassword = await bcrypt.compare(password, foundUser.password)
                if (!isValidPassword){
                    return res.render('signup', {message:"Email and password do not match"})
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
            res.render('login', {message: "Error logging in"})
        }
})



// REGISTER
router.post("/register", [
        body('email').isEmail(),
        body('password').isLength({min:8})
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            console.log(errors)
            return res.render("signup", {message: "Error in email or password"})
        }
    try{
        const {password, email} = req.body
        const emailTaken = await db.User.findOne({email:email})
        if (emailTaken){
            console.log("username taken")
            return res.render('signup', {message: "Email already taken"})
        }
        if (!password || !email){
            return res.render("signup", {message:"Missing email or password"});
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt, null)
        const user = {
            password: hashedPassword,
            email
        }
        await db.User.create(user)
        res.render("signup")
    }
    catch (err){
        console.log(err)
        res.render("signup")
    }
})

module.exports = router