const userModel = require('../models/user')
const authHelper = require('../helper/authHelper')
const jwt = require('jsonwebtoken');
const jwtKey = "3sd13sd1asdas31sad"

const registerConroller = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body

        if (!name || !email || !password || !phone || !address) {
            return res.send({ error: "All details are reuired" })
        }

        const existingUser = await userModel.findOne({email})

        if (existingUser) {
            return res.status(200).send({
                success: true,
                message: "Already resgistered please login",
            })
        }
       
        const hashedPassword = await authHelper.hashPassword(password)
        let user
        if (req.body.role) {
            let role = req.body.role
            user = await new userModel({
                name, email, password: hashedPassword, phone, address, role }).save()
        }else{
            user = await new userModel({
                name, email, password: hashedPassword, phone, address }).save()

        }


        res.status(201).send({
            success: true,
            message: "User resgistered successfully",
            user,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in resgistration",
            error
        })
    }

}

const loginConroller = async (req, res) => {
    try {
        const {email, password} = req.body

        if (!email || !password) {
           return  res.status(404).send({
                success: false,
                message: "Wrong email or password"
            })
        }
        const user = await userModel.findOne({email})

        if (!user) {
            return res.status(200).send({
                success: false,
                message: "Email is not resgistered",
            })
        }
        const match = await authHelper.comparePassword(password, user.password)

        if (!match) {
            return res.status(200).send({
                success: true,
                message: "Invalid password",
            })
        }

        const token = await jwt.sign({_id:user._id}, jwtKey, {expiresIn: '7d'})
        res.status(200).send({
            success: true,
            message: "login successfull",
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login",
            error
        })
        
    }
}

const testConroller = (req, res)=>{
    res.send('test route');
}
module.exports = {registerConroller, loginConroller, testConroller}