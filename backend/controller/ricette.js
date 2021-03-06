const Categoria = require('../models/categorie');
const User = require('../models/user');

exports.GetAllCategorie = (req, res, next) => {
    Categoria.find()
        .then((categories) => {
            const nomi = categories.map((cat) => {
                return cat.nome;
            })
            res.status(200).json({message: "Categories fetched successfully", categorie: nomi});
        } )
}