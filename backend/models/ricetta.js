const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const recipeSchema = mongoose.Schema({
    'creatorName': {type: String, required: true},
    'creatorId': {type: String, required: true},
    'title': {type: String, required: true},
    'description': {type: String, required: true},
    'difficulty': {type: String, required: true},
    'timeNeeded': {type: String, required: true},
    'category': {type: String},
    'ingredienti': [String],
    'steps': [{
        'title': {type: String, required: true},
        'description': {type: String, required: true},
        'imgs': [String],
    }]

}, {timestamps: true});

recipeSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Ricette", recipeSchema, "ricette");