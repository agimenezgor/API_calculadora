// Importando servicios
const setReferencesArray = require("./setReferenceArray");
const orderCalc = require("./orderCalc");
const setPrintMessage = require("./setPrintMessage");
const setSupplierConditioning = require("./setSupplierConditioning");

async function paletsCalc(supplierId, references, palets){
    // Preparamos los datos necesarios antes de calcular
    const setReferencesArrayResponse = setReferencesArray(references, palets);
    const referenceArray = setReferencesArrayResponse.referenceArray;
    const supplierRemaining = setReferencesArrayResponse.supplierRemaining;

    // Calculamos la cantidad de palets que hay que pedir
    let supplierConditioning = await setSupplierConditioning(supplierId, supplierRemaining);

    // Calculamos el pedido a realizar y devolvemos todos los datos
    const order = Object();
        order.remaining = supplierRemaining - supplierConditioning;
        order.orderArray = orderCalc(supplierConditioning, referenceArray, references);
        order.message = setPrintMessage(supplierConditioning, supplierRemaining);
    return order;
}

module.exports = paletsCalc;