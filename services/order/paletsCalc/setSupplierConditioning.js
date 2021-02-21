const Supplier = require("../../../models/Supplier");

async function setSupplierConditioning(supplierId, supplierRemaining) {
    // devuelve la cantidad de palets que hay que pedir
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
    return supplierConditioning;
}

module.exports = setSupplierConditioning;