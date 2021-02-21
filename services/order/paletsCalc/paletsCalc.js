const Supplier = require("../../../models/Supplier");

// Importando servicios
const setReferencesArray = require("./setReferenceArray");
const orderCalc = require("./orderCalc");

async function paletsCalc(supplierId, references, palets){
    // Preparamos los datos necesarios antes de calcular
    const setReferencesArrayResponse = setReferencesArray(references, palets);
    const referenceArray = setReferencesArrayResponse.referenceArray;
    const supplierRemaining = setReferencesArrayResponse.supplierRemaining;

    // Guardamos el máximo y mínimo de palets del proveedor
    const supplier = await Supplier.findOne({id: supplierId});
    let minPalets =  supplier.minPalets;
    let maxPalets = supplier.maxPalets;
    let message = "Pedido calculado correctamente";
    let supplierConditioning = maxPalets;
    if(supplierRemaining < minPalets){
         message = 'No tienes suficiente espacio para realizar el pedido';
         supplierConditioning = minPalets;
    }
    if(supplierRemaining < maxPalets){
        supplierConditioning = minPalets;
    }
    const order = Object();
        order.palets = palets;
        order.remaining = supplierRemaining - supplierConditioning;
        order.orderArray = orderCalc(supplierConditioning, referenceArray, references);
        order.message = message;
    return order;
}

module.exports = paletsCalc;