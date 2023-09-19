const Post = require('../models/post')
const { validationResult } = require('express-validator')
const User = require('../models/user')
const mongoose =require('mongoose')


exports.getPosts = (req, res, next) => {

    const page = req.query.page || 1
    const perPage = 2
    let totalItems
    Post.find().countDocuments()
        .then(count => {
            totalItems = count
            return Post.find().skip((page - 1) * perPage).limit(perPage)

        })
        .then(posts => {
            res.status(200).json({
                posts: posts,
                message: "fetch succsseful",
                totalItems: totalItems
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })


}

exports.getPost = (req, res, next) => {
    const postId = req.params.postId
    Post.findById(postId)
        .then(post => {
            res.status(200).json({
                message: 'fetch succsseful',
                post: post

            })

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);

        }
        )

}

exports.putPost = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error = new Error('validation failed')
        error.statusCode = 500
        throw error
    }
    const title = req.body.title
    const content = req.body.content
    const post = new Post({
        title: title,
        content: content,
        creator: req.userId
    })

    post.save()
        .then(result => {
            console.log(result._id.toString())
            
            return User.findById(req.userId)
        })
        .then(user => {
            user.posts.push(post)
            return user.save()
        })
        .then(result => {
            res.status(201).json({
                message: 'Post created successfully!',
                post: post
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);

        })



}



exports.deletePost = (req, res, next) => {
    const postId = req.params.postId
    

    Post.findById(postId)
        .then(post => {
            if (post.creator.toString() !== req.userId) {
                const error = new Error('not authorized ')
                
                error.statusCode = 500
                throw error

            }
            
            return Post.findByIdAndDelete(postId)
        }).
        then(result => {
            return User.findById(req.userId)

        })
        .then(user => {
            user.posts.pull(postId)
            return user.save()

        })
        .then(result => {
            res.status(200).json({ message: "post deleted succssefly" })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        })


}



exports.updatePost = (req, res, next) => {
    const postId = req.params.postId
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error = new Error('validation failed')
        error.statusCode = 500
        throw error
    }

    const title = req.body.title
    const content = req.body.content


    Post.findById(postId)
        .then(post => {
            if (post.creator.toString() !== req.userId.toString()) {
                const error = new Error('not authorized ')
                error.statusCode = 500
                throw error

            }

            post.title = title
            post.content = content


            return post.save()
        })
        .then(result => {
            res.status(200).json({ message: "post updated succssefuly " })

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)

        })




}