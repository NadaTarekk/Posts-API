const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const header = req.get('Authorization')
    if (!header) {
        const error = new Error('authorization failed')
        error.statusCode = 500;
        throw error
    }
    const token = header.split(' ')[1]
    
    let decodedToken 

    try {
         decodedToken = jwt.verify(token, 'superSecretKey')
    }
    catch (err) {
        err.statusCode = 500;
        throw err

    }
    if (!decodedToken) {
        const error = new Error('authorization failed')
        error.statusCode = 500;
        throw error
    }
    req.userId = decodedToken.userId
    next()
}