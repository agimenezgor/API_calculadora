const mongoose = require('mongoose');

const ReferenceSchema = new mongoose.Schema({
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier'
    },
    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    number: {
        type: String,
        required: [true, 'La número de referencia es necesario'],
        unique: true
    },
    conditioning: {
        type: number,
        required: [true, 'El condicionante es necesario'],
    },
    facing: {
        type: number,
        default: 0
    },
    sales: {
        type: number,
        default: 0
    }
});

const Reference = mongoose.model('Reference', ReferenceSchema);
module.exports = Reference;