// import validator for validating data
const validator = require("validator");
const bcrypt = require("bcrypt");
const UserModel = require('../models/user.model')

/**
 * Validate the user data and reject if the user data is empty or invalid and accept otherwise
 * @param {String} email - the email to be verified 
 * @param {String} password - the password to be verified
 * @param {String} name - the name to be verified
 * @param {String} phone - the phone to be verified
 * @param {String} username - the username to be verified
 * @returns {Promise} - the promise of data verification
 */
const cleanupAndValidate = ({email,password, username, phone, name}) => {
    return new Promise((resolve, reject) => {
        if (!password || !username) {
            reject(new Error('Insufficient Data'))
        }
        if(email && !validator.isEmail(email)){
            reject(new Error('Invalid Email'))
        }
        if(!validator.isLength(password, {min:6, max:20})){
            reject(new Error('Invalid Password'))
        }
        if(!validator.isLength(username, {min:6, max:20})){
            reject(new Error('Invalid Username'))
        }
        if(phone && !validator.isMobilePhone(phone)){
            reject(new Error('Invalid Phone Number'))
        }
        if(name && !validator.isLength(name, {min:4, max:30})){
            reject(new Error('Invalid Name'))
        }
        resolve({email,password, username, phone, name})    
    })
    
};

/**
 * Signup the user and return the response to the client
 * @param { Object } userData - the user data to be added
 * @returns {Object} - the user object
 */
const signUp = async (userData) => {
    const existingUser = await UserModel.findOne({username:userData.username})
    if(existingUser){
        throw new Error('User already exists')
    }
    const hashPassword = await bcrypt.hash(userData.password, 10);

    const user = new UserModel({
        ...userData,
        password: hashPassword
    })
    const newUser = await user.save()
    return newUser
};

/**
 * 
 * @param {String} username - the username to be used for login
 * @param {String} password - the password to be used for login 
 * @returns {Object} - the user object
 */
const login = async ({username,password}) => {
    const user = await UserModel.findOne({username})
    if(!user){
        throw new Error('User does not exist')
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if(!isValidPassword){
        throw new Error('Invalid Password')
    }
    return user._id
};

/**
 * Middleware to check if the user is logged in
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - the next function
 * @returns 
 */
const isAuthenticated = (req, res, next) => {
    if(req?.session?.isAuthenticated){
        return next()
    }
    return res.status(401).json({message:'Error: Unauthorized Access'})
};

module.exports = { cleanupAndValidate, login, signUp , isAuthenticated };