const Supplier = require("../../models/Supplier");

function setReferencesArray(references, palets){
    // Creamos el objeto reference y el array donde guardaremos los resultados y el array de palets en una variable
    let referenceArray = [];

    // Guardamos en una variable la cantidad total de palets que nos caben en stock de este proveedor
    let supplierRemaining = 0;

    // Guardamos todos los datos necesarios en el array
    let nullReferences = 0;
    for(let i = 0; i < references.length; i++){
        let referenceObject = new Object();
        let remaining = (references[i].facing - palets[i]);
        // Si caben palets en stock, guardamos la referencia en el array
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
    const response = Object();
    response.supplierRemaining = supplierRemaining;
    response.referenceArray = referenceArray;
    return response;
}
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