const mongoose = require('mongoose');
const bcrypt =  require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        required: [true, 'El email es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria'],
        minlength: [8, 'La contraseña debe tener 8 caracteres como mínimo']
    },
}, {
    toJSON:{
        transform:function(doc, ret){
            delete ret.password;
            return ret;
        }
    }
});

UserSchema.pre('save', async function(next) {
    try {
        const salt = await bcrypt.genSalt(9);
        const passwordHash = await bcrypt.hash(this.password, salt);
        this.password = passwordHash;
        next()
    } catch (error) {
        next(error)
    }
})

UserSchema.methods.isValidPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        console.error(error);
    }
  };

const User = mongoose.model('User', UserSchema);
module.exports = User;