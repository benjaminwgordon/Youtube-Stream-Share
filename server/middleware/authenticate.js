const { render } = require("ejs")
const jwt = require("jsonwebtoken")
const db = require("../Models")

module.exports = (app) => {
    const authenticate = async (req, res, next) => {
        const token = req.cookies.token
        console.log(token)
    
        if (!token){
            return res.render('signup')
        }
    
        let payload
        try{
            payload = jwt.verify(token, "temporaryDevKey")  //REPLACE WITH PROCESS.ENV
        } catch(err){
            if (err instanceof jwt.JsonWebTokenError){
                return res.render('signup')
            }
            return res.render('signup')
        }
        const currentUser = await db.User.findOne({email: payload.email});
        app.locals.currentUserId = currentUser.id;
        return next()
    }

    return authenticate
}



