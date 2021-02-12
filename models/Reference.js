const mongoose = require('mongoose');

const ReferenceSchema = new mongoose.Schema({
    supplier: {
        type: String,
        required: [true, 'El proveedor es necesario']
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
        required: [true, 'La número de referencia es necesario'],
    },
    conditioning: {
        type: Number,
        required: [true, 'El condicionante es necesario'],
    },
    facing: {
        type: Number,
        default: 0
    },
    sales: {
        type: Number,
        default: 0
    }
});

const Reference = mongoose.model('Reference', ReferenceSchema);
module.exports = Reference;