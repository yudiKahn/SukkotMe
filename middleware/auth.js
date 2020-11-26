const jwt = require('jsonwebtoken');
const config = require('config');

function authUser(req, res, next){
    const token = req.header('x-auth-token');
    if(!token){
        return res.status(401).json({msg: 'no token'})
    }
    try{
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    } catch(err) {
        console.error(err.message)
        res.status(401).json({msg: 'token is not valid'})
    }
}

function authAdmin(req, res, next){
    const token = req.header('x-auth-token');
    if(!token){
        return res.status(401).json({msg: 'no token'})
    }
    try{
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        let id = decoded.user.id;
        let isAdmin = config.get('ADMIN').find(obj => obj.id.toString()===id.toString())?true:false;
        if(isAdmin)
            return next();
        res.status(401).json({msg: 'token is not valid'})
    } catch(err) {
        console.error(err.message)
        res.status(401).json({msg: 'token is not valid'})
    }
}

module.exports = {authUser, authAdmin}