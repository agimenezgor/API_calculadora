const jwt = require('jsonwebtoken');
const CONFIG = require('../config/config');
const User = require('../models/User');
const Supplier = require("../models/Supplier");

async function findUser(token){
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
const SupplierController = {
    async register(req, res){
        try {
            // comprobar que el id del usuario existe
            let token = req.rawHeaders[1].split(' ')[1];
            let userId = await findUser(token);

            // Guardamos el id del usuario
            let supplierdata = Object(req.body);
            /* supplierdata.user = userId; */
            supplierdata.user = userId; 

            // Guardar en la base de datos
            const supplier = await Supplier.create(supplierdata);
            res.send({supplier, message: 'Supplier succesfully created'});
        } catch (error) {
            console.error(error);
            res.status(500).send({message: "There was a problem trying to register the Supplier", error});
        }
    },
    async getSupplier(req, res){
        try {
            // guardamos token y guardamos el id del usuario
            let token = req.rawHeaders[1].split(' ')[1];
            let userId = await findUser(token);
           
            // buscamos el proveedor en la base de datos
            const supplier = await Supplier.findOne({number: req.params.number});
            
            // comprobamos que el usuario es el creador del proveedor y devolvemos
            if( toString(supplier.user) == toString(userId)){
                res.send(supplier);
            }
            else{
                res.status(500).send({message: "No tienes permiso para ver el proveedor"})
            }
            
        } catch (error) {
            console.error(error);
            res.status(500).send({message: "There was a problem trying to get the supplier", error});
        }
    }
}

module.exports = SupplierController;