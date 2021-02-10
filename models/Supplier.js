const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'El id del usuario es necesario'],
        ref: 'User'
    },
    id: {
        type: String,
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    number: {
        type: String,
        required: [true, 'La número de proveedor es necesario']
    },
    days: {
        type: Number,
        required: [true, 'La cantidad de días que tardan en servir es necesaria'],
    },
    calculateType: {
        type: String,
        default: "Palets",
        enum: ["Palets", "Kilos", "Franco"]
    },
    money: {
        type: Number,
        required: elegibleMoney
    },
    minPalets: {
        type: Number,
        required: elegiblePalets
    },
    maxPalets: {
        type: Number,
        required: elegiblePalets
    },
    minKilos: {
        type: Number,
        required: elegibleKilos
    },
    maxKilos: {
        type: Number,
        required: elegibleKilos
    }
});

function elegiblePalets(){
    if(this.calculateType === "Palets"){
        return true;
    }
    return false;
}
function elegibleKilos(){
    if(this.calculateType === "Kilos"){
        return true;
    }
    return false;
}
function elegibleMoney(){
    if(this.calculateType === "Franco"){
        return true
    }
    return false;
}

const Supplier = mongoose.model('Supplier', SupplierSchema);
module.exports = Supplier;