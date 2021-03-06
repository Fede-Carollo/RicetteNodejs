const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    'nome': {type: String}
});

module.exports = mongoose.model("Categorie", categorySchema, "categorie");