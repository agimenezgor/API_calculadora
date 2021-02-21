// Importando servicios
const getSupplierId = require("../services/order/getSupplierId");
const getReferences = require("../services/order/getReferences");
const getCalculateType = require("../services/order/getCalculateType");
const paletsCalc = require("../services/order/paletsCalc");

const OrderController = {
    async getOrder(req, res){
        try {
            // Guardamos el id del proveedor
            let supplierId = await getSupplierId(req, res)
            // Guardamos todas las referencias del proveedor
            const references = await getReferences(supplierId);

            // Array de palets pasados como cuerpo de la petición
            let palets = req.params.palets.split(",");

            // Guardamos el tipo de cálculo del proveedor
            const calculateType = await getCalculateType(supplierId);
            let order = [];
            if(calculateType === "Palets"){
                order = await paletsCalc(supplierId, references, palets)
            }
            res.send(order)
        } catch (error) {
            console.error(error);
            res.status(500).send({message: "There was a problem trying to get the order", error});
        }
    }
}

module.exports = OrderController;