const User = require("../models/User");
const jwt = require('jsonwebtoken');
const CONFIG = require('../config/config');

const UserController = {
    async register(req, res){
        try {
            const user = await User.create(req.body);
            res.send({user, message: 'Usuario creado correctamente'});
        } catch (error) {
            console.error(error);
            res.status(500).send({message: "There was a problem trying to register the user", error});
        }
    },
    async login(req, res){
        try {
            console.log(req.body)
            const user = await User.findOne({email:req.body.email});
            if(!user){
                res.send({message: 'El usuario no existe en la base de datos'});
            }else {
                const isMatch = await user.isValidPassword(req.body.password);
                if(!isMatch){
                    res.send({message: 'La contraseña es incorrecta'});
                }else{
                    payload = {
                        email: user.email,
                    }
                    jwt.sign(payload, CONFIG.TOKEN_SECRET, function(error, token){
                        if(error){
                            res.status(500).send({error})
                        }res.send({message: 'Sesión iniciada correctamente', user, token});
                    }) 
                }
            }    
        } catch (error) {
            console.error(error);
            res.status(500).send({message:'There was a problem trying to login the user', error});
        }
    }
}

module.exports = UserController;