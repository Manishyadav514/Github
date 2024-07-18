const userModel = require('../models/user')
const jwt = require('jsonwebtoken');
const jwtKey = "3sd13sd1asdas31sad"


const requireSignIn = (req, res, next)=>{
    try {
        const decode = jwt.verify(req.headers.authorization, jwtKey)
        req.user = decode
        if (!decode) {
            return res.status(401).send({
                success: false,
                message: "Invalid token",
            })
        }else{
         next()
        }
    } catch (error) {
        console.log(error);
    }
}

const isAdmin = async(req, res, next)=>{
    try {
        const user = await userModel.findById(req.user._id)
        if (user.role !== 1) {
            return res.status(401).send({
                success: false,
                message: "UnAuthorized Access",
            })
        }
        
        next()
    } catch (error) {
        res.status(401).send({
            success: false,
            error
        })
        console.log(error);
    }
}

module.exports = {requireSignIn, isAdmin}