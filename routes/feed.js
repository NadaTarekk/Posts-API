const express =require('express')

const router = express.Router();

const {body} =require('express-validator')

const isAuth = require('../middleware/is-auth')

const feedController = require('../controllers/feed')
router.get('/posts', isAuth, feedController.getPosts);

router.get('/post/:postId',isAuth,feedController.getPost)

router.post('/post',isAuth,[
    body('title').trim(),
    body('content').trim()
   
], feedController.putPost)


router.delete('/post/:postId',isAuth,feedController.deletePost)

router.put('/post/:postId',isAuth,[
    body('title').trim(),
    body('content').trim()
   
],feedController.updatePost)



module.exports = router 

