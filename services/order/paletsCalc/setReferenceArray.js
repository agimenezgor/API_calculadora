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
module.exports = setReferencesArray;