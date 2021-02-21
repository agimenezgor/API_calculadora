const Supplier = require("../../../models/Supplier");

// Importando servicios
const setReferencesArray = require("./setReferenceArray");

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

module.exports = paletsCalc;