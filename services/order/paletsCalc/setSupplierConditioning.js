const Supplier = require("../../../models/Supplier");

async function setSupplierConditioning(supplierId, supplierRemaining) {
    const supplier = await Supplier.findOne({id: supplierId});
    if(supplierRemaining <= supplier.minPalets){
        return supplier.minPalets;
    }
    if(supplierRemaining >= supplier.maxPalets){
        return supplier.maxPalets;
    }
    return supplierRemaining;
}

module.exports = setSupplierConditioning;