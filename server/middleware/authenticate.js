const { render } = require("ejs")
const jwt = require("jsonwebtoken")
const db = require("../Models")

module.exports = (app) => {
    const authenticate = async (req, res, next) => {
        const token = req.cookies.token    
        if (!token){
            return res.redirect('/users/login')
        }
    
        let payload
        try{
            payload = jwt.verify(token, process.env.JWT_KEY)  //REPLACE WITH PROCESS.ENV
            const currentUser = await db.User.findOne({email: payload.email});
            app.locals.currentUserId = currentUser.id;
            app.locals.currentUserEmail = currentUser.email;
        } catch(err){
            if (err instanceof jwt.JsonWebTokenError){
                return res.redirect('/users/login')
            }
            return res.redirect('/users/login')
        }

        return next()
    }

    return authenticate
}



