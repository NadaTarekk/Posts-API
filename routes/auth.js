
const express =require('express')
const {body} =require('express-validator')
const User = require('../models/user')
const authController = require('../controllers/auth')
const router = express.Router();


router.put('/signup',[
    body('email')
    .isEmail()
    .custom((value,{req})=>{
       return User.findOne({email:value}).then(user=>{
            if(user){
                return Promise.reject('email already exist')
            }
        })}),
        body('password').trim().isLength({min:6}),
        body('name').trim()],authController.signup)

router.post('/login',authController.login)

module.exports=router