const {validationResult} =require('express-validator')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');


exports.signup = (req,res,next)=>{
    const errors = validationResult(req)
    console.log(errors)
    if(!errors.isEmpty()){
        console.log('iam here')
        const error = new Error('Invalid email or password')
        error.status=500;
        throw error;
    }
    console.log('noo iam here')
    const email = req.body.email
    const password = req.body.password
    const name = req.body.name
   bcrypt.hash(password,12).then(pass=>{
        const user = new User({
            email:email,
            password:pass,
            name:name
        })
        return user.save()

    })
   
    .then(result=>{
        res.status(200).json({message:'user signedup succesfuly', user:result})
    })
    .catch(err=>{
        next(err)
    })

}


exports.login = (req,res,next)=>{
    const email = req.body.email
    const password = req.body.password
    let foundUser;
     User.findOne({email: email})
     .then((user)=>{
        if(!user){
            const error = new Error('no such email exists')
            error.status= 500;
            throw error
        }
        foundUser=user;
        return bcrypt.compare(password, user.password)
        

     })
     .then(result=>{
        if(!result){
            const error = new Error('wrong password')
            error.status= 500;
            throw error  
         }
         const token =jwt.sign(
            {
                email: email,
                userId: foundUser._id
            },
            'superSecretKey'
         )
         res.status(200).json({message:"Succseful signin",token:token})

    })
     .catch(err=>{
        next(err)
     })
    
}