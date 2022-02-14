//** import npm modules
const router = require('express').Router()
// import bcrypt for hashing passwords
const bcrypt = require("bcrypt");


//** import local modules
const { cleanupAndValidate, login, signUp } = require('../utils/auth')


router.post('/login' , async (req , res)=>{
    try {
        const {username,password} = await cleanupAndValidate(req.body)
        const uid = await login({username,password})
        req.session.isAuthenticated = true
        // save user id in session cookie
        req.session.uid = uid
        res.status(200).json({status:200, message:"User login successful", data:user})
    } catch (error) {
        return res.status(400).json({status:400, message: `Login Failed: ${error.message}`,})
    }
})


//logout by destroying session
router.post('/logout' , async (req , res)=>{
    res?.session?.destroy((err)=>{
        if(err){
            return res.status(500).json({status:500, message: `Logout Failed: ${error.message}`,})
        }
        return res.status(200).json({status:200, message:'logout successfully'})
    })
})

router.put('/signup' , async(req , res)=>{
    try {
        const userDetails = await cleanupAndValidate(req.body)
        const user = await signUp(userDetails)
        res.status(200).json({status:200, message:"Signup Successful", data:user})
    } catch (error) {
        return res.status(400).json({status:400, message: `Signup Failed: ${error.message}`})
    }
})

module.exports  = router