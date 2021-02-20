const jwt = require('jsonwebtoken');
const CONFIG = require('../config/config');
const User = require('../models/User');
const Supplier = require("../models/Supplier");

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
const SupplierController = {
    async register(req, res){
        try {
            // comprobar que el id del usuario existe
            let token = req.headers.authorization.split(' ')[1];
            let userId = await findUser(token, res);
            // Guardamos el id del usuario
            let supplierdata = Object(req.body);
            /* supplierdata.user = userId; */
            supplierdata.user = userId; 
            let supplierId =  userId + req.body.number; 
            supplierdata.id = supplierId;

            // Guardar en la base de datos
            const supplier = await Supplier.create(supplierdata);
            res.send({supplier, message: 'Proveedor guardado correctamente'});
        } catch (error) {
            console.error(error);
            res.status(500).send({message: "There was a problem trying to register the Supplier", error});
        }
    },
    async getSupplier(req, res){
        try {
            // guardamos token y guardamos el id del usuario
            let token = req.headers.authorization.split(' ')[1];
            let userId = await findUser(token, res);
           
            // buscamos el proveedor en la base de datos
            let supplierNumber = req.params.number.split(':')[1];
            const supplierId = userId + supplierNumber;
            const supplier = await Supplier.findOne({id: supplierId});
            
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
    },
    async getAll(req, res){
        try {
            // guardamos token y guardamos el id del usuario
            let token = req.headers.authorization.split(' ')[1];
            let userId = await findUser(token);

            // buscamos todos los proveedores del usuario y devolvemos
            const suppliers = await Supplier.find({user: userId});
            
            res.send(suppliers);
        } catch (error) {
            console.error(error);
            res.status(500).send({message: "There was a problem trying to get all suppliers", error});
        }
    },
    async update(req, res){
        try {
            // guardamos token y guardamos el id del usuario
            let token = req.headers.authorization.split(' ')[1];
            let userId = await findUser(token);
            // guardamos el número de proveedor
            const supplierId = userId + req.params.number;
            // comprobamos si se ha modificado el número
            if(req.body.number){
                if(req.params.number !== req.body.number){
                    req.body.id = userId + req.body.number;
                }
            }
            // comprobamos si se ha modificado el tipo de cálculo
            const currentValue = await Supplier.findOne({id: supplierId});
            let message = "Proveedor modificado correctamente";
            if(req.body.calculateType && currentValue.calculateType !== req.body.calculateType){
                switch(req.body.calculateType){
                    case "Kilos":
                        if(!req.body.minKilos || !req.body.maxKilos){
                            message = "Es necesario modificar también las variables minKilos y maxKilos";
                        }
                        break;
                    case "Franco":
                        if(!req.body.money){
                            message = "Es necesario modificar también la variable money";
                        }
                        break;
                    default: 
                    if(!req.body.minPalets || !req.body.maxPalets){
                        message = "Es necesario modificar también las variables minPalets y maxPalets";
                    }
                        break;
                }
            }
            // actualizamos el proveedor
            let supplier = [];
            if(message === "Proveedor modificado correctamente"){
                supplier = await Supplier.findOneAndUpdate({id: supplierId}, req.body, {new: true});
            }
            
            res.send({supplier, message});
        } catch (error) {
            console.error(error);
            res.status(500).send({message: "There was a problem trying to update the supplier", error});
        }
    },
    async delete(req, res){
        try {
             // guardamos token y guardamos el id del usuario
            let token = req.headers.authorization.split(' ')[1];
            let userId = await findUser(token);
            // guardamos el número de proveedor
            let supplierNumber = req.params.number;
            // guardamos el id del usuario
            const supplierId = userId + supplierNumber;

            // comprobamos que el proveedor existe en la base de datos
            const sup = await Supplier.findOne({id: supplierId});
            let message = 'El proveedor no existe en la base de datos';
            if(sup){
                const supplier = await Supplier.findOneAndDelete({id: supplierId});
                message = 'Proveedor borrado correctamente';
            }
            res.send({message});
        } catch (error) {
            console.error(error);
            res.status(500).send({message: "There was a problem trying to delete the supplier", error});
        }
    }
}

module.exports = SupplierController;