const jwt = require('jsonwebtoken');
const CONFIG = require('../config/config');
const User = require('../models/User');
const Reference = require("../models/Reference");

async function findUser(token, res){
    let userId = 0;
    await jwt.verify(token, CONFIG.TOKEN_SECRET, async function(error, decoded){
        if(error){
            return res.status(403).send({message: 'Token incorrecto'});
        }
        const user = await User.findOne({email: decoded.email})
        if(!user){
            return res.status(401).send({message: 'No estás autorizado'});
        }
        userId = user._id;
    });
    return userId;
}
const ReferenceController = { 
    async register(req, res){
        try {
            //Buscamos el id del usuario
            let token = req.headers.authorization.split(' ')[1];
            let userId = await findUser(token, res);

            // Guardamos el id de la referencia (id del usuario + número de proveedor + número de referencia)
            let referenceData = Object(req.body);
            let supplierId =  userId + req.params.number;
            referenceData.supplier = supplierId;
            referenceData.id = userId + req.params.number + req.body.number;

            // Guardamos en la base de datos
            const reference = await Reference.create(referenceData);
            res.send({reference, message: 'Referencia guardada correctamente'});
        } catch (error) {
            console.error(error);
            res.status(500).send({message: "There was a problem trying to register the reference", error});
        }
    },
    async getAll(req, res){
        try {
            //Buscamos el id del usuario
            let token = req.headers.authorization.split(' ')[1];
            let userId = await findUser(token, res);
            // Guardamos el id del proveedor
            let supplierId = userId + req.params.number;
            // Buscamos todas las referencias
            const references = await Reference.find({supplier: supplierId});
            res.send(references);
        } catch (error) {
            console.error(error);
            res.status(500).send({message: "There was a problem trying to get all references", error});
        }
    },
}

module.exports = ReferenceController;