function orderCalc (supplierConditioning, referenceArray) {
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
            referenceObject.number = referenceArray[position].number;
            referenceObject.conditioning = referenceArray[position].conditioning;
            referenceObject.palets = 1;
            orderArray[position] = referenceObject;
        }
        else{
            orderArray[position].palets++;
        }
    }
    
    return orderArray;
}
module.exports = orderCalc;