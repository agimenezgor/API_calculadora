const Supplier = require("../../models/Supplier");

async function getCalculateType(supplierId){
    const supplier = await Supplier.findOne({id: supplierId});
    return supplier.calculateType;
}

module.exports = getCalculateType;