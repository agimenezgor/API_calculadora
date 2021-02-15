const jwt = require('jsonwebtoken');
const CONFIG = require('../config/config');
const User = require('../models/User');
const Reference = require("../models/Reference");
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
/**
     * Cálculo del pedido: (por palets)
     *  1 - calcular para cuantos días hay stock de cada referencia
     *          1.1 - Calculo del stock de cada referencia
     *          1.2 - Cálculo de los días cubiertos con cada referencia
     * 
     *  2 - buscar la referencia que tenga menos días cubiertos y que la cantidad facing sea mayor a la cantidad en stock
     *          2.1 - comprobar la cantidad de palets faltantes para llenar el facing
     *          2.2 - borrar de la lista las referencias que les falte menos cantidad que el condicionante
     *          2.3 - comprobar si la cantidad faltante total del total de referencias es suficiente para completar el condicionante del proveedor
     *              (solo se realiza en la primera iteración)
     *                  2.3.1 - sumar la cantidad de palets que caben en stock en total
     *                  2.3.2 - si es menor que el condicionante, lanzar mensaje de atención porque no se puede completar el condicionante
     *                  2.3.3 - en caso contrario, continuar la ejecución
     *          2.3 - buscar la referencia con menos días de stock cubiertos y añadir una unidad al array en la posición correspondiente
     * 
     *  3 - modificar las cantidades de stock del array de referencias
     *          3.1 sumar la cantidad pedida al stock de la referencia
     *          3.2 recalcular la cantidad de días faltantes
     * 
     *  4 - volver al paso 1 hasta que se cumpla el condicionante
     */
const OrderController = {
    async getOrder(req, res){
        try {
            //Buscamos el id del usuario
            let token = req.headers.authorization.split(' ')[1];
            let userId = await findUser(token, res);

            // Guardamos el id del proveedor
            let supplierId =  userId + req.params.number;

            // Guardamos todas las referencias del proveedor en la variable references
            const references = await Reference.find({supplier: supplierId});

/**********************************************************************************************************************/
            // Creamos el objeto reference y el array donde guardaremos los resultados y el array de palets en una variable
            let referenceArray = [];
            let palets = req.body.palets;

            // Guardamos en una variable la cantidad total de palets que nos caben en stock de este proveedor
            let supplierRemaining = 0;
            // Guardamos el máximo y mínimo de palets del proveedor
            const supplier = await Supplier.findOne({id: supplierId});
            let minPalets =  supplier.minPalets;
            let maxPalets = supplier.maxPalets;

            // Guardamos todos los datos necesarios en el array
            for(let i = 0; i < references.length; i++){
                let referenceObject = new Object();
                referenceObject.name = references[i].name;
                referenceObject.palets = palets[i];
                referenceObject.conditioning = references[i].conditioning;
                referenceObject.sales = references[i].sales;
                let days = (palets[i] * references[i].conditioning) / (references[i].sales / 30);
                referenceObject.remaining = (references[i].facing - palets[i]);
                supplierRemaining = supplierRemaining + (references[i].facing - palets[i]);
                referenceObject.days = days.toFixed(2);
                referenceArray[i] = referenceObject;
            }
            let message = "Pedido calculado correctamente";
            let supplierConditioning = maxPalets;
            if(supplierRemaining < minPalets){
                 message = 'No tienes suficiente espacio para realizar el pedido';
                 supplierConditioning = minPalets;
            }
            if(supplierRemaining < maxPalets){
                supplierConditioning = minPalets;
            }
            // Una vez tenemos todos los datos necesarios, empezamos la ejecución del añgoritmo de cálculo
            res.send({supplierRemaining, referenceArray, message});
        } catch (error) {
            console.error(error);
            res.status(500).send({message: "There was a problem trying to get the order", error});
        }
    }
}

module.exports = OrderController;