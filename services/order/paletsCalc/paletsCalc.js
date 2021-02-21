const Supplier = require("../../../models/Supplier");

// Importando servicios
const setReferencesArray = require("./setReferenceArray");
const orderCalc = require("./orderCalc");
const setPrintMessage = require("./setPrintMessage");

async function paletsCalc(supplierId, references, palets){
    // Preparamos los datos necesarios antes de calcular
    const setReferencesArrayResponse = setReferencesArray(references, palets);
    const referenceArray = setReferencesArrayResponse.referenceArray;
    const supplierRemaining = setReferencesArrayResponse.supplierRemaining;

    // Guardamos el máximo y mínimo de palets del proveedor
    const supplier = await Supplier.findOne({id: supplierId});
    let minPalets =  supplier.minPalets;
    let maxPalets = supplier.maxPalets;
    let supplierConditioning = maxPalets;
    if(supplierRemaining < minPalets){
         supplierConditioning = minPalets;
    }
    if(supplierRemaining < maxPalets){
        supplierConditioning = minPalets;
    }
    // Guardamos el mensaje a mostrar
    const message = setPrintMessage(supplierConditioning, supplierRemaining);

    // Calculamos el pedido a realizar y devolvemos todos los datos
    const order = Object();
        order.palets = palets;
        order.remaining = supplierRemaining - supplierConditioning;
        order.orderArray = orderCalc(supplierConditioning, referenceArray, references);
        order.message = message;
    return order;
}

module.exports = paletsCalc;