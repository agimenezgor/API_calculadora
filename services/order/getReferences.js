const Reference = require("../../models/Reference");

async function getReferences(supplierId){
    return await Reference.find({supplier: supplierId});
}

module.exports = getReferences;