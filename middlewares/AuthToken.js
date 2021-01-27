const jwt = require('jsonwebtoken');
const CONFIG = require('../config/config');
const User = require('../models/User');

module.exports = async function(req, res, next){
    console.log(req.path)
    if(req.path != '/users/login' && req.path != '/users/register'){
        if(req.headers.authorization){
            let token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, CONFIG.TOKEN_SECRET, async function(error, decoded){
                if(error){
                    return res.status(403).send({message: 'Token incorrecto'});
                }
                const user = await User.findOne({email: decoded.email})
                if(!user){
                    return res.status(401).send({message: 'No estás autorizado'});
                }
                next();
            })
        }else{
            res.status(403).send({message: 'Se necesita un token para acceder al contenido'});
        }
    }else{
        next();
    }
}