const express = require('express')

const mongoose =require ('mongoose')


const feedRoutes = require('./routes/feed')

const authRoutes = require('./routes/auth')



const app = express();



app.use(express.json())

//app.use(multer())

//app.use('/images',)


app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})


app.use('/feed', feedRoutes)
app.use('/auth', authRoutes)

app.use((err,req,res,next)=>{
    if(!err.status){
        err.status=500
    }
    const status = err.status;
    const message = err.message;
    res.status(status).json({message:message});
})





mongoose.connect(" ")
.then((result)=>{
    console.log('CONNECTED!')
    app.listen(3000)
})
.catch(err=>{ 
    console.log(err)
})

