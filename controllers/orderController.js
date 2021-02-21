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
async function getSupplierId(req, res){
    //Buscamos el id del usuario
    let token = req.headers.authorization.split(' ')[1];
    let userId = await findUser(token, res);

    // Devolvemos el id del proveedor
    return userId + req.params.number;
}
async function getReferences(supplierId){
    return await Reference.find({supplier: supplierId});
}
function getStockPalets(req){
    let stringPalets = req.params.palets;
    return stringPalets.split(",");
}
async function paletsCalc(supplierId, references, palets){
    // Creamos el objeto reference y el array donde guardaremos los resultados y el array de palets en una variable
    let referenceArray = [];

    // Guardamos en una variable la cantidad total de palets que nos caben en stock de este proveedor
    let supplierRemaining = 0;
    // Guardamos el máximo y mínimo de palets del proveedor
    const supplier = await Supplier.findOne({id: supplierId});
    let minPalets =  supplier.minPalets;
    let maxPalets = supplier.maxPalets;
    let nullReferences = 0;
    // Guardamos todos los datos necesarios en el array
    for(let i = 0; i < references.length; i++){
        let referenceObject = new Object();
        let remaining = (references[i].facing - palets[i]);
        if(remaining > 0){
            referenceObject.name = references[i].name;
            referenceObject.palets = palets[i];
            referenceObject.conditioning = references[i].conditioning;
            referenceObject.sales = references[i].sales;
            let days = (palets[i] * references[i].conditioning) / (references[i].sales / 30);
            referenceObject.remaining = (references[i].facing - palets[i]);
            supplierRemaining = supplierRemaining + (references[i].facing - palets[i]);
            referenceObject.days = days.toFixed(2);
            referenceArray[i - nullReferences] = referenceObject;
        }
        else{
            nullReferences++;
        }
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

    // Una vez tenemos todos los datos necesarios, empezamos la ejecución del algoritmo de cálculo
    // 1- buscamos la referencia que menos días tiene cubierto
    // 2- sumamos una unidad al stock y recalculamos el número de días cubiertos
    // 3- volvemos al paso 1 hasta finalizar el condicionante del proveedor
    let orderArray = []
    for(let i = 0; i < supplierConditioning; i++){
        // buscamos mínimo días
        let minDays = referenceArray[0].days;
        let position = 0;
        for(let j = 1; j < referenceArray.length; j++){
            if(referenceArray[j].days < minDays){
                minDays = referenceArray[j].days;
                position = j;
            }
        }
        // sumamos stock y recalculamos días
        referenceArray[position].palets++;
        let days = (referenceArray[position].palets * referenceArray[position].conditioning) / (referenceArray[position].sales / 30);
        referenceArray[position].days = days.toFixed(2);
        // guardamos la referencia en el array
        if(!orderArray[position]){
            let referenceObject = new Object();
            referenceObject.name = referenceArray[position].name;
            referenceObject.number = references[position].number;
            referenceObject.conditioning = referenceArray[position].conditioning;
            referenceObject.palets = 1;
            orderArray[position] = referenceObject;
        }
        else{
            orderArray[position].palets++;
        }
    }
    const order = Object();
        order.palets = palets;
        order.remaining = supplierRemaining - supplierConditioning;
        order.orderArray = orderArray;
        order.message = message;
    return order;
}
const OrderController = {
    async getOrder(req, res){
        try {
            // Guardamos el id del proveedor
            let supplierId = await getSupplierId(req, res)
            // Guardamos todas las referencias del proveedor
            const references = await getReferences(supplierId);

            // Array de palets pasados como cuerpo de la petición
            let palets = getStockPalets(req);
/**********************************************************************************************************************/
            const order = await paletsCalc(supplierId, references, palets)
            res.send(order)
        } catch (error) {
            console.error(error);
            res.status(500).send({message: "There was a problem trying to get the order", error});
        }
    }
}

module.exports = OrderController;