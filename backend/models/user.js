const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String},
    nome: {type: String, required: true},
    cognome: {type: String, required: true},
    profilePhoto: {type: String, default: ''},
    citazione: {type: String, required: true}
}, 
{timestamps: true});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Users", userSchema);