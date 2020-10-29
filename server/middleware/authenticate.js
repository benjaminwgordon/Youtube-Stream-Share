const { render } = require("ejs")
const jwt = require("jsonwebtoken")
const db = require("../Models")

module.exports = (app) => {
    const authenticate = async (req, res, next) => {
        const token = req.cookies.token    
        if (!token){
            return res.redirect('/users/signup')
        }
    
        let payload
        try{
            payload = jwt.verify(token, "temporaryDevKey")  //REPLACE WITH PROCESS.ENV
        } catch(err){
            if (err instanceof jwt.JsonWebTokenError){
                return res.redirect('/users/signup')
            }
            return res.redirect('/users/signup')
        }
        const currentUser = await db.User.findOne({email: payload.email});
        app.locals.currentUserId = currentUser.id;
        app.locals.currentUserEmail = currentUser.email;
        return next()
    }

    return authenticate
}



